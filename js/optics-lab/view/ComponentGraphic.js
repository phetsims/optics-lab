/**
 * Draws graphic for lens, mirror, mask or other component
 * with adjustable focal length, diameter, etc.
 * Created by Dubson on 7/9/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var FocalPointGraphic = require( 'OPTICS_LAB/optics-lab/view/FocalPointGraphic' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  //var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  //

  //var Vector2 = require( 'DOT/Vector2' );

  /**
   * {vector2] startDir = direction of starting ray
   *
   * @constructor
   */

  function ComponentGraphic( type, diameter, radius, index ) {
      var componentGraphic = this;
      Node.call( componentGraphic );

    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );
    this.type = type;
    this.diameter = diameter;    //starting direction of the first segment, the one thing that never changes
    this.radius = radius;   //radius of curvature of each surface of lens
    this.index = index;     //index of refraction
    this.f = this.radius/( 2*( this.index - 1 ));



    this.shape = new Shape();
    this.path = new Path( this.shape );
    this.focalPtRight = new FocalPointGraphic( 15 );
    this.focalPtLeft = new FocalPointGraphic( 15 );
    this.focalPtRight.visible = true;
    this.focalPtLeft.visible = true;
    //this.addChild( this.focalPtLeft );
    //this.addChild( this.focalPtRight );
    //this.addChild( this.path );
    this.children = [ this.path, this.focalPtLeft, this.focalPtRight ];
    //this.makeDrawing();

  }

  return inherit( Node, ComponentGraphic, {
      makeDrawing: function(){
        switch( this.type ){
          case 'converging_lens':
            this.drawLens();
            break;
          case 'diverging_lens':
            this.drawLens();
            break;
          case 'converging_mirror':
            //this.drawPlaneMirror();
            this.drawCurvedMirror();
            break;
          case 'plane_mirror':
            this.drawPlaneMirror();
            break;
          case 'diverging_mirror':
            //this.drawDivergingMirror();
            this.drawCurvedMirror();
            break;
          case 'simple_mask':
            this.drawMask();
            break;
          case 'slit_mask':
            this.drawMask();

            break;
        }//end switch
      },  //end makeDrawing()
      clearDrawing: function() {

      },
      drawLens: function() {
        this.shape = new Shape();
        var R;  //same as this.radius = radius of curvature of lens, not to be confused with half-diameter of lens
        var fudge1 = 1;   //fudge factor to make lens radius big enough to be apparent to eye
        var fudge2 = 2;   //fudge factor to make adjust range of index of refraction
        //fudge * 2 * Math.abs( this.f ) * ( this.n - 1 );  //radius of curvature of lens surface
        var n = fudge2*this.index;
        if( this.type === 'converging_lens' ){
          R = fudge1*this.radius;
        }else{
          R = -fudge1*this.radius;   //radius has sign, R is positive
        }
        this.f = ( this.radius / 2 )* ( 1 / ( n - 1 ) );  //f takes sign of R
        var h = this.diameter / 2;                          //h = height = radius of lens
        var theta = Math.asin( h / R );                     //magnitude of startAngle and endAngle
        var C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
        if ( this.f > 0 ) {
          this.shape
            //.moveTo( 0, -h )
            //arc: function( centerX, centerY, radius, startAngle, endAngle, anticlockwise )
            .arc( -C, 0, R, theta, -theta, true )//arc( -diameter, 0,)
            .arc( C, 0, R, -Math.PI + theta, Math.PI - theta, true );
          //.close();
        }
        else if ( this.f < 0 ) {
          var w = 5;
          this.shape
            //.moveTo( 0, 0)
            .arc( -w - R, 0, R, theta, -theta, true )
            .lineToRelative( 2 * ( w + ( R - C )) )
            .arc( w + R, 0, R, -Math.PI + theta, Math.PI - theta, true )
            .close();
        }
        //this.path.options = { stroke: 'yellow', fill: 'white', lineWidth: 2, opacity: 0.95 };
        this.path.stroke = 'yellow';
        this.path.fill = 'white';
        this.path.lineWidth = 2;
        this.path.opacity = 0.95;
        this.path.setShape( this.shape );
      },//end drawLens()
      drawCurvedMirror: function( ) {
        this.removeAllChildren();
        var fudge = 1;
        var R = fudge*this.radius;
        var f = this.radius/2;
        var h = this.diameter / 2;                          //h = height = radius of lens
        var theta = Math.asin( h / R );                     //magnitude of startAngle and endAngle
        var C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
        this.shape = new Shape();
        if( this.type === 'diverging_mirror'){
          this.shape.arc( C, 0, R, -Math.PI + theta, Math.PI - theta, true );
        }else{
          this.shape.arc( -C, 0, R, theta, -theta, true );
        }
        this.path.stroke = 'white';
        this.path.lineWidth = 8;
        //this.path.opacity = 0.95;
        this.path.setShape( this.shape );
        var w = 20;
        var mirrorBackGraphic = new Rectangle( 0, -h, w, 2*h, {fill:'red'} );
        this.children = [ mirrorBackGraphic, this.path ];
      },
      //drawDivergingMirror: function(){
      //  this.removeAllChildren();
      //  var fudge = 1;
      //  var R = fudge*this.radius;
      //  var f = this.radius/2;
      //  var h = this.diameter / 2;                          //h = height = radius of lens
      //  var theta = Math.asin( h / R );                     //magnitude of startAngle and endAngle
      //  var C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
      //  this.shape = new Shape();
      //  this.shape.arc( C, 0, R, -Math.PI + theta, Math.PI - theta, true );
      //  this.path.stroke = 'white';
      //  this.path.lineWidth = 8;
      //  //this.path.opacity = 0.95;
      //  this.path.setShape( this.shape );
      //  var w = 20;
      //  var mirrorBackGraphic = new Rectangle( 0, -h, w, 2*h, {fill:'red'} );
      //  this.children = [ mirrorBackGraphic, this.path ];
      //
      //},
      //drawConvergingMirror: function(){
      //
      //},
      drawPlaneMirror: function( ) {
        this.removeAllChildren();
        var w = 20;
        var height = this.diameter;
        //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
        var maskGraphic = new Rectangle( 0, -height/2, w, height, {fill:'red'} );
        //Line( x1, y1, x2, y2, options )
        var lineGraphic = new Line( 0, -height/2, 0, height/2, { stroke: '#FFF', lineWidth: 4} );
        this.addChild( maskGraphic );
        this.addChild( lineGraphic );
      },
      drawMask: function(){
        this.removeAllChildren();
        var w = 20;
        var height = this.diameter;
        //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
        var maskGraphic = new Rectangle( 0, -height/2, w, height, {fill:'green'} );
        //Line( x1, y1, x2, y2, options )
        var lineGraphic = new Line( 0, -height/2, 0, height/2, { stroke: 'black', lineWidth: 4} );
        this.addChild( maskGraphic );
        this.addChild( lineGraphic );
      },
      setFocalLength: function( focalLength ){
        this.f = focalLength;
        this.makeDrawing();
      },
      setDiameter: function( diameter ) {
        this.diameter = diameter;
        this.makeDrawing();
      },
      setRadius: function( R ) {
        this.radius = R;
        this.makeDrawing();
      },
        setIndex: function (index) {
          //console.log( 'index is ' + index );
          this.index = index;
          this.makeDrawing();
        },
        setFocalPointPositions: function( distance ){
          this.focalPtLeft.x = -distance;
          this.focalPtRight.x = distance;
          //console.log( 'focal points distance = ' + distance );
        },
        setFocalPointsVisibility: function (isVisible) {
          this.focalPtLeft.visible = isVisible;
          this.focalPtRight.visible = isVisible;
          //console.log( 'focal points visibility = ' + isVisible );
        }


    }//end inherit
  );
} );
