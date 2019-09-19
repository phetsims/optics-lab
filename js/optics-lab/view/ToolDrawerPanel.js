// Copyright 2015-2017, University of Colorado Boulder

/**
 * Toolbox for selecting light sources, lenses, mirrors, and masks
 * Click on icon to drag sources or component onto stage
 * Drag component back to toolbox to delete from stage
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  //constants
  var DISPLAY_FONT = new PhetFont( 12 );
  var PANEL_COLOR = '#ccc';

  /**
   * @extends {Panel}
   * @param {OpticsLabModel} mainModel
   * @param {OpticsLabScreenView} mainView
   * @constructor
   */
  function ToolDrawerPanel( mainModel, mainView ) {

    this.mainModel = mainModel; // OpticsLabModel
    this.mainView = mainView;  // OpticsLabScreenView
    var self = this;

    var fanSourceIcon = new Node();
    var beamSourceIcon = new Node();
    var convergingLensIcon = new Node();
    var divergingLensIcon = new Node();
    var convergingMirrorIcon = new Node();
    var planeMirrorIcon = new Node();
    var divergingMirrorIcon = new Node();
    var simpleMaskIcon = new Node();
    var slitMaskIcon = new Node();

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

    var nodeSetup = function( element, index, array ) {
      var xCorner = -8;
      var yCorner = textArray[ index ].height;
      var elementWidth = textArray[ index ].width + 16;
      var elementHeight = textArray[ index ].height + 10;
      var pieceGrabbed;
      element.addChild( textArray[ index ] );
      element.addChild( new Rectangle( xCorner, -yCorner, elementWidth, elementHeight, {
        fill: 'green',
        cursor: 'pointer',
        opacity: 0.1
      } ) );

      element.addInputListener( new SimpleDragHandler(
        {

          allowTouchSnag: true,

          start: function( e ) {

            var startPosition = self.globalToParentPoint( e.pointer.point );
            var type = typeArray[ index ];
            pieceGrabbed = mainView.addPiece( type, startPosition );
            //pieceGrabbed.mainView.setSelectedPiece( pieceGrabbed );
            mainView.setSelectedPiece( pieceGrabbed );
            mainView.setSelectedPieceType( pieceGrabbed );
          },

          drag: function( e ) {
            var position = self.globalToParentPoint( e.pointer.point );   //returns Vector2

            pieceGrabbed.pieceModel.setPosition( position );
          },
          end: function( e ) {
            var vEnd = self.globalToParentPoint( e.pointer.point );
            if ( self.visibleBounds.containsCoordinates( vEnd.x, vEnd.y ) ) {
              mainView.removePiece( pieceGrabbed );
            }
          }
        }//end addInputListener

      ) );
    }; //end nodeSetup

    nodeArray.forEach( nodeSetup );

    var spacing = 5;
    var sourceVBox = new VBox( {
      children: [ fanSourceIcon, beamSourceIcon ],
      align: 'left',
      spacing: spacing
    } );
    var lensVBox = new VBox( {
      children: [ convergingLensIcon, divergingLensIcon ],
      align: 'left',
      spacing: spacing
    } );
    var curvedMirrorVBox = new VBox( {
      children: [ convergingMirrorIcon, divergingMirrorIcon ],
      align: 'left',
      spacing: spacing
    } );
    var planeMirrorVBox = new VBox( {
      children: [ planeMirrorIcon ],
      align: 'left',
      spacing: spacing
    } );
    var maskVBox = new VBox( {
      children: [ simpleMaskIcon, slitMaskIcon ],
      align: 'left',
      spacing: spacing
    } );
    spacing = 10;
    var content = new HBox( {
      children: [
        sourceVBox,
        lensVBox,
        planeMirrorVBox,
        curvedMirrorVBox,
        maskVBox
      ],
      align: 'top',
      spacing: spacing
    } );

    Panel.call( this, content, { xMargin: 15, yMargin: 5, lineWidth: 2, fill: PANEL_COLOR } );
  }//end constructor

  opticsLab.register( 'ToolDrawerPanel', ToolDrawerPanel );

  return inherit( Panel, ToolDrawerPanel );
} );
