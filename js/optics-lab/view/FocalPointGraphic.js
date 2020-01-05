// Copyright 2015-2020, University of Colorado Boulder

/**
 * @author Michael Dubson (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Utils = require( 'DOT/Utils' );

  class FocalPointGraphic extends Node {
    /**
     * @param {number|null} size
     */
    constructor( size ) {

      super();
      let R = Utils.roundSymmetric( size / 2 );
      if ( size === undefined ) {
        R = 30;
      }
      const strokeInfo = { stroke: 'yellow', lineWidth: 4, lineCap: 'butt' };
      const line1 = new Line( -R, -R, R, R, strokeInfo );
      const line2 = new Line( R, -R, -R, R, strokeInfo );
      this.children = [line1, line2];

    }

  }

  return opticsLab.register( 'FocalPointGraphic', FocalPointGraphic );
} );