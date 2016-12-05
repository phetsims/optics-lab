// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Optics Lab' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  console.log( 'hello' ); //test of console in browser: cntrl-shft-j

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  //var Circle = require( 'SCENERY/nodes/Circle' );
  //var ControlPanel2 = require( 'OPTICS_LAB/optics-lab/view/ControlPanel2' );
  //var ControlPanelManager = require( 'OPTICS_LAB/optics-lab/view/ControlPanelManager' );
  var ControlPanelManager2 = require( 'OPTICS_LAB/optics-lab/view/ControlPanelManager2' );
  var ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  var ComponentNode = require( 'OPTICS_LAB/optics-lab/view/ComponentNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  //var Line = require( 'SCENERY/nodes/Line' );
  //var LinearFunction = require( 'DOT/LinearFunction' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Property = require( 'AXON/Property' );
  //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  //var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SourceNode = require( 'OPTICS_LAB/optics-lab/view/SourceNode' );
  var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  var ToolDrawerPanel = require( 'OPTICS_LAB/optics-lab/view/ToolDrawerPanel' );
  //var Util = require( 'DOT/Util' );
  //var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function OpticsLabScreenView( opticsLabModel ) {

    this.mainModel = opticsLabModel;
    this.selectedPieceProperty = new Property( null );
    this.selectedPieceTypeProperty = new Property( null );

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // model-view transform
    this.modelViewTransform = ModelViewTransform2.createIdentity();
   // this.controlPanel = new ControlPanel( this.mainModel, this );
    //this.addChild( this.controlPanel );
    this.controlPanelManager = new ControlPanelManager2( this.mainModel, this );
    this.addChild( this.controlPanelManager );

    this.toolDrawerPanel = new ToolDrawerPanel( opticsLabModel, this );
    this.addChild( this.toolDrawerPanel );

    //test code, to be deleted
    //this.addChild( new ControlPanel2( opticsLabModel, this, 'beam_source' ));
    //end test code

    //Layout
    this.controlPanelManager.left = 40;       //this line crashes sim unless controlPanelManager has graphic content
    this.controlPanelManager.top = 10;
    this.toolDrawerPanel.bottom = this.layoutBounds.bottom - 10;
    this.toolDrawerPanel.centerX = this.layoutBounds.centerX;


  }//end constructor

  return inherit( ScreenView, OpticsLabScreenView,{
      addSource: function( type, startPosition ){
        var sourceModel;
        if ( type === 'fan_source' ){
          //SourceModel( mainModel, type, nbrOfRays, position, spread, height )
          sourceModel = new SourceModel( this.mainModel, 'fan_source', 10, startPosition, 45, 0 );
        }else{
          sourceModel = new SourceModel( this.mainModel, 'beam_source', 10, startPosition, 0, 50 );
        }
        this.mainModel.addSource( sourceModel );
        sourceModel.setPosition( startPosition );
        var sourceNode = new SourceNode( this.mainModel, sourceModel, this );
        this.addChild( sourceNode );
        return sourceNode;
        //sourceNode.addRayNodesToParent( this );
      },
      addComponent: function( type, startPosition ){
        var componentModel;
        switch( type ){
          case 'converging_lens':
            //ComponentModel( mainModel, type, diameter, radiusCurvature, index )
            //radius of curvature R = 2*f*( n - 1 )

            componentModel = new ComponentModel( this.mainModel, 'converging_lens', 125, 350, 1.8 );
            break;
          case 'diverging_lens':
            componentModel = new ComponentModel( this.mainModel, 'diverging_lens', 125, -300, 1.8 );
            break;
          case 'converging_mirror':
            componentModel = new ComponentModel( this.mainModel, 'converging_mirror', 125, 300, undefined );
            break;
          case 'plane_mirror':
            componentModel = new ComponentModel( this.mainModel, 'plane_mirror', 125, undefined, undefined );
            break;
          case 'diverging_mirror':
            componentModel = new ComponentModel( this.mainModel, 'diverging_mirror', 125, -300, undefined );
            break;
          case 'simple_mask':
            componentModel = new ComponentModel( this.mainModel, 'simple_mask', 125, 0, 0 );
            break;
          case 'slit_mask':
            componentModel = new ComponentModel( this.mainModel, 'simple_mask', 100, 0, 0 );
            break;
          default:
            throw new Error( 'invalid type: ' + type );
        }//end switch()
        var componentNode;
        if( componentModel !== undefined ){
          this.mainModel.addComponent( componentModel );
          componentNode = new ComponentNode( componentModel, this);
          this.addChild( componentNode );
          componentModel.setPosition( startPosition );
        }
        return componentNode;

      },//end addComponent()
      //A piece is either a source or a component
      addPiece: function( type, startPosition ) {
        var newPiece;
        if( type === 'fan_source' || type === 'beam_source' ){
          newPiece = this.addSource( type, startPosition );
        }else{
          newPiece = this.addComponent( type, startPosition );
        }
        //since it is a new piece, have to reset its control panel settings
        var panelIndex = this.controlPanelManager.getIndex( newPiece.type );
        var controlPanelOfThisType = this.controlPanelManager.controlPanels[ panelIndex ];
        controlPanelOfThisType.resetProperties();

        //this.controlPanelManager.displayControlPanelForNewPiece( newPiece );
        return newPiece;
      },//end AddPiece
      removeSource: function( sourceNode ){
        //console.log( 'remove source called. source is ' + sourceNode );
        var sourceModel = sourceNode.pieceModel;
        //sourceNode.removeRayNodesFromParent( this );
        this.removeChild( sourceNode );
        this.mainModel.removeSource( sourceModel );
      },
      removeComponent: function( componentNode ){
          //console.log( 'remove component ' + componentNode );
        this.removeChild( componentNode );
        var componentModel = componentNode.pieceModel;
        this.mainModel.removeComponent( componentModel );
      },
      removePiece: function( piece ){
        var type = piece.type;
        //this.controlPanelManager.disposeOfControlPanelForDeletedPiece( piece );
        if( type === 'fan_source' || type === 'beam_source' ){
          this.removeSource( piece );
        }else{
          this.removeComponent( piece );
        }

      },


      setSelectedPiece: function ( piece ){
        this.selectedPieceProperty.value = piece;
        this.selectedPieceTypeProperty.value = piece.type;
        piece.moveToFront();
      },
      setSelectedPieceType: function( piece ){
        this.selectedPieceTypeProperty.value = piece.type;
        //console.log( 'piece type is ' + piece.type );
        piece.moveToFront();
      }

    }
  );
} );