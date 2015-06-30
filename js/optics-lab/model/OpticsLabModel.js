
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Optics Lab' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function OpticsLabModel() {
    this.sources = [];
    this.components = [];

  }

  return inherit( Object, OpticsLabModel, {
      addSource: function( source ) {
        this.sources.push( source );
      },
      addComponent: function( component ) {
        this.components.push( component );
      },
      removeSource: function( source ) {
        var index = sources.indexOf( source );
        this.sources.splice( index, 1 );
      },
      removeComponent: function( component ) {
        var index = this.components.indexOf( component );
        this.components.splice( index, 1 );
      },
      processRays: function() {

      }
    }
  );
} );