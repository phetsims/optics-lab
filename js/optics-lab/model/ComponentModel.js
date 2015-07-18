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
      radius: radiusCurvature,
      f: focalLength,                 //@private
      index: index                        //@private
    } );

    var componentModel = this;
    this.mainModel = mainModel;

    //this.model = model;
    this.type = type; // 'converging_lens'|'diverging_lens'|'converging_mirror'|'plane_mirror'|etc.
    //this.diameter = diameter;
    //this.f = focalLength;
    //this.n = index;  //index of refraction n > 1 , n and f set radius of lens
    //this.position = new Vector2( 0, 0 );
    //this.model.addComponent( this );
    this.diameterProperty.link( function(){
      componentModel.mainModel.processRays();
    });
    this.radiusProperty.link( function(){
      componentModel.mainModel.processRays();
    });
    this.fProperty.link( function(){
      componentModel.mainModel.processRays();
    });
    this.indexProperty.link( function(){
      componentModel.mainModel.processRays();
    });
  }

  return inherit( PropertySet, ComponentModel, {
      setFocalLength: function( f ) {
        if ( this.type === 'converging_lens' || this.type === 'diverging_lens' ) {
          this.f = f;
          this.mainModel.processRays();
        }
        else {
          console.log( 'ERROR: plane mirrors and masks do not have finite focal length.' );
        }
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
      }
    }
  );
} );