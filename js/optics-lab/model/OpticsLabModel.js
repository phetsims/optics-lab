
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
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );


  function OpticsLabModel() {

    PropertySet.call( this, {
      processRaysCount: 0            //@private, position of source on stage
    } );

    this.sources = new ObservableArray();
    this.components = new ObservableArray();
    //this.sources = [];
    //this.components = [];
  }

  return inherit( PropertySet, OpticsLabModel, {
      addSource: function( source ) {
        this.sources.add( source );
        //this.sources.push( source );
      },
      addComponent: function( component ) {
        this.components.add( component );
        //this.components.push( component );
      },
      removeSource: function( source ) {
        this.sources.remove( source );
        //var index = sources.indexOf( source );
        //this.sources.splice( index, 1 );
      },
      removeComponent: function( component ) {
        this.components.remove( component );
        //var index = this.components.indexOf( component );
        //this.components.splice( index, 1 );
      },
      processRays: function(){
        //loop through all sources
        for (var i = 0; i < this.sources.length; i++ ){
          //this.updateSourceLines( this.sources[ i ]);
          this.updateSourceLines( this.sources.get( i ));
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
            var compDiameter = this.components.get( j ).diameter;
            var compCenter = this.components.get( j ).position;
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