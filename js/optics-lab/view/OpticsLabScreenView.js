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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  var ComponentNode = require( 'OPTICS_LAB/optics-lab/view/ComponentNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SourceNode = require( 'OPTICS_LAB/optics-lab/view/SourceNode' );
  var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  var Util = require( 'DOT/Util' );
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
    var sourceModel1 = new SourceModel( this.opticsLabModel, 'fan', 20, 60 );
    var sourceModel2 = new SourceModel( this.opticsLabModel, 'beam', 12, 0, 100 );
    sourceModel1.sourceNumber = 1;
    sourceModel2.sourceNumber = 2;
    //sourceModel1.setNbrOfRays( 5 );
    //sourceModel1.setSpreadOfFan( 25 );

    //Nodes
    var sourceNode1 = new SourceNode( this.opticsLabModel, sourceModel1, modelViewTransform );
    var sourceNode2 = new SourceNode( this.opticsLabModel, sourceModel2, modelViewTransform );
    sourceNode1.sourceNumber = 1;  //for testing
    sourceNode2.sourceNumber = 2;
    this.addChild( sourceNode1 );
    sourceNode1.addRayNodesToParent( this );
    this.addChild( sourceNode2 );
    sourceNode2.addRayNodesToParent( this );

    //function componentModel1( type, diameter, focalLength  )
    var componentModel1 = new ComponentModel( this.opticsLabModel, 'mask', 100 );
    var componentModel2 = new ComponentModel( this.opticsLabModel, 'lens', 200, 10 );
    //componentNode1( componentModel1, modelViewTransform )
    var componentNode1 = new ComponentNode( componentModel1, modelViewTransform );
    var componentNode2 = new ComponentNode( componentModel2, modelViewTransform );
    this.addChild( componentNode1 );
    this.addChild( componentNode2 );
    this.opticsLabModel.addComponent( componentModel1 );
    this.opticsLabModel.addComponent( componentModel2 );
    this.opticsLabModel.addSource( sourceModel1 );
    this.opticsLabModel.addSource( sourceModel2 );
    sourceModel1.setPosition( new Vector2( 50, 50 ));
    componentModel1.setPosition( new Vector2( 300, 300 ));
    sourceModel2.setPosition( new Vector2( 100, 200 ));
    componentModel2.setPosition( new Vector2( 350, 500 ));


    //updateAllSources();
  }//end constructor

  return inherit( ScreenView, OpticsLabScreenView, {
    addSource: function(){

    }
  } );
} );