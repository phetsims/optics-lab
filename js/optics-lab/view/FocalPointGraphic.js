// Copyright 2015-2019, University of Colorado Boulder

/**
 * @author Michael Dubson (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Util = require( 'DOT/Util' );

  /**
   * @extends {Node}
   * @param {number|null} size
   * @constructor
   */
  function FocalPointGraphic( size ) {

    Node.call( this );

    var R = Util.roundSymmetric( size / 2 );
    if ( size === undefined ) {
      R = 30;
    }
    var strokeInfo = { stroke: 'yellow', lineWidth: 4, lineCap: 'butt' };
    var line1 = new Line( -R, -R, R, R, strokeInfo );
    var line2 = new Line( R, -R, -R, R, strokeInfo );
    this.children = [ line1, line2 ];

  }

  opticsLab.register( 'FocalPointGraphic', FocalPointGraphic );

  return inherit( Node, FocalPointGraphic );
} );