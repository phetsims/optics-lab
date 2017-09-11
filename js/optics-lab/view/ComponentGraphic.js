// Copyright 2016, University of Colorado Boulder

/**
 * Draws graphic for lens, mirror, mask or other component
 * with adjustable focal length, diameter, etc.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var FocalPointGraphic = require( 'OPTICS_LAB/optics-lab/view/FocalPointGraphic' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  var Util = require( 'DOT/Util' );

  /**
   * @extends {Node}
   *
   * @param {Type} type
   * @param {number} diameter
   * @param {number} radius
   * @param {number} index
   * @constructor
   */
  function ComponentGraphic( type, diameter, radius, index ) {
    Node.call( this );

    this.type = type;
    this.diameter = diameter;    //starting direction of the first segment, the one thing that never changes
    this.radius = radius;   // radius of curvature of each surface of lens
    this.index = index;     // index of refraction
    this.f = this.radius / ( 2 * ( this.index - 1 ));

    this.mirrorBackGraphic = new Rectangle( 0, -0.5, 20, 1, { fill: 'red' } );
    this.shape = new Shape();
    this.path = new Path( this.shape );
    this.focalPtRight = new FocalPointGraphic( 15 );
    this.focalPtLeft = new FocalPointGraphic( 15 );
    this.focalPtRight.visible = true;
    this.focalPtLeft.visible = true;
    this.children = [ this.mirrorBackGraphic, this.path, this.focalPtLeft, this.focalPtRight ];

  }

  opticsLab.register( 'ComponentGraphic', ComponentGraphic );

  return inherit( Node, ComponentGraphic, {
    /**
     * Draws the component
     * @private
     */
    makeDrawing: function() {
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
          throw new Error( 'invalid type: ' + this.type );
      }//end switch
    },  //end makeDrawing()
    /**
     * @private
     */
    clearDrawing: function() {

    },
    /**
     * Draws a lens (convergent and divergent)
     * @private
     */
    drawLens: function() {
      this.shape = new Shape();
      var R;  //same as this.radius = radius of curvature of lens, not to be confused with half-diameter of lens
      var fudge1 = 1;   //fudge factor to make lens radius big enough to be apparent to eye
      var fudge2 = 2;   //fudge factor to make adjust range of index of refraction
      //fudge * 2 * Math.abs( this.f ) * ( this.n - 1 );  //radius of curvature of lens surface
      var n = fudge2 * this.index;
      if ( this.type === Type.CONVERGING_LENS ) {
        R = fudge1 * this.radius;
      }
      else {
        R = -fudge1 * this.radius;   //radius has sign, R is positive
      }
      this.f = ( this.radius / 2 ) * ( 1 / ( n - 1 ) );  //f takes sign of R
      var h = this.diameter / 2;                          //h = height = radius of lens
      //  temporary fixed for theta, see #12   set the maximum ratio to be one
      var theta = Math.asin( Util.clamp( h / R, -1, 1 ) );                     //magnitude of startAngle and endAngle
      var C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
      if ( this.f > 0 ) {
        this.shape
          .arc( -C, 0, R, theta, -theta, true )//arc( -diameter, 0,)
          .arc( C, 0, R, -Math.PI + theta, -Math.PI - theta, true );
      }
      else if ( this.f < 0 ) {
        var w = 5;
        this.shape
          .arc( -w - R, 0, R, theta, -theta, true )
          .lineToRelative( 2 * ( w + ( R - C )) )
          .arc( w + R, 0, R, -Math.PI + theta, -Math.PI - theta, true )
          .close();
      }
      this.path.stroke = 'yellow';
      this.path.fill = 'white';
      this.path.lineWidth = 2;

      this.path.opacity = 0.85;
      this.path.setShape( this.shape );
      this.mirrorBackGraphic.visible = false;
    },//end drawLens()
    /**
     * Draws a curve mirror (convergent and divergent)
     * @private
     */
    drawCurvedMirror: function() {
      var fudge = 1;
      var R = fudge * this.radius;
      var h = this.diameter / 2;          //h = height = radius of lens
      //  temporary fixed for theta, see #12   set the maximum ratio to be one
      var theta = Math.asin( Util.clamp( h / R, -1, 1 ) ); //magnitude of startAngle and endAngle
      var C = R * Math.cos( theta );                      //distance from center of lens to center of curvature of lens surface
      this.shape = new Shape();
      if ( this.type === Type.DIVERGING_MIRROR ) {
        this.shape.arc( C, 0, R, -Math.PI + theta, -Math.PI - theta, false );
      }
      else {
        this.shape.arc( -C, 0, R, theta, -theta, true );
      }
      this.path.stroke = 'white';
      this.path.lineWidth = 8;
      //this.path.opacity = 0.95;
      this.path.setShape( this.shape );
      //var w = 20;
      //this.mirrorBackGraphic = new Rectangle( 0, -h, w, 2*h, {fill:'red'} );
      this.mirrorBackGraphic.setScaleMagnitude( 1, 2 * h );
      this.mirrorBackGraphic.visible = true;
    },
    /**
     * Draws a plane mirror
     * @private
     */
    drawPlaneMirror: function() {
      this.removeAllChildren();
      var w = 20;
      var height = this.diameter;
      //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
      var maskGraphic = new Rectangle( 0, -height / 2, w, height, { fill: 'red' } );
      //Line( x1, y1, x2, y2, options )
      var lineGraphic = new Line( 0, -height / 2, 0, height / 2, { stroke: '#FFF', lineWidth: 4 } );
      this.addChild( maskGraphic );
      this.addChild( lineGraphic );
    },
    /**
     * draw a background mask
     * @private
     */
    drawMask: function() {
      this.removeAllChildren();
      var w = 20;
      var height = this.diameter;
      var maskGraphic = new Rectangle( 0, -height / 2, w, height, { fill: 'green' } );
      var lineGraphic = new Line( 0, -height / 2, 0, height / 2, { stroke: 'black', lineWidth: 4 } );
      this.addChild( maskGraphic );
      this.addChild( lineGraphic );
    },
    /**
     * Sets the diameter of the component
     * @param {number} diameter
     * @public
     */
    setDiameter: function( diameter ) {
      this.diameter = diameter;
      this.makeDrawing();
    },
    /**
     * Sets the radius of curvature of component
     * @param {number} R
     * @public
     */
    setRadius: function( R ) {
      this.radius = R;
      this.makeDrawing();
    },

    /**
     * Sets the index of refraction of the component
     * @param {number} index
     * @public
     */
    setIndex: function( index ) {
      this.index = index;
      this.makeDrawing();
    },
    /**
     *
     * @param {number} distance
     * @public
     */
    setFocalPointPositions: function( distance ) {
      this.focalPtLeft.x = -distance;
      this.focalPtRight.x = distance;
    },

    /**
     *
     * @param {boolean} isVisible
     * @public
     */
    setFocalPointsVisibility: function( isVisible ) {
      this.focalPtLeft.visible = isVisible;
      this.focalPtRight.visible = isVisible;
    }

  } );
} );
