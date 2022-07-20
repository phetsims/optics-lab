// Copyright 2015-2022, University of Colorado Boulder

/**
 * Node for Source of light, which is either a fan of rays (point source)
 * or a parallel beam of rays
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Circle, Node, Path, Rectangle, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import opticsLab from '../../opticsLab.js';
import Type from '../model/Type.js';
import OpticsLabConstants from '../OpticsLabConstants.js';

// constants
const MAXIMUM_LIGHT_RAYS = OpticsLabConstants.MAXIMUM_LIGHT_RAYS;

class SourceNode extends Node {
  /**
   * @param {OpticsLabModel} mainModel
   * @param {SourceModel} sourceModel
   * @param {OpticsLabScreenView} mainView
   */
  constructor( mainModel, sourceModel, mainView ) {

    super( {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    this.colorProperty = new Property( 'white' );  //sets color of rays
    this.mainModel = mainModel;
    this.pieceModel = sourceModel;   //need generic name because need to loop over all pieces and have pieceModel
    this.type = sourceModel.type;
    this.relativeRayStarts = []; //starting positions, relative to source center, of each ray
    this.rayNodes = [];   //array of rayNodes, a rayNode is a path of a ray from source through components to end
    this.counter = 0; //for testing only
    this.settingHeight = false; //flag used to prevent conflicting calls to set angle of translation handle
    // Call the super constructor

    // Draw a handle
    const height = sourceModel.height;   //if type = Type.BEAM_SOURCE
    const angle = sourceModel.angleProperty.value;

    this.translationHandle;
    this.rotationHandle = new Node();
    if ( sourceModel.type === Type.FAN_SOURCE ) {
      this.translationHandle = new Circle( 20, { x: 0, y: 0, fill: '#8F8' } );
    }
    else if ( sourceModel.type === Type.BEAM_SOURCE ) {
      this.translationHandle = new Rectangle( -5, -height / 2, 10, height, { fill: '#8F8', cursor: 'pointer' } );
      this.rotationHandle = new Circle( 5, {
        x: Math.sin( angle ) * height / 2,
        y: Math.cos( angle ) * height / 2,
        fill: 'yellow'
      } );
      this.addChild( this.rotationHandle );
    }

    this.insertChild( 0, this.translationHandle );

    const rayOptionsObject = { stroke: 'black', lineWidth: 1.5, lineJoin: 'bevel' }; //, lineDash: [ 5, 1 ]
    for ( let r = 0; r < MAXIMUM_LIGHT_RAYS; r++ ) {
      this.rayNodes[ r ] = new Path( new Shape(), rayOptionsObject );
      this.addChild( this.rayNodes[ r ] );
    }

    // When dragging, move the sample element
    let mouseDownPosition;
    this.translationHandle.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        start: e => {
          mainView.setSelectedPiece( this );
          const position = this.globalToParentPoint( e.pointer.point );
          const currentNodePos = this.pieceModel.positionProperty.value;
          mouseDownPosition = position.minus( currentNodePos );
        },

        drag: e => {
          let position = this.globalToParentPoint( e.pointer.point );
          position = position.minus( mouseDownPosition );
          this.pieceModel.setPosition( position );
        },
        end: e => {
          const position = this.globalToParentPoint( e.pointer.point );
          if ( mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y ) ) {
            mainView.removePiece( this );
          }
        }
      } ) );//end translationHandle.addInputListener()

    this.rotationHandle.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      //start function for testing only
      start: e => {
        mainView.setSelectedPiece( this );
      },

      drag: e => {
        const mousePosRelative = this.translationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
        const angle = mousePosRelative.angle - Math.PI / 2;  //angle = 0 when beam horizontal, CW is + angle
        this.pieceModel.setAngle( angle );

      }
    } ) );//end this.rotationHandle.addInputListener()

    // Register for synchronization with pieceModel and mainModel.
    sourceModel.positionProperty.link( position => {
      this.translation = position;
    } );

    sourceModel.angleProperty.link( angle => {
      if ( !this.settingHeight ) {
        this.translationHandle.rotation = angle;
      }

      const cosAngle = Math.cos( angle );
      const sinAngle = Math.sin( angle );
      const height = this.pieceModel.height;
      this.rotationHandle.translation = new Vector2( -( height / 2 ) * sinAngle, ( height / 2 ) * cosAngle );
    } );

    sourceModel.nbrOfRaysProperty.link( nbrOfRays => {
      this.setRayNodes( nbrOfRays );
      this.mainModel.processRays();
    } );

    sourceModel.spreadProperty.link( () => {
      if ( this.type === Type.FAN_SOURCE ) {
        this.setRayNodes();
        this.mainModel.processRays();
      }
    } );

    sourceModel.widthProperty.link( width => {
      if ( this.type === Type.BEAM_SOURCE ) {
        this.setWidth( width );
        this.setRayNodes();
        this.mainModel.processRays();
      }
    } );

    this.mainModel.processRaysCountProperty.link( () => {
      this.drawRays();
    } );
    this.colorProperty.link( color => {
      let colorCode;            //switch ( color )
      switch( color ) {
        case 'white':
          colorCode = '#fff';
          break;
        case 'green':
          colorCode = '#0f0';
          break;
        case 'red':
          colorCode = '#f00';
          break;
        case 'yellow':
          colorCode = '#ff0';
          break;
        default:
          throw new Error( `invalid color: ${color}` );
      }
      for ( let i = 0; i < MAXIMUM_LIGHT_RAYS; i++ ) {
        this.rayNodes[ i ].strokeColor = colorCode;
      }
    } );

  }

  /**
   *
   * @param {number} nbrOfRays
   * @private
   */
  setRayNodes( nbrOfRays ) {
    //this.translationHandle.removeAllChildren();
    //this.rayNodes = [];
    nbrOfRays = Utils.roundSymmetric( nbrOfRays );

    for ( let i = nbrOfRays; i < MAXIMUM_LIGHT_RAYS; i++ ) {
      this.rayNodes[ i ].visible = false;

    }
    const maxRayLength = OpticsLabConstants.MAXIMUM_RAY_LENGTH;
    //var rayFontObject = { stroke: 'white', lineWidth: 2 } ;
    for ( let r = 0; r < this.pieceModel.rayPaths.length; r++ ) {
      this.rayNodes[ r ].visible = true;
      const dir = this.pieceModel.rayPaths[ r ].startDir;
      const sourceCenter = this.pieceModel.positionProperty.value;
      if ( this.pieceModel.rayPaths[ r ].segments.length === 0 ) {
        return;
      }
      const AbsoluteRayStart = this.pieceModel.rayPaths[ r ].segments[ 0 ].getStart();
      const AbsoluteRayEnd = this.pieceModel.rayPaths[ r ].segments[ 0 ].getEnd();
      const relativeRayStart = AbsoluteRayStart.minus( sourceCenter );
      const relativeRayEnd = AbsoluteRayEnd.minus( sourceCenter );
      const rayShape = new Shape();
      rayShape.moveToPoint( relativeRayStart );
      if ( this.pieceModel.type === Type.FAN_SOURCE ) {
        this.relativeRayStarts[ r ] = relativeRayStart;
        const relativeEndPt = dir.timesScalar( maxRayLength );
        rayShape.lineToPoint( relativeEndPt );

        //var rayNode = new Line( new Vector2( 0, 0 ), dir.timesScalar( maxRayLength ), rayFontObject );
      }
      else if ( this.pieceModel.type === Type.BEAM_SOURCE ) {

        this.relativeRayStarts[ r ] = relativeRayStart;
        rayShape.lineToPoint( relativeRayEnd );
      }
      this.rayNodes[ r ].setShape( rayShape );
    }//end rayPath loop
  }

  /**
   * @private
   */
  drawRays() {
    for ( let i = 0; i < this.pieceModel.rayPaths.length; i++ ) {
      const shape = this.pieceModel.rayPaths[ i ].getRelativeShape();//getShape();
      this.rayNodes[ i ].setShape( shape );
    }
  }

  /**
   * Sets the width of the beam source
   * @param {number} height
   * @private
   */
  setWidth( height ) {
    this.settingHeight = true;
    const cosAngle = Math.cos( this.pieceModel.angleProperty.value );
    const sinAngle = Math.sin( this.pieceModel.angleProperty.value );
    this.translationHandle.rotation = 0;
    //
    this.translationHandle.setRect( -5, -height / 2, 10, height );
    this.translationHandle.rotation = this.pieceModel.angleProperty.value;

    this.rotationHandle.translation = new Vector2( ( -height / 2 ) * sinAngle, ( height / 2 ) * cosAngle );
    this.settingHeight = false;
  }

  /**
   * sets the color of the light rays
   * @param {string|Color} color
   * @private
   */
  setColor( color ) {
    for ( let i = 0; i < this.pieceModel.rayPaths.length; i++ ) {
      this.rayNodes[ i ].strokeColor = color;
    }
  }
}

opticsLab.register( 'SourceNode', SourceNode );
export default SourceNode;