// Copyright 2015-2017, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var OpticsLabConstants = require( 'OPTICS_LAB/optics-lab/OpticsLabConstants' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var DISPLAY_FONT = new PhetFont( 12 );
  var TEXT_COLOR = OpticsLabConstants.TEXT_COLOR;

  /**
   * @extends {Node}
   * @param {OpticsLabModel} mainModel
   * @param {OpticsLabScreenView} mainView
   * @param {ComponentModel|SourceModel} selectedPiece
   * @constructor
   */
  function SelectedPieceControlPanel( mainModel, mainView, selectedPiece ) {

    Node.call( this );
    var self = this;
    this.mainModel = mainModel;
    this.mainView = mainView;
    this.selectedPiece = selectedPiece;
    this.expandedProperty = new Property( true );
    this.hSliders = []; //array of HSliders in this control panel, used solely for garbage collection

    //initialize source rays color radio buttons
    var fontInfo = { font: DISPLAY_FONT };
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

    this.expandCollapseButton.expandedProperty.link( function( tOrF ) {
      self.displayPanel.visible = tOrF;
    } );

    this.mainView.selectedPieceProperty.link( function( piece ) {
      self.visible = ( piece === self.selectedPiece );
    } );

  }//end constructor

  opticsLab.register( 'SelectedPieceControlPanel', SelectedPieceControlPanel );

  return inherit( Node, SelectedPieceControlPanel, {

    /**
     *
     * @param {string} titleString
     * @public
     */
    setTitleBar: function( titleString ) {
      this.panelTitle.text = titleString;
    },

    /**
     * change the piece that this panel controls
     * @private
     */
    setControlsForSelectedPiece: function() {
      if ( this.selectedPiece !== null ) {
        var piece = this.selectedPiece;
        var pieceModel = piece.pieceModel;
        var type = piece.type;
        var fillerBox = new Text( ' ', { font: DISPLAY_FONT } );
        var nbrOfRaysVBox;
        var diameterVBox;
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
        var hBoxMaker = function( childrenArray ) {
          return new HBox( {
            children: childrenArray,
            spacing: spacing,
            resize: false
          } );
        };
        if ( type === Type.FAN_SOURCE || type === Type.BEAM_SOURCE ) {
          //pieceModel = piece.pieceModel;
          var maxNbrRays = pieceModel.maxNbrOfRays;
          var nbrOfRaysSlider = new HSlider( pieceModel.nbrOfRaysProperty, {
            min: 1,
            max: maxNbrRays
          }, sliderOptions );
          nbrOfRaysVBox = vBoxMaker( [ nbrOfRaysSlider, this.nbrOfRaysText ] );
          this.setColorRadioButtonsForSourceNode( piece );
        }
        else {   //if piece = component
          var diameterSlider = new HSlider( pieceModel.diameterProperty, { min: 50, max: 250 }, sliderOptions );
          diameterVBox = vBoxMaker( [ diameterSlider, this.diameterText ] );
          this.focalLengthReadoutText.text = pieceModel.fProperty.value.toFixed( 0 );
          var self = this;
          pieceModel.fProperty.link( function( f ) {
            if ( f ) {
              self.focalLengthReadoutText.text = f.toFixed( 0 );
            }
          } );
        }

        var checkboxOptions = { checkboxColorBackground: 'white' };
        var spacing = 25;
        var focalLengthHBox = hBoxMaker( [ this.focalLengthText, this.focalLengthReadoutText ] );
        switch( type ) {
          case Type.FAN_SOURCE:
            var spreadSlider = new HSlider( pieceModel.spreadProperty, { min: 2, max: 180 }, sliderOptions );
            var spreadVBox = vBoxMaker( [ spreadSlider, this.spreadText ] );
            this.content = hBoxMaker( [ fillerBox, nbrOfRaysVBox, spreadVBox, this.colorVBox1, this.colorVBox2 ] );
            break;
          case Type.BEAM_SOURCE:
            var heightSlider = new HSlider( pieceModel.heightProperty, { min: 50, max: 250 }, sliderOptions );
            var heightVBox = vBoxMaker( [ heightSlider, this.heightText ] );
            this.content = hBoxMaker( [ fillerBox, nbrOfRaysVBox, heightVBox, this.colorVBox1, this.colorVBox2 ] );
            break;
          case Type.CONVERGING_LENS:
            //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
            //radius of curvature R = 2*f*( n - 1 )
            var radiusSlider = new HSlider( pieceModel.radiusProperty, { min: 100, max: 800 }, sliderOptions );
            this.hSliders.push( radiusSlider );
            var radiusVBox = vBoxMaker( [ radiusSlider, this.radiusText ] );
            var indexSlider = new HSlider( pieceModel.indexProperty, { min: 1.4, max: 3 }, sliderOptions );
            this.hSliders.push( indexSlider );
            var indexVBox = vBoxMaker( [ indexSlider, this.indexText ] );
            var focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckbox, focalLengthHBox ] );
            break;
          case Type.DIVERGING_LENS:
            //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
            //radius of curvature R = 2*f*( n - 1 )
            radiusSlider = new HSlider( pieceModel.radiusProperty, { min: -100, max: -800 }, sliderOptions );
            this.hSliders.push( radiusSlider );
            radiusVBox = vBoxMaker( [ radiusSlider, this.radiusText ] );
            indexSlider = new HSlider( pieceModel.indexProperty, { min: 1.4, max: 3 }, sliderOptions );
            this.hSliders.push( indexSlider );
            indexVBox = vBoxMaker( [ indexSlider, this.indexText ] );
            focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckbox, focalLengthHBox ] );
            break;
          case Type.CONVERGING_MIRROR:
            radiusSlider = new HSlider( pieceModel.radiusProperty, { min: 200, max: 1600 }, sliderOptions );
            this.hSliders.push( radiusSlider );
            radiusVBox = vBoxMaker( [ radiusSlider, this.radiusText ] );
            focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, focalPtCheckbox, focalLengthHBox ] );
            break;
          case Type.PLANE_MIRROR:
            this.content = hBoxMaker( [ fillerBox, diameterVBox ] );
            break;
          case Type.DIVERGING_MIRROR:
            radiusSlider = new HSlider( pieceModel.radiusProperty, { min: -200, max: -1600 }, sliderOptions );
            this.hSliders.push( radiusSlider );
            radiusVBox = vBoxMaker( [ radiusSlider, this.radiusText ] );
            focalPtCheckbox = new Checkbox( this.focalPointsText, piece.showFocalPointsProperty, checkboxOptions );
            this.content = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, focalPtCheckbox, focalLengthHBox ] );
            break;
          case Type.SIMPLE_MASK:
            this.content = hBoxMaker( [ fillerBox, diameterVBox ] );
            break;
          case Type.SLIT_MASK:
            this.content = hBoxMaker( [ fillerBox ] );
            break;
          default:
            throw new Error( 'invalid type: ' + type );

        }//end switch()
        this.displayPanel = new Panel( this.content, this.panelOptions );
        this.children = [ this.displayPanel, this.expandCollapseButton ];
        this.expandCollapseButton.left = 5;
        this.expandCollapseButton.top = 5;
      }//end if (type != null)
    }, // end setControlsForSelectedPiece()

    /**
     *
     * @param {SourceNode} sourceNode
     * @private
     */
    setColorRadioButtonsForSourceNode: function( sourceNode ) {
      var radioButtonOptions = { radius: 8, fontSize: 12, deselectedColor: 'white' };
      var whiteColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'white', this.whiteText, radioButtonOptions );
      var greenColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'green', this.greenText, radioButtonOptions );
      var redColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'red', this.redText, radioButtonOptions );
      var yellowColorRadioButton = new AquaRadioButton( sourceNode.colorProperty, 'yellow', this.yellowText, radioButtonOptions );
      var spacing = 5;
      this.colorVBox1 = new VBox( {
        children: [ whiteColorRadioButton, greenColorRadioButton ],
        align: 'left',
        spacing: spacing
      } );
      this.colorVBox2 = new VBox( {
        children: [ redColorRadioButton, yellowColorRadioButton ],
        align: 'left',
        spacing: spacing
      } );
    },

    /**
     *  @public
     */
    dispose: function() {
      for ( var i = 0; i < this.hSliders.length; i++ ) {
        this.hSliders[ i ].dispose();
      }
    }

  } );//end inherit
} );
