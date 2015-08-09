/**
 * Created by Dubson on 8/8/2015.
 */
/*
* Control panel for a particular source (fan or beam) or a particular component (lens, mirror, or mask)
* contains sliders to set height or spread of source or diameter, focal length (if lens or mirror)
* and index  of refraction (if lens)
    * Piece:  Controls
* fan_source: nbr of rays / spread in degrees / color of rays
* beam_source: nbr of rays / width in cm / color of rays
* converging_lens: diameter in cm /radius of curvature in cm/ index of refraction (no units)/ focal points checkBox/ focal length readout
* diverging_lens: diameter/radius/index/focal points checkbox/focal length readout
* converging_mirror: diameter/radius/focal points checkbox/focal length readout
* diverging_mirror: diameter/radius/focal points checkbox/focal length readout
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
    function   ControlPanel2( mainModel, mainView, type ) {
        Node.call( this );
        var controlPanel2 = this;
        var mainModel = mainModel;
        var mainView = mainView;
        this.type = type;
        //this.controlPanelArray = [];
        //var typeArray = [
        //    'fan_source',
        //    'beam_source',
        //    'converging_lens',
        //    'diverging_lens',
        //    'converging_mirror',
        //    'plane_mirror',
        //    'diverging_mirror',
        //    'simple_mask',
        //    'slit_mask'
        //];


        var fontInfo = {font: DISPLAY_FONT};
        var whiteText = new Text('white', fontInfo);
        var greenText = new Text('green', fontInfo);
        var redText = new Text('red', fontInfo);
        var yellowText = new Text('yellow', fontInfo);

        fontInfo = {font: DISPLAY_FONT, fill: TEXT_COLOR};
        var nbrOfRaysText = new Text('number of rays', fontInfo);
        var focalPointsText = new Text('focal points', fontInfo);
        var widthText = new Text('width', fontInfo);
        var spreadText = new Text('spread', fontInfo);
        var diameterText = new Text('diameter', fontInfo);
        var radiusText = new Text('radius of curvature', fontInfo);
        var focalLengthText = new Text('f : ', fontInfo);
        var focalLengthReadoutText = new Text('filler', fontInfo);
        var indexText = new Text('refractive index', fontInfo);



        // All controls are placed on display node, with visibility set by expand/collapse button
        var panelOptions = {
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


        //for ( var i = 0; i < typeArray.length; i++ ){
        //    this.controlPanelArray[ i ] = makeControlPanel( typeArray[ i ] );
        //}

        var sliderOptions = {
            trackSize: new Dimension2(120, 5),
            thumbSize: new Dimension2(12, 25)
        };

        var vBoxMaker = function( childrenArray ){
            return new VBox( {
                children: childrenArray,
                align: 'center',
                resize: false
            });
        };
        var vBoxMaker2 = function( childrenArray ){
            return new VBox( {
                children: childrenArray,
                align: 'left',
                resize: false
            });
        };
        var spacing = 20;
        var hBoxMaker = function( childrenArray ){
            return new HBox({
                children: childrenArray,
                spacing: spacing,
                resize: false
            })
        };

        //Properties for Sliders, CheckBoxes, and Radio Buttons
        this.expandedProperty = new Property( true );
        this.nbrOfRaysProperty = new Property( 10 );
        this.spreadProperty = new Property( 20 );
        this.widthProperty = new Property( 50 );
        this.colorProperty = new Property( 'white' );
        this.diameterProperty = new Property( 50 );
        this.radiusOfCurvatureProperty = new Property( 150 );
        this.indexOfRefractionProperty = new Property( 2 );
        this.showFocalPointsProperty = new Property( 'false' );

        var fillerBox = new Text(' ', {font: DISPLAY_FONT});

        //Create Sliders with Text labels
        var maxNbrRays = mainModel.maxNbrOfRaysFromASource;
        var nbrOfRaysSlider = new HSlider(this.nbrOfRaysProperty, {min: 1, max: maxNbrRays}, sliderOptions);
        var nbrOfRaysVBox = vBoxMaker([nbrOfRaysSlider, nbrOfRaysText]);

        var spreadSlider = new HSlider(this.spreadProperty, {min: 2, max: 180}, sliderOptions);
        var spreadVBox = vBoxMaker([spreadSlider, spreadText]);

        var widthSlider = new HSlider(this.widthProperty, {min: 50, max: 250}, sliderOptions);
        var widthVBox = vBoxMaker([widthSlider, widthText]);

        var radioButtonOptions = {radius: 8, fontSize: 12, deselectedColor: 'white'};
        var whiteColorRadioButton = new AquaRadioButton(this.colorProperty, 'white', whiteText, radioButtonOptions);
        var greenColorRadioButton = new AquaRadioButton(this.colorProperty, 'green', greenText, radioButtonOptions);
        var redColorRadioButton = new AquaRadioButton(this.colorProperty, 'red', redText, radioButtonOptions);
        var yellowColorRadioButton = new AquaRadioButton(this.colorProperty, 'yellow', yellowText, radioButtonOptions);

        var colorVBox1 = vBoxMaker2([whiteColorRadioButton, greenColorRadioButton]);
        var colorVBox2 = vBoxMaker2([redColorRadioButton, yellowColorRadioButton]);

        var diameterSlider = new HSlider(this.diameterProperty, {min: 50, max: 250}, sliderOptions);
        var diameterVBox = vBoxMaker([diameterSlider, diameterText]);

        var radiusSlider = new HSlider(this.radiusOfCurvatureProperty, {min: 100, max: 800}, sliderOptions);
        var radiusVBox = vBoxMaker([radiusSlider, radiusText]);

        var indexSlider = new HSlider(this.indexOfRefractionProperty, {min: 1.4, max: 3}, sliderOptions);
        var indexVBox = vBoxMaker([indexSlider, indexText]);

        var checkBoxOptions = {checkBoxColorBackground: 'white'};
        var focalPtCheckBox = new CheckBox(focalPointsText, this.showFocalPointsProperty, checkBoxOptions);

        var focalLengthHBox = hBoxMaker( [ focalLengthText, focalLengthReadoutText])
        var panelContent = new Node();

        switch (type) {
            case 'fan_source':
                panelContent = hBoxMaker([fillerBox, nbrOfRaysVBox, spreadVBox, colorVBox1, colorVBox2]);
                break;
            case 'beam_source':
                panelContent = hBoxMaker([fillerBox, nbrOfRaysVBox, widthVBox, colorVBox1, colorVBox2]);
                break;
            case 'converging_lens':
                //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
                //radius of curvature R = 2*f*( n - 1 )
                panelContent = hBoxMaker([fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox]);
                break;
            case 'diverging_lens':
                panelContent = hBoxMaker([fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox]);
                break;
            case 'converging_mirror':
                panelContent = hBoxMaker([fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox]);
                break;
            case 'plane_mirror':
                panelContent = hBoxMaker([fillerBox, diameterVBox]);
                break;
            case 'diverging_mirror':
                panelContent = hBoxMaker([fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox]);
                break;
            case 'simple_mask':
                panelContent = hBoxMaker([fillerBox, diameterVBox]);
                break;
            case 'slit_mask':
                panelContent = hBoxMaker([fillerBox]);
                break;

        }//end switch()
        var expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
            sideLength: 15,
            cursor: 'pointer'
        });
        var displayPanel = new Panel( panelContent, panelOptions );
        controlPanel2.children = [ displayPanel, expandCollapseButton ];
        expandCollapseButton.left = 5;
        expandCollapseButton.top = 5;

        mainView.selectedPieceTypeProperty.link( function( piece ){
            if( piece !== null ){
                controlPanel2.visible = ( piece.type === controlPanel2.type );
            }

            //console.log( 'calling setControls for piece ' + piece.type );
        } );
        expandCollapseButton.expandedProperty.link( function( tOrF ) {
            displayPanel.visible = tOrF;
            //if( displayPanel !== null ){
            //    displayPanel.visible = tOrF;
            //}
        });


        }//end constructor

        return inherit( Node, ControlPanel2, {

        });//end inherit
    });

