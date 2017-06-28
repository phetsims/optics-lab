// Copyright 2016, University of Colorado Boulder

/**
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var opticsLab = require( 'OPTICS_LAB/opticsLab' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @extends {PropertySet}
   *
   * @param {OpticsLabModel} mainModel
   * @param {string} type
   * @param {number} diameter
   * @param {number} radiusCurvature
   * @param {number} index
   * @constructor
   */
  function ComponentModel( mainModel, type, diameter, radiusCurvature, index ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 ),  //@private, position of source on stage
      diameter: diameter,             //@private
      radius: radiusCurvature,       //@private
      index: index,                  //@private, index of refraction of lens
      f: 500,                        //focal length of component of lens or mirror
      angle: 0                        //tilt angle of component, 0 = optic axis is horizontal, + angle is CW
    } );

    var self = this;
    this.mainModel = mainModel;

    this.type = type; // 'converging_lens'|'diverging_lens'|'converging_mirror'|'plane_mirror'|etc.
    if ( this.type === 'converging_mirror' || this.type === 'diverging_mirror' ) {
      this.index = 2;  //needed so formula for focal length is correct in mirror case
    }
    this.diameterProperty.link( function() {
      self.mainModel.processRays();
    } );
    this.radiusProperty.link( function( radius ) {
      var R = self.radius;   //R is signed.  + for converging lenses, - for diverging lenses
      var n = self.index;
      self.f = R / ( 2 * ( n - 1 ));  //focal length gets correct sign from sign of radius R.
      self.mainModel.processRays();
    } );

    this.indexProperty.link( function() {
      var R = self.radius;
      var n = self.index;
      self.f = R / ( 2 * ( n - 1 ));
      self.mainModel.processRays();
    } );
    this.angleProperty.link( function() {
      self.mainModel.processRays();
    } );
  }

  opticsLab.register( 'ComponentModel', ComponentModel );

  return inherit( PropertySet, ComponentModel, {
      updateFocalLength: function() {
        if ( this.type === 'converging_lens' || this.type === 'diverging_lens' ) {
          this.f = ( this.radius / 2 ) / ( this.index - 1 );
        }
        else if ( this.type === 'converging_mirror' || this.type === 'diverging_mirror' ) {
          this.f = this.radius / 2;
        }
        else {
          console.log( 'ERROR: plane mirrors and masks do not have finite focal length.' );
        }
        this.mainModel.processRays();
      },
      setDiameter: function( diameter ) {
        this.diameter = diameter;
        this.mainModel.processRays();
      },
      setRadius: function( radius ) {
        this.radius = radius;
        this.mainModel.processRays();
      },
      setIndex: function( index ) {
        this.index = index;
        this.mainModel.processRays();
      },
      setPosition: function( position ) {   //position is vector2
        this.position = position;
        //console.log( 'component position is ' + position );
        if ( !this.mainModel.processingRays ) {
          this.mainModel.processRays();
        }
      },
      setAngle: function( angleInRads ) {
        this.angle = angleInRads;
        this.mainModel.processRays();
      }
    }
  );
} );