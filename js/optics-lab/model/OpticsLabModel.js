
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
          this.updateSourceLines( this.sources.get( i ));   //sources is an observable array, hence .get(i)
        }
        this.processRaysCount += 1;
      },
      updateSourceLines: function( source ) {

        //loop through all rayPaths
        var intersection;
        var distanceToIntersection;

        //loop thru all rayPaths of this source
        for ( var r = 0; r < source.rayPaths.length; r++ ) {

          //loop thru all segments of this rayPath
          for ( var s = 0; s < source.rayPaths[ r ].segments.length; s++ ){
            intersection = null;
            var maxLength = source.maxLength;
            distanceToIntersection = maxLength;
            var rayStart = source.rayPaths[ r ].segments[ s ].getStart();
            var rayTip = rayStart.plus( source.rayPaths[ r ].dirs[ s ].timesScalar( maxLength ) );

            //loop thru all components
            var componentIntersected = null;
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
                  componentIntersected = this.components.get( j );
                }
              }
            }//end component loop
            if ( intersection !== null ) {
              source.rayPaths[ r ].segments[ s ]._end = intersection;   //Later, JO will provide Line.getEnd()
            }
            else {
              source.rayPaths[ r ].segments[ s ]._end = rayTip;
            }
          }//end segment loop
        }//end rayPath loop
      }//end updateSourceLines()
    }
  );
} );