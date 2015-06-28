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
        this.type = type; // 'lens'|'mirror'|'mask'
        this.diameter = diameter;
        this.f = focalLength;
        this.position = new Vector2( 0, 0 );

        this.model.addComponent( this );
    }

    return inherit(Object, OpticsLabModel, {
            setFocalLength: function (f) {
                this.f = f;
            },
            setDiameter: function( diameter ){
                this.diameter = diameter;
            },
            setPosition: function( position ){
            this.position = position;
        }

        }
    );
} );