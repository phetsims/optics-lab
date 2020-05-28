// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model type for a component such as a Mirror, or a Lens
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import opticsLab from '../../opticsLab.js';
import Type from './Type.js';

class ComponentModel {
  /**
   * @param {OpticsLabModel} mainModel
   * @param {Type} type
   * @param {number} diameter
   * @param {number} [radiusCurvature] - plane mirrors do not have a radius of curvature
   * @param {number} [index] - mirrors do not pass as index
   */
  constructor( mainModel, type, diameter, radiusCurvature, index ) {

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

    this.mainModel = mainModel;

    // @public (read-only) {string}
    this.type = type; // Type.CONVERGING_LENS|Type.DIVERGING_LENS|Type.CONVERGING_MIRROR|Type.PLANE_MIRROR|etc.
    if ( this.type === Type.CONVERGING_MIRROR || this.type === Type.DIVERGING_MIRROR ) {
      this.indexProperty.value = 2;  //needed so formula for focal length is correct in mirror case
    }

    this.diameterProperty.link( () => {
      mainModel.processRays();
    } );

    this.radiusProperty.link( radius => {
      const R = radius;   // R is signed.  + for converging lenses, - for diverging lenses
      const n = this.indexProperty.value;
      this.fProperty.value = R / ( 2 * ( n - 1 ) );  //focal length gets correct sign from sign of radius R.
      mainModel.processRays();
    } );

    this.indexProperty.link( index => {
      const R = this.radiusProperty.value;
      this.fProperty.value = R / ( 2 * ( index - 1 ) );
      mainModel.processRays();
    } );

    this.angleProperty.link( () => {
      mainModel.processRays();
    } );
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.diameterProperty.reset();
    this.radiusProperty.reset();
    this.indexProperty.reset();
    this.fProperty.reset();
    this.angleProperty.reset();
  }

  /**
   * @private TODO- looks unused
   */
  updateFocalLength() {
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
  }

  /**
   * Sets the diameter of the component
   * @param {number} diameter
   * @public
   */
  setDiameter( diameter ) {
    this.diameterProperty.value = diameter;
    this.mainModel.processRays();
  }

  /**
   * Sets the radius of the component
   * @param {number} radius
   * @public
   */
  setRadius( radius ) {
    this.radiusProperty.value = radius;
    this.mainModel.processRays();
  }

  /**
   * Sets the index of refraction of the component
   * @param {number} index
   * @public
   */
  setIndex( index ) {
    this.indexProperty.value = index;
    this.mainModel.processRays();
  }

  /**
   * Sets the position of the component
   * @param {Vector2} position
   * @public
   */
  setPosition( position ) {
    this.positionProperty.value = position;
    if ( !this.mainModel.processingRays ) {
      this.mainModel.processRays();
    }
  }

  /**
   * Sets the rotation angle of the component (with respect to its center)
   * @param {number} angleInRads
   * @public
   */
  setAngle( angleInRads ) {
    this.angleProperty.value = angleInRads;
    this.mainModel.processRays();
  }
}

opticsLab.register( 'ComponentModel', ComponentModel );
export default ComponentModel;