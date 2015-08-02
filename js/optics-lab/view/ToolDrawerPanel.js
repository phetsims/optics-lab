/**
 * Toolbox for selecting light sources, lenses, mirrors, and masks
 * Click on icon to drag sources or component onto stage
 * Drag component back to toolbox to delete from stage
 * Created by dubson on 7/14/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  //var Bounds2 = require( 'DOT/Bounds2' );
  //var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  //var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  //var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  //var SourceNode = require( 'OPTICS_LAB/optics-lab/view/SourceNode' );
  //var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  //var Vector2 = require( 'DOT/Vector2' );
  //var Shape = require( 'KITE/Shape' );

  //constants
  var DISPLAY_FONT = new PhetFont( 12 );
  var PANEL_COLOR = '#ccc';

  /**
   * {vector2] startDir = direction of starting ray
   *
   * @constructor
   */

  function ToolDrawerPanel( mainModel, mainView ) {

    this.mainModel = mainModel; //OpticsLabModel
    this.mainView = mainView;  //OpticsLabScreenView
    var toolDrawerPanel = this;

    //var nodeOptions = { fill: 'red', cursor: 'pointer' };

    var fanSourceIcon = new Node( );
    var beamSourceIcon = new Node();
    var convergingLensIcon = new Node();
    var divergingLensIcon = new Node();
    var convergingMirrorIcon = new Node();
    var planeMirrorIcon = new Node();
    var divergingMirrorIcon = new Node();
    var simpleMaskIcon = new Node();
    var slitMaskIcon = new Node();
    //var rulerCheckBox = new CheckBox();
    //var protractorCheckBox = new CheckBox();

    var fontInfo = { font: DISPLAY_FONT };
    var fanSourceText = new Text( 'fan source', fontInfo );
    var beamSourceText = new Text( 'beam source', fontInfo );
    var convergingLensText = new Text( 'converging lens', fontInfo );
    var divergingLensText = new Text( 'diverging lens', fontInfo );
    var convergingMirrorText = new Text( 'converging mirror', fontInfo );
    var planeMirrorText = new Text( 'plane mirror', fontInfo );
    var divergingMirrorText = new Text( 'diverging mirror', fontInfo );
    var simpleMaskText = new Text( 'simple mask', fontInfo );
    var slitMaskText = new Text( 'slit mask', fontInfo );

    var nodeArray = [
      fanSourceIcon,
      beamSourceIcon,
      convergingLensIcon,
      divergingLensIcon,
      convergingMirrorIcon,
      planeMirrorIcon,
      divergingMirrorIcon,
      simpleMaskIcon,
      slitMaskIcon
    ];

    var textArray = [
      fanSourceText,
      beamSourceText,
      convergingLensText,
      divergingLensText,
      convergingMirrorText,
      planeMirrorText,
      divergingMirrorText,
      simpleMaskText,
      slitMaskText
    ];

    var typeArray = [
      'fan_source',
      'beam_source',
      'converging_lens',
      'diverging_lens',
      'converging_mirror',
      'plane_mirror',
      'diverging_mirror',
      'simple_mask',
      'slit_mask'
    ];



    var nodeSetup = function( element, index, array ){
      //Rectangle = function Rectangle( x, y, width, height, arcWidth, arcHeight, options )
      var xCorner = -8;
      var yCorner = textArray[ index ].height;
      var elementWidth = textArray[ index ].width + 16;
      var elementHeight = textArray[ index ].height + 10;
      var pieceGrabbed;
      element.addChild( textArray[ index ] );
      element.addChild( new Rectangle( xCorner, -yCorner, elementWidth, elementHeight, { fill:'green', cursor: 'pointer', opacity: 0.1 }));

      element.addInputListener( new SimpleDragHandler(
        {

          allowTouchSnag: true,


          start: function( e ) {
            var startPosition = toolDrawerPanel.globalToParentPoint( e.pointer.point );
            var type = typeArray[ index ];
            pieceGrabbed = mainView.addPiece( type, startPosition );
            //pieceGrabbed.mainView.setSelectedPiece( pieceGrabbed );
            mainView.setSelectedPiece( pieceGrabbed );
            //console.log( 'pieceGrabbed is ' + pieceGrabbed.type );
            debugger;
          },

          drag: function( e ) {
            var position = toolDrawerPanel.globalToParentPoint( e.pointer.point );   //returns Vector2
            //var v1 = e.pointer.point;
            //toolDrawerPanel.mainView.

            pieceGrabbed.pieceModel.setPosition( position );
            //console.log( 'dragging postion is ' + v1 );
          },
          end: function( e ){
            var vEnd = toolDrawerPanel.globalToParentPoint( e.pointer.point );
            if( toolDrawerPanel.visibleBounds.containsCoordinates( vEnd.x, vEnd.y )){
              mainView.removePiece( pieceGrabbed );
              //pieceGrabbed.mainView.removeComponent( pieceGrabbed );
              //mainView.removeComponent( pieceGrabbed );
              //mainView.controlPanel.displayPanel.visible = false;
            }
          }
        }//end addInputListener

      ));
    }; //end nodeSetup


    nodeArray.forEach( nodeSetup );



    var spacing = 5;
    var sourceVBox = new VBox( {
      children:[
        fanSourceIcon,
        beamSourceIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var lensVBox = new VBox( {
      children:[
        convergingLensIcon,
        divergingLensIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var curvedMirrorVBox = new VBox( {
      children:[
        convergingMirrorIcon,
        divergingMirrorIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var planeMirrorVBox = new VBox( {
      children:[
        planeMirrorIcon,
      ],
      align: 'left',
      spacing: spacing
    });
    var maskVBox = new VBox( {
      children:[
        simpleMaskIcon,
        slitMaskIcon
      ],
      align: 'left',
      spacing: spacing
    });
    //var toolVBox = new VBox( {
    //  children:[
    //    rulerCheckBox,
    //    protractorCheckBox
    //  ],
    //  align: 'left',
    //  spacing: spacing
    //});
    spacing = 10;
    var content = new HBox( {
      children:[
        sourceVBox,
        lensVBox,
        planeMirrorVBox,
        curvedMirrorVBox,
        maskVBox
      ],
      align:'top',
      spacing: spacing
    });



    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );


    Panel.call( this, content, { xMargin: 15, yMargin: 5, lineWidth: 2, fill: PANEL_COLOR } );
  }//end constructor

  return inherit( Panel, ToolDrawerPanel, {

    }//end inherit
  );
} );
