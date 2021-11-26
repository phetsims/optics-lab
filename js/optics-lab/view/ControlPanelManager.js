// Copyright 2015-2021, University of Colorado Boulder

/**
 * Control panel for a particular source (fan or beam) or a particular component (lens, mirror, or mask)
 * contains sliders to set height or spread of source or diameter, focal length (if lens or mirror) and index (if lens) of refraction of component
 * Piece:  Controls
 * fan_source: spread in degrees
 * beam_source: height in cm
 * converging_lens: diameter in cm,/radius of curvature in cm/index of refraction (no units)
 * diverging_lens: diameter/radius/index
 * converging_mirror: diameter/radius
 * diverging_mirror: diameter/radius
 * plane_mirror: diameter
 * simple_mask: diameter
 * slit_mask: diameter/ slit width
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Utils from '../../../../dot/js/Utils.js';
import { Node } from '../../../../scenery/js/imports.js';
import opticsLab from '../../opticsLab.js';
import Type from '../model/Type.js';
import ControlPanel from './ControlPanel.js';

class ControlPanelManager extends Node {
  /**
   * @param {OpticsLabScreenView} mainView
   */
  constructor( mainView ) {

    super();
    this.mainView = mainView;
    this.controlPanels = [];     //one display for each piece on the stage, only display of selected piece is visible
    this.pieces = createObservableArray();
    this.selectedPiece = new Node();
    this.previousRaysUpdate;
    this.previousSpreadUpdate;
    this.previousColorUpdate;
    this.previousDiameterUpdate;
    this.previousRadiusOfCurvatureUpdate;
    this.previousIndexOfRefractionUpdate;
    this.previousShowFocalPointsUpdate;
    this.previousDisplayFocalLengthUpdate;
    //this.expandedProperty = new Property( true );
    this.typeArray = [
      Type.FAN_SOURCE,
      Type.BEAM_SOURCE,
      Type.CONVERGING_LENS,
      Type.DIVERGING_LENS,
      Type.CONVERGING_MIRROR,
      Type.PLANE_MIRROR,
      Type.DIVERGING_MIRROR,
      Type.SIMPLE_MASK,
      Type.SLIT_MASK
    ];

    for ( let i = 0; i < this.typeArray.length; i++ ) {
      const newControlPanel = new ControlPanel( mainView, this.typeArray[ i ] );
      this.controlPanels[ i ] = newControlPanel;
      this.addChild( newControlPanel );
    }

    this.mainView.selectedPieceProperty.lazyLink( piece => {
      this.selectedPiece = piece;
      this.linkControls();
    } );

    // All controls are placed on display node, with visibility set by accordionBox button

  }//end constructor

  /**
   *
   * @param {Type} type
   * @returns {number}
   * @public
   */
  getIndex( type ) {
    let index;
    for ( let i = 0; i < this.typeArray.length; i++ ) {
      if ( this.controlPanels[ i ].type === type ) {
        index = i;
      }
    }
    return index;
  }

  /**
   * @private
   */
  linkControls() {
    const piece = this.selectedPiece;
    const controlPanel = this.controlPanels[ this.getIndex( piece.type ) ];

    const raysUpdate = nbrOfRays => {
      piece.pieceModel.nbrOfRaysProperty.value = Utils.roundSymmetric( nbrOfRays );
    };

    const spreadUpdate = spread => {
      piece.pieceModel.spreadProperty.value = Utils.roundSymmetric( spread );
    };

    const colorUpdate = colorString => {
      piece.colorProperty.value = colorString;
    };

    const widthUpdate = width => {
      piece.pieceModel.widthProperty.value = width;
    };

    const diameterUpdate = diameter => {
      piece.pieceModel.diameterProperty.value = diameter;
    };

    const radiusOfCurvatureUpdate = radius => {
      piece.pieceModel.radiusProperty.value = radius;
    };

    const indexOfRefractionUpdate = index => {
      piece.pieceModel.indexProperty.value = index;
    };

    const showFocalPointsUpdate = tOrF => {
      piece.showFocalPointsProperty.value = tOrF;
    };

    const unlinkAll = () => {
      controlPanel.nbrOfRaysProperty.hasListener( this.previousRaysUpdate ) && controlPanel.nbrOfRaysProperty.unlink( this.previousRaysUpdate );
      controlPanel.spreadProperty.hasListener( this.previousSpreadUpdate ) && controlPanel.spreadProperty.unlink( this.previousSpreadUpdate );
      controlPanel.colorProperty.hasListener( this.previousColorUpdate ) && controlPanel.colorProperty.unlink( this.previousColorUpdate );
      controlPanel.widthProperty.hasListener( this.previousWidthUpdate ) && controlPanel.widthProperty.unlink( this.previousWidthUpdate );
      controlPanel.diameterProperty.hasListener( this.previousDiameterUpdate ) && controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      controlPanel.radiusOfCurvatureProperty.hasListener( this.previousRadiusOfCurvatureUpdate ) && controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
      controlPanel.indexOfRefractionProperty.hasListener( this.previousIndexOfRefractionUpdate ) && controlPanel.indexOfRefractionProperty.unlink( this.previousIndexOfRefractionUpdate );
      controlPanel.showFocalPointsProperty.hasListener( this.previousShowFocalPointsUpdate ) && controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
    };

    const setAllPanelsAndLinkAll = () => {
      if ( piece.pieceModel.nbrOfRaysProperty !== undefined ) {
        controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRaysProperty.value;
        controlPanel.nbrOfRaysProperty.link( raysUpdate );
      }
      if ( piece.pieceModel.spreadProperty !== undefined ) {
        controlPanel.spreadProperty.value = piece.pieceModel.spreadProperty.value;
        controlPanel.spreadProperty.link( spreadUpdate );
      }
      if ( piece.colorProperty !== undefined ) {
        controlPanel.colorProperty.value = piece.colorProperty.value;
        controlPanel.colorProperty.link( colorUpdate );
      }
      if ( piece.pieceModel.widthProperty !== undefined ) {
        controlPanel.widthProperty.value = piece.pieceModel.widthProperty.value;
        controlPanel.widthProperty.link( widthUpdate );
      }
      if ( piece.pieceModel.diameterProperty !== undefined &&
           piece.pieceModel.diameterProperty.value !== undefined ) {
        controlPanel.diameterProperty.value = piece.pieceModel.diameterProperty.value;
        controlPanel.diameterProperty.link( diameterUpdate );
      }
      if ( piece.pieceModel.radiusProperty !== undefined &&
           piece.pieceModel.radiusProperty.value !== undefined ) {
        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radiusProperty.value;
        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
      }
      if ( piece.pieceModel.indexProperty !== undefined &&
           piece.pieceModel.indexProperty.value !== undefined ) {
        controlPanel.indexOfRefractionProperty.value = piece.pieceModel.indexProperty.value;
        controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
      }
      if ( piece.showFocalPointsProperty !== undefined ) {
        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
      }
    };

    const setPreviousUpdates = () => {
      this.previousRaysUpdate = raysUpdate;
      this.previousSpreadUpdate = spreadUpdate;
      this.previousColorUpdate = colorUpdate;
      this.previousWidthUpdate = widthUpdate;
      this.previousDiameterUpdate = diameterUpdate;
      this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
      this.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
      this.previousShowFocalPointsUpdate = showFocalPointsUpdate;

    };

    unlinkAll();
    setAllPanelsAndLinkAll();
    //linkAll();
    setPreviousUpdates();

  }//end linkControls()

}

opticsLab.register( 'ControlPanelManager', ControlPanelManager );
export default ControlPanelManager;