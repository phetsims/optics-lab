// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import OpticsLabScreen from './optics-lab/OpticsLabScreen.js';
import OpticsLabStrings from './OpticsLabStrings.js';

//following 2 lines always required in every sim

const opticsLabTitleStringProperty = OpticsLabStrings[ 'optics-lab' ].titleStringProperty;

const simOptions = {
  credits: {
    //TODO fill in credits
    leadDesign: 'Michael Dubson',
    softwareDevelopment: 'Michael Dubson',
    team: '',
    thanks: ''
  }
};

simLauncher.launch( () => {
  const sim = new Sim( opticsLabTitleStringProperty, [ new OpticsLabScreen() ], simOptions );
  sim.start();
} );