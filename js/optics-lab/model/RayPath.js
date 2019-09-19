// Copyright 2015-2019, University of Colorado Boulder

/**
 * A RayPath is an array of line segments representing the path of a ray of light
 * starting from the source and bending at each component, ending at a mask or at infinity
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'KITE/segments/Line' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @extends {Object}
   *
   * @param {Vector2} relativeStartPos
   * @param {Vector2} startDir
   * @constructor
   */
  function RayPath( relativeStartPos, startDir ) {

    this.startPos;  //starting position of Path in absolute coordinates

    // @public {Vector2}
    this.startDir = startDir;    //starting direction of the first segment, changes upon rotation of source

    // @public {Vector2}
    this.relativeStartPos = relativeStartPos;  //starting position, relative to source center, of the first segment

    this.maxLength = 2000;  //maximum length of rays in pixels
    this.maxNbrSegments = 50;  //maximum number of segments in ray path, needed to prevent endless loops

    // @public {number}
    this.nbrSegments = 0;    //number of segments in raypath, not to exceed this.maxNbrSegments

    // @public (read-only) {Line[]}
    this.segments = [];     //an array of line segments

    // @public (read-only) {Vector2[]}
    this.dirs = [];         //array of directions, corresponding to the segments

    // @private {number[]}
    this.lengths = [];      //array of lengths of the segments

    // @private {Shape}
    this.shape = new Shape();

  }

  opticsLab.register( 'RayPath', RayPath );

  return inherit( Object, RayPath, {
    /**
     * @public
     */
    clearPath: function() {
      this.segments = [];
      this.dirs = [];
      this.lengths = [];
      this.nbrSegments = 0;
    },
    /**
     *
     */
    clearSegments: function() {
      this.segments = [];
    },
    /**
     *
     * @param {Vector2} startPos
     * @param {Vector2} endPos
     * @public
     */
    addSegment: function( startPos, endPos ) {
      this.segments.push( new Line( startPos, endPos ) );
      this.nbrSegments += 1;
      const deltaPos = endPos.minus( startPos );
      const dir = deltaPos.normalize();
      const length = deltaPos.magnitude;
      this.dirs.push( dir );
      this.lengths.push( length );
    },
    /**
     *
     * @returns {Shape}
     * @private
     */
    getShape: function() {
      this.shape = new Shape();
      this.shape.moveToPoint( this.segments[ 0 ].getStart() );
      for ( let i = 0; i < this.segments.length; i++ ) {
        this.shape.lineToPoint( this.segments[ i ].getEnd() );
      }
      return this.shape;
    },
    /**
     *
     * @returns {Shape}
     * @public
     */
    getRelativeShape: function() {

      const shape = new Shape();
      shape.moveToPoint( this.relativeStartPos );
      if ( this.segments.length > 0 ) {
        const startPoint = this.segments[ 0 ].getStart();
        let nextAbsolutePoint;
        let nextRelativePoint;
        for ( let i = 0; i < this.segments.length; i++ ) {
          nextAbsolutePoint = this.segments[ i ].getEnd();
          nextRelativePoint = this.relativeStartPos.plus( nextAbsolutePoint.minus( startPoint ) );
          shape.lineToPoint( nextRelativePoint );
        }
      }

      return shape;
    }

  } );
} );
