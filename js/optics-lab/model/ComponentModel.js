/**
 * Created by Duso on 6/28/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Vector2 = require( 'DOT/Vector2' );

    function ComponentModel( model, type, diameter, focalLength  ) {

        this.componentModel = this;

        this.model = model;
        this.type = type; // 'lens'|'curved_mirror'|'plane_mirror'|'mask'
        this.diameter = diameter;
        this.f = focalLength;
        this.position = new Vector2( 0, 0 );
        this.model.addComponent( this );
    }

    return inherit(Object, OpticsLabModel, {
            setFocalLength: function ( f ) {
                if( this.type === 'lens' || this.type === 'curved_mirror'){
                    this.f = f;
                } else{
                    console.log( 'ERROR: plane mirrors and masks do not have finite focal length.')
                }
            },
            setDiameter: function( diameter ){

                this.diameter = diameter;
            },
            setPosition: function( position ){   //position is vector2
            this.position = position;
        }

        }
    );
} );