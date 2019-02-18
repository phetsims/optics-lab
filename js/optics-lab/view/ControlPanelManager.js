// Copyright 2015-2019, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var ControlPanel = require( 'OPTICS_LAB/optics-lab/view/ControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  var Util = require( 'DOT/Util' );

  /**
   * @extends {Node}
   * @param {OpticsLabModel} mainModel
   * @param {OpticsLabScreenView} mainView
   * @constructor
   */
  function ControlPanelManager( mainModel, mainView ) {

    Node.call( this );
    var self = this;
    this.mainModel = mainModel;
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

    for ( var i = 0; i < this.typeArray.length; i++ ) {
      var newControlPanel = new ControlPanel( mainModel, mainView, this.typeArray[ i ] );
      this.controlPanels[ i ] = newControlPanel;
      this.addChild( newControlPanel );
    }

    this.mainView.selectedPieceProperty.lazyLink( function( piece ) {
      self.selectedPiece = piece;
      self.selectedPieceType = piece.type;
      self.linkControls();
    } );

    // All controls are placed on display node, with visibility set by accordionBox button

  }//end constructor

  opticsLab.register( 'ControlPanelManager', ControlPanelManager );

  return inherit( Node, ControlPanelManager, {
    /**
     *
     * @param {Type} type
     * @returns {number}
     */
    getIndex: function( type ) {
      var index;
      for ( var i = 0; i < this.typeArray.length; i++ ) {
        if ( this.controlPanels[ i ].type === type ) {
          index = i;
        }
      }
      return index;
    },
    /**
     * @private
     */
    linkControls: function() {
      var type = this.selectedPieceType;
      var piece = this.selectedPiece;
      var controlPanel = this.controlPanels[ this.getIndex( type ) ];
      var self = this;

      function raysUpdate( nbrOfRays ) {
        piece.pieceModel.nbrOfRaysProperty.value = Util.roundSymmetric( nbrOfRays );
      }

      function spreadUpdate( spread ) {
        piece.pieceModel.spreadProperty.value = Util.roundSymmetric( spread );
      }

      function colorUpdate( colorString ) {
        piece.colorProperty.value = colorString;
      }

      function widthUpdate( width ) {
        piece.pieceModel.widthProperty.value = width;
      }

      function diameterUpdate( diameter ) {
        piece.pieceModel.diameterProperty.value = diameter;
      }

      function radiusOfCurvatureUpdate( radius ) {
        piece.pieceModel.radiusProperty.value = radius;
      }

      function indexOfRefractionUpdate( index ) {
        piece.pieceModel.indexProperty.value = index;
      }

      function showFocalPointsUpdate( tOrF ) {
        piece.showFocalPointsProperty.value = tOrF;
      }

      function unlinkAll() {
        controlPanel.nbrOfRaysProperty.hasListener( self.previousRaysUpdate ) && controlPanel.nbrOfRaysProperty.unlink( self.previousRaysUpdate );
        controlPanel.spreadProperty.hasListener( self.previousSpreadUpdate ) && controlPanel.spreadProperty.unlink( self.previousSpreadUpdate );
        controlPanel.colorProperty.hasListener( self.previousColorUpdate ) && controlPanel.colorProperty.unlink( self.previousColorUpdate );
        controlPanel.widthProperty.hasListener( self.previousWidthUpdate ) && controlPanel.widthProperty.unlink( self.previousWidthUpdate );
        controlPanel.diameterProperty.hasListener( self.previousDiameterUpdate ) && controlPanel.diameterProperty.unlink( self.previousDiameterUpdate );
        controlPanel.radiusOfCurvatureProperty.hasListener( self.previousRadiusOfCurvatureUpdate ) && controlPanel.radiusOfCurvatureProperty.unlink( self.previousRadiusOfCurvatureUpdate );
        controlPanel.indexOfRefractionProperty.hasListener( self.previousIndexOfRefractionUpdate ) && controlPanel.indexOfRefractionProperty.unlink( self.previousIndexOfRefractionUpdate );
        controlPanel.showFocalPointsProperty.hasListener( self.previousShowFocalPointsUpdate ) && controlPanel.showFocalPointsProperty.unlink( self.previousShowFocalPointsUpdate );
      }

      function setAllPanelsAndLinkAll() {
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
      }

      function setPreviousUpdates() {
        self.previousRaysUpdate = raysUpdate;
        self.previousSpreadUpdate = spreadUpdate;
        self.previousColorUpdate = colorUpdate;
        self.previousWidthUpdate = widthUpdate;
        self.previousDiameterUpdate = diameterUpdate;
        self.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
        self.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
        self.previousShowFocalPointsUpdate = showFocalPointsUpdate;

      }

      unlinkAll();
      setAllPanelsAndLinkAll();
      //linkAll();
      setPreviousUpdates();

      //switch( type ){
      //    case Type.FAN_SOURCE:
      //        //resetPanel(
      //        //    controlPanel.nbrOfRaysProperty,
      //        //    self.previousRaysUpdate,
      //        //    raysUpdate,
      //        //    piece.pieceModel.nbrOfRays
      //        //);
      //        //controlPanel.nbrOfRaysProperty.unlink( this.previousRaysUpdate );
      //        controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRays;
      //        controlPanel.nbrOfRaysProperty.link( raysUpdate );
      //        this.previousRaysUpdate = raysUpdate;
      //        //resetPanel(
      //        //    controlPanel.spreadProperty,
      //        //    self.previousSpreadUpdate,
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

  } );
} );
