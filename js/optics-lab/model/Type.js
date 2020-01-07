// Copyright 2017-2020, University of Colorado Boulder

/**
 * Enumeration of type of piece (Sources or Components) is being shown.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );


  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );

  const Type = Enumeration.byKeys( [

    'SLIT_MASK',
    'SIMPLE_MASK',
    'DIVERGING_MIRROR',
    'CONVERGING_MIRROR',
    'PLANE_MIRROR',
    'CONVERGING_LENS',
    'DIVERGING_LENS',
    'FAN_SOURCE',
    'BEAM_SOURCE'
  ] );

  return opticsLab.register( 'Type', Type );
} );
