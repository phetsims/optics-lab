// Copyright 2017-2022, University of Colorado Boulder

/**
 * Enumeration of type of piece (Sources or Components) is being shown.
 *
 * @author Martin Veillette (Berea College)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import opticsLab from '../../opticsLab.js';

const Type = EnumerationDeprecated.byKeys( [

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

opticsLab.register( 'Type', Type );
export default Type;