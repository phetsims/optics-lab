/**
 * Created by Dubson on 8/9/2015.
 */
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
    var ControlPanel2 = require( 'OPTICS_LAB/optics-lab/view/ControlPanel2' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    //var Property = require( 'AXON/Property' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );

    //var Text = require( 'SCENERY/nodes/Text' );
    //var Util = require( 'OPTICS_LAB/optics-lab/common/Util' );
    //var VBox = require( 'SCENERY/nodes/VBox' );

    // constants


    /**
     * {ComponentModel] pieceModel
   *
     * @constructor
     */

    function ControlPanelManager2( mainModel, mainView ) {

        Node.call( this );
        var controlPanelManager2 = this;
        this.mainModel = mainModel;
        this.mainView = mainView;
        this.controlPanels = [];     //one display for each piece on the stage, only display of selected piece is visible
        this.pieces = new ObservableArray();
        this.selectedPiece = new Node();
        this.selectedPieceType;
        this.previousRaysUpdate;
        this.previousSpreadUpdate;
        this.previousColorUpdate;
        this.previousDiameterUpdate;
        this.previousRadiusOfCurvatureUpdate;
        this.previousIndexOfRefractionUpdate;
        this.previousShowFocalPointsUpdate;
        this.previousDisplayFocalLengthUpdate;
        //this.expandedProperty = new Property( true );
        this.typeArray = [
            'fan_source',
            'beam_source',
            'converging_lens',
            'diverging_lens',
            'converging_mirror',
            'plane_mirror',
            'diverging_mirror',
            'simple_mask',
            'slit_mask'
        ];

        for( var i = 0; i < this.typeArray.length; i++ ){
            var newControlPanel = new ControlPanel2( mainModel, mainView, this.typeArray[i]);
            this.controlPanels[i]= newControlPanel;
            this.addChild( newControlPanel );
        }


        this.mainView.selectedPieceProperty.lazyLink(function (piece) {
            controlPanelManager2.selectedPiece = piece;
            controlPanelManager2.selectedPieceType = piece.type;
            controlPanelManager2.linkControls();
        });


        //need any content to initialize position
        //var myCircle = new Circle( 25, { fill: 'yellow'} ) ;
        //var filler = new Rectangle( 0, 0, 10, 10, { fill: 'yellow', opacity: 0.0 } );
        //this.addChild( filler );

        // All controls are placed on display node, with visibility set by accordionBox button

    }//end constructor

    return inherit(Node, ControlPanelManager2, {
            getIndex: function (type) {
                var index;
                for (var i = 0; i < this.typeArray.length; i++) {
                    if ( this.controlPanels[i].type === type ) {
                        index = i;
                    }
                }
                return index;
            },
            linkControls: function(){
                var type = this.selectedPieceType;
                var piece = this.selectedPiece;
                var controlPanel = this.controlPanels[ this.getIndex( type )];
                var controlPanelManager = this;

                function raysUpdate( nbrOfRays ){
                    piece.pieceModel.nbrOfRaysProperty.value = Math.round( nbrOfRays );
                }
                function spreadUpdate( spread ){
                    piece.pieceModel.spreadProperty.value = Math.round( spread );
                }
                function colorUpdate( colorString ){
                    piece.colorProperty.value = colorString;
                }
                function widthUpdate( width ){
                    piece.pieceModel.widthProperty.value = width;
                }
                function diameterUpdate( diameter ){
                    piece.pieceModel.diameterProperty.value = diameter;
                }
                function radiusOfCurvatureUpdate( radius ){
                    piece.pieceModel.radiusProperty.value = radius;
                }
                function indexOfRefractionUpdate( index ){
                    piece.pieceModel.indexProperty.value = index;
                }
                function showFocalPointsUpdate( tOrF ){
                    piece.showFocalPointsProperty.value = tOrF;
                }
              //TODO optics-lab#3 defined but never used
              //  function displayFocalLength( focalLength ){
              //
              //  }
              //TODO optics-lab#3 defined but never used
              //  var resetPanel = function( property, previousUpdate, update, attribute ){
              //      property.unlink( previousUpdate );
              //      property.value = attribute;
              //      property.link( update );
              //      //controlPanelManager.previousUpdate = update;
              //  };
              function unlinkAll(){
                controlPanel.nbrOfRaysProperty.unlink( controlPanelManager.previousRaysUpdate );
                controlPanel.spreadProperty.unlink( controlPanelManager.previousSpreadUpdate );
                controlPanel.colorProperty.unlink( controlPanelManager.previousColorUpdate );
                controlPanel.widthProperty.unlink( controlPanelManager.previousWidthUpdate );
                controlPanel.diameterProperty.unlink( controlPanelManager.previousDiameterUpdate );
                controlPanel.radiusOfCurvatureProperty.unlink( controlPanelManager.previousRadiusOfCurvatureUpdate );
                controlPanel.indexOfRefractionProperty.unlink( controlPanelManager.previousIndexOfRefractionUpdate );
                controlPanel.showFocalPointsProperty.unlink( controlPanelManager.previousShowFocalPointsUpdate );
              }
              function setAllPanelsAndLinkAll(){
                if( piece.pieceModel.nbrOfRays !== undefined ){
                  controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRays;
                  controlPanel.nbrOfRaysProperty.link( raysUpdate );
                }
                if( piece.pieceModel.spread !== undefined ){
                  controlPanel.spreadProperty.value = piece.pieceModel.spread;
                  controlPanel.spreadProperty.link( spreadUpdate );
                }
                if( piece.colorProperty !== undefined ){
                  controlPanel.colorProperty.value = piece.colorProperty.value;
                  controlPanel.colorProperty.link( colorUpdate );
                }
                if( piece.pieceModel.width !== undefined ){
                  controlPanel.widthProperty.value = piece.pieceModel.width;
                  controlPanel.widthProperty.link( widthUpdate );
                }
                if( piece.pieceModel.diameter !== undefined ){
                  controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                  controlPanel.diameterProperty.link( diameterUpdate );
                }
                if( piece.pieceModel.radius !== undefined ){
                  controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
                  controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
                }
                if( piece.pieceModel.index !== undefined ){
                  controlPanel.indexOfRefractionProperty.value = piece.pieceModel.index;
                  controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
                }
                if( piece.showFocalPointsProperty !== undefined ){
                  controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
                  controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
                }
              }
              //function linkAll(){
              //  controlPanel.nbrOfRaysProperty.link( raysUpdate );
              //  controlPanel.spreadProperty.link( spreadUpdate );
              //  controlPanel.colorProperty.link( colorUpdate );
              //  controlPanel.widthProperty.link( widthUpdate );
              //  controlPanel.diameterProperty.link( diameterUpdate );
              //  controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
              //  controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
              //  controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
              //}
              function setPreviousUpdates(){
                controlPanelManager.previousRaysUpdate = raysUpdate;
                controlPanelManager.previousSpreadUpdate = spreadUpdate;
                controlPanelManager.previousColorUpdate = colorUpdate;
                controlPanelManager.previousWidthUpdate = widthUpdate;
                controlPanelManager.previousDiameterUpdate = diameterUpdate;
                controlPanelManager.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
                controlPanelManager.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
                controlPanelManager.previousShowFocalPointsUpdate = showFocalPointsUpdate;

              }
              unlinkAll();
              setAllPanelsAndLinkAll();
              //linkAll();
              setPreviousUpdates();

                //switch( type ){
                //    case 'fan_source':
                //        //resetPanel(
                //        //    controlPanel.nbrOfRaysProperty,
                //        //    controlPanelManager.previousRaysUpdate,
                //        //    raysUpdate,
                //        //    piece.pieceModel.nbrOfRays
                //        //);
                //        //controlPanel.nbrOfRaysProperty.unlink( this.previousRaysUpdate );
                //        controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRays;
                //        controlPanel.nbrOfRaysProperty.link( raysUpdate );
                //        this.previousRaysUpdate = raysUpdate;
                //        //resetPanel(
                //        //    controlPanel.spreadProperty,
                //        //    controlPanelManager.previousSpreadUpdate,
                //        //    spreadUpdate,
                //        //    piece.pieceModel.spread
                //        //);
                //        //controlPanel.spreadProperty.unlink( this.previousSpreadUpdate );
                //        controlPanel.spreadProperty.value = piece.pieceModel.spread;
                //        controlPanel.spreadProperty.link( spreadUpdate );
                //        this.previousSpreadUpdate = spreadUpdate;
                //
                //        //controlPanel.colorProperty.unlink( this.previousColorUpdate );
                //        controlPanel.colorProperty.value = piece.colorProperty.value;
                //        controlPanel.colorProperty.link( colorUpdate );
                //        this.previousColorUpdate = colorUpdate;
                //        break;
                //    case 'beam_source':
                //        //controlPanel.nbrOfRaysProperty.unlink( this.previousRaysUpdate );
                //        controlPanel.nbrOfRaysProperty.value = piece.pieceModel.nbrOfRays;
                //        controlPanel.nbrOfRaysProperty.link( raysUpdate );
                //        this.previousRaysUpdate = raysUpdate;
                //        //controlPanel.widthProperty.unlink( this.previousWidthUpdate );
                //        controlPanel.widthProperty.value = piece.pieceModel.width;
                //        controlPanel.widthProperty.link( widthUpdate );
                //        this.previousWidthUpdate = widthUpdate;
                //        //controlPanel.colorProperty.unlink( this.previousColorUpdate );
                //        controlPanel.colorProperty.value = piece.colorProperty.value;
                //        controlPanel.colorProperty.link( colorUpdate );
                //        this.previousColorUpdate = colorUpdate;
                //        break;
                //    case 'converging_lens':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
                //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
                //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
                //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
                //        controlPanel.indexOfRefractionProperty.unlink( this.previousIndexOfRefractionUpdate );
                //        controlPanel.indexOfRefractionProperty.value = piece.pieceModel.index;
                //        controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
                //        this.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
                //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
                //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
                //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
                //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
                //        break;
                //    case 'diverging_lens':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
                //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
                //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
                //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
                //        controlPanel.indexOfRefractionProperty.unlink( this.previousIndexOfRefractionUpdate );
                //        controlPanel.indexOfRefractionProperty.value = piece.pieceModel.index;
                //        controlPanel.indexOfRefractionProperty.link( indexOfRefractionUpdate );
                //        this.previousIndexOfRefractionUpdate = indexOfRefractionUpdate;
                //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
                //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
                //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
                //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
                //        break;
                //    case 'converging_mirror':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
                //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
                //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
                //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
                //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
                //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
                //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
                //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
                //        break;
                //    case 'plane_mirror':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        break;
                //    case 'diverging_mirror':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        controlPanel.radiusOfCurvatureProperty.unlink( this.previousRadiusOfCurvatureUpdate );
                //        controlPanel.radiusOfCurvatureProperty.value = piece.pieceModel.radius;
                //        controlPanel.radiusOfCurvatureProperty.link( radiusOfCurvatureUpdate );
                //        this.previousRadiusOfCurvatureUpdate = radiusOfCurvatureUpdate;
                //        controlPanel.showFocalPointsProperty.unlink( this.previousShowFocalPointsUpdate );
                //        controlPanel.showFocalPointsProperty.value = piece.showFocalPointsProperty.value;
                //        controlPanel.showFocalPointsProperty.link( showFocalPointsUpdate );
                //        this.previousShowFocalPointsUpdate = showFocalPointsUpdate;
                //        break;
                //    case 'simple_mask':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        break;
                //    case 'slit_mask':
                //        controlPanel.diameterProperty.unlink( this.previousDiameterUpdate );
                //        controlPanel.diameterProperty.value = piece.pieceModel.diameter;
                //        controlPanel.diameterProperty.link( diameterUpdate );
                //        this.previousDiameterUpdate = diameterUpdate;
                //        break;
                //}//end switch
            }//end linkControls()


            //setTitleBar: function (titleString) {
            //    this.panelTitle.text = titleString;
            //}


        }//end inherit
    );
} );
