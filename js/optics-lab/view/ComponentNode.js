// Copyright 2016, University of Colorado Boulder

/**
 * Node for component, which can be either lens, mirror, plane mirror, or mask
 * Created by dubson on 6/30/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var ComponentGraphic = require( 'OPTICS_LAB/optics-lab/view/ComponentGraphic' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  //var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Property = require( 'AXON/Property' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );


  // images


  /**
   * Constructor for ComponentNode which renders sample element as a scenery node.
   * @param {sampleElement} sampleElement the pieceModel of the sampleElement
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between pieceModel coordinates and view coordinates
   * @constructor
   */
  function ComponentNode( componentModel, mainView ) {

    var self = this;
    this.pieceModel =  componentModel;
    this.mainView = mainView;
    this.modelViewTransform = mainView.modelViewTransform;
    this.type = this.pieceModel.type;
    this.showFocalPointsProperty = new Property( false );

    // Call the super constructor
    Node.call( this, {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    // Add the rectangle graphic
    //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
    //var xPos = this.pieceModel.position.x;
    //var yPos = this.pieceModel.position.y;
    var height = this.pieceModel.diameter;
    var radius = this.pieceModel.radius;    //radius of curvature
    //var f = this.pieceModel.f;
    var index = this.pieceModel.index;
    //var myHandle = new Rectangle( xPos, yPos - height/2, 15, height, { fill: 'red' } );
    //var marker1 = new Line( xPos, yPos, xPos + 15, yPos, { stroke: 'yellow' });
    //var centerLine = new Line( xPos, yPos - height/2, xPos, yPos + height/2, { stroke: 'blue' });

    //myHandle.children = [ marker1, marker2 ];
    //function ComponentGraphic( type, diameter, radius(of curvature), index, mainView )
    this.componentGraphic = new ComponentGraphic( this.type, height, radius, index );
    //var height = this.pieceModel.diameter;   //if type = 'beam_source'
    var angle = this.pieceModel.angle;
    this.rotationHandle = new Circle( 5, { x: Math.sin( angle )*height/2, y: Math.cos( angle )*height/2, fill: 'yellow' });
    //myHandle.addChild( componentGraphic );
    //self.addChild( myHandle );
    self.addChild( this.componentGraphic );
    self.addChild( this.rotationHandle );




    // When dragging, move the sample element
    var mouseDownPosition;
    self.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,
        start: function( e ){
          self.mainView.setSelectedPiece( self );
          self.mainView.setSelectedPieceType( self );
          var position = self.globalToParentPoint( e.pointer.point );
          var currentNodePos = self.pieceModel.position;
          mouseDownPosition = position.minus( currentNodePos );
          //self.mouseDownPosition = e.pointer.point;
          //console.log( '   posGlobalToParent = ' + position + ' relPos' + mouseDownPosition );
        },

        drag: function( e ){
          var position = self.globalToParentPoint( e.pointer.point );
          position = position.minus( mouseDownPosition );
          //console.log( 'component position = ' + position );
          self.pieceModel.setPosition( position );
        },
        end: function( e ) {
          var position = self.globalToParentPoint( e.pointer.point );
          if( self.mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y )){
            self.mainView.removePiece( self );
            //self.mainView.removeComponent( self );
            //self.mainView.controlPanel.displayPanel.visible = false;
          }else{
            //console.log( 'keep this' );
          }
        }
      } ) );

    this.rotationHandle.addInputListener ( new SimpleDragHandler ( {
      allowTouchSnag: true,
      //start function for testing only
      start: function (e){
        self.mainView.setSelectedPiece( self );
        self.mainView.setSelectedPieceType( self );
        //console.log( 'mouse down' );
        //var mouseDownPosition = e.pointer.point;
      },

      drag: function(e){
        var mousePosRelative =  self.rotationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
        var angle = mousePosRelative.angle() - Math.PI/2;  //angle = 0 when beam horizontal, CW is + angle
        self.pieceModel.setAngle( angle );
        //console.log( 'position is ' + mousePosRelative );
        //console.log( 'rotation angle in degree is ' + angle*180/Math.PI );

      }
    }));//end this.rotationHandle.addInputListener()

    // Register for synchronization with pieceModel.
    this.pieceModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );
    this.pieceModel.angleProperty.link( function( angle ){
      self.componentGraphic.rotation = angle;
      var cosAngle = Math.cos( angle );
      var sinAngle = Math.sin( angle );
      var diameter = self.pieceModel.diameter;
      self.rotationHandle.translation = new Vector2( -( diameter/2 )*sinAngle, ( diameter/2 )*cosAngle );
    });
    this.pieceModel.diameterProperty.link( function( diameter ) {
      self.componentGraphic.setDiameter( diameter );
      var angle = self.pieceModel.angle;
      var cosAngle = Math.cos( angle );
      var sinAngle = Math.sin( angle );
      //var diameter = self.pieceModel.diameter;
      self.rotationHandle.translation = new Vector2( -( diameter/2 )*sinAngle, ( diameter/2 )*cosAngle );
    } );
    this.pieceModel.radiusProperty.link( function( R ) {
      self.componentGraphic.setRadius( R );
    } );
    //this.pieceModel.fProperty.link( function( f ) {
    //  self.componentGraphic.setFocalLength( f );
    //} );
    this.pieceModel.indexProperty.link( function( n ) {
      self.componentGraphic.setIndex( n );
    } );
    //this.mainView.controlPanel.showFocalPointsProperty.link( function( isVisible ){
    //  //console.log( 'focal points visibility = ' + isVisible );
    //  self.componentGraphic.setFocalPointsVisibility( isVisible );
    //} ) ;
    this.showFocalPointsProperty.link( function( isVisible ){
      self.componentGraphic.setFocalPointsVisibility( isVisible );
    } ) ;

    this.pieceModel.fProperty.link( function( focalLength ){
      self.componentGraphic.setFocalPointPositions( focalLength );
    });

  }

  return inherit( Node, ComponentNode );
} );