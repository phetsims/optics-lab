/**
 * Draws graphic for lens, mirror, mask or other component
 * with adjustable focal length, diameter, etc.
 * Created by dubson on 7/9/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
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

  function ComponentGraphic( type, diameter, focalLength, index ) {
      var componentGraphic = this;
      Node.call( componentGraphic );

    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );
    this.type = type;
    this.diameter = diameter;    //starting direction of the first segment, the one thing that never changes
    this.f = focalLength;               //starting position of the first segment
    this.n = index;     //index of refraction


    this.shape = new Shape();
    this.path = new Path( this.shape );
    this.addChild( this.path );
    //this.makeDrawing();

  }

  return inherit( Node, ComponentGraphic, {
      makeDrawing: function(){
        switch( this.type ){
          case 'lens':
            this.drawLens();
            break;
          case 'curved_mirror':
            this.drawCurvedMirror();
            break;
          case 'plane_mirror':
            this.drawPlaneMirror();
            break;
          case 'mask':
            this.drawMask();
            break;
        }//end switch
      },  //end makeDrawing()
      clearDrawing: function() {

      },
      drawLens: function() {
        this.shape = new Shape();
        var fudge = 1;   //fudge factor to make lens radius big enough to be apparent to ey
        var R = fudge * 2 * Math.abs( this.f ) * ( this.n - 1 );  //radius of curvature of lens surface
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
        //this.addChild( new Path( this.shape, { stroke:'yellow', fill:'white', lineWidth: 2, opacity: 0.95 }) );
        //debugger;
        //this.addChild( new Circle( 50, { fill: 'white'}));
        //debugger;
      },//end drawLens()
      drawCurvedMirror: function( ) {

      },
      drawPlaneMirror: function( ) {
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
      setIndex: function( index ){
        console.log( 'index is ' + index );
        this.n = index;
        this.makeDrawing();
      }


    }//end inherit
  );
} );