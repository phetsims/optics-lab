// Copyright 2015-2020, University of Colorado Boulder

/**
 * Constants for the simulation Optics Lab
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import opticsLab from '../opticsLab.js';

const OpticsLabConstants = {
  // layout bounds used throughout the simulation for laying out the screens
  LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),
  BACKGROUND_COLOR: '#0000CC', //'#FFFF99', //'#FFECB3',  //'#EFE', //
  VIEW_BACKGROUND_COLOR: '#FFF', //'#EFE', //'#FFD',//'#FEC',
  TEXT_COLOR: '#000',
  LINE_COLOR: '#000',
  PANEL_COLOR: '#EEE', //'#FFD9B3',  //
  LENS_COLOR: '#0C0',
  MIRROR_COS_COLOR: '#00D',

  MAXIMUM_LIGHT_RAYS: 20, // Maximum number of light rays from a source

  // TODO convert the length to model coordinates (see #31)
  MAXIMUM_RAY_LENGTH: 2000 // maximum length of segment of rayPath
};
opticsLab.register( 'OpticsLabConstants', OpticsLabConstants );
export default OpticsLabConstants;