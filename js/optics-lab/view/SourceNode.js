/**
 * Node for Source of light, which is either a fan of rays (point source)
 * or a parallel beam of rays
 * Created by Duso on 6/29/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Vector2 = require( 'DOT/Vector2' );


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
        this.rayNodes = [];

        // Call the super constructor
        Node.call( sourceNode, {

            // Show a cursor hand over the bar magnet
            cursor: 'pointer'
        } );

        // Add the circle graphic
        var myHandle = new Circle( 20, { x: 0, y: 0, fill: '#8F8' } );

        for ( var i = 0; i < this.model.rays.length; i++ ) {
            var dir = this.model.rays[ i ].dir;
            var rayNode = new Line( new Vector2( 0, 0 ), dir.timesScalar( 2000 ), { stroke: 'white', lineWidth: 2 } );
            this.rayNodes.push( rayNode );
            myHandle.addChild( rayNode );
        }
        sourceNode.addChild( myHandle );


        // When dragging, move the sample element
        sourceNode.addInputListener( new SimpleDragHandler(
            {
                // When dragging across it in a mobile device, pick it up
                allowTouchSnag: true,

                // Translate on drag events
                //translate: function( args ) {
                //    //console.log( 'mouse position is ' + args.position );
                //    sourceNode.model.setPosition( args.position );
                //    //var position = sourceNode.globalToParentPoint( args.pointer.point );
                //    //console.log( 'sourceNode position = ' + position );
                //    //console.log( ' args.pointer.point' + sourceNode.globalToParentPoint( args.pointer.point ));
                //    //console.log( ' args.pointer.point' + args.pointer.point );
                //    //sourceNode.location = modelViewTransform.viewToModelPosition( args.position );
                //    //myCircle.translation = modelViewTransform.viewToModelPosition( args.position );
                //}
                drag: function( e ){
                    var position = sourceNode.globalToParentPoint( e.pointer.point );
                    //console.log( 'position = ' + position );
                    sourceNode.model.setPosition( position );
                }
            } ) );

        // Register for synchronization with model.
        this.model.positionProperty.link( function( position ) {
            sourceNode.translation = position;
            //console.log( 'callback position is ' + position );
            sourceNode.drawRays();
        } );

    }

    return inherit( Node, SourceNode, {
        drawRays: function(){
            for ( var i = 0; i < this.model.rays.length; i++ ) {
                var endPt = this.model.rayEnds[ i ];
                var startPt = this.model.rays[ i ].pos;
                var segment = endPt.minus( startPt );
                var length = segment.magnitude();
                var dir = this.model.rays[ i ].dir;
                this.rayNodes[ i ].setPoint2( dir.timesScalar( length ) );
            }
        }
    } );
} );