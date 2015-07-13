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
  var Shape = require( 'KITE/Shape' );

  //

  //var Vector2 = require( 'DOT/Vector2' );

  /**
   * {vector2] startDir = direction of starting ray
   *
   * @constructor
   */

  function ComponentGraphic( type, diameter, focalLength ) {
      var componentGraphic = this;
      Node.call( componentGraphic );

    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );
    this.type = type;
    this.diameter = diameter;    //starting direction of the first segment, the one thing that never changes
    this.f = focalLength;               //starting position of the first segment



    this.shape = new Shape();

    this.makeDrawing();


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
      drawLens: function( ){
          //this.shape = new Shape();
          if( this.f > 0 ) {
              this.shape
                  .moveTo( 0, this.diameter/2 )
                  //arc: function( centerX, centerY, radius, startAngle, endAngle, anticlockwise )
                  .lineTo( 20, this.diameter/2 )//arc( -diameter, 0,)
                  .lineTo( 20, -this.diameter/2 )//arc( )
                  .lineTo( -20, -this.diameter/2 )
                  .lineTo( 0, this.diameter/2 );
          }
          this.addChild( new Path( this.shape, { stroke:'white', fill:'white' }) );
          //debugger;
          //this.addChild( new Circle( 50, { fill: 'white'}));
          //debugger;
      },
      drawCurvedMirror: function( ) {

      },
      drawPlaneMirror: function( ) {

      },
      drawMask: function(){

      },
      setFocalLength: function(){

      },
      setDiameter: function(){

      }


    }//end inherit
  );
} );
