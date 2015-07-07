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
    var Path = require( 'SCENERY/nodes/Path' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Vector2 = require( 'DOT/Vector2' );


    // images


    /**
     * Constructor for SourceNode which renders sample element as a scenery node.
     * @param {sampleElement} sampleElement the sourceModel of the sampleElement
     * @param {ModelViewTransform2} modelViewTransform the coordinate transform between sourceModel coordinates and view coordinates
     * @constructor
     */
    function SourceNode( mainModel, sourceModel, modelViewTransform ) {

        var sourceNode = this;
        this.sourceNumber;  //for testing
        this.mainModel = mainModel;
        this.sourceModel =  sourceModel;
        this.modelViewTransform = modelViewTransform;
        this.rayNodes = [];   //array of rayNodes, a rayNode is a path of a ray from source through components to end

        // Call the super constructor
        Node.call( sourceNode, {

            // Show a cursor hand over the bar magnet
            cursor: 'pointer'
        } );

        // Draw a handle
        var height = sourceModel.height;   //if beam
        var deltaHeight = height/( sourceModel.nbrOfRays - 1 );
        var maxRayLength = sourceModel.maxLength;

        if( sourceModel.type === 'fan'){
            var myHandle = new Circle( 20, { x: 0, y: 0, fill: '#8F8' } );
        }else if ( sourceModel.type === 'beam' ){
            myHandle = new Rectangle( 0, -height/2, 10, height, { fill: '#8F8' } );
        }

        //draw the rays on the handle
        var rayFontObject = { stroke: 'white', lineWidth: 2 }

        for ( var i = 0; i < this.sourceModel.rayPaths.length; i++ ) {
            var dir = this.sourceModel.rayPaths[ i ].startDir;
            var sourceCenter = this.sourceModel.position;
            var AbsoluteRayStart = sourceModel.rayPaths[ i ].segments[ 0 ].getStart();
            var AbsoluteRayEnd = sourceModel.rayPaths[ i ].segments[ 0 ].getEnd();
            var relativeRayStart = AbsoluteRayStart.minus( sourceCenter );
            var relativeRayEnd = AbsoluteRayEnd.minus( sourceCenter );
            var rayShape = new Shape();
            rayShape.moveToPoint( relativeRayStart );
            if ( sourceModel.type === 'fan' ) {
                var relativeEndPt = dir.timesScalar( maxRayLength );
                rayShape.lineToPoint( relativeEndPt );

                //var rayNode = new Line( new Vector2( 0, 0 ), dir.timesScalar( maxRayLength ), rayFontObject );
            }else if( sourceModel.type === 'beam' ){

                //console.log( 'ray' + i + '  rayStart is ' + relativeRayStart + '  rayEnd is ' + relativeRayEnd );
                //var rayNode = new Line( relativeRayStart, relativeRayEnd, rayFontObject );
                rayShape.lineToPoint( relativeRayEnd );
            }
            var rayNode = new Path( rayShape, rayFontObject );

            this.rayNodes.push( rayNode );
            myHandle.addChild( rayNode );   //want to work with absolute coords
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
                //    sourceNode.sourceModel.setPosition( args.position );
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
                    sourceNode.sourceModel.setPosition( position );
                }
            } ) );

        // Register for synchronization with sourceModel and mainModel.
        this.sourceModel.positionProperty.link( function( position ) {
            sourceNode.translation = position;
            //console.log( 'source callback, position is ' + position );
            //sourceNode.drawRays();
        } );

        this.mainModel.processRaysCountProperty.link( function( count ) {
            sourceNode.drawRays();
            //console.log( 'source callback, rays processed. Count is ' + count );
        });

    }

    return inherit( Node, SourceNode, {
        drawRays: function(){
            for ( var i = 0; i < this.sourceModel.rayPaths.length; i++ ) {
                //console.log( 'drawing rays for source ' + this.sourceNumber );
                var shape = this.sourceModel.rayPaths[ i ].getShape();
                this.rayNodes[ i ].setShape( shape );
                //var centerStartPt = this.sourceModel.position;
                //var absoluteRayEndPt = this.sourceModel.rayPaths[ i ].segments[ 0 ].getEnd();
                //var relativeRayEndPt = absoluteRayEndPt.minus( centerStartPt );
                //this.rayNodes[ i ].setPoint2( relativeRayEndPt );
             //this.rayNodes[ i ].setPoint2( dir.timesScalar( length ) );
            }
        },
        addRayNodesToParent: function(){
            for ( var i = 0; i < this.rayNodes.length; i++ ) {
                debugger;
                this.parent.addChild( this.rayNodes[ i ] );
            }
        }
    } );
} );