// Copyright 2016, University of Colorado Boulder

/**
 * Node for Source of light, which is either a fan of rays (point source)
 * or a parallel beam of rays
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );

  /**
   * @extends {Node}
   * @param {OpticsLabModel} mainModel
   * @param {SourceModel} sourceModel
   * @param {OpticsLabScreenView} mainView
   * @constructor
   */
  function SourceNode( mainModel, sourceModel, mainView ) {

    var self = this;
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
    Node.call( self, {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    // Draw a handle
    var height = sourceModel.height;   //if type = Type.BEAM_SOURCE
    var angle = sourceModel.angleProperty.value;

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

    var rayOptionsObject = { stroke: 'black', lineWidth: 1.5, lineJoin: 'bevel' }; //, lineDash: [ 5, 1 ]
    for ( var r = 0; r < this.maxNbrOfRays; r++ ) {
      this.rayNodes[ r ] = new Path( new Shape(), rayOptionsObject );
      self.addChild( this.rayNodes[ r ] );
    }

    // When dragging, move the sample element
    var mouseDownPosition;
    self.translationHandle.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        start: function( e ) {
          self.mainView.setSelectedPiece( self );
          self.mainView.setSelectedPieceType( self );
          var position = self.globalToParentPoint( e.pointer.point );
          var currentNodePos = self.pieceModel.positionProperty.value;
          mouseDownPosition = position.minus( currentNodePos );
        },

        drag: function( e ) {
          var position = self.globalToParentPoint( e.pointer.point );
          position = position.minus( mouseDownPosition );
          self.pieceModel.setPosition( position );
        },
        end: function( e ) {
          var position = self.globalToParentPoint( e.pointer.point );
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
        var mousePosRelative = self.translationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
        var angle = mousePosRelative.angle() - Math.PI / 2;  //angle = 0 when beam horizontal, CW is + angle
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

      var cosAngle = Math.cos( angle );
      var sinAngle = Math.sin( angle );
      var height = self.pieceModel.height;
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
      var colorCode;            //switch ( color )
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
      for ( var i = 0; i < self.maxNbrOfRays; i++ ) {
        self.rayNodes[ i ].strokeColor = colorCode;
      }
    } );

  }

  opticsLab.register( 'SourceNode', SourceNode );

  return inherit( Node, SourceNode, {
    /**
     *
     * @param {number} nbrOfRays
     * @private
     */
    setRayNodes: function( nbrOfRays ) {
      //this.translationHandle.removeAllChildren();
      //this.rayNodes = [];
      nbrOfRays = Math.round( nbrOfRays );

      for ( var i = nbrOfRays; i < this.maxNbrOfRays; i++ ) {
        this.rayNodes[ i ].visible = false;

      }
      var maxRayLength = this.pieceModel.maxLength;
      //var rayFontObject = { stroke: 'white', lineWidth: 2 } ;
      for ( var r = 0; r < this.pieceModel.rayPaths.length; r++ ) {
        this.rayNodes[ r ].visible = true;
        //this.rayNodes[ r ].strokeColor = this.rayColor;
        var dir = this.pieceModel.rayPaths[ r ].startDir;
        var sourceCenter = this.pieceModel.positionProperty.value;
        if ( this.pieceModel.rayPaths[ r ].segments.length === 0 ) {
          return;
        }
        var AbsoluteRayStart = this.pieceModel.rayPaths[ r ].segments[ 0 ].getStart();
        var AbsoluteRayEnd = this.pieceModel.rayPaths[ r ].segments[ 0 ].getEnd();
        var relativeRayStart = AbsoluteRayStart.minus( sourceCenter );
        var relativeRayEnd = AbsoluteRayEnd.minus( sourceCenter );
        var rayShape = new Shape();
        rayShape.moveToPoint( relativeRayStart );
        if ( this.pieceModel.type === Type.FAN_SOURCE ) {
          this.relativeRayStarts[ r ] = relativeRayStart;
          var relativeEndPt = dir.timesScalar( maxRayLength );
          rayShape.lineToPoint( relativeEndPt );

          //var rayNode = new Line( new Vector2( 0, 0 ), dir.timesScalar( maxRayLength ), rayFontObject );
        }
        else if ( this.pieceModel.type === Type.BEAM_SOURCE ) {

          this.relativeRayStarts[ r ] = relativeRayStart;
          rayShape.lineToPoint( relativeRayEnd );
        }
        this.rayNodes[ r ].setShape( rayShape );
      }//end rayPath loop
    },//end setRayNodes()
    /**
     * @private
     */
    drawRays: function() {
      for ( var i = 0; i < this.pieceModel.rayPaths.length; i++ ) {
        var shape = this.pieceModel.rayPaths[ i ].getRelativeShape();//getShape();
        this.rayNodes[ i ].setShape( shape );
      }
    },
    /**
     * Sets the width of the beam source
     * @param {number} height
     * @private
     */
    setWidth: function( height ) {
      this.settingHeight = true;
      var cosAngle = Math.cos( this.pieceModel.angleProperty.value );
      var sinAngle = Math.sin( this.pieceModel.angleProperty.value );
      this.translationHandle.rotation = 0;
      //
      this.translationHandle.setRect( -5, -height / 2, 10, height );
      this.translationHandle.rotation = this.pieceModel.angleProperty.value;

      this.rotationHandle.translation = new Vector2( ( -height / 2 ) * sinAngle, ( height / 2 ) * cosAngle );
      this.settingHeight = false;
    },
    /**
     * sets the color of the light rays
     * @param {string|Color} color
     * @private
     */
    setColor: function( color ) {
      for ( var i = 0; i < this.pieceModel.rayPaths.length; i++ ) {
        this.rayNodes[ i ].strokeColor = color;
      }
    }
  } );
} );