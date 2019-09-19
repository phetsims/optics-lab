// Copyright 2017, University of Colorado Boulder

/**
 * What type of piece is being shown.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );

  var Type = {
    SLIT_MASK: 'SLIT_MASK',
    SIMPLE_MASK: 'SIMPLE_MASK',
    DIVERGING_MIRROR: 'DIVERGING_MIRROR',
    CONVERGING_MIRROR: 'CONVERGING_MIRROR',
    PLANE_MIRROR: 'PLANE_MIRROR',
    CONVERGING_LENS: 'CONVERGING_LENS',
    DIVERGING_LENS: 'DIVERGING_LENS',
    FAN_SOURCE: 'FAN_SOURCE',
    BEAM_SOURCE: 'BEAM_SOURCE'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Type ); }

  return opticsLab.register( 'Type', Type );
} );
