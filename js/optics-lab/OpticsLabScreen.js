// Copyright 2002-2014, University of Colorado Boulder

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

  // strings
  var opticsLabNameString = require( 'string!OPTICS_LAB/optics-lab.name' );

  function OpticsLabScreen() {
    Screen.call( this, opticsLabNameString, null /* no icon, single-screen sim */,
      function() { return new OpticsLabModel(); },
      function( model ) { return new OpticsLabScreenView( model ); },
      { backgroundColor: '#000077' }
    );
  }

  return inherit( Screen, OpticsLabScreen );
} );