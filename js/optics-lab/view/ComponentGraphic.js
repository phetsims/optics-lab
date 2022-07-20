// Copyright 2015-2022, University of Colorado Boulder

/**
 * Draws graphic for lens, mirror, mask or other component
 * with adjustable focal length, diameter, etc.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Line, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import opticsLab from '../../opticsLab.js';
import Type from '../model/Type.js';
import FocalPointGraphic from './FocalPointGraphic.js';

class ComponentGraphic extends Node {
  /**
   * @param {Type} type
   * @param {number} diameter
   * @param {number} radius
   * @param {number} index
   */
  constructor( type, diameter, radius, index ) {
    super();

    this.type = type;

    // @private {number}
    this.diameter = diameter;    //starting direction of the first segment, the one thing that never changes

    // @private {number}
    this.radius = radius;   // radius of curvature of each surface of lens

    //@private
    this.index = index;     // index of refraction

    // @private
    this.f = this.radius / ( 2 * ( this.index - 1 ) );

    // @private
    this.mirrorBackGraphic = new Rectangle( 0, -0.5, 20, 1, { fill: 'red' } );

    // @private
    this.path = new Path( new Shape() );

    // @private
    this.focalPtRight = new FocalPointGraphic( 15 );

    //@private
    this.focalPtLeft = new FocalPointGraphic( 15 );

    //@private
    this.children = [ this.mirrorBackGraphic, this.path, this.focalPtLeft, this.focalPtRight ];
  }

  /**
   * Draws the component
   * @private
   */
  makeDrawing() {
    switch( this.type ) {
      case Type.CONVERGING_LENS:
        this.drawLens();
        break;
      case Type.DIVERGING_LENS:
        this.drawLens();
        break;
      case Type.CONVERGING_MIRROR:
        this.drawCurvedMirror();
        break;
      case Type.PLANE_MIRROR:
        this.drawPlaneMirror();
        break;
      case Type.DIVERGING_MIRROR:
        this.drawCurvedMirror();
        break;
      case Type.SIMPLE_MASK:
        this.drawMask();
        break;
      case Type.SLIT_MASK:
        this.drawMask();
        break;
      default:
        throw new Error( `invalid type: ${this.type}` );
    }//end switch
  }

  //end makeDrawing()
  /**
   * @private
   */
  clearDrawing() {

  }

  /**
   * Draws a lens (convergent and divergent)
   * @private
   */
  drawLens() {
    const shape = new Shape();
    let R;  //same as this.radius = radius of curvature of lens, not to be confused with half-diameter of lens
    const fudge1 = 1;   //fudge factor to make lens radius big enough to be apparent to eye
    const fudge2 = 2;   //fudge factor to make adjust range of index of refraction
    //fudge * 2 * Math.abs( this.f ) * ( this.n - 1 );  //radius of curvature of lens surface
    const n = fudge2 * this.index;
    if ( this.type === Type.CONVERGING_LENS ) {
      R = fudge1 * this.radius;
    }
    else {
      R = -fudge1 * this.radius;   //radius has sign, R is positive
    }
    this.f = ( this.radius / 2 ) * ( 1 / ( n - 1 ) );  //f takes sign of R
    const h = this.diameter / 2;                          //h = height = radius of lens
    //  temporary fixed for theta, see #12   set the maximum ratio to be one
    const theta = Math.asin( Utils.clamp( h / R, -1, 1 ) );                     //magnitude of startAngle and endAngle
    const C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
    if ( this.f > 0 ) {
      shape
        .arc( -C, 0, R, theta, -theta, true )//arc( -diameter, 0,)
        .arc( C, 0, R, -Math.PI + theta, -Math.PI - theta, true );
    }
    else if ( this.f < 0 ) {
      const w = 5;
      shape
        .arc( -w - R, 0, R, theta, -theta, true )
        .lineToRelative( 2 * ( w + ( R - C ) ), 0 )
        .arc( w + R, 0, R, -Math.PI + theta, -Math.PI - theta, true )
        .close();
    }
    this.path.stroke = 'yellow';
    this.path.fill = 'white';
    this.path.lineWidth = 2;

    this.path.opacity = 0.85;
    this.path.setShape( shape );
    this.mirrorBackGraphic.visible = false;
  }//end drawLens()

  /**
   * Draws a curve mirror (convergent and divergent)
   * @private
   */
  drawCurvedMirror() {
    const fudge = 1;
    const R = fudge * this.radius;
    const h = this.diameter / 2;          //h = height = radius of lens
    //  temporary fixed for theta, see #12   set the maximum ratio to be one
    const theta = Math.asin( Utils.clamp( h / R, -1, 1 ) ); //magnitude of startAngle and endAngle
    const C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
    const shape = new Shape();
    if ( this.type === Type.DIVERGING_MIRROR ) {
      shape.arc( C, 0, R, -Math.PI + theta, -Math.PI - theta, false );
    }
    else {
      shape.arc( -C, 0, R, theta, -theta, true );
    }
    this.path.stroke = 'white';
    this.path.lineWidth = 8;
    //this.path.opacity = 0.95;
    this.path.setShape( shape );
    //var w = 20;
    //this.mirrorBackGraphic = new Rectangle( 0, -h, w, 2*h, {fill:'red'} );
    this.mirrorBackGraphic.setScaleMagnitude( 1, 2 * h );
    this.mirrorBackGraphic.visible = true;
  }

  /**
   * Draws a plane mirror
   * @private
   */
  drawPlaneMirror() {
    this.removeAllChildren();
    const w = 20;
    const height = this.diameter;
    //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
    const maskGraphic = new Rectangle( 0, -height / 2, w, height, { fill: 'red' } );
    //Line( x1, y1, x2, y2, options )
    const lineGraphic = new Line( 0, -height / 2, 0, height / 2, { stroke: '#FFF', lineWidth: 4 } );
    this.addChild( maskGraphic );
    this.addChild( lineGraphic );
  }

  /**
   * draw a background mask
   * @private
   */
  drawMask() {
    this.removeAllChildren();
    const w = 20;
    const height = this.diameter;
    const maskGraphic = new Rectangle( 0, -height / 2, w, height, { fill: 'green' } );
    const lineGraphic = new Line( 0, -height / 2, 0, height / 2, { stroke: 'black', lineWidth: 4 } );
    this.addChild( maskGraphic );
    this.addChild( lineGraphic );
  }

  /**
   * Sets the diameter of the component
   * @param {number} diameter
   * @public
   */
  setDiameter( diameter ) {
    this.diameter = diameter;
    this.makeDrawing();
  }

  /**
   * Sets the radius of curvature of component
   * @param {number} R
   * @public
   */
  setRadius( R ) {
    this.radius = R;
    this.makeDrawing();
  }

  /**
   * Sets the index of refraction of the component
   * @param {number} index
   * @public
   */
  setIndex( index ) {
    this.index = index;
    this.makeDrawing();
  }

  /**
   *
   * @param {number} distance
   * @public
   */
  setFocalPointPositions( distance ) {
    this.focalPtLeft.x = -distance;
    this.focalPtRight.x = distance;
  }

  /**
   *
   * @param {boolean} isVisible
   * @public
   */
  setFocalPointsVisibility( isVisible ) {
    this.focalPtLeft.visible = isVisible;
    this.focalPtRight.visible = isVisible;
  }
}

opticsLab.register( 'ComponentGraphic', ComponentGraphic );
export default ComponentGraphic;