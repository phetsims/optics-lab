// Copyright 2015-2019, University of Colorado Boulder

/**
 * Model type for a component such as a Mirror, or a Lens
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var Property = require( 'AXON/Property' );
  var Type = require( 'OPTICS_LAB/optics-lab/model/Type' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @extends {Object}
   *
   * @param {OpticsLabModel} mainModel
   * @param {Type} type
   * @param {number} diameter
   * @param {number} [radiusCurvature] - plane mirrors do not have a radius of curvature
   * @param {number} [index] - mirrors do not pass as index
   * @constructor
   */
  function ComponentModel( mainModel, type, diameter, radiusCurvature, index ) {

    // @private - position of component on stage
    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // @private, {Property.<number>}
    this.diameterProperty = new NumberProperty( diameter );

    // @public {Property.<number|null>} spread of point source (fan source) in degrees
    this.radiusProperty = new Property( radiusCurvature );

    // @public {Property.<number|null>} index of refraction of lens
    this.indexProperty = new Property( index );

    // @public {Property.<number|null>} focal length of component of lens or mirror
    this.fProperty = new Property( 500 );

    // @public {Property.<number>} tilt angle of component, 0 = optic axis is horizontal, + angle is CW
    this.angleProperty = new NumberProperty( 0 );

    var self = this;
    this.mainModel = mainModel;

    // @public (read-only) {string}
    this.type = type; // Type.CONVERGING_LENS|Type.DIVERGING_LENS|Type.CONVERGING_MIRROR|Type.PLANE_MIRROR|etc.
    if ( this.type === Type.CONVERGING_MIRROR || this.type === Type.DIVERGING_MIRROR ) {
      this.indexProperty.value = 2;  //needed so formula for focal length is correct in mirror case
    }

    this.diameterProperty.link( function() {
      self.mainModel.processRays();
    } );

    this.radiusProperty.link( function( radius ) {
      var R = radius;   // R is signed.  + for converging lenses, - for diverging lenses
      var n = self.indexProperty.value;
      self.fProperty.value = R / ( 2 * ( n - 1 ));  //focal length gets correct sign from sign of radius R.
      self.mainModel.processRays();
    } );

    this.indexProperty.link( function( index ) {
      var R = self.radiusProperty.value;
      var n = index;
      self.fProperty.value = R / ( 2 * ( n - 1 ));
      self.mainModel.processRays();
    } );

    this.angleProperty.link( function() {
      self.mainModel.processRays();
    } );
  }

  opticsLab.register( 'ComponentModel', ComponentModel );

  return inherit( Object, ComponentModel, {

    /**
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.diameterProperty.reset();
      this.radiusProperty.reset();
      this.indexProperty.reset();
      this.fProperty.reset();
      this.angleProperty.reset();
    },

    /**
     *
     */
    updateFocalLength: function() {
      if ( this.type === Type.CONVERGING_LENS || this.type === Type.DIVERGING_LENS ) {
        this.fProperty.value = ( this.radiusProperty.value / 2 ) / ( this.indexProperty.value - 1 );
      }
      else if ( this.type === Type.CONVERGING_MIRROR || this.type === Type.DIVERGING_MIRROR ) {
        this.fProperty.value = this.radiusProperty.value / 2;
      }
      else {
        console.log( 'ERROR: plane mirrors and masks do not have finite focal length.' );
      }
      this.mainModel.processRays();
    },
    /**
     * Sets the diameter of the component
     * @param {number} diameter
     * @public
     */
    setDiameter: function( diameter ) {
      this.diameterProperty.value = diameter;
      this.mainModel.processRays();
    },

    /**
     * Sets the radius of the component
     * @param {number} radius
     * @public
     */
    setRadius: function( radius ) {
      this.radiusProperty.value = radius;
      this.mainModel.processRays();
    },
    /**
     * Sets the index of refraction of the component
     * @param {number} index
     * @public
     */
    setIndex: function( index ) {
      this.indexProperty.value = index;
      this.mainModel.processRays();
    },
    /**
     * Sets the position of the component
     * @param {Vector2} position
     * @public
     */
    setPosition: function( position ) {
      this.positionProperty.value = position;
      if ( !this.mainModel.processingRays ) {
        this.mainModel.processRays();
      }
    },

    /**
     * Sets the rotation angle of the component (with respect to its center)
     * @param {number} angleInRads
     * @public
     */
    setAngle: function( angleInRads ) {
      this.angleProperty.value = angleInRads;
      this.mainModel.processRays();
    }
  } );
} );