/**
 * Created by Duso on 6/28/2015.
 */

define( function( require ) {
    'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Ray2 = require( 'DOT/Ray2' );
  var Vector2 = require( 'DOT/Vector2' );


  function ComponentModel( mainModel, type, diameter, focalLength ) {

    PropertySet.call( this, {
      position: 0               //@private, position of source on stage
    } );

    this.componentModel = this;
    this.mainModel = mainModel;

    //this.model = model;
    this.type = type; // 'lens'|'curved_mirror'|'plane_mirror'|'mask'
    this.diameter = diameter;
    this.f = focalLength;
    this.position = new Vector2( 0, 0 );
    //this.model.addComponent( this );
  }

  return inherit( PropertySet, ComponentModel, {
      setFocalLength: function( f ) {
        if ( this.type === 'lens' || this.type === 'curved_mirror' ) {
          this.f = f;
          this.mainModel.processRays();
        }
        else {
          console.log( 'ERROR: plane mirrors and masks do not have finite focal length.' )
        }
      },
      setDiameter: function( diameter ) {
        this.diameter = diameter;
        this.mainModel.processRays();
      },
      setPosition: function( position ) {   //position is vector2
        this.position = position;
        this.mainModel.processRays();
      }
    }
  );
} );