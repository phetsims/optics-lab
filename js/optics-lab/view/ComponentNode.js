/**
 * Node for component, which can be either lens, mirror, plane mirror, or mask
 * Created by dubson on 6/30/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var ComponentGraphic = require( 'OPTICS_LAB/optics-lab/view/ComponentGraphic' );
  var inherit = require( 'PHET_CORE/inherit' );
  //var Circle = require( 'SCENERY/nodes/Circle' );
  //var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  //var Vector2 = require( 'DOT/Vector2' );


  // images


  /**
   * Constructor for ComponentNode which renders sample element as a scenery node.
   * @param {sampleElement} sampleElement the pieceModel of the sampleElement
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between pieceModel coordinates and view coordinates
   * @constructor
   */
  function ComponentNode( componentModel, mainView ) {

    var componentNode = this;
    this.pieceModel =  componentModel;
    this.mainView = mainView;
    this.modelViewTransform = mainView.modelViewTransform;
    this.type = this.pieceModel.type;

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
    //myHandle.addChild( componentGraphic );
    //componentNode.addChild( myHandle );
    componentNode.addChild( this.componentGraphic );




    // When dragging, move the sample element
    componentNode.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,
        start: function( e ){
          componentNode.mainView.setSelectedPiece( componentNode );
        },

        drag: function( e ){
          var position = componentNode.globalToParentPoint( e.pointer.point );
          //console.log( 'component position = ' + position );
          componentNode.pieceModel.setPosition( position );
        },
        end: function( e ) {
          var position = componentNode.globalToParentPoint( e.pointer.point );
          if( componentNode.mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y )){
            componentNode.mainView.removeComponent( componentNode );
            componentNode.mainView.controlPanel.displayPanel.visible = false;
          }else{
            //console.log( 'keep this' );
          }
        }
      } ) );

    // Register for synchronization with pieceModel.
    this.pieceModel.positionProperty.link( function( position ) {
      componentNode.translation = position;
    } );
    this.pieceModel.diameterProperty.link( function( diameter ) {
      componentNode.componentGraphic.setDiameter( diameter );
    } );
    this.pieceModel.radiusProperty.link( function( R ) {
      componentNode.componentGraphic.setRadius( R );
    } );
    this.pieceModel.fProperty.link( function( f ) {
      componentNode.componentGraphic.setFocalLength( f );
    } );
    this.pieceModel.indexProperty.link( function( n ) {
      componentNode.componentGraphic.setIndex( n );
    } );
    this.mainView.controlPanel.showFocalPointsProperty.link( function( isVisible ){
      //console.log( 'focal points visibility = ' + isVisible );
      componentNode.componentGraphic.setFocalPointsVisibility( isVisible );
    } ) ;

    this.pieceModel.fProperty.link( function( focalLength ){
      componentNode.componentGraphic.setFocalPointPositions( focalLength );
    });

  }

  return inherit( Node, ComponentNode );
} );