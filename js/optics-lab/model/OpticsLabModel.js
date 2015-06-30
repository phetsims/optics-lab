
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Optics Lab' screen.
 *
 * @author Mike Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function OpticsLabModel() {
    this.sources = [];
    this.components = [];

  }

  return inherit( Object, OpticsLabModel, {
      addSource: function( source ) {
        this.sources.push( source );
      },
      addComponent: function( component ) {
        this.components.push( component );
      },
      removeSource: function( source ) {
        var index = sources.indexOf( source );
        this.sources.splice( index, 1 );
      },
      removeComponent: function( component ) {
        var index = this.components.indexOf( component );
        this.components.splice( index, 1 );
      },
      processRays: function() {
        var maxDist = 2000;
        for( var i = 0; i < this.sources.length; i++ ){
          for( var j = 0; j < this.components.length; j++ ){
            for( var r = 0; r < this.sources[ i ].rays.length; r++ ){
              for( var s = 0; s < this.components[ j ].length; l++ ){
                var rayStart = this.source[ i ].rays[ r ].pos;
                var rayEnd = this.source[ i ].rayEnds[ r ];
                var compDiameter = this.components[ j ].diameter;
                var compCenter = this.components[ j ].position;
                var intersection = Util.lineSegmentIntersection(
                  rayStart.x, rayStart.y, rayEnd.x, rayEnd.y,
                  compCenter.x, compCenter.y - compDiameter/2, compCenter.x, compCenter.y + compDiameter/2 );
                if( intersection != null ){
                  rayEnd = intersection;
                }
              }
            }
          }
        }

      }//end processRays()
    }
  );
} );