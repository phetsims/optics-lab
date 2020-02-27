// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Optics Lab' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import opticsLab from '../opticsLab.js';
import OpticsLabModel from './model/OpticsLabModel.js';
import OpticsLabScreenView from './view/OpticsLabScreenView.js';

class OpticsLabScreen extends Screen {

  constructor() {
    super(
      () => new OpticsLabModel(),
      model => new OpticsLabScreenView( model ),
      { backgroundColorProperty: new Property( '#0000CC' ) }
    );
  }
}

opticsLab.register( 'OpticsLabScreen', OpticsLabScreen );
export default OpticsLabScreen;