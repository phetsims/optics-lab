// Copyright 2016, University of Colorado Boulder

/**
 * Control panel for a particular source (fan or beam) or a particular component (lens, mirror, or mask)
 * contains sliders to set height or spread of source or diameter, focal length (if lens or mirror)
 * and index  of refraction (if lens)
 * Piece:  Controls
 * fan_source: nbr of rays / spread in degrees / color of rays
 * beam_source: nbr of rays / width in cm / color of rays
 * converging_lens: diameter in cm /radius of curvature in cm/ index of refraction (no units)/ focal points checkBox/ focal length readout
 * diverging_lens: diameter/radius/index/focal points checkbox/focal length readout
 * converging_mirror: diameter/radius/focal points checkbox/focal length readout
 * diverging_mirror: diameter/radius/focal points checkbox/focal length readout
 * plane_mirror: diameter
 * simple_mask: diameter
 * slit_mask: diameter/ slit width
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  var OpticsLabConstants = require( 'OPTICS_LAB/optics-lab/OpticsLabConstants' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );

  // constants
  var DISPLAY_FONT = new PhetFont( 12 );
  var TEXT_COLOR = OpticsLabConstants.TEXT_COLOR;

  /**
   * @extends {Node}
   * @param {OpticsLabModel} mainModel
   * @param {OpticsLabScreenView} mainView
   * @param {Type} type
   * @constructor
   */
  function ControlPanel( mainModel, mainView, type ) {
    Node.call( this );
    var self = this;
    this.type = type;

    var fontInfo = { font: DISPLAY_FONT };
    var whiteText = new Text( 'white', fontInfo );
    var greenText = new Text( 'green', fontInfo );
    var redText = new Text( 'red', fontInfo );
    var yellowText = new Text( 'yellow', fontInfo );

    fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var nbrOfRaysText = new Text( 'number of rays', fontInfo );
    var focalPointsText = new Text( 'focal points', fontInfo );
    var widthText = new Text( 'width', fontInfo );
    var spreadText = new Text( 'spread', fontInfo );
    var diameterText = new Text( 'diameter', fontInfo );
    var radiusText = new Text( 'radius of curvature', fontInfo );
    var focalLengthText = new Text( 'f : ', fontInfo );
    this.focalLengthReadoutText = new Text( 'filler', fontInfo );
    var indexText = new Text( 'refractive index', fontInfo );


    // All controls are placed on display node, with visibility set by expand/collapse button
    var panelOptions = {
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

    var sliderOptions = {
      trackSize: new Dimension2( 120, 5 ),
      thumbSize: new Dimension2( 12, 25 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 6
    };

    var vBoxMaker = function( childrenArray ) {
      return new VBox( {
        children: childrenArray,
        align: 'center',
        resize: false
      } );
    };
    var vBoxMaker2 = function( childrenArray ) {
      return new VBox( {
        children: childrenArray,
        align: 'left',
        resize: false
      } );
    };
    var spacing = 20;
    var hBoxMaker = function( childrenArray ) {
      return new HBox( {
        children: childrenArray,
        spacing: spacing,
        resize: false
      } );
    };

    //Properties for Sliders, CheckBoxes, and Radio Buttons
    this.expandedProperty = new Property( true );
    this.nbrOfRaysProperty = new Property( 10 );
    this.spreadProperty = new Property( 20 );
    this.widthProperty = new Property( 50 );
    this.colorProperty = new Property( 'white' );
    this.diameterProperty = new Property( 50 );
    this.radiusOfCurvatureProperty = new Property( 150 );
    this.indexOfRefractionProperty = new Property( 2 );
    this.showFocalPointsProperty = new Property( false );

    var fillerBox = new Text( ' ', { font: DISPLAY_FONT } );

    //Create Sliders with Text labels
    var maxNbrRays = mainModel.maxNbrOfRaysFromASource;
    var nbrOfRaysSlider = new HSlider( this.nbrOfRaysProperty, { min: 1, max: maxNbrRays }, sliderOptions );
    var nbrOfRaysVBox = vBoxMaker( [ nbrOfRaysSlider, nbrOfRaysText ] );

    var spreadSlider = new HSlider( this.spreadProperty, { min: 2, max: 180 }, sliderOptions );
    var spreadVBox = vBoxMaker( [ spreadSlider, spreadText ] );

    var widthSlider = new HSlider( this.widthProperty, { min: 50, max: 250 }, sliderOptions );
    var widthVBox = vBoxMaker( [ widthSlider, widthText ] );

    var radioButtonOptions = { radius: 8, fontSize: 12, deselectedColor: 'white' };
    var whiteColorRadioButton = new AquaRadioButton( this.colorProperty, 'white', whiteText, radioButtonOptions );
    var greenColorRadioButton = new AquaRadioButton( this.colorProperty, 'green', greenText, radioButtonOptions );
    var redColorRadioButton = new AquaRadioButton( this.colorProperty, 'red', redText, radioButtonOptions );
    var yellowColorRadioButton = new AquaRadioButton( this.colorProperty, 'yellow', yellowText, radioButtonOptions );

    var colorVBox1 = vBoxMaker2( [ whiteColorRadioButton, greenColorRadioButton ] );
    var colorVBox2 = vBoxMaker2( [ redColorRadioButton, yellowColorRadioButton ] );

    var diameterSlider = new HSlider( this.diameterProperty, { min: 50, max: 250 }, sliderOptions );
    var diameterVBox = vBoxMaker( [ diameterSlider, diameterText ] );

    var radiusSlider = new HSlider( this.radiusOfCurvatureProperty, { min: 100, max: 800 }, sliderOptions );
    var radiusVBox = vBoxMaker( [ radiusSlider, radiusText ] );

    var radiusSlider2 = new HSlider( this.radiusOfCurvatureProperty, { min: -100, max: -800 }, sliderOptions );
    var radiusVBox2 = vBoxMaker( [ radiusSlider2, radiusText ] );

    var indexSlider = new HSlider( this.indexOfRefractionProperty, { min: 1.4, max: 3 }, sliderOptions );
    var indexVBox = vBoxMaker( [ indexSlider, indexText ] );

    var checkBoxOptions = { checkBoxColorBackground: 'white' };

    var focalPtCheckBox = new CheckBox( focalPointsText, this.showFocalPointsProperty, checkBoxOptions );

    var focalLengthHBox = hBoxMaker( [ focalLengthText, this.focalLengthReadoutText ] );
    var panelContent = new Node();

    switch( type ) {
      case Type.FAN_SOURCE:
        panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, spreadVBox, colorVBox1, colorVBox2 ] );
        break;
      case Type.BEAM_SOURCE:
        panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, widthVBox, colorVBox1, colorVBox2 ] );
        break;
      case Type.CONVERGING_LENS:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox ] );
        break;
      case Type.DIVERGING_LENS:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox2, indexVBox, focalPtCheckBox, focalLengthHBox ] );
        break;
      case Type.CONVERGING_MIRROR:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox ] );
        break;
      case Type.PLANE_MIRROR:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox ] );
        break;
      case Type.DIVERGING_MIRROR:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox2, focalPtCheckBox, focalLengthHBox ] );
        break;
      case Type.SIMPLE_MASK:
        panelContent = hBoxMaker( [ fillerBox, diameterVBox ] );
        break;
      case Type.SLIT_MASK:
        panelContent = hBoxMaker( [ fillerBox ] );
        break;
      default:
        throw new Error( 'invalid type: ' + type );

    }//end switch()
    var expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 15,
      cursor: 'pointer'
    } );
    var displayPanel = new Panel( panelContent, panelOptions );
    self.children = [ displayPanel, expandCollapseButton ];
    expandCollapseButton.left = 5;
    expandCollapseButton.top = 5;

    mainView.selectedPieceProperty.lazyLink( function( piece ) {
      self.visible = ( piece.type === self.type );
      self.unlinkToOldPiece();

      if ( self.visible ) {
        self.linkToPiece( piece );
      }
    } );
    expandCollapseButton.expandedProperty.link( function( tOrF ) {
      displayPanel.visible = tOrF;
      //if( displayPanel !== null ){
      //    displayPanel.visible = tOrF;
      //}
    } );
    //if( type !== Type.FAN_SOURCE && type !== Type.BEAM_SOURCE ){
    //    mainView.selectedPieceProperty.lazyLink( function( piece ){
    //       var fValue = piece.pieceModel.f;
    //       self.focalLengthReadoutText.text = fValue.toFixed( 0 );
    //    });
    //}


  }//end constructor

  opticsLab.register( 'ControlPanel', ControlPanel );

  return inherit( Node, ControlPanel, {
    /**
     *
     * @param {SourceNode|ComponentNode} piece
     */
    linkToPiece: function( piece ) {

    },
    /**
     *
     */
    unlinkToOldPiece: function() {

    },

    /**
     * @public
     */
    resetProperties: function() {
      this.expandedProperty.value = true;
      this.nbrOfRaysProperty.value = 10;
      this.spreadProperty.value = 20;
      this.widthProperty.value = 50;
      this.colorProperty.value = 'white';
      this.diameterProperty.value = 50;
      this.radiusOfCurvatureProperty.value = 150;
      this.indexOfRefractionProperty.value = 2;
      this.showFocalPointsProperty.value = false;
    }

  } );//end inherit
} );

