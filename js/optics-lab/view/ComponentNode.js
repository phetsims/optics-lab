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
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  //var Vector2 = require( 'DOT/Vector2' );


  // images


  /**
   * Constructor for ComponentNode which renders sample element as a scenery node.
   * @param {sampleElement} sampleElement the componentModel of the sampleElement
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between componentModel coordinates and view coordinates
   * @constructor
   */
  function ComponentNode( componentModel, modelViewTransform ) {

    var componentNode = this;
    this.componentModel =  componentModel;
    this.modelViewTransform = modelViewTransform;
    this.type = this.componentModel.type;

    // Call the super constructor
    Node.call( componentNode, {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    // Add the rectangle graphic
    //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
    var xPos = this.componentModel.position.x;
    var yPos = this.componentModel.position.y;
    var height = this.componentModel.diameter;
    var f = this.componentModel.f;
    var n = this.componentModel.n;
    var myHandle = new Rectangle( xPos, yPos - height/2, 15, height, { fill: 'red' } );
    var marker1 = new Line( xPos, yPos, xPos + 15, yPos, { stroke: 'yellow' });
    var centerLine = new Line( xPos, yPos - height/2, xPos, yPos + height/2, { stroke: 'blue' });

    //myHandle.children = [ marker1, marker2 ];
    //function ComponentGraphic( type, diameter, focalLength, index )
    this.componentGraphic = new ComponentGraphic( this.type, height, f, n );
    //myHandle.addChild( componentGraphic );
    //componentNode.addChild( myHandle );
    componentNode.addChild( this.componentGraphic );




    // When dragging, move the sample element
    componentNode.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,


        drag: function( e ){
          var position = componentNode.globalToParentPoint( e.pointer.point );
          //console.log( 'component position = ' + position );
          componentNode.componentModel.setPosition( position );
        }
      } ) );

    // Register for synchronization with componentModel.
    this.componentModel.positionProperty.link( function( position ) {
      componentNode.translation = position;
    } );
    this.componentModel.diameterProperty.link( function( diameter ) {
      componentNode.componentGraphic.setDiameter( diameter );
    } );
    this.componentModel.fProperty.link( function( f ) {
      componentNode.componentGraphic.setFocalLength( f );
    } );
    this.componentModel.nProperty.link( function( n ) {
      componentNode.componentGraphic.setIndex( n );
    } );

  }

  return inherit( Node, ComponentNode );
} );