// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the 'Optics Lab' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  console.log( "hello" ); //test of console in browser: cntrl-shft-j

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  //var Circle = require( 'SCENERY/nodes/Circle' );
  var ControlPanel = require( 'OPTICS_LAB/optics-lab/view/ControlPanel' );
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

    var opticsLabScreenView = this;
    ScreenView.call( opticsLabScreenView, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    //var sources = [];
    //var walls = [];

    // model-view transform
    this.modelViewTransform = ModelViewTransform2.createIdentity();
    this.controlPanel = new ControlPanel( this.mainModel, this );
    opticsLabScreenView.addChild( this.controlPanel );

    this.toolDrawerPanel = new ToolDrawerPanel( opticsLabModel, opticsLabScreenView );
    opticsLabScreenView.addChild( this.toolDrawerPanel );
    this.toolDrawerPanel.bottom = this.layoutBounds.bottom - 10;
    this.toolDrawerPanel.centerX = this.layoutBounds.centerX;

    //this.selectedPieceProperty.link( function( property ){
    //  //console.log( 'selectedPieceProperty linked ' );
    //  if( property != null ){
    //    //console.log( 'selected piece is ' + property.type );
    //  }
    //} );

    //this.opticsLabModel.sources.addItemAddedListener( function( sourceModel ){
    //  //console.log( 'source added is ' + source.type );
    //
    //  var sourceNode = new SourceNode( opticsLabScreenView.opticsLabModel, sourceModel, opticsLabScreenView.modelViewTransform );
    //  opticsLabScreenView.addChild( sourceNode );
    //  sourceNode.addRayNodesToParent( opticsLabScreenView );
    //});

    //console.log( 'toolDrawer bounds are ' + toolDrawerPanel.visibleBounds );


    //var componentControlPanel = new ComponentControlPanel( componentModel2 );
    //this.addChild( componentControlPanel );
    //componentControlPanel.top = this.layoutBounds.top + 10;
    //componentControlPanel.centerX = this.layoutBounds.centerX;

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
        //sourceNode.addRayNodesToParent( this );
      },
      addComponent: function( type, startPosition ){
        var componentModel;
        switch( type ){
          case 'converging_lens':
            //ComponentModel( mainModel, type, diameter, radiusCurvature, index )
            //radius of curvature R = 2*f*( n - 1 )

            componentModel = new ComponentModel( this.mainModel, 'converging_lens', 200, 350, 1.8 );
            break;
          case 'diverging_lens':
            componentModel = new ComponentModel( this.mainModel, 'diverging_lens', 150, -300, 1.8 );
            break;
          case 'converging_mirror':
            break;
          case 'plane_mirror':
            componentModel = new ComponentModel( this.mainModel, 'plane_mirror', 200, undefined, undefined );
            break;
          case 'diverging_mirror':
            break;
          case 'simple_mask':
            componentModel = new ComponentModel( this.mainModel, 'simple_mask', 100, 0, 0 );
            break;
          case 'slit_mask':
            break;
        }//end switch()
        if( componentModel !== undefined ){
          this.mainModel.addComponent( componentModel );
          var componentNode = new ComponentNode( componentModel, this);
          this.addChild( componentNode );
          componentModel.setPosition( startPosition );
        }

      },//end addComponent()
      //A piece is either a source or a component
      addPiece: function( type, startPosition ) {
        if( type === 'fan_source' || type === 'beam_source' ){
          this.addSource( type, startPosition );
        }else{
          this.addComponent( type, startPosition );
        }
      },//end AddPiece
      removeSource: function( sourceNode ){
        //console.log( 'remove source called. source is ' + sourceNode );
        var sourceModel = sourceNode.sourceModel;
        //sourceNode.removeRayNodesFromParent( this );
        this.removeChild( sourceNode );
        this.mainModel.removeSource( sourceModel );
      },
      removeComponent: function( componentNode ){
          //console.log( 'remove component ' + componentNode );
        this.removeChild( componentNode );
        var componentModel = componentNode.componentModel;
        this.mainModel.removeComponent( componentModel );
      },
      setSelectedPiece: function ( piece ){
        //console.log( 'setSelectedPiece() called.' )
        this.selectedPieceProperty.value = piece;
      }
    }
  );
} );