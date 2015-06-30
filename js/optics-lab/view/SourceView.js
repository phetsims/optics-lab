/**
 * Created by Duso on 6/29/2015.
 */
define( function( require ) {
    'use strict';

    // modules

    var inherit = require( 'PHET_CORE/inherit' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var Node = require( 'SCENERY/nodes/Node' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );


    // images


    /**
     * Constructor for SourceNode which renders sample element as a scenery node.
     * @param {sampleElement} sampleElement the model of the sampleElement
     * @param {ModelViewTransform2} modelViewTransform the coordinate transform between model coordinates and view coordinates
     * @constructor
     */
    function SourceNode( sourceModel, modelViewTransform ) {

        var sourceNode = this;

        // Call the super constructor
        Node.call( sourceNode, {

            // Show a cursor hand over the bar magnet
            cursor: 'pointer'
        } );

        // Add the circle graphic
        var myCircle = new Circle( 50, { x: 300, y: 400, fill: 'green' } );
        sourceNode.addChild( myCircle );

        /*    // Add another (test) circle graphic
         var myCircle2 = new Circle( 30, { x: 300, y: 400, fill: 'Yellow' } );
         sourceNode.addChild( myCircle2 );
         myCircle2.translation =  { x: myCircle.x + 100, y: myCircle.y };*/


        // Scale it so it matches the model width and height
        //sourceNode.scale( modelViewTransform.modelToViewDeltaX( barMagnet.size.width ) / this.width,
        //modelViewTransform.modelToViewDeltaY( barMagnet.size.height ) / this.height );

        // When dragging, move the sample element
        sourceNode.addInputListener( new SimpleDragHandler(
            {
                // When dragging across it in a mobile device, pick it up
                allowTouchSnag: true,

                // Translate on drag events
                translate: function( args ) {
                    //console.log( 'mouse position is ' + args.position );
                    sampleElement.location = modelViewTransform.viewToModelPosition( args.position );
                    //myCircle.translation = modelViewTransform.viewToModelPosition( args.position );
                }
            } ) );

        // Register for synchronization with model.
        sampleElement.locationProperty.link( function( location ) {
            sourceNode.translation = modelViewTransform.modelToViewPosition( location );
        } );

        // Register for synchronization with model
        //sampleElement.orientationProperty.link( function( orientation ) {
        //sourceNode.rotation = orientation;
        //} );
    }

    return inherit( Node, SourceNode );
} );