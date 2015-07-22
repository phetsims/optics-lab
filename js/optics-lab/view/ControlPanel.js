/**
 * Control panel for a particular source (fan or beam) or a particular component (lens, mirror, or mask)
 * contains sliders to set height or spread of source or diameter, focal length (if lens or mirror) and index (if lens) of refraction of component
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
 * Created by dubson on 7/12/2015.
 */


define( function( require ) {
  'use strict';

  // modules
  //var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  //var HSeparator = require( 'SUN/HSeparator' );
  var AccordionBox = require( 'SUN/AccordionBox' );
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
  var Util = require( 'OPTICS_LAB/optics-lab/common/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var DISPLAY_FONT = new PhetFont( 12 );
  var TEXT_COLOR = Util.TEXT_COLOR;
  //var PANEL_COLOR = Util.PANEL_COLOR;
  //var BACKGROUND_COLOR = Util.BACKGROUND_COLOR;


  /**
   * {ComponentModel] pieceModel
   *
   * @constructor
   */

  function ControlPanel( mainModel, mainView ) {

    Node.call( this );
    var controlPanel = this;
    this.mainModel = mainModel;
    this.mainView = mainView;
    this.expandedProperty = new Property( true );

    this.mainView.selectedPieceProperty.link( function( piece ){
      if( piece !== null ){
        //console.log( 'calling setControls for piece ' + piece.type );
        controlPanel.setControlsForSelectedPiece( piece );
      }
    } );

    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    this.nbrOfRaysText = new Text( 'number of rays', fontInfo );
    this.focalPointsText = new Text( 'focal points', fontInfo );
    this.heightText = new Text( 'height', fontInfo );
    this.spreadText = new Text( 'spread', fontInfo );
    this.diameterText = new Text( 'diameter', fontInfo );
    this.radiusText = new Text( 'radius of curvature', fontInfo );
    this.focalLengthText = new Text( 'focal length', fontInfo );
    this.indexText = new Text( 'refractive index', fontInfo );
    this.showFocalPointsProperty = new Property( false );
    //
    //var diameterVBox = new VBox( { children: [ this.diameterSlider, this.diameterText ], align: 'center' } );
    //var focalLengthVBox = new VBox( { children: [ this.positivefSlider, this.focalLengthText ], align: 'center' } );
    //var indexVBox = new VBox( { children: [ this.indexSlider, this.indexText ], align: 'center' } );
    this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, { sideLength: 15, cursor:'pointer' });

    var spacing = 35;
    var fillerBox = new Text( '', {font: DISPLAY_FONT} );
    this.content = new HBox( {
      children: [
          fillerBox
      ],
      spacing: spacing
    } );


    // All graphic elements, curves, axes, labels, etc are placed on display node, with visibility set by accordionBox button
    this.panelOptions = {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 15,
      yMargin: 5,
      cornerRadius: 5, // radius of the rounded corners on the background
      resize: true, // dynamically resize when content bounds change
      backgroundPickable: false,
      align: 'left', // {string} horizontal of content in the pane, left|center|right
      minWidth: 0 // minimum width of the panel
    };

    this.displayPanel = new Panel( this.content, this.panelOptions );


    this.children = [ this.displayPanel, this.expandCollapseButton ];
    this.expandCollapseButton.left = 5;
    this.expandCollapseButton.top = 5;


    this.expandCollapseButton.expandedProperty.link( function ( tOrF ){
      controlPanel.displayPanel.visible = tOrF;
    } );


  }//end constructor

  return inherit( Node, ControlPanel, {
      //resetAccordionBox: function(){
      //  this.removeChild( this.accordionBox );
      //  this.accordionBox = null;
      //  this.accordionBox = new AccordionBox( this.content, this.accordionBoxOptions );
      //  this.addChild( this.accordionBox );
      //},//end setUpAccordionBox()
      setControls: function() {
        this.removeChild( this.displayPanel );
        this.displayPanel = new Panel( this.content, this.panelOptions );
        this.insertChild( 0, this.displayPanel );
      },
      setTitleBar: function( titleString ){
        this.panelTitle.text = titleString;
      },
      //change the component that this panel controls
      setControlsForSelectedPiece: function( piece ) {

        if ( piece !== null ) {
          var pieceModel;
          var type = piece.type;
          var maxNbrRays;
          var nbrOfRaysVBox;
          var diameterVBox;
          var fillerBox = new Text( ' ', {font: DISPLAY_FONT} );
          var sliderOptions = { trackSize: new Dimension2( 150, 5 ), thumbSize: new Dimension2( 12, 25 ) };
          if( type === 'fan_source' || type === 'beam_source' ){
            pieceModel = piece.pieceModel;
            maxNbrRays = pieceModel.maxNbrOfRays;
            var nbrOfRaysSlider = new HSlider( pieceModel.nbrOfRaysProperty, { min: 1, max: maxNbrRays }, sliderOptions );
            nbrOfRaysVBox = new VBox( { children: [ nbrOfRaysSlider, this.nbrOfRaysText ], align: 'center' } );
          }else{
            pieceModel = piece.pieceModel;
            var diameterSlider = new HSlider( pieceModel.diameterProperty, { min: 50, max: 250 }, sliderOptions );
            diameterVBox = new VBox( { children: [ diameterSlider, this.diameterText ]});
          }

          var checkBoxOptions = { checkBoxColorBackground: 'white' };
          var spacing = 25;
          //console.log( 'setControlsForSelectedPiece' + piece.type );
          switch( type ){
            case 'fan_source':
              var spreadSlider = new HSlider( pieceModel.spreadProperty, { min: 2, max: 180 }, sliderOptions );
              var spreadVBox = new VBox( { children: [ spreadSlider, this.spreadText ], align: 'center' } );
              this.content = new HBox( { children: [ fillerBox, nbrOfRaysVBox, spreadVBox ], spacing: spacing } );
              break;
            case 'beam_source':
              var heightSlider = new HSlider( pieceModel.heightProperty, { min: 50, max: 400 }, sliderOptions );
              var heightVBox = new VBox( { children: [ heightSlider, this.heightText ], align: 'center' } );
              this.content = new HBox( { children: [ fillerBox, nbrOfRaysVBox, heightVBox ], spacing: spacing } );
              break;
            case 'converging_lens':
              //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
              //radius of curvature R = 2*f*( n - 1 )
              var radiusSlider = new HSlider( pieceModel.radiusProperty, { min: 200, max: 800 }, sliderOptions );
              var radiusVBox = new VBox( { children: [ radiusSlider, this.radiusText ], align: 'center' } );
              var indexSlider = new HSlider( pieceModel.indexProperty, { min: 1.4, max: 2.2 }, sliderOptions );
              var indexVBox = new VBox( { children: [ indexSlider, this.indexText ], align: 'center' } );
              var focalPtCheckBox = new CheckBox( this.focalPointsText, this.showFocalPointsProperty, checkBoxOptions );
              this.content = new HBox( { children: [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox ], spacing: spacing } );
              break;
            case 'diverging_lens':
              //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
              //radius of curvature R = 2*f*( n - 1 )
              radiusSlider = new HSlider( pieceModel.radiusProperty, { min: -200, max: -800 }, sliderOptions );
              radiusVBox = new VBox( { children: [ radiusSlider, this.radiusText ], align: 'center' } );
              indexSlider = new HSlider( pieceModel.indexProperty, { min: 1.4, max: 2.2 }, sliderOptions );
              indexVBox = new VBox( { children: [ indexSlider, this.indexText ], align: 'center' } );
              focalPtCheckBox = new CheckBox( this.focalPointsText, this.showFocalPointsProperty, checkBoxOptions );
              this.content = new HBox( { children: [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox ], spacing: spacing } );
              break;
            case 'converging_mirror':
              this.content = new HBox( { children: [ fillerBox ] } );
              break;
            case 'plane_mirror':
              this.content = new HBox( { children: [ fillerBox, diameterVBox], spacing: spacing } );
              break;
            case 'diverging_mirror':
              this.content = new HBox( { children: [ fillerBox ] } );
              break;
            case 'simple_mask':
              this.content = new HBox( { children: [ fillerBox, diameterVBox], spacing: spacing } );

              break;
            case 'slit_mask':
              this.content = new HBox( { children: [ fillerBox ] } );
              break;
          }//end switch()
          //this.resetAccordionBox();
          this.setControls();
        }//end if (type != null)
      }// end setControlsForSelectedPiece()


    }//end inherit
  );
} );
