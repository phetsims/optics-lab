// Copyright 2016, University of Colorado Boulder

/**
 * Color constants
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );

  return opticsLab.register( 'Util', {
    // layout bounds used throughout the simulation for laying out the screens
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),
    BACKGROUND_COLOR: '#0000CC', //'#FFFF99', //'#FFECB3',  //'#EFE', //
    VIEW_BACKGROUND_COLOR: '#FFF', //'#EFE', //'#FFD',//'#FEC',
    TEXT_COLOR: '#000',
    LINE_COLOR: '#000',
    PANEL_COLOR: '#EEE', //'#FFD9B3',  //
    LENS_COLOR: '#0C0',
    MIRROR_COS_COLOR: '#00D'
  } );
} );

