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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
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
    var controlPanel = this;
    this.mainModel = mainModel;
    this.mainView = mainView;

    this.mainView.selectedPieceProperty.link( function( piece ){
      controlPanel.setControlsForSelectedPiece( piece );
    } );


    //this.componentModel = pieceModel;
    //
    //this.diameterSlider = new HSlider( componentModel.diameterProperty, { min: 50, max: 400 } );
    //this.radiusSlider = new HSlider( componentModel.radiusProperty, { min: 200, max: 600 });
    //this.positivefSlider = new HSlider( componentModel.fProperty, { min: 50, max:500 });
    //this.negativefSlider = new HSlider( componentModel.fProperty, {min: -50, max: -500 });
    //this.indexSlider = new HSlider( componentModel.nProperty, { min: 1.3, max: 2.2 });
    //
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    this.nbrOfRaysText = new Text( 'number of rays', fontInfo );
    this.heightText = new Text( 'height', fontInfo );
    this.spreadText = new Text( 'spread in degrees', fontInfo );
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

    this.setUpAccordionBox();

    //AccordionBox.call( this, content, {
    //  lineWidth: 2,
    //  cornerRadius: 10,
    //  buttonXMargin: 12, // horizontal space between button and left|right edge of box
    //  buttonYMargin: 12,
    //  titleNode: new Text( '  Values', { font: DISPLAY_FONT, fontWeight: 'bold' } ),
    //  titleAlignX: 'left',
    //  //contentAlign: 'left',
    //  fill: PANEL_COLOR,
    //  showTitleWhenExpanded: true,
    //  contentXMargin: 20,
    //  contentYMargin: 15,
    //  contentYSpacing: 8
    //} );
  }

  return inherit( AccordionBox, ControlPanel, {
      setUpAccordionBox: function(){
        AccordionBox.call( this, this.content, {
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
        } );
      },

      //change the component that this panel controls
      setControlsForSelectedPiece: function( piece ) {
        if ( piece != null ) {
          var pieceModel;
          var type = piece.type;
          if( type === 'fan_source' || type === 'beam_source' ){
            pieceModel = piece.sourceModel;
            var nbrOfRaysSlider = new HSlider( pieceModel.nbrOfRaysProperty, {min: 1, max: 40 });
            var nbrOfRaysVBox = new VBox( { children: [ nbrOfRaysSlider, this.nbrOfRaysText ], align: 'center' } );
          }else{
            pieceModel = piece.componentModel;
          }
          var diameterSlider = new HSlider( pieceModel.diameterProperty, { min: 50, max: 400 } );
          //console.log( 'setControlsForSelectedPiece' + piece.type );
          switch( type ){
            case 'fan_source':
              var spreadSlider = new HSlider( pieceModel.spreadProperty, { min: 2, max: 90 } );
              var spreadVBox = new VBox( { children: [ spreadSlider, this.spreadText ], align: 'center' } );
              this.content = new HBox( { children: [ nbrOfRaysVBox, spreadVBox ] } );
              break;
            case 'beam_source':
              var heightSlider = new HSlider( pieceModel.heightProperty, { min: 50, max: 400 } );
              break;
            case 'converging_lens':
              //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
              //radius of curvature R = 2*f*( n - 1 )

              break;
            case 'diverging_lens':

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
          this.setUpAccordionBox();
        }//end if (type != null)
      }


    }//end inherit
  );
} );
