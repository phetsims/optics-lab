/**
 * Control panel for a particular component (lens, mirror, or mask)
 * contains sliders to set diameter, focal length (if lens or mirror) and index (if lens) of refraction of component
 * Created by dubson on 7/12/2015.
 */


define( function( require ) {
  'use strict';

  // modules
  //var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  //var CheckBox = require( 'SUN/CheckBox' );
  //var HSeparator = require( 'SUN/HSeparator' );
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
   * {ComponentModel] scomponentModel
   *
   * @constructor
   */

  function ComponentControlPanel( componentModel ) {

    this.componentModel = componentModel;

    this.diameterSlider = new HSlider( componentModel.diameterProperty, { min: 50, max: 400 } );
    this.fSlider = new HSlider( componentModel.fProperty, { min: 50, max:500 });
    this.indexSlider = new HSlider( componentModel.nProperty, { min: 1.3, max: 2.2 });

    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    this.diameterText = new Text( 'diameter', fontInfo );
    this.focalLengthText = new Text( 'focal length', fontInfo );
    this.indexText = new Text( 'refractive index', fontInfo );

    var diameterVBox = new VBox( { children: [ this.diameterSlider, this.diameterText ], align: 'center' } );
    var focalLengthVBox = new VBox( { children: [ this.fSlider, this.focalLengthText ], align: 'center' } );
    var indexVBox = new VBox( { children: [ this.indexSlider, this.indexText ], align: 'center' } );

    var spacing = 35;
    var content = new HBox( {
      children: [
        diameterVBox,
        focalLengthVBox,
        indexVBox
      ],
      spacing: spacing
    } );



    Panel.call( this, content, {xMargin: 15, yMargin: 15, lineWidth: 2, fill: PANEL_COLOR} );
  }

  return inherit( Panel, ComponentControlPanel, {

      //change the component that this panel controls
      setComponent: function( componentModel ) {
          this.componentModel = componentModel;
      },
      getShape: function(){

      }


    }//end inherit
  );
} );
