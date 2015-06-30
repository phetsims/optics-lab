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
        this.model =  sourceModel;
        this.modelViewTransform = modelViewTransform;

        // Call the super constructor
        Node.call( sourceNode, {

            // Show a cursor hand over the bar magnet
            cursor: 'pointer'
        } );

        // Add the circle graphic
        var myCircle = new Circle( 50, { x: 300, y: 400, fill: 'red' } );
        sourceNode.addChild( myCircle );


        // When dragging, move the sample element
        sourceNode.addInputListener( new SimpleDragHandler(
            {
                // When dragging across it in a mobile device, pick it up
                allowTouchSnag: true,

                // Translate on drag events
                translate: function( args ) {
                    //console.log( 'mouse position is ' + args.position );
                    sourceNode.model.setPosition( args.position );
                    //sourceNode.location = modelViewTransform.viewToModelPosition( args.position );
                    //myCircle.translation = modelViewTransform.viewToModelPosition( args.position );
                }
            } ) );

        // Register for synchronization with model.
        this.model.positionProperty.link( function( position ) {
            sourceNode.translation = position;
        } );

    }

    return inherit( Node, SourceNode );
} );