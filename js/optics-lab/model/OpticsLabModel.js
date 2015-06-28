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
    var sources = [];
    var components = [];
  }

  return inherit(Object, OpticsLabModel, {
        addSource: function (source) {
          sources.push(source);
        },
        addComponent: function (component) {
          components.push(component);
        },
        removeSource: function (source) {
          var index = sources.indexOf(source);
          sources.splice(index, 1);
        },
        removeComponent: function (component) {
          var index = components.indexOf( component );
          components.splice( index, 1 );
        }
      }
  );
} );