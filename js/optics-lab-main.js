// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var OpticsLabScreen = require( 'OPTICS_LAB/optics-lab/OpticsLabScreen' );
  //following 2 lines always required in every sim
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var opticsLabTitleString = require( 'string!OPTICS_LAB/optics-lab.title' );

  var simOptions = {
    credits: {
      //TODO fill in credits
      leadDesign: 'Michael Dubson',
      softwareDevelopment: 'Michael Dubson',
      team: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( opticsLabTitleString, [ new OpticsLabScreen() ], simOptions );
    sim.start();
  } );
} );