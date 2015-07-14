/**
 * Toolbox for selecting light sources, lenses, mirrors, and masks
 * Click on icon to drag sources or component onto stage
 * Drag component back to toolbox to delete from stage
 * Created by dubson on 7/14/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );

  //constants
  var DISPLAY_FONT = new PhetFont( 15 );
  var PANEL_COLOR = '#999';

  /**
   * {vector2] startDir = direction of starting ray
   *
   * @constructor
   */

  function ToolDrawerPanel( mainModel ) {

    var fanSourceIcon = new Node();
    var beamSourceIcon = new Node();
    var convergingLensIcon = new Node();
    var divergingLensIcon = new Node();
    var convergingMirrorIcon = new Node();
    var planeMirrorIcon = new Node();
    var divergingMirrorIcon = new Node();
    var simpleMaskIcon = new Node();
    var slitMaskIcon = new Node();
    var rulerCheckBox = new CheckBox();
    var protractorCheckBox = new CheckBox();

    var fontInfo = { font: DISPLAY_FONT };
    var fanSourceText = new Text( 'fan source', fontInfo );
    var beamSourceText = new Text( 'beam source', fontInfo );
    var convergingLensText = new Text( 'converging lens', fontInfo );
    var divergingLensText = new Text( 'diverging lens', fontInfo );
    var convergingMirrorText = new Text( 'converging mirror', fontInfo );
    var planeMirrorText = new Text( 'plane mirror', fontInfo );
    var divergingMirrorText = new Text( 'diverging mirror', fontInfo );
    var simpleMaskText = new Text( 'simple mask', fontInfo );
    var slitMaskText = new Text( 'slit mask', fontInfo );

    fanSourceIcon.addChild( fanSourceText );
    beamSourceIcon.addChild( beamSourceText );
    convergingLensIcon.addChild( convergingLensText );
    divergingLensIcon.addChild( divergingLensText );
    convergingMirrorIcon.addChild( convergingMirrorText );
    planeMirrorIcon.addChild( planeMirrorText );
    divergingLensIcon.addChild( divergingLensText );
    simpleMaskIcon.addChild( simpleMaskText );
    slitMaskIcon.addChild( slitMaskIcon );

    var spacing = 10;
    var sourceVBox = new VBox( {
      children:[
        fanSourceIcon,
        beamSourceIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var lensVBox = new VBox( {
      children:[
        convergingLensIcon,
        divergingLensIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var mirrorVBox = new VBox( {
      children:[
        convergingMirrorIcon,
        planeMirrorIcon,
        divergingMirrorIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var maskVBox = new VBox( {
      children:[
        simpleMaskIcon,
        slitMaskIcon
      ],
      align: 'left',
      spacing: spacing
    });
    var toolVBox = new VBox( {
      children:[
        rulerCheckBox,
        protractorCheckBox
      ],
      align: 'left',
      spacing: spacing
    });
    var content = new HBox( {
      children:[
        sourceVBox,
        lensVBox,
        mirrorVBox,
        maskVBox
      ],
      spacing: spacing
    });



    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );


    Panel.call( this, content, { xMargin: 15, yMargin: 15, lineWidth: 2, fill: PANEL_COLOR } );
  }//end constructor

  return inherit( Panel, ToolDrawerPanel, {
      myFunction: function() {

      }


    }//end inherit
  );
} );
