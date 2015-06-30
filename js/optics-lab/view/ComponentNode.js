/**
 * Node for component, which can be either lens, mirror, plane mirror, or mask
 * Created by dubson on 6/30/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );


  // images


  /**
   * Constructor for ComponentNode which renders sample element as a scenery node.
   * @param {sampleElement} sampleElement the model of the sampleElement
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function ComponentNode( componentModel, modelViewTransform ) {

    var componentNode = this;
    this.model =  componentModel;
    this.modelViewTransform = modelViewTransform;

    // Call the super constructor
    Node.call( componentNode, {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    // Add the rectangle graphic
    //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
    var xPos = this.model.position.x;
    var yPos = this.model.position.y;
    var height = this.model.diameter;
    var myHandle = new Rectangle( xPos, yPos - height/2, 15, height, { fill: 'red' } );

    componentNode.addChild( myHandle );


    // When dragging, move the sample element
    componentNode.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        // Translate on drag events
        //translate: function( args ) {
        //  //console.log( 'mouse position is ' + args.position );
        //  ComponentNode.model.setPosition( args.position );
        //  //ComponentNode.location = modelViewTransform.viewToModelPosition( args.position );
        //  //myCircle.translation = modelViewTransform.viewToModelPosition( args.position );
        //}
        drag: function( e ){
          var position = componentNode.globalToParentPoint( e.pointer.point );
          //console.log( 'position = ' + position );
          componentNode.model.setPosition( position );
        }
      } ) );

    // Register for synchronization with model.
    this.model.positionProperty.link( function( position ) {
      componentNode.translation = position;

    } );

  }

  return inherit( Node, ComponentNode );
} );