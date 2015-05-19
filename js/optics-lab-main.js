// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var OpticsLabScreen = require( 'OPTICS_LAB/optics-lab/OpticsLabScreen' );
  //following 2 lines always required in every sim
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!OPTICS_LAB/optics-lab.name' );

  var simOptions = {
    credits: {
      //TODO fill in credits
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new OpticsLabScreen() ], simOptions );
    sim.start();
  } );
} );