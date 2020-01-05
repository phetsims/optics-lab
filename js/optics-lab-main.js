// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const OpticsLabScreen = require( 'OPTICS_LAB/optics-lab/OpticsLabScreen' );
  //following 2 lines always required in every sim
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const opticsLabTitleString = require( 'string!OPTICS_LAB/optics-lab.title' );

  const simOptions = {
    credits: {
      //TODO fill in credits
      leadDesign: 'Michael Dubson',
      softwareDevelopment: 'Michael Dubson',
      team: '',
      thanks: ''
    }
  };

  SimLauncher.launch( () => {
    const sim = new Sim( opticsLabTitleString, [new OpticsLabScreen()], simOptions );
    sim.start();
  } );
} );