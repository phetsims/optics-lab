/**
 * Model of source of light = array of rays
 * Rays are either a fan (point source) or a beam (parallel rays)
 * Created by Dubson on 6/28/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var PropertySet = require( 'AXON/PropertySet' );
    var Ray2 = require( 'DOT/Ray2' );
    var Vector2 = require( 'DOT/Vector2' );

    /**
     *
     * @param {String} type = 'fan'|'beam' = fan of diverging rays or beam of parallel rays
     * @param {Number} nbrOfRays
     * @param {Number} spread = for fan source, range of angles in degrees; for beam, spread is zero
     * @param {Number} height = for beam source, range of y-position in cm; for fan, height is zero
     * @constructor
     */

    function SourceModel( mainModel, type, nbrOfRays, spread, height ) {

        PropertySet.call( this, {
            position: new Vector2( 0, 0 )               //@private, position of source on stage
        } );

        this.sourceModel = this;
        this.mainModel = mainModel;
        this.sourceNumber;  //for testing

        this.type = type; //'fan'|'beam'
        this.nbrOfRays = nbrOfRays;
        this.position = new Vector2( 0, 0 );
        this.maxLength = 2000;  //maximum length of rays in pixels

        if( type === 'fan' ){
            this.spread = spread;
            this.height = 0;
        }else if ( type === 'beam' ){
            this.spread = 0;
            this.height = height;
        }

        this.rays = [];    //an array of rays
        this.rayTips = [];   //ends of undeviated rays
        this.rayBreaks = [];    //ends of rays when intersecting component
        this.createRays();

    }

    return inherit( PropertySet, SourceModel, {
            createRays: function () {
                this.rays = [];  //clear any current rays
                this.rayTips = [];
                this.rayBreaks = [];
                //for fan
                var lowestAngle = - this.spread / 2;  //in degrees
                var deltaAngle;
                if( this.nbrOfRays === 1 ){
                    deltaAngle = 0;
                }else{
                    deltaAngle = this.spread / ( this.nbrOfRays - 1);    //in degrees
                }
                var theta = ( lowestAngle ) * Math.PI / 180; //in radians
                var dir = new Vector2( Math.cos( theta ), Math.sin( theta ) );
                //for beam
                var lowestPos = new Vector2( 0, -this.height / 2 );   //in cm
                var pos = lowestPos;
                var deltaHeight = this.height / ( this.nbrOfRays - 1 );
                var deltaPos = new Vector2( 0, deltaHeight );

                for (var i = 0; i < this.nbrOfRays; i++) {
                    if (this.type === 'fan') {
                        theta = ( lowestAngle + i*deltaAngle ) * Math.PI / 180;
                        dir = new Vector2( Math.cos(theta), Math.sin(theta) );
                        this.rays[i] = new Ray2( this.position, dir );
                        this.rayTips[i] =  this.position.plus( dir.timesScalar( this.maxLength ));
                        this.rayBreaks[i] = this.rayTips[i];
                    } else if (this.type === 'beam') {
                        dir = new Vector2(1, 0);
                        pos = this.position.plus( lowestPos ).plus( deltaPos.timesScalar( i ) );
                        this.rays[i] = new Ray2( pos, dir );
                        this.rayTips[i] = pos.plus( dir.timesScalar( this.maxLength ) );
                        this.rayBreaks[i] = this.rayTips[i];
                    }
                }
            }, //end createRays()
            setNbrOfRays: function ( nbrOfRays ){
                this.nbrOfRays = nbrOfRays;
                this.createRays();
                this.mainModel.processRays();
            },
            setSpreadOfFan: function( angleInDegrees ){
                if( this.type === 'fan' ){
                    this.spread = angleInDegrees;
                    this.createRays();
                    this.mainModel.processRays();
                }
            },
            setWidthOfBeam: function( heightInCm ){
                if( this.type === 'beam' ){
                    this.height = heightInCm;
                    this.createRays();
                    this.mainModel.processRays();
                }
            },
            setPosition: function ( position ){   //position = Vector2
                this.position = position;
                for( var i = 0; i < this.rays.length; i++ ){
                    if( this.type === 'fan' ){
                        this.rays[i].pos = position;
                        this.rayTips[i] = position.plus(this.rays[i].dir.timesScalar( this.maxLength ));
                        //this.rayBreaks[i] = this.rayTips[ i ];
                    }else if ( this.type === 'beam' ){
                        var lowestPos = new Vector2( 0, -this.height / 2 );
                        var deltaPos = new Vector2( 0, this.height / ( this.nbrOfRays - 1 ) );
                        var pos = position.plus( lowestPos ).plus( deltaPos.timesScalar( i ) );
                        this.rays[i].pos = pos;

                        this.rayTips[i] = pos.plus(this.rays[i].dir.timesScalar( this.maxLength ));
                        //this.rayBreaks[i] = this.rayTips[ i ];
                    }
                }
                this.mainModel.processRays();
            }
        }//end inherit
    );
} );