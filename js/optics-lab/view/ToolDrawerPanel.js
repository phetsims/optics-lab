// Copyright 2015-2022, University of Colorado Boulder

/**
 * Toolbox for selecting light sources, lenses, mirrors, and masks
 * Click on icon to drag sources or component onto stage
 * Drag component back to toolbox to delete from stage
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Rectangle, SimpleDragHandler, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import opticsLab from '../../opticsLab.js';
import Type from '../model/Type.js';

//constants
const DISPLAY_FONT = new PhetFont( 12 );
const PANEL_COLOR = '#ccc';

class ToolDrawerPanel extends Panel {
  /**
   * @param {OpticsLabScreenView} mainView
   */
  constructor( mainView ) {

    /**
     * Create icon with dragListener
     * @param {string} string
     * @param {Type} type
     * @returns {Node}
     */
    const createIcon = ( string, type ) => {

      const fontOptions = { font: DISPLAY_FONT };
      const pieceText = new Text( string, fontOptions );
      const iconLayer = new Node();
      iconLayer.addChild( pieceText );
      iconLayer.addChild( new Rectangle( pieceText.bounds.dilatedXY( 8, 5 ), {
        fill: 'green',
        cursor: 'pointer',
        opacity: 0.1
      } ) );

      let pieceGrabbed;
      iconLayer.addInputListener( new SimpleDragHandler(
        {

          allowTouchSnag: true,

          start: e => {

            const startPosition = this.globalToParentPoint( e.pointer.point );
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
      return iconLayer;
    }; //end nodeSetup

    const fanSourceIcon = createIcon( 'Fan Source', Type.FAN_SOURCE );
    const beamSourceIcon = createIcon( 'Beam Source', Type.BEAM_SOURCE );
    const convergingLensIcon = createIcon( 'Converging Lens', Type.CONVERGING_LENS );
    const convergingMirrorIcon = createIcon( 'Converging Mirror', Type.CONVERGING_MIRROR );
    const divergingLensIcon = createIcon( 'Diverging Lens', Type.DIVERGING_LENS );
    const divergingMirrorIcon = createIcon( 'Diverging Mirror', Type.DIVERGING_MIRROR );
    const simpleMaskIcon = createIcon( 'Simple Mask', Type.SIMPLE_MASK );
    const slitMaskIcon = createIcon( 'Slit Mask', Type.SLIT_MASK );
    const planeMirrorIcon = createIcon( 'Plane Mirror', Type.PLANE_MIRROR );

    const vBoxOptions = { align: 'left', spacing: 5 };

    const sourceVBox = new VBox( merge( { children: [ fanSourceIcon, beamSourceIcon ] }, vBoxOptions ) );
    const lensVBox = new VBox( merge( { children: [ convergingLensIcon, divergingLensIcon ] }, vBoxOptions ) );
    const curvedMirrorVBox = new VBox( merge( { children: [ convergingMirrorIcon, divergingMirrorIcon ] }, vBoxOptions ) );
    const planeMirrorVBox = new VBox( merge( { children: [ planeMirrorIcon ] }, vBoxOptions ) );
    const maskVBox = new VBox( merge( { children: [ simpleMaskIcon, slitMaskIcon ] }, vBoxOptions ) );

    const panelContent = new HBox( {
      children: [ sourceVBox, lensVBox, planeMirrorVBox, curvedMirrorVBox, maskVBox ],
      align: 'top',
      spacing: 10
    } );

    super( panelContent, { xMargin: 15, yMargin: 5, lineWidth: 2, fill: PANEL_COLOR } );

  }//end constructor
}

opticsLab.register( 'ToolDrawerPanel', ToolDrawerPanel );
export default ToolDrawerPanel;