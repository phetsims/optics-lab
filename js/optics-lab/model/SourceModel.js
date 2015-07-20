/**
 * Model of source of light = array of rays
 * Rays are either a fan (point source) or a beam (parallel rays)
 * Created by Dubson on 6/28/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    //var Line = require( 'KITE/segments/Line' );
    var PropertySet = require( 'AXON/PropertySet' );
    //var Ray2 = require( 'DOT/Ray2' );
    var RayPath = require( 'OPTICS_LAB/optics-lab/model/RayPath' );
    var Vector2 = require( 'DOT/Vector2' );

    /**
     * @param {OpticsLabModel} mainModel for this sim
     * @param {String} type = 'fan_source'|'beam_source' = fan of diverging rays or beam of parallel rays
     * @param {Number} nbrOfRays
     * @param {Number} spread = for fan source, range of angles in degrees; for beam, spread is zero
     * @param {Number} height = for beam source, range of y-position in cm; for fan, height is zero
     * @constructor
     */

    function SourceModel( mainModel, type, nbrOfRays, position, spread, height ) {

        PropertySet.call( this, {
            position: position,         //@private, position of source on stage
            nbrOfRays: nbrOfRays,       //@private, number of rays
            spread: spread,             //spread of point source (fan source) in degrees
            height: height              //height of source, if beam
        } );

        var sourceModel = this;
        this.mainModel = mainModel;
        this.sourceNumber;  //for testing

        this.type = type; //'fan_source'|'beam_source'
        this.maxLength = 2000;  //maximum length of rays in pixels
        this.maxNbrOfRays = 40;

        if( type === 'fan_source' ){
            this.spread = spread;
            this.height = 0;
        }else if ( type === 'beam_source' ){
            this.spread = 0;
            this.height = height;
        }

        this.nbrOfRaysProperty.link( function(){
            //debugger;
            sourceModel.createRays();
            sourceModel.mainModel.processRays();
        });
        this.spreadProperty.link( function(){
            sourceModel.createRays();
            sourceModel.mainModel.processRays();
        });
        this.heightProperty.link( function(){
            sourceModel.createRays();
            sourceModel.mainModel.processRays();
        });



        this.rayPaths = [];    //an array of RayPaths

        this.createRays();

        //this.setPosition( position );

    }

    return inherit( PropertySet, SourceModel, {
            createRays: function () {
                this.rayPaths = [];  //clear any current rays
                this.nbrOfRays = Math.round( this.nbrOfRays );  //slider may produce non-integer number of rays
                //for fan source
                var lowestAngle = -this.spread / 2;  //in degrees
                var deltaAngle;
                if( this.nbrOfRays === 1 ){
                    deltaAngle = 0;
                    lowestAngle = 0;  //if only one ray, ray is horizontal
                }else{
                    deltaAngle = this.spread / ( this.nbrOfRays - 1);    //in degrees
                }
                var theta = ( lowestAngle ) * Math.PI / 180; //in radians
                var dir = new Vector2( Math.cos( theta ), Math.sin( theta ) );
                var relativeStartPos = new Vector2( 0, 0 );
                //var endPosition = this.position.plus( dir.timesScalar( this.maxLength ));

                //for beam source
                var lowestPos = new Vector2( 0, -this.height / 2 );   //in cm
                var startPos = lowestPos;
                var deltaHeight = this.height / ( this.nbrOfRays - 1 );
                var deltaPos = new Vector2( 0, deltaHeight );

                //loop through and initialize all rayPaths of the source
                for ( var i = 0; i < this.nbrOfRays; i++ ) {
                    if ( this.type === 'fan_source' ) {
                        theta = ( lowestAngle + i*deltaAngle ) * Math.PI / 180;  //in radians
                        relativeStartPos = new Vector2( 0, 0 );
                        dir = new Vector2( Math.cos(theta), Math.sin(theta) );
                        //endPosition = this.position.plus( dir.timesScalar( this.maxLength ));

                        this.rayPaths[i] = new RayPath( relativeStartPos, dir );
                        this.rayPaths[i].startPos = this.position;
                        //this.rayPaths[i].addSegment( this.position, endPosition );
                    } else if (this.type === 'beam_source') {
                        dir = new Vector2( 1, 0 );
                        relativeStartPos = lowestPos.plus( deltaPos.timesScalar( i ) );
                        startPos = this.position.plus( lowestPos ).plus( deltaPos.timesScalar( i ) );
                        //endPosition = startPos.plus( dir.timesScalar( this.maxLength ));
                        this.rayPaths[i] = new RayPath( relativeStartPos, dir );
                        this.rayPaths[i].startPos = startPos;
                        //this.rayPaths[i].addSegment( startPos, endPosition );
                    }
                }
            }, //end createRays()
            setNbrOfRays: function ( nbrOfRays ){
                this.nbrOfRays = nbrOfRays;
                this.createRays();
                this.mainModel.processRays();
            },
            setSpreadOfFan: function( angleInDegrees ){
                if( this.type === 'fan_source' ){
                    this.spread = angleInDegrees;
                    this.createRays();
                    this.mainModel.processRays();
                }
            },
            setWidthOfBeam: function( heightInCm ){
                if( this.type === 'beam_source' ){
                    this.height = heightInCm;
                    this.createRays();
                    this.mainModel.processRays();
                }
            },
            setPosition: function ( position ){   //position = Vector2
                this.position = position;
                for( var i = 0; i < this.rayPaths.length; i++ ){
                    //var dir = this.rayPaths[ i ].startDir;
                    //this.rayPaths[ i ].clearPath();
                    if( this.type === 'fan_source' ){
                        this.rayPaths[ i ].startPos = position;
                        //var endPos = position.plus( dir.timesScalar( this.maxLength ));
                        //this.rayPaths[ i ].addSegment( position, endPos );
                    }else if ( this.type === 'beam_source' ){
                        var lowestPos = new Vector2( 0, -this.height / 2 );
                        var deltaPos = new Vector2( 0, this.height / ( this.nbrOfRays - 1 ) );
                        var pos = position.plus( lowestPos ).plus( deltaPos.timesScalar( i ) );
                        //endPos = pos.plus( dir.timesScalar( this.maxLength ));
                        this.rayPaths[ i ].startPos = pos;
                        //this.rayPaths[ i ].addSegment( pos, endPos );
                    }
                }
                this.mainModel.processRays();
            }
        }//end inherit
    );
} );