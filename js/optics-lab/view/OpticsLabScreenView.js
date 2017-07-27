// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Optics Lab' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanelManager = require( 'OPTICS_LAB/optics-lab/view/ControlPanelManager' );
  var ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  var ComponentNode = require( 'OPTICS_LAB/optics-lab/view/ComponentNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SourceNode = require( 'OPTICS_LAB/optics-lab/view/SourceNode' );
  var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  var ToolDrawerPanel = require( 'OPTICS_LAB/optics-lab/view/ToolDrawerPanel' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  /**
   * @extends {ScreenView}
   * @param {OpticsLabModel} opticsLabModel
   * @constructor
   */
  function OpticsLabScreenView( opticsLabModel ) {

    this.mainModel = opticsLabModel;
    this.selectedPieceProperty = new Property( null );
    this.selectedPieceTypeProperty = new Property( null );

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // model-view transform
    this.modelViewTransform = ModelViewTransform2.createIdentity();
    this.controlPanelManager = new ControlPanelManager( this.mainModel, this );
    this.addChild( this.controlPanelManager );

    this.toolDrawerPanel = new ToolDrawerPanel( opticsLabModel, this );
    this.addChild( this.toolDrawerPanel );

    //Layout
    this.controlPanelManager.left = 40;       //this line crashes sim unless controlPanelManager has graphic content
    this.controlPanelManager.top = 10;
    this.toolDrawerPanel.bottom = this.layoutBounds.bottom - 10;
    this.toolDrawerPanel.centerX = this.layoutBounds.centerX;

    var resetAllButton = new ResetAllButton( {
        listener: function() {
          opticsLabModel.reset();
        },
        right: this.layoutBounds.right - 20,
        top: this.toolDrawerPanel.top
      }
    );

    this.addChild( resetAllButton );

  }//end constructor

  opticsLab.register( 'OpticsLabScreenView', OpticsLabScreenView );

  return inherit( ScreenView, OpticsLabScreenView, {

    /**
     *
     * @param {Type} type
     * @param {Vector2} startPosition
     * @returns {SourceNode}
     * @private
     */
    addSource: function( type, startPosition ) {
      var sourceModel;
      if ( type === Type.FAN_SOURCE ) {
        sourceModel = new SourceModel( this.mainModel, Type.FAN_SOURCE, 10, startPosition, 45, 0 );
      }
      else {
        sourceModel = new SourceModel( this.mainModel, Type.BEAM_SOURCE, 10, startPosition, 0, 50 );
      }
      this.mainModel.addSource( sourceModel );
      sourceModel.setPosition( startPosition );
      var sourceNode = new SourceNode( this.mainModel, sourceModel, this );
      this.addChild( sourceNode );
      return sourceNode;
      //sourceNode.addRayNodesToParent( this );
    },

    /**
     *
     * @param {Type} type
     * @param {Vector2} startPosition
     * @returns {ComponentNode}
     * @private
     */
    addComponent: function( type, startPosition ) {
      var componentModel;
      switch( type ) {
        case Type.CONVERGING_LENS:
          componentModel = new ComponentModel( this.mainModel, Type.CONVERGING_LENS, 125, 350, 1.8 );
          break;
        case Type.DIVERGING_LENS:
          componentModel = new ComponentModel( this.mainModel, Type.DIVERGING_LENS, 125, -300, 1.8 );
          break;
        case Type.CONVERGING_MIRROR:
          componentModel = new ComponentModel( this.mainModel, Type.CONVERGING_MIRROR, 125, 300, undefined );
          break;
        case Type.PLANE_MIRROR:
          componentModel = new ComponentModel( this.mainModel, Type.PLANE_MIRROR, 125, undefined, undefined );
          break;
        case Type.DIVERGING_MIRROR:
          componentModel = new ComponentModel( this.mainModel, Type.DIVERGING_MIRROR, 125, -300, undefined );
          break;
        case Type.SIMPLE_MASK:
          componentModel = new ComponentModel( this.mainModel, Type.SIMPLE_MASK, 125, 0, 0 );
          break;
        case Type.SLIT_MASK:
          componentModel = new ComponentModel( this.mainModel, Type.SIMPLE_MASK, 100, 0, 0 );
          break;
        default:
          throw new Error( 'invalid type: ' + type );
      }//end switch()
      var componentNode;
      if ( componentModel !== undefined ) {
        this.mainModel.addComponent( componentModel );
        componentNode = new ComponentNode( componentModel, this );
        this.addChild( componentNode );
        componentModel.setPosition( startPosition );
      }
      return componentNode;

    },//end addComponent()
    //A piece is either a source or a component

    /**
     *
     * @param {Type} type
     * @param {Vector2} startPosition
     * @returns {ComponentNode|SourceNode}
     * @public
     */
    addPiece: function( type, startPosition ) {
      var newPiece;
      if ( type === Type.FAN_SOURCE || type === Type.BEAM_SOURCE ) {
        newPiece = this.addSource( type, startPosition );
      }
      else {
        newPiece = this.addComponent( type, startPosition );
      }
      //since it is a new piece, have to reset its control panel settings
      var panelIndex = this.controlPanelManager.getIndex( newPiece.type );
      var controlPanelOfThisType = this.controlPanelManager.controlPanels[ panelIndex ];
      controlPanelOfThisType.resetProperties();

      //this.controlPanelManager.displayControlPanelForNewPiece( newPiece );
      return newPiece;
    },//end AddPiece

    /**
     *
     * @param {SourceNode} sourceNode
     * @private
     */
    removeSource: function( sourceNode ) {
      var sourceModel = sourceNode.pieceModel;
      this.removeChild( sourceNode );
      this.mainModel.removeSource( sourceModel );
    },

    /**
     *
     * @param {ComponentNode} componentNode
     * @private
     */
    removeComponent: function( componentNode ) {
      this.removeChild( componentNode );
      var componentModel = componentNode.pieceModel;
      this.mainModel.removeComponent( componentModel );
    },

    /**
     *
     * @param {SourceNode|ComponentNode} piece
     * @public
     */
    removePiece: function( piece ) {
      var type = piece.type;
      if ( type === Type.FAN_SOURCE || type === Type.BEAM_SOURCE ) {
        this.removeSource( piece );
      }
      else {
        this.removeComponent( piece );
      }

    },

    /**
     *
     * @param {SourceNode|ComponentNode} piece
     * @public
     */
    setSelectedPiece: function( piece ) {
      this.selectedPieceProperty.value = piece;
      this.selectedPieceTypeProperty.value = piece.type;
      piece.moveToFront();
    },

    /**
     *
     * @param {SourceNode|ComponentNode} piece
     * @public
     */
    setSelectedPieceType: function( piece ) {
      this.selectedPieceTypeProperty.value = piece.type;
      piece.moveToFront();
    }

  } );
} );