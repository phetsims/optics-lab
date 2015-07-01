
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
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );


  function OpticsLabModel() {

    PropertySet.call( this, {
      processRaysCount: 0            //@private, position of source on stage
    } );

    this.sources = [];
    this.components = [];
  }

  return inherit( PropertySet, OpticsLabModel, {
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
      processRays2: function() {
        var maxDist = 2000;
        for ( var i = 0; i < this.sources.length; i++ ) {
          for ( var j = 0; j < this.components.length; j++ ) {
            for ( var r = 0; r < this.sources[ i ].rays.length; r++ ) {
              //console.log( 'processRays i = ' + i + '  j = ' + j + '  r = ' + r );
              var rayStart = this.sources[ i ].rays[ r ].pos;
              var dir = this.sources[ i ].rays[ r ].dir;
              //console.log( 'rayStart = ' + rayStart );
              var rayEnd = this.sources[ i ].rayTips[ r ]; //rayStart.plus( dir.timesScalar( maxDist ) );
              //console.log( 'rayEnd = ' + rayEnd );
              var compDiameter = this.components[ j ].diameter;
              var compCenter = this.components[ j ].position;
              var intersection = Util.lineSegmentIntersection(
                rayStart.x, rayStart.y, rayEnd.x, rayEnd.y,
                compCenter.x, compCenter.y - compDiameter / 2, compCenter.x, compCenter.y + compDiameter / 2 );

              if ( intersection !== null ) {
                this.sources[ i ].rayBreaks[ r ] = intersection;
                console.log('intersection between source  ' + i + ' and component ' + j + ' at ' + intersection );
              }
              else {
                //this.sources[ i ].rayBreaks[ r ] = rayEnd;
              }
            }
          }
        }
        this.processRaysCount += 1;
      }, //end processRays2()
      processRays: function(){
        //loop through all sources
        for (var i = 0; i < this.sources.length; i++ ){
          this.updateSourceLines( this.sources[ i ])
        }
        this.processRaysCount += 1;
      },
      updateSourceLines: function( source ) {

        //loop through all rays
        var intersection;
        var distanceToIntersection;
        for ( var r = 0; r < source.rays.length; r++ ) {
          intersection = null;
          distanceToIntersection = source.maxLength;
          var rayStart = source.rays[ r ].pos;
          var rayTip = source.rayTips[ r ];

          //loop thru all components
          for ( var j = 0; j < this.components.length; j++ ) {
            var compDiameter = this.components[ j ].diameter;
            var compCenter = this.components[ j ].position;
            var thisIntersection = Util.lineSegmentIntersection(
              rayStart.x, rayStart.y, rayTip.x, rayTip.y,
              compCenter.x, compCenter.y - compDiameter / 2, compCenter.x, compCenter.y + compDiameter / 2 );
            if( thisIntersection !== null ){
              var dist = thisIntersection.distance( rayStart );
              //console.log( 'dist = ' + dist );
              if ( dist < distanceToIntersection ) {
                distanceToIntersection = dist;
                intersection = thisIntersection;
              }
            }
          }//end component loop
          if ( intersection !== null ) {
            source.rayBreaks[ r ] = intersection;
          }
          else {
            source.rayBreaks[ r ] = rayTip;
          }
        }//end ray loop
      }//end updateSourceLines()
    }
  );
} );