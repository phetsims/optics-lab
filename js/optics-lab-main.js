// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import opticsLabStrings from './opticsLabStrings.js';
import OpticsLabScreen from './optics-lab/OpticsLabScreen.js';

//following 2 lines always required in every sim

const opticsLabTitleString = opticsLabStrings[ 'optics-lab' ].title;

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
  const sim = new Sim( opticsLabTitleString, [ new OpticsLabScreen() ], simOptions );
  sim.start();
} );