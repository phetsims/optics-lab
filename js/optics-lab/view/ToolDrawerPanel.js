// Copyright 2015-2020, University of Colorado Boulder

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
  const Node = require( 'SCENERY/nodes/Node' );
  const merge = require( 'PHET_CORE/merge' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  //constants
  const DISPLAY_FONT = new PhetFont( 12 );
  const PANEL_COLOR = '#ccc';

  class ToolDrawerPanel extends Panel {
    /**
     * @param {OpticsLabScreenView} mainView
     */
    constructor( mainView ) {

      const fanSourceIcon = new Node();
      const beamSourceIcon = new Node();
      const convergingLensIcon = new Node();
      const divergingLensIcon = new Node();
      const convergingMirrorIcon = new Node();
      const planeMirrorIcon = new Node();
      const divergingMirrorIcon = new Node();
      const simpleMaskIcon = new Node();
      const slitMaskIcon = new Node();

      const fontInfo = { font: DISPLAY_FONT };
      const fanSourceText = new Text( 'fan source', fontInfo );
      const beamSourceText = new Text( 'beam source', fontInfo );
      const convergingLensText = new Text( 'converging lens', fontInfo );
      const divergingLensText = new Text( 'diverging lens', fontInfo );
      const convergingMirrorText = new Text( 'converging mirror', fontInfo );
      const planeMirrorText = new Text( 'plane mirror', fontInfo );
      const divergingMirrorText = new Text( 'diverging mirror', fontInfo );
      const simpleMaskText = new Text( 'simple mask', fontInfo );
      const slitMaskText = new Text( 'slit mask', fontInfo );

      const nodeArray = [
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

      const textArray = [
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

      const typeArray = [
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

      const vBoxOptions = { align: 'left', spacing: 5 };

      const sourceVBox = new VBox( merge( { children: [fanSourceIcon, beamSourceIcon] }, vBoxOptions ) );
      const lensVBox = new VBox( merge( { children: [convergingLensIcon, divergingLensIcon] }, vBoxOptions ) );
      const curvedMirrorVBox = new VBox( merge( { children: [convergingMirrorIcon, divergingMirrorIcon] }, vBoxOptions ) );
      const planeMirrorVBox = new VBox( merge( { children: [planeMirrorIcon] }, vBoxOptions ) );
      const maskVBox = new VBox( merge( { children: [simpleMaskIcon, slitMaskIcon] }, vBoxOptions ) );

      const content = new HBox( {
        children: [sourceVBox, lensVBox, planeMirrorVBox, curvedMirrorVBox, maskVBox],
        align: 'top',
        spacing: 10
      } );

      super( content, { xMargin: 15, yMargin: 5, lineWidth: 2, fill: PANEL_COLOR } );

      const nodeSetup = ( element, index ) => {
        const xCorner = -8;
        const yCorner = textArray[ index ].height;
        const elementWidth = textArray[ index ].width + 16;
        const elementHeight = textArray[ index ].height + 10;
        let pieceGrabbed;
        element.addChild( textArray[ index ] );
        element.addChild( new Rectangle( xCorner, -yCorner, elementWidth, elementHeight, {
          fill: 'green',
          cursor: 'pointer',
          opacity: 0.1
        } ) );

        element.addInputListener( new SimpleDragHandler(
          {

            allowTouchSnag: true,

            start: e => {

              const startPosition = this.globalToParentPoint( e.pointer.point );
              const type = typeArray[ index ];
              pieceGrabbed = mainView.addPiece( type, startPosition );
              //pieceGrabbed.mainView.setSelectedPiece( pieceGrabbed );
              mainView.setSelectedPiece( pieceGrabbed );
            },

            drag: e => {
              const position = this.globalToParentPoint( e.pointer.point );   //returns Vector2

              pieceGrabbed.pieceModel.setPosition( position );
            },
            end: e => {
              const vEnd = this.globalToParentPoint( e.pointer.point );
              if ( this.visibleBounds.containsCoordinates( vEnd.x, vEnd.y ) ) {
                mainView.removePiece( pieceGrabbed );
              }
            }
          }//end addInputListener

        ) );
      }; //end nodeSetup

      nodeArray.forEach( nodeSetup );

    }//end constructor
  }

  return opticsLab.register( 'ToolDrawerPanel', ToolDrawerPanel );

} );
