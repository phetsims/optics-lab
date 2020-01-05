// Copyright 2014-2020, University of Colorado Boulder

/**
 * View for the 'Optics Lab' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  // const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  const ComponentNode = require( 'OPTICS_LAB/optics-lab/view/ComponentNode' );
  const ControlPanelManager = require( 'OPTICS_LAB/optics-lab/view/ControlPanelManager' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  const SourceNode = require( 'OPTICS_LAB/optics-lab/view/SourceNode' );
  const ToolDrawerPanel = require( 'OPTICS_LAB/optics-lab/view/ToolDrawerPanel' );
  const Type = require( 'OPTICS_LAB/optics-lab/model/Type' );

  class OpticsLabScreenView extends ScreenView {
    /**
     * @param {OpticsLabModel} opticsLabModel
     */
    constructor( opticsLabModel ) {

      super( { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

      this.mainModel = opticsLabModel;
      this.selectedPieceProperty = new Property( null );

      this.selectedPieceTypeProperty = new Property( null );

      this.controlPanelManager = new ControlPanelManager( this );
      this.addChild( this.controlPanelManager );

      this.toolDrawerPanel = new ToolDrawerPanel( this );
      this.addChild( this.toolDrawerPanel );

      //Layout
      this.controlPanelManager.left = 40;       //this line crashes sim unless controlPanelManager has graphic content
      this.controlPanelManager.top = 10;
      this.toolDrawerPanel.bottom = this.layoutBounds.bottom - 10;
      this.toolDrawerPanel.centerX = this.layoutBounds.centerX;

      const resetAllButton = new ResetAllButton( {
          listener: () => {
            opticsLabModel.reset();
          },
          right: this.layoutBounds.right - 20,
          top: this.toolDrawerPanel.top
        }
      );

      this.addChild( resetAllButton );

    }//end constructor

    /**
     *
     * @param {Type} type
     * @param {Vector2} startPosition
     * @returns {SourceNode}
     * @private
     */
    addSource( type, startPosition ) {
      let sourceModel;

      if ( type === Type.FAN_SOURCE
      ) {
        sourceModel = new SourceModel( this.mainModel, Type.FAN_SOURCE, 10, startPosition, 45, 0 );
      }

      else {
        sourceModel = new SourceModel( this.mainModel, Type.BEAM_SOURCE, 10, startPosition, 0, 50 );
      }
      this.mainModel.addSource( sourceModel );
      sourceModel.setPosition( startPosition );
      const sourceNode = new SourceNode( this.mainModel, sourceModel, this );
      this.addChild( sourceNode );
      return sourceNode;
      //sourceNode.addRayNodesToParent( this );
    }

    /**
     *
     * @param {Type} type
     * @param {Vector2} startPosition
     * @returns {ComponentNode}
     * @private
     */
    addComponent( type, startPosition ) {
      let componentModel;
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
      let componentNode;
      if ( componentModel !== undefined ) {
        this.mainModel.addComponent( componentModel );
        componentNode = new ComponentNode( componentModel, this );
        this.addChild( componentNode );
        componentModel.setPosition( startPosition );
      }
      return componentNode;

    }//end addComponent()

    //A piece is either a source or a component
    /**
     *
     * @param {Type} type
     * @param {Vector2} startPosition
     * @returns {ComponentNode|SourceNode}
     * @public
     */
    addPiece( type, startPosition ) {
      let newPiece;
      if ( type === Type.FAN_SOURCE || type === Type.BEAM_SOURCE ) {
        newPiece = this.addSource( type, startPosition );
      }
      else {
        newPiece = this.addComponent( type, startPosition );
      }
      //since it is a new piece, have to reset its control panel settings
      const panelIndex = this.controlPanelManager.getIndex( newPiece.type );
      const controlPanelOfThisType = this.controlPanelManager.controlPanels[ panelIndex ];
      controlPanelOfThisType.resetProperties();

      //this.controlPanelManager.displayControlPanelForNewPiece( newPiece );
      return newPiece;
    }//end AddPiece

    /**
     *
     * @param {SourceNode} sourceNode
     * @private
     */
    removeSource( sourceNode ) {
      const sourceModel = sourceNode.pieceModel;
      this.removeChild( sourceNode );
      this.mainModel.removeSource( sourceModel );
    }

    /**
     *
     * @param {ComponentNode} componentNode
     * @private
     */
    removeComponent( componentNode ) {
      this.removeChild( componentNode );
      const componentModel = componentNode.pieceModel;
      this.mainModel.removeComponent( componentModel );
    }

    /**
     *
     * @param {SourceNode|ComponentNode} piece
     * @public
     */
    removePiece( piece ) {
      const type = piece.type;
      if ( type === Type.FAN_SOURCE || type === Type.BEAM_SOURCE ) {
        this.removeSource( piece );
      }
      else {
        this.removeComponent( piece );
      }

    }

    /**
     *
     * @param {SourceNode|ComponentNode} piece
     * @public
     */
    setSelectedPiece( piece ) {
      this.selectedPieceProperty.value = piece;
      this.selectedPieceTypeProperty.value = piece.type;
      piece.moveToFront();
    }

    /**
     *
     * @param {SourceNode|ComponentNode} piece
     * @public
     */
    setSelectedPieceType( piece ) {
      this.selectedPieceTypeProperty.value = piece.type;
      piece.moveToFront();
    }

  }

  return opticsLab.register( 'OpticsLabScreenView', OpticsLabScreenView );


} );