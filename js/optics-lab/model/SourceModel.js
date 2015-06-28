/**
 * Created by Dubson on 6/28/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
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

    function SourceModel( type, nbrOfRays, spread, height ) {

        this.sourceModel = this;

        this.type = type; //'fan'|'beam'
        this.nbrOfRays = nbrOfRays;
        this.position = new Vector2( 0, 0 );

        if( type === 'fan' ){
            this.spread = spread;
            this.height = 0;
        }else if ( type === 'beam' ){
            this.spread = 0;
            this.height = height;
        }

        this.source = [];    //source is an array of rays
        this.createRays();


    }

    return inherit(Object, SourceModel, {
            createRays: function () {
                this.source = [];  //clear any current rays
                //for fan
                var lowestAngle = this.spread / 2;  //in degrees
                var deltaAngle = this.spread / ( this.nbrOfRays - 1);    //in degrees
                var theta = ( lowestAngle + 0 * deltaAngle ) * Math.PI / 180; //in radians
                var dir = new Vector2( Math.cos(theta), Math.sin(theta) );
                //for beam
                var lowestPos = -this.height / 2;   //in cm
                var pos = lowestPos;
                var deltaPos = this.height / ( this.nbrOfRays - 1 );

                for (var i = 0; i < this.nbrOfRays; i++) {
                    if (this.type === 'fan') {
                        dir = new Vector2(Math.cos(theta), Math.sin(theta));
                        this.source[i] = new Ray2( this.position, dir );
                    } else if (this.type === 'beam') {
                        dir = new Vector2(1, 0);
                        pos = this.position + lowestPos + i * deltaPos;
                        this.source[i] = new Ray2( pos, dir );
                    }
                }
            }, //end createRays()
            setNbrOfRays: function ( nbrOfRays ){
                this.nbrOfRays = nbrOfRays;
                this.createRays();
            },
            setSpreadOfFan: function( angleInDegrees ){
                if( this.type === 'fan' ){
                    this.spread = angleInDegrees;
                    this.createRays();
                }
            },
            setHeightOfBeam: function( heightInCm ){
                if( this.type === 'beam' ){
                    this.height = heightInCm;
                    this.createRays;
                }
            },
            setPosition: function ( position ){
                this.position = position;
                for( var i = 0; i < this.sources.length; i++ ){
                    if( type === 'fan' ){
                        this.sources[i].pos = position;
                    }else if ( type === 'beam' ){
                        var deltaPos = this.height / ( this.nbrOfRays - 1 );
                        var pos = -( this.height/2 ) + i*deltaPos;
                        this.sources[i].pos = pos;
                    }
                }
            }
        }//end inherit
    );
} );