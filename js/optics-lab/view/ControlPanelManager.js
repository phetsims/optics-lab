// Copyright 2015-2020, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const ControlPanel = require( 'OPTICS_LAB/optics-lab/view/ControlPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  const Utils = require( 'DOT/Utils' );

  class ControlPanelManager extends Node {
    /**
     * @param {OpticsLabScreenView} mainView
     */
    constructor( mainView ) {

      super();
      this.mainView = mainView;
      this.controlPanels = [];     //one display for each piece on the stage, only display of selected piece is visible
      this.pieces = new ObservableArray();
      this.selectedPiece = new Node();
      this.selectedPieceType;
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
        this.selectedPieceType = piece.type;
        this.linkControls();
      } );

      // All controls are placed on display node, with visibility set by accordionBox button

    }//end constructor
    /**
     *
     * @param {Type} type
     * @returns {number}
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
      const type = this.selectedPieceType;
      const piece = this.selectedPiece;
      const controlPanel = this.controlPanels[ this.getIndex( type ) ];

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

      //switch( type ){
      //    case Type.FAN_SOURCE:
      //        //resetPanel(
      //        //    controlPanel.nbrOfRaysProperty,
      //        //    this.previousRaysUpdate,
      //        //    raysUpdate,
      //        //    piece.pieceModel.nbrOfRays
      //        //);
      //        //controlPanel.nbrOfRaysProperty.unlink( this.previousRaysUpdate );
      //        controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRays;
      //        controlPanel.nbrOfRaysProperty.link( raysUpdate );
      //        this.previousRaysUpdate = raysUpdate;
      //        //resetPanel(
      //        //    controlPanel.spreadProperty,
      //        //    this.previousSpreadUpdate,
      //        //    spreadUpdate,
      //        //    piece.pieceModel.spread
      //        //);
      //        //controlPanel.spreadProperty.unlink( this.previousSpreadUpdate );
      //        controlPanel.spreadProperty.value = piece.pieceModel.spread;
      //        controlPanel.spreadProperty.link( spreadUpdate );
      //        this.previousSpreadUpdate = spreadUpdate;
      //
      //        //controlPanel.colorProperty.unlink( this.previousColorUpdate );
      //        controlPanel.colorProperty.value = piece.colorProperty.value;
      //        controlPanel.colorProperty.link( colorUpdate );
      //        this.previousColorUpdate = colorUpdate;
      //        break;
      //    case Type.BEAM_SOURCE:
      //        //controlPanel.nbrOfRaysProperty.unlink( this.previousRaysUpdate );
      //        controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRays;
      //        controlPanel.nbrOfRaysProperty.link( raysUpdate );
      //        this.previousRaysUpdate = raysUpdate;
      //        //controlPanel.widthProperty.unlink( this.previousWidthUpdate );
      //        controlPanel.widthProperty.value = piece.pieceModel.width;
      //        controlPanel.widthProperty.link( widthUpdate );
      //        this.previousWidthUpdate = widthUpdate;
      //        //controlPanel.colorProperty.unlink( this.previousColorUpdate );
      //        controlPanel.colorProperty.value = piece.colorProperty.value;
      //        controlPanel.colorProperty.link( colorUpdate );
      //        this.previousColorUpdate = colorUpdate;
      //        break;
      //    case Type.CONVERGING_LENS:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
      //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
      //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
      //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
      //        controlPanel.indexOfRefractionProperty.unlink( this.previousIndexOfRefractionUpdate );
      //        controlPanel.indexOfRefractionProperty.value = piece.pieceModel.index;
      //        controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
      //        this.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
      //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
      //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
      //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
      //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
      //        break;
      //    case Type.DIVERGING_LENS:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
      //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
      //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
      //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
      //        controlPanel.indexOfRefractionProperty.unlink( this.previousIndexOfRefractionUpdate );
      //        controlPanel.indexOfRefractionProperty.value = piece.pieceModel.index;
      //        controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
      //        this.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
      //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
      //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
      //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
      //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
      //        break;
      //    case Type.CONVERGING_MIRROR:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
      //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
      //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
      //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
      //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
      //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
      //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
      //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
      //        break;
      //    case Type.PLANE_MIRROR:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        break;
      //    case Type.DIVERGING_MIRROR:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
      //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
      //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
      //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
      //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
      //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
      //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
      //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
      //        break;
      //    case Type.SIMPLE_MASK:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        break;
      //    case Type.SLIT_MASK:
      //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
      //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
      //        controlPanel.diameterProperty.link( diameterUpdate );
      //        this.previousDiameterUpdate = diameterUpdate;
      //        break;
      //}//end switch
    }//end linkControls()

    //setTitleBar: function (titleString) {
    //    this.panelTitle.text = titleString;
    //}

  }

  return opticsLab.register( 'ControlPanelManager', ControlPanelManager );

} );
