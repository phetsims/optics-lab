// Copyright 2016, University of Colorado Boulder

/**
 * Node for component, which can be either lens, mirror, plane mirror, or mask
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComponentGraphic = require( 'OPTICS_LAB/optics-lab/view/ComponentGraphic' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );



  /**
   * Constructor for ComponentNode which renders sample element as a scenery node.
   * @param {sampleElement} sampleElement the pieceModel of the sampleElement
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between pieceModel coordinates and view coordinates
   * @constructor
   */
  function ComponentNode( componentModel, mainView ) {

    var self = this;
    this.pieceModel = componentModel;
    this.mainView = mainView;
    this.modelViewTransform = mainView.modelViewTransform;
    this.type = this.pieceModel.type;
    this.showFocalPointsProperty = new Property( false );

    // Call the super constructor
    Node.call( this, {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    var height = this.pieceModel.diameter;
    var radius = this.pieceModel.radius;    //radius of curvature
    var index = this.pieceModel.index;

    this.componentGraphic = new ComponentGraphic( this.type, height, radius, index );
    var angle = this.pieceModel.angle;
    this.rotationHandle = new Circle( 5, {
      x: Math.sin( angle ) * height / 2,
      y: Math.cos( angle ) * height / 2,
      fill: 'yellow'
    } );
    self.addChild( this.componentGraphic );
    self.addChild( this.rotationHandle );


    // When dragging, move the sample element
    var mouseDownPosition;
    self.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,
        start: function( e ) {
          self.mainView.setSelectedPiece( self );
          self.mainView.setSelectedPieceType( self );
          var position = self.globalToParentPoint( e.pointer.point );
          var currentNodePos = self.pieceModel.position;
          mouseDownPosition = position.minus( currentNodePos );
          //self.mouseDownPosition = e.pointer.point;
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
      } ) );

    this.rotationHandle.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      //start function for testing only
      start: function( e ) {
        self.mainView.setSelectedPiece( self );
        self.mainView.setSelectedPieceType( self );
      },

      drag: function( e ) {
        var mousePosRelative = self.rotationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
        var angle = mousePosRelative.angle() - Math.PI / 2;  //angle = 0 when beam horizontal, CW is + angle
        self.pieceModel.setAngle( angle );

      }
    } ) );//end this.rotationHandle.addInputListener()

    // Register for synchronization with pieceModel.
    this.pieceModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );
    this.pieceModel.angleProperty.link( function( angle ) {
      self.componentGraphic.rotation = angle;
      var cosAngle = Math.cos( angle );
      var sinAngle = Math.sin( angle );
      var diameter = self.pieceModel.diameter;
      self.rotationHandle.translation = new Vector2( -( diameter / 2 ) * sinAngle, ( diameter / 2 ) * cosAngle );
    } );
    this.pieceModel.diameterProperty.link( function( diameter ) {
      self.componentGraphic.setDiameter( diameter );
      var angle = self.pieceModel.angle;
      var cosAngle = Math.cos( angle );
      var sinAngle = Math.sin( angle );
      //var diameter = self.pieceModel.diameter;
      self.rotationHandle.translation = new Vector2( -( diameter / 2 ) * sinAngle, ( diameter / 2 ) * cosAngle );
    } );
    this.pieceModel.radiusProperty.link( function( R ) {
      self.componentGraphic.setRadius( R );
    } );
    this.pieceModel.indexProperty.link( function( n ) {
      self.componentGraphic.setIndex( n );
    } );
    this.showFocalPointsProperty.link( function( isVisible ) {
      self.componentGraphic.setFocalPointsVisibility( isVisible );
    } );

    this.pieceModel.fProperty.link( function( focalLength ) {
      self.componentGraphic.setFocalPointPositions( focalLength );
    } );

  }

  opticsLab.register( 'ComponentNode', ComponentNode );

  return inherit( Node, ComponentNode );
} );