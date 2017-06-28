// Copyright 2016, University of Colorado Boulder

/**
 * The 'Optics Lab' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var OpticsLabModel = require( 'OPTICS_LAB/optics-lab/model/OpticsLabModel' );
  var OpticsLabScreenView = require( 'OPTICS_LAB/optics-lab/view/OpticsLabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );

  /**
   * @extends {Screen}
   * @constructor
   */
  function OpticsLabScreen() {
    Screen.call( this,
      function() { return new OpticsLabModel(); },
      function( model ) { return new OpticsLabScreenView( model ); },
      { backgroundColorProperty: new Property( '#0000CC' ) }
    );
  }

  opticsLab.register( 'OpticsLabScreen', OpticsLabScreen );

  return inherit( Screen, OpticsLabScreen );
} );
