// Copyright 2016, University of Colorado Boulder

/**
 * @author Michael Dubson (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );

  //var Shape = require( 'KITE/Shape' );
  //
  // var Ray2 = require( 'DOT/Ray2' );
  //var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param relativeStartPos
   * @param startDir
   * @constructor
   */

  function FocalPointGraphic( size ) {

    Node.call( this );

    var R = Math.round( size / 2 );
    if ( size === undefined ) {
      R = 30;
    }
    var strokeInfo = { stroke: 'yellow', lineWidth: 4, lineCap: 'butt' };
    var line1 = new Line( -R, -R, R, R, strokeInfo );
    var line2 = new Line( R, -R, -R, R, strokeInfo );
    this.children = [ line1, line2 ];


  }
  opticsLab.register( 'FocalPointGraphic', FocalPointGraphic );

  return inherit( Node, FocalPointGraphic, {
      myFunction: function() {
      }


    }//end inherit
  );
} );