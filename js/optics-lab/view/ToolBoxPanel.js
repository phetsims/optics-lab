/**
 * Toolbox for selecting light sources, lenses, mirrors, and masks
 * Click on icon to drag sources or component onto stage
 * Drag component back to toolbox to delete from stage
 * Created by dubson on 7/14/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'KITE/segments/Line' );
  //var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  //
  // var Ray2 = require( 'DOT/Ray2' );
  //var Vector2 = require( 'DOT/Vector2' );

  /**
   * {vector2] startDir = direction of starting ray
   *
   * @constructor
   */

  function ToolBoxPanel( mainModel ) {



    //PropertySet.call( this, {
    //  startPosition: startPosition             //@private, position of source on stage
    //} );


    Panel.call( this )
  }//end constructor

  return inherit( Object, RayPath, {
      clearPath: function() {

      }


    }//end inherit
  );
} );
