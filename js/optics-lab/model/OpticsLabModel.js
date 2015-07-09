
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
  var Vector2 = require( 'DOT/Vector2' );


  function OpticsLabModel() {

    PropertySet.call( this, {
      processRaysCount: 0            //@private, position of source on stage
    } );

    this.sources = new ObservableArray();
    this.components = new ObservableArray();
    this.maxLength = 2000;  //maximum length of segment of rayPath

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
          this.updateSourceLines( this.sources.get( i ));   //sources is an observable array, hence .get(i)
        }
        this.processRaysCount += 1;
      },
      updateSourceLines: function( source ) {
        var intersection;   //Vector2
        var distanceToIntersection;   //Number = length of ray

        //loop thru all rayPaths of this source
        for ( var r = 0; r < source.rayPaths.length; r++ ) {
          var rayPath = source.rayPaths[ r ];
          var startPoint = rayPath.startPos; //rayPath.segments[ 0 ].getStart();
          var direction = rayPath.startDir;
          //launchRay() assumes that segment is not yet added, so clear the segment
          //rayPath.segments = [];
          //rayPath.dirs = [];
          //rayPath.lengths = [];
          this.launchRay( rayPath, startPoint, direction );

        }//end rayPath loop
      }, //end updateSourceLines()

      launchRay: function( rayPath, startPoint, direction ){
        var rayPath = rayPath;
        var startPoint = startPoint;
        var dir = direction;
        var intersection = null;
        var distanceToIntersection = this.maxLength;
        var rayTip = startPoint.plus( dir.timesScalar( this.maxLength ) );

        //loop thru all components
        var componentIntersectedNbr = undefined;
        for ( var j = 0; j < this.components.length; j++ ) {
          var compDiameter = this.components.get( j ).diameter;
          var compCenter = this.components.get( j ).position;
          var thisIntersection = Util.lineSegmentIntersection(
            startPoint.x, startPoint.y, rayTip.x, rayTip.y,
            compCenter.x, compCenter.y - compDiameter / 2, compCenter.x, compCenter.y + compDiameter / 2 );
          if( thisIntersection !== null ){
            var dist = thisIntersection.distance( startPoint );
            //console.log( 'dist = ' + dist );
            if ( dist < distanceToIntersection ) {
              distanceToIntersection = dist;
              intersection = thisIntersection;
              componentIntersectedNbr = j;
            }
          }
        }//end component loop
        if ( intersection !== null ) {
          rayPath.addSegment( startPoint, intersection );
          var tailSegmentNbr = rayPath.segments.length - 1;
          this.processIntersection( rayPath, intersection, tailSegmentNbr , componentIntersectedNbr );
        }
        else {
          rayPath.addSegment( startPoint, rayTip );
        }
      }, //end launchRay()

      //endPath: function( rayPath, lastSegmentNbr ){
      //
      //},
      processIntersection: function( rayPath, intersection, segmentNbr, componentNbr ){
        var rayPath = rayPath;
        var incomingRayDir = rayPath.dirs[ segmentNbr ];
        var angleInRads = incomingRayDir.angle();
        var newAngleInRads;  // = angleInRads + 0.1*( Math.random() - 0.5 );
        //var newSegment = Vector2.createPolar( this.maxLength, newAngleInRads );
        var segment = rayPath.segments[ segmentNbr ];
        var component = this.components.get( componentNbr );
        var r = ( intersection.y - component.position.y );
        var f = component.f;
        var tanTheta = Math.tan( angleInRads );


        if( component.type === 'lens' ){
          console.log( 'It is a lens.' );
          //var randomOutgoingRayDir = incomingRayDir +
          newAngleInRads = - Math.atan( (r/f) - tanTheta );
          //newSegment = Vector2.createPolar( this.maxLength, newAngleInRads );
          //rayPath.addSegment( intersection, intersection.plus( newSegment ));
          this.launchRay( rayPath, intersection, newAngleInRads );
        }else if ( component.type === 'curved_mirror' ){
          console.log( 'It is a curved mirror.' );
        }else if( component.type === 'plane_mirror' ){
          console.log( 'It is a plane mirror.' );
        }else if( component.type === 'mask' ){
          console.log( 'It is a mask.' );
        }else {
          console.log( 'ERROR: intersection component is unknown.' );
        }
      }//end processIntersection()
    }
  );
} );