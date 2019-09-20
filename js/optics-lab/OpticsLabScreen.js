// Copyright 2014-2019, University of Colorado Boulder

/**
 * The 'Optics Lab' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const OpticsLabModel = require( 'OPTICS_LAB/optics-lab/model/OpticsLabModel' );
  const OpticsLabScreenView = require( 'OPTICS_LAB/optics-lab/view/OpticsLabScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

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
