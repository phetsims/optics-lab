/**
 * Created by dubson on 8/3/2015.
 *
 /**
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
  function   ControlPanels( mainModel, mainView ) {

    Node.call( this );
    var controlPanels = this;
    this.controlPanelArray = [];
    var typeArray = [
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


    for ( var i = 0; i < typeArray.length; i++ ){
      this.controlPanelArray[ i ] = makeControlPanel( typeArray[ i ] );
    }

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
    var spacing = 20;
    var hBoxMaker = function( childrenArray ) {
      return new HBox({
        children: childrenArray,
        spacing: spacing,
        resize: false
      });
    };

    function makeControlPanel( type ){

      //Properties for Sliders, CheckBoxes, and Radio Buttons
      var expandedProperty = new Property( false );
      var nbrOfRaysProperty = new Property( 10 );
      var spreadProperty = new Property( 20 );
      var widthProperty = new Property( 50 );
      var colorProperty = new Property( 'white' );
      var diameterProperty = new Property( 100 );
      var radiusOfCurvatureProperty = new Property( 100 );
      var indexOfRefractionProperty = new Property( 1.5 );
      var showFocalPointsProperty = new Property( false );

      var fillerBox = new Text(' ', {font: DISPLAY_FONT});

      //Create Sliders with Text labels
      var maxNbrRays = this.mainModel.maxNbrOfRaysFromASource;
      var nbrOfRaysSlider = new HSlider( nbrOfRaysProperty, { min: 1, max: maxNbrRays }, sliderOptions );
      var nbrOfRaysVBox = vBoxMaker( [ nbrOfRaysSlider, nbrOfRaysText ] );

      var spreadSlider = new HSlider( spreadProperty, { min: 2, max: 180 }, sliderOptions);
      var spreadVBox = vBoxMaker( [ spreadSlider, this.spreadText ] );

      var widthSlider = new HSlider( widthProperty, { min: 50, max: 250 }, sliderOptions);
      var widthVBox = vBoxMaker( [widthSlider, widthText] );

      var radioButtonOptions = {radius: 8, fontSize: 12, deselectedColor: 'white'};
      var whiteColorRadioButton = new AquaRadioButton( colorProperty, 'white', whiteText, radioButtonOptions);
      var greenColorRadioButton = new AquaRadioButton( colorProperty, 'green', greenText, radioButtonOptions);
      var redColorRadioButton = new AquaRadioButton( colorProperty, 'red', redText, radioButtonOptions);
      var yellowColorRadioButton = new AquaRadioButton( colorProperty, 'yellow', yellowText, radioButtonOptions);

      var colorVBox1 = vBoxMaker( [ whiteColorRadioButton, greenColorRadioButton ] );
      var colorVBox2 = vBoxMaker( [ redColorRadioButton, yellowColorRadioButton ] );

      var diameterSlider = new HSlider( diameterProperty, {min: 50, max: 250}, sliderOptions);
      var diameterVBox = vBoxMaker( [ diameterSlider, this.diameterText ] );

      var radiusSlider = new HSlider( radiusOfCurvatureProperty, {min: 100, max: 800}, sliderOptions);
      var radiusVBox = vBoxMaker( [radiusSlider, radiusText] );

      var indexSlider = new HSlider( indexOfRefractionProperty, {min: 1.4, max: 3}, sliderOptions);
      var indexVBox = vBoxMaker( [ indexSlider, indexText ] );

      var checkBoxOptions = { checkBoxColorBackground: 'white' };
      var focalPtCheckBox = new CheckBox( focalPointsText, showFocalPointsProperty, checkBoxOptions);


      var controlPanel = new Node();
      var panelContent = new Node();
      switch (type) {
        case 'fan_source':
          panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, spreadVBox, colorVBox1, colorVBox2 ] );
          break;
        case 'beam_source':
          panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, widthVBox, colorVBox1, colorVBox2 ] );
          break;
        case 'converging_lens':
          //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
          //radius of curvature R = 2*f*( n - 1 )
          panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox ] );
          break;
        case 'diverging_lens':
          panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox ] );
          break;
        case 'converging_mirror':
          panelContent = hBoxMaker( [fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox] );
          break;
        case 'plane_mirror':
          panelContent = hBoxMaker( [fillerBox, diameterVBox] );
          break;
        case 'diverging_mirror':
          panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox ] );
          break;
        case 'simple_mask':
          panelContent = hBoxMaker( [fillerBox, diameterVBox] );
          break;
        case 'slit_mask':
          panelContent = hBoxMaker( [fillerBox] );
          break;

      }//end switch()
      var expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
        sideLength: 15,
        cursor: 'pointer'
      });
      var displayPanel = new Panel( panelContent, panelOptions );
      controlPanel.children = [ displayPanel, expandCollapseButton ];
      expandCollapseButton.left = 5;
      expandCollapseButton.top = 5;
      return controlPanel;
    }//end makeControlPanel( type )



    //this.expandCollapseButton.expandedProperty.link( function( tOrF ) {
    //   controlPanelMaker.displayPanel.visible = tOrF;
    //});


    //this.mainView.selectedPieceProperty.link( function( piece ){
    //   controlPanelMaker.visible = ( piece ===  controlPanelMaker.selectedPiece );
    //  //console.log( 'calling setControls for piece ' + piece.type );
    //} );


  }//end constructor

  return inherit( Node,   ControlPanels, {


    //change the piece that this panel controls
    createControlPanel: function ( type ) {

        var fillerBox = new Text(' ', {font: DISPLAY_FONT});
        var nbrOfRaysVBox;
        var diameterVBox;
        var sliderOptions = {trackSize: new Dimension2(120, 5), thumbSize: new Dimension2(12, 25)};
        var vBoxMaker = function( childrenArray ){
          return new VBox( {
            children: childrenArray,
            align: 'center',
            resize: false
          });
        };
        var hBoxMaker = function( childrenArray ){
          return new HBox({
            children: childrenArray,
            spacing: spacing,
            resize: false
          });
        };
        if ( type === 'fan_source' || type === 'beam_source' ) {
          var maxNbrRays = this.mainModel.maxNbrOfRaysFromASource;
          var nbrOfRaysSlider = new HSlider( this.nbrOfRaysProperty, {
            min: 1,
            max: maxNbrRays
          }, sliderOptions );
          nbrOfRaysVBox = vBoxMaker( [ nbrOfRaysSlider, this.nbrOfRaysText ] );
          this.setColorRadioButtonsForSourceNode(piece);
        } else {   //if piece = component
          var diameterSlider = new HSlider( this.diameterProperty, {min: 50, max: 250}, sliderOptions);
          diameterVBox = vBoxMaker( [ diameterSlider, this.diameterText ] );
          this.focalLengthReadoutText.text = pieceModel.f.toFixed(0);
          var  controlPanelMaker = this;
          pieceModel.fProperty.link( function() {
             controlPanelMaker.focalLengthReadoutText.text = pieceModel.f.toFixed(0);
            //console.log( 'focalLength' + focalLength.toFixed(0)  );
          });
        }
        var panelContent = new Node();
        var checkBoxOptions = {checkBoxColorBackground: 'white'};
        var spacing = 25;
        //console.log( 'setControlsForSelectedPiece' + piece.type );
        var focalLengthHBox = hBoxMaker( [ this.focalLengthText, this.focalLengthReadoutText ] );
        switch (type) {
          case 'fan_source':
            var spreadSlider = new HSlider(pieceModel.spreadProperty, {min: 2, max: 180}, sliderOptions);
            var spreadVBox = vBoxMaker( [ spreadSlider, this.spreadText ] );
            panelContent = hBoxMaker( [ fillerBox, nbrOfRaysVBox, spreadVBox, this.colorVBox1, this.colorVBox2] );
            break;
          case 'beam_source':
            var heightSlider = new HSlider(pieceModel.heightProperty, {min: 50, max: 250}, sliderOptions);
            var heightVBox = vBoxMaker( [heightSlider, this.heightText] );
            panelContent = hBoxMaker( [fillerBox, nbrOfRaysVBox, heightVBox, this.colorVBox1, this.colorVBox2] );
            break;
          case 'converging_lens':
            //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
            //radius of curvature R = 2*f*( n - 1 )
            var radiusSlider = new HSlider(pieceModel.radiusProperty, {min: 100, max: 800}, sliderOptions);
            this.hSliders.push(radiusSlider);
            var radiusVBox = vBoxMaker( [radiusSlider, this.radiusText] );
            var indexSlider = new HSlider(pieceModel.indexProperty, {min: 1.4, max: 3}, sliderOptions);
            this.hSliders.push(indexSlider);
            var indexVBox = vBoxMaker( [ indexSlider, this.indexText ] );
            var focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
            panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox ] );
            break;
          case 'diverging_lens':
            //ComponentModel( mainModel, type, diameter, radiusCurvature, focalLength, index )
            //radius of curvature R = 2*f*( n - 1 )
            radiusSlider = new HSlider(pieceModel.radiusProperty, {min: -100, max: -800}, sliderOptions);
            this.hSliders.push(radiusSlider);
            radiusVBox = vBoxMaker( [radiusSlider, this.radiusText] );
            indexSlider = new HSlider(pieceModel.indexProperty, {min: 1.4, max: 3}, sliderOptions);
            this.hSliders.push(indexSlider);
            indexVBox = vBoxMaker( [ indexSlider, this.indexText ] );
            focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
            panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, indexVBox, focalPtCheckBox, focalLengthHBox ] );
            break;
          case 'converging_mirror':
            radiusSlider = new HSlider(pieceModel.radiusProperty, {min: 200, max: 1600}, sliderOptions);
            this.hSliders.push(radiusSlider);
            radiusVBox = vBoxMaker( [ radiusSlider, this.radiusText ] );
            focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
            panelContent = hBoxMaker( [fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox] );
            break;
          case 'plane_mirror':
            panelContent = hBoxMaker( [fillerBox, diameterVBox] );
            break;
          case 'diverging_mirror':
            radiusSlider = new HSlider(pieceModel.radiusProperty, {min: -200, max: -1600}, sliderOptions);
            this.hSliders.push(radiusSlider);
            radiusVBox = vBoxMaker( [ radiusSlider, this.radiusText ] );
            focalPtCheckBox = new CheckBox(this.focalPointsText, piece.showFocalPointsProperty, checkBoxOptions);
            panelContent = hBoxMaker( [ fillerBox, diameterVBox, radiusVBox, focalPtCheckBox, focalLengthHBox ] );
            break;
          case 'simple_mask':
            panelContent = hBoxMaker( [fillerBox, diameterVBox] );
            break;
          case 'slit_mask':
            panelContent = hBoxMaker( [fillerBox] );
            break;

        }//end switch()
        this.displayPanel = new Panel(panelContent, this.panelOptions);
        this.children = [this.displayPanel, this.expandCollapseButton];
        this.expandCollapseButton.left = 5;
        this.expandCollapseButton.top = 5;

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


  });//end inherit
});
