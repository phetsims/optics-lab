// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Optics Lab' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var OpticsLabModel = require( 'OPTICS_LAB/optics-lab/model/OpticsLabModel' );
  var OpticsLabScreenView = require( 'OPTICS_LAB/optics-lab/view/OpticsLabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  function OpticsLabScreen() {
    Screen.call( this,
      function() { return new OpticsLabModel(); },
      function( model ) { return new OpticsLabScreenView( model ); },
      { backgroundColorProperty: new Property( '#0000CC' ) }
    );
  }

  return inherit( Screen, OpticsLabScreen );
} );
