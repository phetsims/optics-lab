// Copyright 2015-2022, University of Colorado Boulder

/**
 * Control panel for a particular source (fan or beam) or a particular component (lens, mirror, or mask)
 * contains sliders to set height or spread of source or diameter, focal length (if lens or mirror)
 * and index  of refraction (if lens)
 * Piece:  Controls
 * fan_source: nbr of rays / spread in degrees / color of rays
 * beam_source: nbr of rays / width in cm / color of rays
 * converging_lens: diameter in cm /radius of curvature in cm/ index of refraction (no units)/ focal points checkbox/ focal length readout
 * diverging_lens: diameter/radius/index/focal points checkbox/focal length readout
 * converging_mirror: diameter/radius/focal points checkbox/focal length readout
 * diverging_mirror: diameter/radius/focal points checkbox/focal length readout
 * plane_mirror: diameter
 * simple_mask: diameter
 * slit_mask: diameter/ slit width
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import opticsLab from '../../opticsLab.js';
import Type from '../model/Type.js';
import OpticsLabConstants from '../OpticsLabConstants.js';

// constants
const DISPLAY_FONT = new PhetFont( 12 );
const TEXT_COLOR = OpticsLabConstants.TEXT_COLOR;

class ControlPanel extends Node {
  /**
   * @param {OpticsLabScreenView} mainView
   * @param {Type} type
   */
  constructor( mainView, type ) {
    super();
    this.type = type;

    let fontInfo = { font: DISPLAY_FONT };
    const whiteText = new Text( 'white', fontInfo );
    const greenText = new Text( 'green', fontInfo );
    const redText = new Text( 'red', fontInfo );
    const yellowText = new Text( 'yellow', fontInfo );

    fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    const nbrOfRaysText = new Text( 'number of rays', fontInfo );
    const focalPointsText = new Text( 'focal points', fontInfo );
    const widthText = new Text( 'width', fontInfo );
    const spreadText = new Text( 'spread', fontInfo );
    const diameterText = new Text( 'diameter', fontInfo );
    const radiusText = new Text( 'radius of curvature', fontInfo );
    const focalLengthText = new Text( 'f : ', fontInfo );
    this.focalLengthReadoutText = new Text( 'filler', fontInfo );
    const indexText = new Text( 'refractive index', fontInfo );


    // All controls are placed on display node, with visibility set by expand/collapse button
    const panelOptions = {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 15,
      yMargin: 5,
      cornerRadius: 5, // radius of the rounded corners on the background
      resize: false, // dynamically resize when content bounds change
      backgroundPickable: false,
      align: 'left', // {string} horizontal of content in the pane, left|center|right
      minWidth: 0 // minimum width of the panel
    };

    const sliderOptions = {
      trackSize: new Dimension2( 120, 5 ),
      thumbSize: new Dimension2( 12, 25 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 6
    };

    const vBoxMaker = childrenArray => {
      return new VBox( {
        children: childrenArray,
        align: 'center',
        resize: false
      } );
    };
    const vBoxMaker2 = childrenArray => {
      return new VBox( {
        children: childrenArray,
        align: 'left',
        resize: false
      } );
    };
    const spacing = 20;
    const hBoxMaker = childrenArray => {
      return new HBox( {
        children: childrenArray,
        spacing: spacing,
        resize: false
      } );
    };

    //Properties for Sliders, Checkboxes, and Radio Buttons
    this.expandedProperty = new Property( true );
    this.nbrOfRaysProperty = new Property( 10 );
    this.spreadProperty = new Property( 20 );
    this.widthProperty = new Property( 50 );
    this.colorProperty = new Property( 'white' );
    this.diameterProperty = new Property( 50 );
    this.radiusOfCurvatureProperty = new Property( 150 );
    this.indexOfRefractionProperty = new Property( 2 );
    this.showFocalPointsProperty = new Property( false );

    const fillerBox = new Text( ' ', { font: DISPLAY_FONT } );

    //Create Sliders with Text labels
    const nbrOfRaysSlider = new HSlider( this.nbrOfRaysProperty, new Range( 1, OpticsLabConstants.MAXIMUM_LIGHT_RAYS ), sliderOptions );
    const nbrOfRaysVBox = vBoxMaker( [ nbrOfRaysSlider, nbrOfRaysText ] );

    const spreadSlider = new HSlider( this.spreadProperty, new Range( 2, 180 ), sliderOptions );
    const spreadVBox = vBoxMaker( [ spreadSlider, spreadText ] );

    const widthSlider = new HSlider( this.widthProperty, new Range( 50, 250 ), sliderOptions );
    const widthVBox = vBoxMaker( [ widthSlider, widthText ] );

    const radioButtonOptions = { radius: 8, fontSize: 12, deselectedColor: 'white' };
    const whiteColorRadioButton = new AquaRadioButton( this.colorProperty, 'white', whiteText, radioButtonOptions );
    const greenColorRadioButton = new AquaRadioButton( this.colorProperty, 'green', greenText, radioButtonOptions );
    const redColorRadioButton = new AquaRadioButton( this.colorProperty, 'red', redText, radioButtonOptions );
    const yellowColorRadioButton = new AquaRadioButton( this.colorProperty, 'yellow', yellowText, radioButtonOptions );

    const colorVBox1 = vBoxMaker2( [ whiteColorRadioButton, greenColorRadioButton ] );
    const colorVBox2 = vBoxMaker2( [ redColorRadioButton, yellowColorRadioButton ] );

    const diameterSlider = new HSlider( this.diameterProperty, new Range( 50, 250 ), sliderOptions );
    const diameterVBox = vBoxMaker( [ diameterSlider, diameterText ] );

    const radiusSlider = new HSlider( this.radiusOfCurvatureProperty, new Range( 100, 800 ), sliderOptions );
    const radiusVBox = vBoxMaker( [ radiusSlider, new Node( { children: [ radiusText ] } ) ] );

    //TODO Range here may be incorrect, see https://github.com/phetsims/optics-lab/issues/22
    const radiusSlider2 = new HSlider( this.radiusOfCurvatureProperty, new Range( -800, -100 ), sliderOptions );
    const radiusVBox2 = vBoxMaker( [ radiusSlider2, new Node( { children: [ radiusText ] } ) ] );

    const indexSlider = new HSlider( this.indexOfRefractionProperty, new Range( 1.4, 3 ), sliderOptions );
    const indexVBox = vBoxMaker( [ indexSlider, indexText ] );

    const checkboxOptions = { checkboxColorBackground: 'white' };

    const focalPtCheckbox = new Checkbox( this.showFocalPointsProperty, focalPointsText, checkboxOptions );

    const focalLengthHBox = hBoxMaker( [ focalLengthText, this.focalLengthReadoutText ] );
    let panelContent = new Node();

    switch( type ) {
      case Type.FAN_SOURCE:
        panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, spreadVBox, colorVBox1, colorVBox2 ] );
        break;
      case Type.BEAM_SOURCE:
        panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, widthVBox, colorVBox1, colorVBox2 ] );
        break;
      case Type.CONVERGING_LENS:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckbox, focalLengthHBox ] );
        break;
      case Type.DIVERGING_LENS:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox2, indexVBox, focalPtCheckbox, focalLengthHBox ] );
        break;
      case Type.CONVERGING_MIRROR:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, focalPtCheckbox, focalLengthHBox ] );
        break;
      case Type.PLANE_MIRROR:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox ] );
        break;
      case Type.DIVERGING_MIRROR:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox2, focalPtCheckbox, focalLengthHBox ] );
        break;
      case Type.SIMPLE_MASK:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox ] );
        break;
      case Type.SLIT_MASK:
        panelContent = hBoxMaker( [ fillerBox ] );
        break;
      default:
        throw new Error( `invalid type: ${type}` );

    }//end switch()
    const expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 15,
      cursor: 'pointer'
    } );
    const displayPanel = new Panel( panelContent, panelOptions );
    this.children = [ displayPanel, expandCollapseButton ];
    expandCollapseButton.left = 5;
    expandCollapseButton.top = 5;

    mainView.selectedPieceProperty.lazyLink( piece => {
      this.visible = ( piece.type === type );
      this.unlinkToOldPiece();

      if ( this.visible ) {
        this.linkToPiece( piece );
      }
    } );
    this.expandedProperty.link( tOrF => {
      displayPanel.visible = tOrF;
    } );

  }//end constructor


  /**
   *
   * @param {SourceNode|ComponentNode} piece
   * @private
   */
  linkToPiece( piece ) {

  }

  /**
   * @private
   */
  unlinkToOldPiece() {

  }

  /**
   * @public
   */
  resetProperties() {
    this.expandedProperty.reset();
    this.nbrOfRaysProperty.reset();
    this.spreadProperty.reset();
    this.widthProperty.reset();
    this.colorProperty.reset();
    this.diameterProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.indexOfRefractionProperty.reset();
    this.showFocalPointsProperty.reset();
  }
}

opticsLab.register( 'ControlPanel', ControlPanel );
export default ControlPanel;