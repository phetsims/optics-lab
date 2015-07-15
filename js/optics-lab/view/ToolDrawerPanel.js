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
  //var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  //var HStrut = require( 'SCENERY/nodes/HStrut' );
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
  var PANEL_COLOR = '#ccc';

  /**
   * {vector2] startDir = direction of starting ray
   *
   * @constructor
   */

  function ToolDrawerPanel( mainModel ) {

    this.mainModel = mainModel;
    var toolDrawerPanel = this;

    //var nodeOptions = { fill: 'red', cursor: 'pointer' };

    var fanSourceIcon = new Node( );
    var beamSourceIcon = new Node();
    var convergingLensIcon = new Node();
    var divergingLensIcon = new Node();
    var convergingMirrorIcon = new Node();
    var planeMirrorIcon = new Node();
    var divergingMirrorIcon = new Node();
    var simpleMaskIcon = new Node();
    var slitMaskIcon = new Node();
    //var rulerCheckBox = new CheckBox();
    //var protractorCheckBox = new CheckBox();

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

    var nodeArray = [
      fanSourceIcon,
      beamSourceIcon,
      convergingLensIcon,
      divergingLensIcon,
      convergingMirrorIcon,
      planeMirrorIcon,
      divergingMirrorIcon,
      simpleMaskIcon,
      slitMaskIcon
    ];

    var textArray = [
      fanSourceText,
      beamSourceText,
      convergingLensText,
      divergingLensText,
      convergingMirrorText,
      planeMirrorText,
      divergingMirrorText,
      simpleMaskText,
      slitMaskText
    ];

    var nodeSetup = function( element, index, array ){
      //Rectangle = function Rectangle( x, y, width, height, arcWidth, arcHeight, options )
      var xCorner = -8;
      var yCorner = textArray[ index ].height;
      var elementWidth = textArray[ index ].width + 16;
      var elementHeight = textArray[ index ].height + 10;
      element.addChild( textArray[ index ] );
      element.addChild( new Rectangle( xCorner, -yCorner, elementWidth, elementHeight, { fill:'green', cursor: 'pointer', opacity: 0 }));

      element.addInputListener( new SimpleDragHandler(
        {

          allowTouchSnag: true,

          start: function( e ) {
            var mouseDownPosition = e.pointer.point;
            console.log( 'pressed at ' + mouseDownPosition );
          },

          drag: function( e ) {
            //var v1 = element.globalToParentPoint( e.pointer.point );   //returns Vector2
            var v1 = e.pointer.point;
            console.log( 'dragging postion is ' + v1 );

          },
          end: function( e ){
            //var vEnd = element.globalToParentPoint( e.pointer.point );
            var vEnd = e.pointer.point;
            console.log( 'released at ' +  vEnd );
            console.log( 'visibleBounds are ' + toolDrawerPanel.visibleBounds );
            if( toolDrawerPanel.visibleBounds.containsCoordinates( vEnd.x, vEnd.y )){
              console.log( ' within Bounds' );
            }else{
              console.log( 'NOT within Bounds' );
            }
          }
        }

      ));
    };


    nodeArray.forEach( nodeSetup );



    //fanSourceIcon.addChild( fanSourceText );
    //beamSourceIcon.addChild( beamSourceText );
    //convergingLensIcon.addChild( convergingLensText );
    //divergingLensIcon.addChild( divergingLensText );
    //convergingMirrorIcon.addChild( convergingMirrorText );
    //planeMirrorIcon.addChild( planeMirrorText );
    //divergingMirrorIcon.addChild( divergingMirrorText );
    //simpleMaskIcon.addChild( simpleMaskText );
    //slitMaskIcon.addChild( slitMaskText );


    //Set up drag handlers


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
    //var toolVBox = new VBox( {
    //  children:[
    //    rulerCheckBox,
    //    protractorCheckBox
    //  ],
    //  align: 'left',
    //  spacing: spacing
    //});
    spacing = 30;
    var content = new HBox( {
      children:[
        sourceVBox,
        lensVBox,
        mirrorVBox,
        maskVBox
      ],
      align:'top',
      spacing: spacing
    });



    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );


    Panel.call( this, content, { xMargin: 30, yMargin: 15, lineWidth: 2, fill: PANEL_COLOR } );
  }//end constructor

  return inherit( Panel, ToolDrawerPanel, {
      myFunction: function() {

      }


    }//end inherit
  );
} );
