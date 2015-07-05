/**
 * A RayPath is an array of line segments representing the path of a ray of light
 * starting from the source and bending at each component, ending at a mask or at infinity
 * Created by dubson on 7/5/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Ray2 = require( 'DOT/Ray2' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {String} type = 'fan'|'beam' = fan of diverging rays or beam of parallel rays
   * @param {Number} nbrOfRays
   * @param {Number} spread = for fan source, range of angles in degrees; for beam, spread is zero
   * @param {Number} height = for beam source, range of y-position in cm; for fan, height is zero
   * @constructor
   */

  function RayPath( mainModel, startPosition ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 )               //@private, position of source on stage
    } );

    this.rayPath = this;
    this.mainModel = mainModel;

    this.position = new Vector2( 0, 0 );
    this.maxLength = 2000;  //maximum length of rays in pixels


    this.raySegments = [];    //an array of rays


  }

  return inherit( PropertySet, SourceModel, {


    }//end inherit
  );
} );
