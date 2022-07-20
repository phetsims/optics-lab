// Copyright 2015-2022, University of Colorado Boulder

/**
 * A RayPath is an array of line segments representing the path of a ray of light
 * starting from the source and bending at each component, ending at a mask or at infinity
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import { Line, Shape } from '../../../../kite/js/imports.js';
import opticsLab from '../../opticsLab.js';

class RayPath {
  /**
   * @param {Vector2} relativeStartPos
   * @param {Vector2} startDir
   */
  constructor( relativeStartPos, startDir ) {

    this.startPos;  //starting position of Path in absolute coordinates

    // @public {Vector2}
    this.startDir = startDir;    //starting direction of the first segment, changes upon rotation of source

    // @public {Vector2}
    this.relativeStartPos = relativeStartPos;  //starting position, relative to source center, of the first segment

    this.maxNbrSegments = 50;  //maximum number of segments in ray path, needed to prevent endless loops

    // @public {number}
    this.nbrSegments = 0;    //number of segments in raypath, not to exceed this.maxNbrSegments

    // @public (read-only) {Line[]}
    this.segments = [];     //an array of line segments

    // @public (read-only) {Vector2[]}
    this.dirs = [];         //array of directions, corresponding to the segments

    // @private {number[]}
    this.lengths = [];      //array of lengths of the segments

  }

  /**
   * @public
   */
  clearPath() {
    this.segments = [];
    this.dirs = [];
    this.lengths = [];
    this.nbrSegments = 0;
  }

  /**
   *
   * @param {Vector2} startPos
   * @param {Vector2} endPos
   * @public
   */
  addSegment( startPos, endPos ) {
    this.segments.push( new Line( startPos, endPos ) );
    this.nbrSegments += 1;
    const deltaPos = endPos.minus( startPos );
    const dir = deltaPos.normalize();
    const length = deltaPos.magnitude;
    this.dirs.push( dir );
    this.lengths.push( length );
  }

  /**
   *
   * @returns {Shape}
   * @private
   */
  getShape() {
    const shape = new Shape();
    shape.moveToPoint( this.segments[ 0 ].getStart() );
    for ( let i = 0; i < this.segments.length; i++ ) {
      shape.lineToPoint( this.segments[ i ].getEnd() );
    }
    return shape;
  }

  /**
   *
   * @returns {Shape}
   * @public
   */
  getRelativeShape() {

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
}

opticsLab.register( 'RayPath', RayPath );
export default RayPath;