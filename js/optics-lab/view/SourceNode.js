// Copyright 2015-2019, University of Colorado Boulder

/**
 * Node for Source of light, which is either a fan of rays (point source)
 * or a parallel beam of rays
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Node = require( 'SCENERY/nodes/Node' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  const Vector2 = require( 'DOT/Vector2' );
  const Utils = require( 'DOT/Utils' );

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

      const self = this;
      this.colorProperty = new Property( 'white' );  //sets color of rays
      this.mainModel = mainModel;
      this.pieceModel = sourceModel;   //need generic name because need to loop over all pieces and have pieceModel
      this.mainView = mainView;
      this.modelViewTransform = mainView.modelViewTransform;
      this.type = this.pieceModel.type;
      this.relativeRayStarts = []; //starting positions, relative to source center, of each ray
      this.rayNodes = [];   //array of rayNodes, a rayNode is a path of a ray from source through components to end
      this.maxNbrOfRays = sourceModel.maxNbrOfRays;
      this.counter = 0; //for testing only
      this.rayColor = '#fff';
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
        self.addChild( this.rotationHandle );
      }

      self.insertChild( 0, this.translationHandle );

      const rayOptionsObject = { stroke: 'black', lineWidth: 1.5, lineJoin: 'bevel' }; //, lineDash: [ 5, 1 ]
      for ( let r = 0; r < this.maxNbrOfRays; r++ ) {
        this.rayNodes[ r ] = new Path( new Shape(), rayOptionsObject );
        self.addChild( this.rayNodes[ r ] );
      }

      // When dragging, move the sample element
      let mouseDownPosition;
      self.translationHandle.addInputListener( new SimpleDragHandler(
        {
          // When dragging across it in a mobile device, pick it up
          allowTouchSnag: true,

          start: function( e ) {
            self.mainView.setSelectedPiece( self );
            self.mainView.setSelectedPieceType( self );
            const position = self.globalToParentPoint( e.pointer.point );
            const currentNodePos = self.pieceModel.positionProperty.value;
            mouseDownPosition = position.minus( currentNodePos );
          },

          drag: function( e ) {
            let position = self.globalToParentPoint( e.pointer.point );
            position = position.minus( mouseDownPosition );
            self.pieceModel.setPosition( position );
          },
          end: function( e ) {
            const position = self.globalToParentPoint( e.pointer.point );
            if ( self.mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y ) ) {
              self.mainView.removePiece( self );
            }
          }
        } ) );//end translationHandle.addInputListener()

      this.rotationHandle.addInputListener( new SimpleDragHandler( {
        allowTouchSnag: true,
        //start function for testing only
        start: function( e ) {
          self.mainView.setSelectedPiece( self );
          self.mainView.setSelectedPieceType( self );
        },

        drag: function( e ) {
          const mousePosRelative = self.translationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
          const angle = mousePosRelative.angle - Math.PI / 2;  //angle = 0 when beam horizontal, CW is + angle
          self.pieceModel.setAngle( angle );

        }
      } ) );//end this.rotationHandle.addInputListener()

      // Register for synchronization with pieceModel and mainModel.
      this.pieceModel.positionProperty.link( function( position ) {
        self.translation = position;
      } );

      this.pieceModel.angleProperty.link( function( angle ) {
        if ( !self.settingHeight ) {
          self.translationHandle.rotation = angle;
        }

        const cosAngle = Math.cos( angle );
        const sinAngle = Math.sin( angle );
        const height = self.pieceModel.height;
        self.rotationHandle.translation = new Vector2( -( height / 2 ) * sinAngle, ( height / 2 ) * cosAngle );
      } );

      this.pieceModel.nbrOfRaysProperty.link( function( nbrOfRays ) {
        self.setRayNodes( nbrOfRays );
        sourceModel.mainModel.processRays();
      } );

      this.pieceModel.spreadProperty.link( function() {
        if ( self.type === Type.FAN_SOURCE ) {
          self.setRayNodes();
          sourceModel.mainModel.processRays();
        }
      } );

      this.pieceModel.widthProperty.link( function( width ) {
        if ( self.type === Type.BEAM_SOURCE ) {
          self.setWidth( width );
          self.setRayNodes();
          sourceModel.mainModel.processRays();
        }
      } );

      this.mainModel.processRaysCountProperty.link( function() {
        self.drawRays();
      } );
      this.colorProperty.link( function( color ) {
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
            throw new Error( 'invalid color: ' + color );
        }
        self.rayColor = colorCode;
        for ( let i = 0; i < self.maxNbrOfRays; i++ ) {
          self.rayNodes[ i ].strokeColor = colorCode;
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

      for ( let i = nbrOfRays; i < this.maxNbrOfRays; i++ ) {
        this.rayNodes[ i ].visible = false;

      }
      const maxRayLength = this.pieceModel.maxLength;
      //var rayFontObject = { stroke: 'white', lineWidth: 2 } ;
      for ( let r = 0; r < this.pieceModel.rayPaths.length; r++ ) {
        this.rayNodes[ r ].visible = true;
        //this.rayNodes[ r ].strokeColor = this.rayColor;
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

  return opticsLab.register( 'SourceNode', SourceNode );
} );