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
 * Created by dubson on 7/12/2015.
 */


define( function ( require ) {
    'use strict';

    // modules
    var AquaRadioButton = require('SUN/AquaRadioButton');
    var CheckBox = require('SUN/CheckBox');
    var Dimension2 = require('DOT/Dimension2');
    var ExpandCollapseButton = require('SUN/ExpandCollapseButton');
    var HBox = require('SCENERY/nodes/HBox');
    var HSlider = require('SUN/HSlider');
    //var HStrut = require('SCENERY/nodes/HStrut');
    var inherit = require('PHET_CORE/inherit');
    var Node = require('SCENERY/nodes/Node');
    //var ObservableArray = require('AXON/ObservableArray');
    var Panel = require('SUN/Panel');
    var PhetFont = require('SCENERY_PHET/PhetFont');
    var Property = require('AXON/Property');
    var Text = require('SCENERY/nodes/Text');
    var Util = require('OPTICS_LAB/optics-lab/common/Util');
    var VBox = require('SCENERY/nodes/VBox');

    // constants
    var DISPLAY_FONT = new PhetFont(12);
    var TEXT_COLOR = Util.TEXT_COLOR;
    //var PANEL_COLOR = Util.PANEL_COLOR;
    //var BACKGROUND_COLOR = Util.BACKGROUND_COLOR;


    /**
     * @param mainModel
     * @param mainView
     * @param selectedPiece
     * @constructor
     */
    function SelectedPieceControlPanel( mainModel, mainView, selectedPiece ) {

        Node.call( this );
        var thisControlPanel = this;
        this.mainModel = mainModel;
        this.mainView = mainView;
        this.selectedPiece = selectedPiece;
        this.expandedProperty = new Property( true );
        this.hSliders = []; //array of HSliders in this control panel, used solely for garbage collection


        //initialize source rays color radio buttons
        var fontInfo = {font: DISPLAY_FONT};
        this.whiteText = new Text('white', fontInfo);
        this.greenText = new Text('green', fontInfo);
        this.redText = new Text('red', fontInfo);
        this.yellowText = new Text('yellow', fontInfo);

        fontInfo = {font: DISPLAY_FONT, fill: TEXT_COLOR};
        this.nbrOfRaysText = new Text('number of rays', fontInfo);
        this.focalPointsText = new Text('focal points', fontInfo);
        this.heightText = new Text('height', fontInfo);
        this.spreadText = new Text('spread', fontInfo);
        this.diameterText = new Text('diameter', fontInfo);
        this.radiusText = new Text('radius of curvature', fontInfo);
        this.focalLengthText = new Text('f : ', fontInfo);
        this.focalLengthReadoutText = new Text('filler', fontInfo);
        this.indexText = new Text('refractive index', fontInfo);
        this.expandCollapseButton = new ExpandCollapseButton(this.expandedProperty, {
            sideLength: 15,
            cursor: 'pointer'
        });


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
        //test code follows
        //var spacing = 35;
        //var fillerBox = new Text( 'filler', {font: DISPLAY_FONT} );
        ////content of the current display
        //this.content = new HBox( {
        //    children: [
        //        fillerBox
        //    ],
        //    spacing: spacing
        //} );
        //this.displayPanel = new Panel(this.content, this.panelOptions);
        //this.children = [this.displayPanel, this.expandCollapseButton];
        //this.expandCollapseButton.left = 5;
        //this.expandCollapseButton.top = 5;
        //end test code

        this.expandCollapseButton.expandedProperty.link( function( tOrF ) {
            thisControlPanel.displayPanel.visible = tOrF;
        });

        //commented out for test
        this.mainView.selectedPieceProperty.link( function( piece ){
            thisControlPanel.visible = ( piece === thisControlPanel.selectedPiece );
            //console.log( 'calling setControls for piece ' + piece.type );
        } );


    }//end constructor

    return inherit( Node, SelectedPieceControlPanel, {

        setTitleBar: function( titleString ){
            this.panelTitle.text = titleString;
        },
        //change the piece that this panel controls
        setControlsForSelectedPiece: function () {
            if ( this.selectedPiece !== null ) {
                var piece = this.selectedPiece;
                var pieceModel = piece.pieceModel;
                var type = piece.type;
                var fillerBox = new Text(' ', {font: DISPLAY_FONT});
                var nbrOfRaysVBox;
                var diameterVBox;
                var sliderOptions = {trackSize: new Dimension2(120, 5), thumbSize: new Dimension2(12, 25)};
                if ( type === 'fan_source' || type === 'beam_source' ) {
                    //pieceModel = piece.pieceModel;
                    var maxNbrRays = pieceModel.maxNbrOfRays;
                    var nbrOfRaysSlider = new HSlider( pieceModel.nbrOfRaysProperty, {
                        min: 1,
                        max: maxNbrRays
                    }, sliderOptions );
                    nbrOfRaysVBox = new VBox({children: [nbrOfRaysSlider, this.nbrOfRaysText], align: 'center'});
                    this.setColorRadioButtonsForSourceNode(piece);
                } else {   //if piece = component
                    var diameterSlider = new HSlider(pieceModel.diameterProperty, {min: 50, max: 250}, sliderOptions);
                    diameterVBox = new VBox({children: [diameterSlider, this.diameterText]});
                    this.focalLengthReadoutText.text = pieceModel.f.toFixed(0);
                    var thisControlPanel = this;
                    pieceModel.fProperty.link( function() {
                        thisControlPanel.focalLengthReadoutText.text = pieceModel.f.toFixed(0);
                        //console.log( 'focalLength' + focalLength.toFixed(0)  );
                    });
                }

                var checkBoxOptions = {checkBoxColorBackground: 'white'};
                var spacing = 25;
                //console.log( 'setControlsForSelectedPiece' + piece.type );
                var focalLengthHBox = new HBox({
                    children: [this.focalLengthText, this.focalLengthReadoutText],
                    spacing: 2
                });
                switch (type) {
                    case 'fan_source':
                        var spreadSlider = new HSlider(pieceModel.spreadProperty, {min: 2, max: 180}, sliderOptions);
                        var spreadVBox = new VBox({children: [spreadSlider, this.spreadText], align: 'center'});
                        this.content = new HBox({
                            children: [ fillerBox, nbrOfRaysVBox, spreadVBox, this.colorVBox1, this.colorVBox2],
                            spacing: spacing,
                            resize: false
                        });
                        break;
                    case 'beam_source':
                        var heightSlider = new HSlider(pieceModel.heightProperty, {min: 50, max: 250}, sliderOptions);
                        var heightVBox = new VBox({children: [heightSlider, this.heightText], align: 'center'});
                        this.content = new HBox({
                            children: [fillerBox, nbrOfRaysVBox, heightVBox, this.colorVBox1, this.colorVBox2],
                            spacing: spacing,
                            resize: false
                        });
                        break;
                    case 'converging_lens':
                        //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
                        //radius of curvature R = 2*f*( n - 1 )
                        var radiusSlider = new HSlider(pieceModel.radiusProperty, {min: 100, max: 800}, sliderOptions);
                        this.hSliders.push(radiusSlider);
                        var radiusVBox = new VBox({children: [radiusSlider, this.radiusText], align: 'center'});
                        var indexSlider = new HSlider(pieceModel.indexProperty, {min: 1.4, max: 3}, sliderOptions);
                        this.hSliders.push(indexSlider);
                        var indexVBox = new VBox({children: [indexSlider, this.indexText], align: 'center'});
                        var focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
                        this.content = new HBox({
                            children: [fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox],
                            spacing: spacing,
                            resize: false
                        });
                        break;
                    case 'diverging_lens':
                        //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
                        //radius of curvature R = 2*f*( n - 1 )
                        radiusSlider = new HSlider(pieceModel.radiusProperty, {min: -100, max: -800}, sliderOptions);
                        this.hSliders.push(radiusSlider);
                        radiusVBox = new VBox({children: [radiusSlider, this.radiusText], align: 'center'});
                        indexSlider = new HSlider(pieceModel.indexProperty, {min: 1.4, max: 3}, sliderOptions);
                        this.hSliders.push(indexSlider);
                        indexVBox = new VBox({children: [indexSlider, this.indexText], align: 'center'});
                        focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
                        this.content = new HBox({
                            children: [fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox],
                            spacing: spacing,
                            resize: false
                        });
                        break;
                    case 'converging_mirror':
                        radiusSlider = new HSlider(pieceModel.radiusProperty, {min: 200, max: 1600}, sliderOptions);
                        this.hSliders.push(radiusSlider);
                        radiusVBox = new VBox({children: [radiusSlider, this.radiusText], align: 'center'});
                        focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
                        this.content = new HBox({
                            children: [fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox],
                            spacing: spacing,
                            resize: false
                        });
                        break;
                    case 'plane_mirror':
                        this.content = new HBox({children: [fillerBox, diameterVBox], spacing: spacing});
                        break;
                    case 'diverging_mirror':
                        radiusSlider = new HSlider(pieceModel.radiusProperty, {min: -200, max: -1600}, sliderOptions);
                        this.hSliders.push(radiusSlider);
                        radiusVBox = new VBox({children: [radiusSlider, this.radiusText], align: 'center'});
                        focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
                        this.content = new HBox({
                            children: [fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox],
                            spacing: spacing,
                            resize: false
                        });
                        break;
                    case 'simple_mask':
                        this.content = new HBox({children: [fillerBox, diameterVBox],
                            spacing: spacing,
                            resize: false});

                        break;
                    case 'slit_mask':
                        this.content = new HBox({children: [fillerBox],
                            resize: false});
                        break;

                }//end switch()
                this.displayPanel = new Panel(this.content, this.panelOptions);
                this.children = [this.displayPanel, this.expandCollapseButton];
                this.expandCollapseButton.left = 5;
                this.expandCollapseButton.top = 5;
            }//end if (type != null)
        }, // end setControlsForSelectedPiece()

        setColorRadioButtonsForSourceNode: function (sourceNode) {
            var radioButtonOptions = {radius: 8, fontSize: 12, deselectedColor: 'white'};
            var whiteColorRadioButton = new AquaRadioButton(sourceNode.colorProperty, 'white', this.whiteText, radioButtonOptions);
            var greenColorRadioButton = new AquaRadioButton(sourceNode.colorProperty, 'green', this.greenText, radioButtonOptions);
            var redColorRadioButton = new AquaRadioButton(sourceNode.colorProperty, 'red', this.redText, radioButtonOptions);
            var yellowColorRadioButton = new AquaRadioButton(sourceNode.colorProperty, 'yellow', this.yellowText, radioButtonOptions);
            var spacing = 5;
            this.colorVBox1 = new VBox({
                children: [whiteColorRadioButton, greenColorRadioButton],
                align: 'left',
                spacing: spacing
            });
            this.colorVBox2 = new VBox({
                children: [redColorRadioButton, yellowColorRadioButton],
                align: 'left',
                spacing: spacing
            });
        },

        //for GC
        dispose: function () {
            for (var i = 0; i < this.hSliders.length; i++) {
                this.hSliders[i].dispose();
            }
        }

    });//end inherit
});
