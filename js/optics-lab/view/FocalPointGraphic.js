// Copyright 2015-2022, University of Colorado Boulder

/**
 * X shape representing the focal point
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { Line, Node } from '../../../../scenery/js/imports.js';
import opticsLab from '../../opticsLab.js';

class FocalPointGraphic extends Node {
  /**
   * @param {number|null} size
   */
  constructor( size ) {

    let R = Utils.roundSymmetric( size / 2 );
    if ( size === undefined ) {
      R = 30;
    }
    const lineOptions = { stroke: 'yellow', lineWidth: 4, lineCap: 'butt' };
    const line1 = new Line( -R, -R, R, R, lineOptions );
    const line2 = new Line( R, -R, -R, R, lineOptions );
    super( { children: [ line1, line2 ] } );

  }

}

opticsLab.register( 'FocalPointGraphic', FocalPointGraphic );
export default FocalPointGraphic;