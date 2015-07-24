/**
 * Node for Source of light, which is either a fan of rays (point source)
 * or a parallel beam of rays
 * Created by Dubson on 6/29/2015.
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
     *
     * @param {OpticsLabModel} mainModel
     * @param {SourceModel} sourceModel
     * @param {OpticsLabScreenView} mainView
     * @constructor
     */
    function SourceNode( mainModel, sourceModel, mainView ) {

        var sourceNode = this;
        this.sourceNumber;  //for testing
        this.mainModel = mainModel;
        this.pieceModel =  sourceModel;
        this.mainView = mainView;
        this.modelViewTransform = mainView.modelViewTransform;
        this.type = this.pieceModel.type;
        this.relativeRayStarts = []; //starting positions, relative to source center, of each ray
        this.rayNodes = [];   //array of rayNodes, a rayNode is a path of a ray from source through components to end
        this.maxNbrOfRays = sourceModel.maxNbrOfRays;
        this.counter = 0; //for testing only
        this.rayColor = '#fff';
        // Call the super constructor
        Node.call( sourceNode, {
            // Show a cursor hand over the bar magnet
            cursor: 'pointer'
        } );

        // Draw a handle
        var height = sourceModel.height;   //if type = 'beam_source'
        this.defaultHeight = height;

        this.myHandle;

        if( sourceModel.type === 'fan_source'){
            this.myHandle = new Circle( 20, { x: 0, y: 0, fill: '#8F8' } );
        }else if ( sourceModel.type === 'beam_source' ){
            this.myHandle = new Rectangle( 0, -height/2, 10, height, { fill: '#8F8' } );
        }

        sourceNode.addChild( this.myHandle );

        //initialize rayNodes array

        var rayFontObject = { stroke: this.rayColor, lineWidth: 2 } ;
        for( var r = 0; r < this.maxNbrOfRays; r++ ){
            this.rayNodes[ r ] = new Path( new Shape(), rayFontObject );
            sourceNode.addChild( this.rayNodes[ r ] );
        }



        // When dragging, move the sample element
        sourceNode.myHandle.addInputListener( new SimpleDragHandler(
            {
                // When dragging across it in a mobile device, pick it up
                allowTouchSnag: true,

                start: function( e ){
                    sourceNode.mainView.setSelectedPiece( sourceNode );
                },

                drag: function( e ){
                    var position = sourceNode.globalToParentPoint( e.pointer.point );
                    //console.log( 'position = ' + position );
                    sourceNode.pieceModel.setPosition( position );
                },
                end: function( e ){
                    var position = sourceNode.globalToParentPoint( e.pointer.point );
                    if( sourceNode.mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y )){
                        //console.log( 'delete this');
                        sourceNode.mainView.removeSource( sourceNode );
                        sourceNode.mainView.controlPanel.displayPanel.visible = false;
                    }else{
                        //console.log( 'keep this' );
                    }

                }
            } ) );

        // Register for synchronization with pieceModel and mainModel.
        this.pieceModel.positionProperty.link( function( position ) {
            sourceNode.translation = position;
            //console.log( 'source callback, position is ' + position );
            //sourceNode.drawRays();
        } );

        this.pieceModel.nbrOfRaysProperty.link( function( nbrOfRays ){
            sourceNode.setRayNodes( nbrOfRays );
            sourceModel.mainModel.processRays();
        });

        this.pieceModel.spreadProperty.link( function( nbrOfRays ){
            if( sourceNode.type === 'fan_source' ){
                sourceNode.setRayNodes();
                sourceModel.mainModel.processRays();
            }
        });

        this.pieceModel.heightProperty.link( function( height ){
            //console.log( 'source callback, height is ' + height );
            if( sourceNode.type === 'beam_source' ){
                sourceNode.setHeight( height );
            }
        });

        this.mainModel.processRaysCountProperty.link( function( count ) {
            sourceNode.drawRays();
            //console.log( 'source callback, rays processed. Count is ' + count );
        });

    }

    return inherit( Node, SourceNode, {
        setRayNodes: function( nbrOfRays ){
            //this.myHandle.removeAllChildren();
            //this.rayNodes = [];
            nbrOfRays = Math.round( nbrOfRays );

            for( var i = nbrOfRays; i < this.maxNbrOfRays; i++ ){
                this.rayNodes[ i ].visible = false;
            }
            var maxRayLength = this.pieceModel.maxLength;
            //var rayFontObject = { stroke: 'white', lineWidth: 2 } ;
            for ( var r = 0; r < this.pieceModel.rayPaths.length; r++ ) {
                this.rayNodes[ r ].visible = true;
                var dir = this.pieceModel.rayPaths[ r ].startDir;
                var sourceCenter = this.pieceModel.position;
                var AbsoluteRayStart = this.pieceModel.rayPaths[ r ].segments[ 0 ].getStart();
                var AbsoluteRayEnd = this.pieceModel.rayPaths[ r ].segments[ 0 ].getEnd();
                var relativeRayStart = AbsoluteRayStart.minus( sourceCenter );
                var relativeRayEnd = AbsoluteRayEnd.minus( sourceCenter );
                var rayShape = new Shape();
                rayShape.moveToPoint( relativeRayStart );
                if ( this.pieceModel.type === 'fan_source' ) {
                    this.relativeRayStarts[ r ] = relativeRayStart;
                    var relativeEndPt = dir.timesScalar( maxRayLength );
                    rayShape.lineToPoint( relativeEndPt );

                    //var rayNode = new Line( new Vector2( 0, 0 ), dir.timesScalar( maxRayLength ), rayFontObject );
                }else if( this.pieceModel.type === 'beam_source' ){

                    //console.log( 'ray' + i + '  rayStart is ' + relativeRayStart + '  rayEnd is ' + relativeRayEnd );
                    //var rayNode = new Line( relativeRayStart, relativeRayEnd, rayFontObject );
                    this.relativeRayStarts[ r ] = relativeRayStart;
                    rayShape.lineToPoint( relativeRayEnd );
                }
                this.rayNodes[ r ].setShape( rayShape );
                //var rayNode = new Path( rayShape, rayFontObject );

                //this.rayNodes.push( rayNode );
                //this.myHandle.addChild( rayNode );   //want to work with absolute coords
            }//end rayPath loop
        },//end setRayNodes()
        drawRays: function(){
            for ( var i = 0; i < this.pieceModel.rayPaths.length; i++ ) {
                //console.log( 'drawing rays for source ' + this.sourceNumber );
                var shape = this.pieceModel.rayPaths[ i ].getRelativeShape();//getShape();
                this.rayNodes[ i ].setShape( shape );
                //var centerStartPt = this.pieceModel.position;
                //var absoluteRayEndPt = this.pieceModel.rayPaths[ i ].segments[ 0 ].getEnd();
                //var relativeRayEndPt = absoluteRayEndPt.minus( centerStartPt );
                //this.rayNodes[ i ].setPoint2( relativeRayEndPt );
             //this.rayNodes[ i ].setPoint2( dir.timesScalar( length ) );
            }
        },
        //addRayNodesToParent: function( parentNode ){
        //    for ( var i = 0; i < this.rayNodes.length; i++ ) {
        //        parentNode.addChild( this.rayNodes[ i ] );
        //    }
        //},
        //removeRayNodesFromParent: function( parentNode ){
        //    for ( var i = this.rayNodes.length - 1; i >= 0 ; i-- ) {
        //        parentNode.removeChild( this.rayNodes[ i ] );
        //    }
        //},
        setHeight: function( height ){
            this.myHandle.setScaleMagnitude( 1, height/this.defaultHeight );
        },
        setColor: function( color ){
            for ( var i = 0; i < this.pieceModel.rayPaths.length; i++ ) {
                this.rayNodes[ i ].strokeColor = color;
            }
        }
    } );
} );