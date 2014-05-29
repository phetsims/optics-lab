// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Optics Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {BarMagnetModel} model
   * @constructor
   */
  function OpticsLabScreenView( model ) {

    var thisView = this;
    ScreenView.call( thisView );
  }

  return inherit( ScreenView, OpticsLabScreenView );
} );