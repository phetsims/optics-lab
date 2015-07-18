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
    //var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    //var Vector2 = require( 'DOT/Vector2' );


    // images


    /**
     * Constructor for SourceNode which renders sample element as a scenery node.
     * @param {sampleElement} sampleElement the sourceModel of the sampleElement
     * @param {ModelViewTransform2} modelViewTransform the coordinate transform between sourceModel coordinates and view coordinates
     * @constructor
     */
    function SourceNode( mainModel, sourceModel, mainView ) {

        var sourceNode = this;
        this.sourceNumber;  //for testing
        this.mainModel = mainModel;
        this.sourceModel =  sourceModel;
        this.mainView = mainView;
        this.modelViewTransform = mainView.modelViewTransform;
        this.type = this.sourceModel.type;
        this.rayNodes = [];   //array of rayNodes, a rayNode is a path of a ray from source through components to end
        this.counter = 0; //for testing only
        // Call the super constructor
        Node.call( sourceNode, {

            // Show a cursor hand over the bar magnet
            cursor: 'pointer'
        } );

        // Draw a handle
        var height = sourceModel.height;   //if beam
        //var deltaHeight = height/( sourceModel.nbrOfRays - 1 );

        var myHandle;

        if( sourceModel.type === 'fan_source'){
            myHandle = new Circle( 20, { x: 0, y: 0, fill: '#8F8' } );
        }else if ( sourceModel.type === 'beam_source' ){
            myHandle = new Rectangle( 0, -height/2, 10, height, { fill: '#8F8' } );
        }

        sourceNode.addChild( myHandle );

        //draw the starting rays
        this.setRayNodes();

        // When dragging, move the sample element
        sourceNode.addInputListener( new SimpleDragHandler(
            {
                // When dragging across it in a mobile device, pick it up
                allowTouchSnag: true,

                start: function( e ){
                    sourceNode.mainView.setSelectedPiece( sourceNode );
                },

                drag: function( e ){
                    var position = sourceNode.globalToParentPoint( e.pointer.point );
                    //console.log( 'position = ' + position );
                    sourceNode.sourceModel.setPosition( position );
                },
                end: function( e ){
                    var position = sourceNode.globalToParentPoint( e.pointer.point );
                    if( sourceNode.mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y )){
                        //console.log( 'delete this');
                        sourceNode.mainView.removeSource( sourceNode );
                    }else{
                        //console.log( 'keep this' );
                    }

                }
            } ) );

        // Register for synchronization with sourceModel and mainModel.
        this.sourceModel.positionProperty.link( function( position ) {
            sourceNode.translation = position;
            //console.log( 'source callback, position is ' + position );
            //sourceNode.drawRays();
        } );

        this.sourceModel.nbrOfRaysProperty.link( function( nbrOfRays ){
            sourceNode.setRayNodes();
        });

        this.mainModel.processRaysCountProperty.link( function( count ) {
            sourceNode.drawRays();
            //console.log( 'source callback, rays processed. Count is ' + count );
        });

    }

    return inherit( Node, SourceNode, {
        setRayNodes: function(){
            this.rayNodes = [];
            var maxRayLength = this.sourceModel.maxLength;
            var rayFontObject = { stroke: 'white', lineWidth: 2 } ;
            for ( var r = 0; r < this.sourceModel.rayPaths.length; r++ ) {

                var dir = this.sourceModel.rayPaths[ r ].startDir;
                var sourceCenter = this.sourceModel.position;
                var AbsoluteRayStart = this.sourceModel.rayPaths[ r ].segments[ 0 ].getStart();
                var AbsoluteRayEnd = this.sourceModel.rayPaths[ r ].segments[ 0 ].getEnd();
                var relativeRayStart = AbsoluteRayStart.minus( sourceCenter );
                var relativeRayEnd = AbsoluteRayEnd.minus( sourceCenter );
                var rayShape = new Shape();
                rayShape.moveToPoint( relativeRayStart );
                if ( this.sourceModel.type === 'fan_source' ) {
                    var relativeEndPt = dir.timesScalar( maxRayLength );
                    rayShape.lineToPoint( relativeEndPt );

                    //var rayNode = new Line( new Vector2( 0, 0 ), dir.timesScalar( maxRayLength ), rayFontObject );
                }else if( this.sourceModel.type === 'beam_source' ){

                    //console.log( 'ray' + i + '  rayStart is ' + relativeRayStart + '  rayEnd is ' + relativeRayEnd );
                    //var rayNode = new Line( relativeRayStart, relativeRayEnd, rayFontObject );
                    rayShape.lineToPoint( relativeRayEnd );
                }
                var rayNode = new Path( rayShape, rayFontObject );

                this.rayNodes.push( rayNode );
                //myHandle.addChild( rayNode );   //want to work with absolute coords
            }//end rayPath loop
        },//end setRayNodes()
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
        addRayNodesToParent: function( parentNode ){
            for ( var i = 0; i < this.rayNodes.length; i++ ) {
                parentNode.addChild( this.rayNodes[ i ] );
            }
        },
        removeRayNodesFromParent: function( parentNode ){
            for ( var i = this.rayNodes.length - 1; i >= 0 ; i-- ) {
                parentNode.removeChild( this.rayNodes[ i ] );
            }
        }
    } );
} );