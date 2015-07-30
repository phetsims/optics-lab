/**
 * Created by Duso on 6/28/2015.
 */

define( function( require ) {
    'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  //var Ray2 = require( 'DOT/Ray2' );
  var Vector2 = require( 'DOT/Vector2' );


  function ComponentModel( mainModel, type, diameter, radiusCurvature, index ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 ),  //@private, position of source on stage
      diameter: diameter,             //@private
      radius: radiusCurvature,       //@private
      index: index,                  //@private
      f: 500,
      angle: 0                        //tilt angle of component, 0 = optic axis is horizontal, + angle is CW
    } );

    var componentModel = this;
    this.mainModel = mainModel;

    //this.model = model;
    this.type = type; // 'converging_lens'|'diverging_lens'|'converging_mirror'|'plane_mirror'|etc.
    if( this.type === 'converging_mirror' || this.type === 'diverging_mirror' ){
      this.index = 2;  //needed so formula for focal length is correct in mirror case
    }
    //this.diameter = diameter;
    //this.n = index;  //index of refraction n > 1 , n and f set radius of lens
    //this.position = new Vector2( 0, 0 );
    //this.model.addComponent( this );
    this.diameterProperty.link( function(){
      componentModel.mainModel.processRays();
    });
    this.radiusProperty.link( function( radius ){
      //console.log( 'radius is ' + radius );
      var R = componentModel.radius;   //R is signed.  + for converging lenses, - for diverging lenses
      var n = componentModel.index;
      componentModel.f = R/( 2 * ( n - 1 ));  //focal length gets correct sign from sign of radius R.
      console.log(  'R curvature = ' + R + '   f = ' + componentModel.f );
      componentModel.mainModel.processRays();
    });
    //this.fProperty.link( function(){    //probably unused
    //  componentModel.mainModel.processRays();
    //});
    this.indexProperty.link( function(){
      var R = componentModel.radius;
      var n = componentModel.index;
      componentModel.f = R/( 2 * ( n - 1 ));
      componentModel.mainModel.processRays();
    });
    this.angleProperty.link( function(){
      componentModel.mainModel.processRays();
    });
  }

  return inherit( PropertySet, ComponentModel, {
      updateFocalLength: function() {
        if ( this.type === 'converging_lens' || this.type === 'diverging_lens' ) {
          this.f = ( this.radius/2 )/( this.index - 1 );
        }
        else if( this.type === 'converging_mirror' || this.type === 'diverging_mirror'  ) {
          this.f =  this.radius/2 ;
        }else{
          console.log( 'ERROR: plane mirrors and masks do not have finite focal length.' );
        }
        this.mainModel.processRays();
      },
      setDiameter: function( diameter ) {
        this.diameter = diameter;
        this.mainModel.processRays();
      },
      setRadius: function( radius ){
        this.radius = radius;
        this.mainModel.processRays();
      },
      setIndex: function ( index ){
        this.index = index;
        this.mainModel.processRays();
      },
      setPosition: function( position ) {   //position is vector2
        this.position = position;
        //console.log( 'component position is ' + position );
        this.mainModel.processRays();
      },
      setAngle: function( angleInRads ){
        this.angle = angleInRads;
        this.mainModel.processRays();
      }
    }
  );
} );