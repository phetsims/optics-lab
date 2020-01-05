// Copyright 2015-2020, University of Colorado Boulder

/**
 * Control panel for a particular source (fan or beam) or a particular component (lens, mirror, or mask)
 * contains sliders to set height or spread of source or diameter, focal length (if lens or mirror)
 * and index  of refraction (if lens)
 * Piece:  Controls
 * fan_source: spread in degrees
 * beam_source: height in cm
 * converging_lens: diameter in cm,/radius of curvature in cm/index of refraction (no units)
 * diverging_lens: diameter/radius/index
 * converging_mirror: diameter/radius
 * diverging_mirror: diameter/radius
 * plane_mirror: diameter
 * simple_mask: diameter
 * slit_mask: diameter/ slit width
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const Node = require( 'SCENERY/nodes/Node' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const OpticsLabConstants = require( 'OPTICS_LAB/optics-lab/OpticsLabConstants' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const DISPLAY_FONT = new PhetFont( 12 );
  const TEXT_COLOR = OpticsLabConstants.TEXT_COLOR;

  class SelectedPieceControlPanel extends Node {
    /**
     * @param {OpticsLabModel} mainModel
     * @param {OpticsLabScreenView} mainView
     * @param {ComponentModel|SourceModel} selectedPiece
     */
    constructor( mainModel, mainView, selectedPiece ) {

      super();
      this.mainModel = mainModel;
      this.mainView = mainView;
      this.selectedPiece = selectedPiece;
      this.expandedProperty = new Property( true );
      this.hSliders = []; //array of HSliders in this control panel, used solely for garbage collection

      //initialize source rays color radio buttons
      let fontInfo = { font: DISPLAY_FONT };
      this.whiteText = new Text( 'white', fontInfo );
      this.greenText = new Text( 'green', fontInfo );
      this.redText = new Text( 'red', fontInfo );
      this.yellowText = new Text( 'yellow', fontInfo );

      fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
      this.nbrOfRaysText = new Text( 'number of rays', fontInfo );
      this.focalPointsText = new Text( 'focal points', fontInfo );
      this.heightText = new Text( 'height', fontInfo );
      this.spreadText = new Text( 'spread', fontInfo );
      this.diameterText = new Text( 'diameter', fontInfo );
      this.radiusText = new Text( 'radius of curvature', fontInfo );
      this.focalLengthText = new Text( 'f : ', fontInfo );
      this.focalLengthReadoutText = new Text( 'filler', fontInfo );
      this.indexText = new Text( 'refractive index', fontInfo );
      this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
        sideLength: 15,
        cursor: 'pointer'
      } );

      // All controls are placed on display node, with visibility set by expand/collapse button
      this.panelOptions = {
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

      this.setControlsForSelectedPiece();

      this.expandCollapseButton.expandedProperty.link( tOrF => {
        this.displayPanel.visible = tOrF;
      } );

      this.mainView.selectedPieceProperty.link( piece => {
        this.visible = ( piece === this.selectedPiece );
      } );

    }//end constructor


    /**
     *
     * @param {string} titleString
     * @public
     */
    setTitleBar( titleString ) {
      this.panelTitle.text = titleString;
    }

    /**
     * change the piece that this panel controls
     * @private
     */
    setControlsForSelectedPiece() {
      if ( this.selectedPiece !== null ) {
        const piece = this.selectedPiece;
        const pieceModel = piece.pieceModel;
        const type = piece.type;
        const fillerBox = new Text( ' ', { font: DISPLAY_FONT } );
        let nbrOfRaysVBox;
        let diameterVBox;
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
        const hBoxMaker = childrenArray => {
          return new HBox( {
            children: childrenArray,
            spacing: spacing,
            resize: false
          } );
        };
        if ( type === Type.FAN_SOURCE || type === Type.BEAM_SOURCE ) {
          //pieceModel = piece.pieceModel;
          const maxNbrRays = OpticsLabConstants.MAXIMUM_LIGHT_RAYS;
          const nbrOfRaysSlider = new HSlider( pieceModel.nbrOfRaysProperty, new Range( 1, maxNbrRays ), sliderOptions );
          nbrOfRaysVBox = vBoxMaker( [nbrOfRaysSlider, this.nbrOfRaysText] );
          this.setColorRadioButtonsForSourceNode( piece );
        }
        else {   //if piece = component
          const diameterSlider = new HSlider( pieceModel.diameterProperty, new Range( 50, 250 ), sliderOptions );
          diameterVBox = vBoxMaker( [diameterSlider, this.diameterText] );
          this.focalLengthReadoutText.text = pieceModel.fProperty.value.toFixed( 0 );
          pieceModel.fProperty.link( f => {
            if ( f ) {
              this.focalLengthReadoutText.text = f.toFixed( 0 );
            }
          } );
        }

        const checkboxOptions = { checkboxColorBackground: 'white' };
        var spacing = 25;
        const focalLengthHBox = hBoxMaker( [this.focalLengthText, this.focalLengthReadoutText] );
        switch( type ) {
          case Type.FAN_SOURCE:
            var spreadSlider = new HSlider( pieceModel.spreadProperty, new Range( 2, 180 ), sliderOptions );
            var spreadVBox = vBoxMaker( [spreadSlider, this.spreadText] );
            this.content = hBoxMaker( [fillerBox, nbrOfRaysVBox, spreadVBox, this.colorVBox1, this.colorVBox2] );
            break;
          case Type.BEAM_SOURCE:
            var heightSlider = new HSlider( pieceModel.heightProperty, new Range( 50, 250 ), sliderOptions );
            var heightVBox = vBoxMaker( [heightSlider, this.heightText] );
            this.content = hBoxMaker( [fillerBox, nbrOfRaysVBox, heightVBox, this.colorVBox1, this.colorVBox2] );
            break;
          case Type.CONVERGING_LENS:
            //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
            //radius of curvature R = 2*f*( n - 1 )
            var radiusSlider = new HSlider( pieceModel.radiusProperty, new Range( 100, 800 ), sliderOptions );
            this.hSliders.push( radiusSlider );
            var radiusVBox = vBoxMaker( [radiusSlider, this.radiusText] );
            var indexSlider = new HSlider( pieceModel.indexProperty, new Range( 1.4, 3 ), sliderOptions );
            this.hSliders.push( indexSlider );
            var indexVBox = vBoxMaker( [indexSlider, this.indexText] );
            var focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckbox, focalLengthHBox] );
            break;
          case Type.DIVERGING_LENS:
            //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
            //radius of curvature R = 2*f*( n - 1 )
            radiusSlider = new HSlider( pieceModel.radiusProperty, new Range( -100, -800 ), sliderOptions );
            this.hSliders.push( radiusSlider );
            radiusVBox = vBoxMaker( [radiusSlider, this.radiusText] );
            indexSlider = new HSlider( pieceModel.indexProperty, new Range( 1.4, 3 ), sliderOptions );
            this.hSliders.push( indexSlider );
            indexVBox = vBoxMaker( [indexSlider, this.indexText] );
            focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckbox, focalLengthHBox] );
            break;
          case Type.CONVERGING_MIRROR:
            radiusSlider = new HSlider( pieceModel.radiusProperty, new Range( 200, 1600 ), sliderOptions );
            this.hSliders.push( radiusSlider );
            radiusVBox = vBoxMaker( [radiusSlider, this.radiusText] );
            focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [fillerBox, diameterVBox, radiusVBox, focalPtCheckbox, focalLengthHBox] );
            break;
          case Type.PLANE_MIRROR:
            this.content = hBoxMaker( [fillerBox, diameterVBox] );
            break;
          case Type.DIVERGING_MIRROR:
            radiusSlider = new HSlider( pieceModel.radiusProperty, new Range( -200, -1600 ), sliderOptions );
            this.hSliders.push( radiusSlider );
            radiusVBox = vBoxMaker( [radiusSlider, this.radiusText] );
            focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [fillerBox, diameterVBox, radiusVBox, focalPtCheckbox, focalLengthHBox] );
            break;
          case Type.SIMPLE_MASK:
            this.content = hBoxMaker( [fillerBox, diameterVBox] );
            break;
          case Type.SLIT_MASK:
            this.content = hBoxMaker( [fillerBox] );
            break;
          default:
            throw new Error( 'invalid type: ' + type );

        }//end switch()
        this.displayPanel = new Panel( this.content, this.panelOptions );
        this.children = [this.displayPanel, this.expandCollapseButton];
        this.expandCollapseButton.left = 5;
        this.expandCollapseButton.top = 5;
      }//end if (type != null)
    }// end setControlsForSelectedPiece()

    /**
     *
     * @param {SourceNode} sourceNode
     * @private
     */
    setColorRadioButtonsForSourceNode( sourceNode ) {
      const radioButtonOptions = { radius: 8, fontSize: 12, deselectedColor: 'white' };
      const whiteColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'white', this.whiteText, radioButtonOptions );
      const greenColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'green', this.greenText, radioButtonOptions );
      const redColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'red', this.redText, radioButtonOptions );
      const yellowColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'yellow', this.yellowText, radioButtonOptions );
      const spacing = 5;
      this.colorVBox1 = new VBox( {
        children: [whiteColorRadioButton, greenColorRadioButton],
        align: 'left',
        spacing: spacing
      } );
      this.colorVBox2 = new VBox( {
        children: [redColorRadioButton, yellowColorRadioButton],
        align: 'left',
        spacing: spacing
      } );
    }


    /**
     *  @public
     */
    dispose() {
      for ( let i = 0; i < this.hSliders.length; i++ ) {
        this.hSliders[ i ].dispose();
      }
    }
  }

  return opticsLab.register( 'SelectedPieceControlPanel', SelectedPieceControlPanel );
} );
