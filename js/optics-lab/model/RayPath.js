/**
 * A RayPath is an array of line segments representing the path of a ray of light
 * starting from the source and bending at each component, ending at a mask or at infinity
 * Created by dubson on 7/5/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'KITE/segments/Line' );
  //var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  //
  // var Ray2 = require( 'DOT/Ray2' );
  //var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param relativeStartPos
   * @param startDir
   * @constructor
   */

  function RayPath( relativeStartPos, startDir ) {

    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );
    this.startPos;  //starting position of Path in absolute coordinates
    this.startDir = startDir;    //starting direction of the first segment, changes upon rotation of source
    this.relativeStartPos = relativeStartPos;  //starting position, relative to source center, of the first segment

    this.rayPath = this;
    //this.mainModel = mainModel;

    this.maxLength = 2000;  //maximum length of rays in pixels
    this.maxNbrSegments = 50;  //maximum number of segments in ray path, needed to prevent endless loops
    this.nbrSegments = 0;    //number of segments in raypath, not to exceed this.maxNbrSegments

    //An array of Kite.Line segments.  Kite.Line functions include
    //getStart(), getEnd(), getStartTangent() which returns direction

    this.segments = [];     //an array of line segments
    this.dirs = [];         //array of directions, corresponding to the segments
    this.lengths = [];      //array of lengths of the segments

    this.shape = new Shape();


  }

  return inherit( Object, RayPath, {
      clearPath: function() {
        this.segments = [];
        this.dirs = [];
        this.lengths = [];
        this.nbrSegments = 0;
      },
      clearSegments: function(){
        this.segments = [];
      },
      addSegment: function( startPos, endPos ) {
        this.segments.push( new Line( startPos, endPos ) );
        this.nbrSegments += 1;
        var deltaPos = endPos.minus( startPos );
        var dir = deltaPos.normalize();
        var length = deltaPos.magnitude();
        this.dirs.push( dir );
        this.lengths.push( length );
      },
      getShape: function(){
        this.shape = new Shape();
        this.shape.moveToPoint( this.segments[ 0 ].getStart() );
        for ( var i = 0; i < this.segments.length; i++ ){
          this.shape.lineToPoint( this.segments[i].getEnd() );
        }
        return this.shape;
      },
      getRelativeShape: function(){

        var shape = new Shape();
        shape.moveToPoint( this.relativeStartPos );
        var startPoint = this.segments[ 0 ].getStart();
        var nextAbsolutePoint;
        var nextRelativePoint;
        for ( var i = 0; i < this.segments.length; i++ ){
          nextAbsolutePoint = this.segments[i].getEnd();
          nextRelativePoint = this.relativeStartPos.plus( nextAbsolutePoint.minus( startPoint ) );
          shape.lineToPoint( nextRelativePoint );
        }
        return shape;
      }


    }//end inherit
  );
} );
