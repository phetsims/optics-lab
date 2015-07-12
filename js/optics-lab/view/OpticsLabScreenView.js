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
  var ComponentControlPanel = require( 'OPTICS_LAB/optics-lab/view/ComponentControlPanel' );
  var ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  var ComponentNode = require( 'OPTICS_LAB/optics-lab/view/ComponentNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  //var Line = require( 'SCENERY/nodes/Line' );
  //var LinearFunction = require( 'DOT/LinearFunction' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  //var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SourceNode = require( 'OPTICS_LAB/optics-lab/view/SourceNode' );
  var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  //var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function OpticsLabScreenView( opticsLabModel ) {

    this.opticsLabModel = opticsLabModel;

    var opticsLabScreenView = this;
    ScreenView.call( opticsLabScreenView, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    //var sources = [];
    //var walls = [];

    // model-view transform
    var modelViewTransform = ModelViewTransform2.createIdentity();

    //function SourceModel( mainModel, type, nbrOfRays, spread, height )
    var positionSource1 = new Vector2( 10, 50 );
    var positionSource2 = new Vector2( 15, 150 );
    //SourceModel( mainModel, type, nbrOfRays, position, spread, height )
    var sourceModel1 = new SourceModel( this.opticsLabModel, 'fan', 20, positionSource1, 45, 0 );
    var sourceModel2 = new SourceModel( this.opticsLabModel, 'beam', 8, positionSource2, 0, 100 );
    //var sourceModel2 = new SourceModel( this.opticsLabModel, 'fan', 20, positionSource2, 45, 0 );
    sourceModel1.sourceNumber = 1;        //just for testing
    sourceModel2.sourceNumber = 2;
    //sourceModel1.setNbrOfRays( 5 );
    //sourceModel1.setSpreadOfFan( 25 );

    //ComponentModel( mainModel, type, diameter, focalLength, index )
    var componentModel1 = new ComponentModel( this.opticsLabModel, 'mask', 100, 0, 0 );
    var componentModel2 = new ComponentModel( this.opticsLabModel, 'lens', 200, 150, 1.6 );
    var componentModel3 = new ComponentModel( this.opticsLabModel, 'lens', 150, -200, 1.6 );
    //var componentModel3 = new ComponentModel( this.opticsLabModel, 'plane_mirror', 200, undefined, undefined );

    var componentControlPanel = new ComponentControlPanel( componentModel2 );
    this.addChild( componentControlPanel );
    componentControlPanel.top = this.top + 10;
    componentControlPanel.xCenter = this.xCenter;

    this.opticsLabModel.addSource( sourceModel1 );
    this.opticsLabModel.addSource( sourceModel2 );
    this.opticsLabModel.addComponent( componentModel2 );
    this.opticsLabModel.addComponent( componentModel3 );
    sourceModel1.setPosition( new Vector2( 500, 400 ));
    sourceModel2.setPosition( new Vector2( 100, 200 ));

    //Source Nodes
    var sourceNode1 = new SourceNode( this.opticsLabModel, sourceModel1, modelViewTransform );
    var sourceNode2 = new SourceNode( this.opticsLabModel, sourceModel2, modelViewTransform );
    sourceNode1.sourceNumber = 1;  //for testing
    sourceNode2.sourceNumber = 2;
    this.addChild( sourceNode1 );
    sourceNode1.addRayNodesToParent( this );
    this.addChild( sourceNode2 );
    sourceNode2.addRayNodesToParent( this );

    this.opticsLabModel.addComponent( componentModel1 );






    //Component Nodes
    //componentNode1( componentModel1, modelViewTransform )
    var componentNode1 = new ComponentNode( componentModel1, modelViewTransform );
    var componentNode2 = new ComponentNode( componentModel2, modelViewTransform );
    var componentNode3 = new ComponentNode( componentModel3, modelViewTransform );
    this.addChild( componentNode1 );
    componentModel1.setPosition( new Vector2( 300, 300 ));
    this.addChild( componentNode2 );
    this.addChild( componentNode3 );
    componentModel2.setPosition( new Vector2( 350, 400 ));
    componentModel3.setPosition( new Vector2( 400, 500 ));

    //this.opticsLabModel.processRays();

    //updateAllSources();
  }//end constructor

  return inherit( ScreenView, OpticsLabScreenView );
} );