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
  //var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  //var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SelectedPieceControlPanel = require( 'OPTICS_LAB/optics-lab/view/SelectedPieceControlPanel' );
  //var Text = require( 'SCENERY/nodes/Text' );
  //var Util = require( 'OPTICS_LAB/optics-lab/common/Util' );
  //var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  //var DISPLAY_FONT = new PhetFont( 12 );
  //var TEXT_COLOR = Util.TEXT_COLOR;
  //var PANEL_COLOR = Util.PANEL_COLOR;
  //var BACKGROUND_COLOR = Util.BACKGROUND_COLOR;


  /**
   * {ComponentModel] pieceModel
   *
   * @constructor
   */

  function ControlPanelManager( mainModel, mainView ) {

    Node.call( this );
    var controlPanelManager = this;
    this.mainModel = mainModel;
    this.mainView = mainView;
    this.controlPanels = new ObservableArray();     //one display for each piece on the stage, only display of selected piece is visible
    this.pieces = new ObservableArray();
    this.selectedPiece = new Node();
    //this.expandedProperty = new Property( true );


      this.mainView.selectedPieceProperty.link(function (piece) {
          if (piece !== null) {
              controlPanelManager.selectedPiece = piece;
          }
      });

      //need any content to initialize position
      //var myCircle = new Circle( 25, { fill: 'yellow'} ) ;
      var filler = new Rectangle( 0, 0, 10, 10, { fill: 'yellow', opacity: 0.0 } );
      this.addChild( filler );

    // All controls are placed on display node, with visibility set by accordionBox button



  }//end constructor

    return inherit(Node, ControlPanelManager, {

            displayControlPanelForNewPiece: function ( piece ) {

                var newPanel = new SelectedPieceControlPanel( this.mainModel, this.mainView, piece);
                this.controlPanels.add( newPanel );
                this.pieces.add( piece );

                //var myCircle = new Circle( 20, { fill: 'red'} ) ;
                this.addChild( newPanel );
                //this.hideAllControlPanels();
                //newPanel.visible = true;
            },
            disposeOfControlPanelForDeletedPiece: function ( piece ) {
                var panelIndex = this.getIndexOfPanelOfSelectedPiece();
                var panelToDelete = this.controlPanels.get( panelIndex );
                panelToDelete.visible = false;
                panelToDelete.dispose();
                this.controlPanels.remove( panelToDelete );
                this.pieces.remove( piece );
            },
            //hideAllControlPanels: function () {
            //    for (var i = 0; i < this.controlPanels.length; i++) {
            //        this.controlPanels.get( i ).visible = false;
            //    }
            //},
            getIndexOfPanelOfSelectedPiece: function () {
                var selectedPanelIndex;
                for (var i = 0; i < this.controlPanels.length; i++) {
                    if ( this.controlPanels.get( i ).selectedPiece === this.selectedPiece ) {
                        selectedPanelIndex = i;
                        return selectedPanelIndex;
                    }
                }
            }

            //setControls: function () {
            //    this.removeChild(this.displayPanel);
            //    this.displayPanel = new Panel(this.content, this.panelOptions);
            //    this.insertChild(0, this.displayPanel);
            //},
            //setTitleBar: function (titleString) {
            //    this.panelTitle.text = titleString;
            //}


        }//end inherit
    );
} );
