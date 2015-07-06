/**
 * A RayPath is an array of line segments representing the path of a ray of light
 * starting from the source and bending at each component, ending at a mask or at infinity
 * Created by dubson on 7/5/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'KITE/Line' );
  var PropertySet = require( 'AXON/PropertySet' );
  //
  // var Ray2 = require( 'DOT/Ray2' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * {vector2] startDir = direction of starting ray
   * 
   * @constructor
   */

  function RayPath( startDir ) {

    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );

    this.startDir = startDir;

    this.rayPath = this;
    //this.mainModel = mainModel;

    this.maxLength = 2000;  //maximum length of rays in pixels

    //An array of Kite.Line segments.  Functions include
    //getStart(), getEnd(), getStartTangent() which returns direction

    this.segments = [];     //an array of line segments
    this.dirs = [];         //array of directions, corresponding to the segments
    this.lengths = [];      //array of lengths of the segments

    this.shape = new Shape();


  }

  return inherit( Object, RayPath, {
      clearPath: function() {
        this.segments = [];
        this.dir = [];
        this.lengths = [];
      },
      clearSegments: function(){
        this.segments = [];
      },
      addSegment: function( startPos, endPos ) {
        this.segments.push( new Line( startPos, endPos ) );
        var deltaPos = endPos.minus( startPos );
        var dir = deltaPos.normalize();
        var length = deltaPos.magnitude();
        this.dirs.push( dir );
        this.lengths.push( length );
      },
      getShape: function(){
        this.shape = new Shape();
        this.shape.moveTo( this.segments[0].x, this.segments[0 ].y );
        for ( var i = 0; i < this.segments.length; i++ ){
          this.shape.lineTo( this.segments[i].x, this.segments[i].y )
        }
        return this.shape;
      }


    }//end inherit
  );
} );
