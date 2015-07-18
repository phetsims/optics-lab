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
  //var CheckBox = require( 'SUN/CheckBox' );
  //var HSeparator = require( 'SUN/HSeparator' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'OPTICS_LAB/optics-lab/common/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var TEXT_COLOR = Util.TEXT_COLOR;
  var PANEL_COLOR = Util.PANEL_COLOR;
  //var BACKGROUND_COLOR = Util.BACKGROUND_COLOR;


  /**
   * {ComponentModel] componentModel
   *
   * @constructor
   */

  function ControlPanel( mainModel, mainView ) {

    Node.call( this );
    var controlPanel = this;
    this.mainModel = mainModel;
    this.mainView = mainView;

    this.mainView.selectedPieceProperty.link( function( piece ){
      if( piece != null ){
        //console.log( 'calling setControls for piece ' + piece.type );
        controlPanel.setControlsForSelectedPiece( piece );
      }
    } );

    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    this.nbrOfRaysText = new Text( 'number of rays', fontInfo );
    this.heightText = new Text( 'height', fontInfo );
    this.spreadText = new Text( 'spread', fontInfo );
    this.diameterText = new Text( 'diameter', fontInfo );
    this.radiusText = new Text( 'radius of curvature', fontInfo );
    this.focalLengthText = new Text( 'focal length', fontInfo );
    this.indexText = new Text( 'refractive index', fontInfo );
    //
    //var diameterVBox = new VBox( { children: [ this.diameterSlider, this.diameterText ], align: 'center' } );
    //var focalLengthVBox = new VBox( { children: [ this.positivefSlider, this.focalLengthText ], align: 'center' } );
    //var indexVBox = new VBox( { children: [ this.indexSlider, this.indexText ], align: 'center' } );

    var spacing = 35;
    this.content = new HBox( {
      children: [
          new Text( 'filler', {font: DISPLAY_FONT})
      ],
      spacing: spacing
    } );

    this.accordionBoxOptions = {
      lineWidth: 2,
      cornerRadius: 10,
      buttonXMargin: 12, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( '  Values', { font: DISPLAY_FONT, fontWeight: 'bold' } ),
      titleAlignX: 'left',
      //contentAlign: 'left',
      fill: PANEL_COLOR,
      showTitleWhenExpanded: true,
      contentXMargin: 20,
      contentYMargin: 15,
      contentYSpacing: 8
    };

    this.accordionBox = new AccordionBox( this.content, this.accordionBoxOptions );
    this.addChild( this.accordionBox );

  }//end constructor

  return inherit( Node, ControlPanel, {
      resetAccordionBox: function(){
        this.removeChild( this.accordionBox );
        this.accordionBox = null;
        this.accordionBox = new AccordionBox( this.content, this.accordionBoxOptions );
        this.addChild( this.accordionBox );
      },//end setUpAccordionBox()

      //change the component that this panel controls
      setControlsForSelectedPiece: function( piece ) {

        if ( piece != null ) {
          var pieceModel;
          var type = piece.type;
          var sliderOptions = { trackSize: new Dimension2( 200, 5 ) };
          if( type === 'fan_source' || type === 'beam_source' ){
            pieceModel = piece.sourceModel;
            var nbrOfRaysSlider = new HSlider( pieceModel.nbrOfRaysProperty, { min: 1, max: 40 }, sliderOptions );
            var nbrOfRaysVBox = new VBox( { children: [ nbrOfRaysSlider, this.nbrOfRaysText ], align: 'center' } );
          }else{
            pieceModel = piece.componentModel;
            var diameterSlider = new HSlider( pieceModel.diameterProperty, { min: 50, max: 400 }, sliderOptions );
            var diameterVBox = new VBox( { children: [ diameterSlider, this.diameterText ]});
          }

          //console.log( 'setControlsForSelectedPiece' + piece.type );
          switch( type ){
            case 'fan_source':
              var spreadSlider = new HSlider( pieceModel.spreadProperty, { min: 2, max: 180 }, sliderOptions );
              var spreadVBox = new VBox( { children: [ spreadSlider, this.spreadText ], align: 'center' } );
              this.content = new HBox( { children: [ nbrOfRaysVBox, spreadVBox ], spacing: 40 } );
              break;
            case 'beam_source':
              var heightSlider = new HSlider( pieceModel.heightProperty, { min: 50, max: 400 }, sliderOptions );
              var heightVBox = new VBox( { children: [ heightSlider, this.heightText ], align: 'center' } );
              this.content = new HBox( { children: [ nbrOfRaysVBox, heightVBox ], spacing: 40 } );
              break;
            case 'converging_lens':
              //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
              //radius of curvature R = 2*f*( n - 1 )
              var radiusSlider = new HSlider( pieceModel.radiusProperty, { min: 200, max: 800 }, sliderOptions );
              var radiusVBox = new VBox( { children: [ radiusSlider, this.radiusText ], align: 'center' } );
              var indexSlider = new HSlider( pieceModel.indexProperty, { min: 1.4, max: 2.2 }, sliderOptions );
              var indexVBox = new VBox( { children: [ indexSlider, this.indexText ], align: 'center' } );
              this.content = new HBox( { children: [ diameterVBox, radiusVBox, indexVBox ], spacing: 40 } );
              break;
            case 'diverging_lens':
              //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
              //radius of curvature R = 2*f*( n - 1 )
              var radiusSlider = new HSlider( pieceModel.radiusProperty, { min: 200, max: 800 }, sliderOptions );
              var radiusVBox = new VBox( { children: [ radiusSlider, this.radiusText ], align: 'center' } );
              var indexSlider = new HSlider( pieceModel.indexProperty, { min: 1.4, max: 2.2 }, sliderOptions );
              var indexVBox = new VBox( { children: [ indexSlider, this.indexText ], align: 'center' } );
              this.content = new HBox( { children: [ diameterVBox, radiusVBox, indexVBox ], spacing: 40 } );

              break;
            case 'converging_mirror':
              break;
            case 'plane_mirror':

              break;
            case 'diverging_mirror':
              break;
            case 'simple_mask':

              break;
            case 'slit_mask':
              break;
          }//end switch()
          this.resetAccordionBox();
        }//end if (type != null)
      }// end setControlsForSelectedPiece()


    }//end inherit
  );
} );
