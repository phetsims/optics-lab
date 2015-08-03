
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Optics Lab' screen.
 *
 * @author Mike Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  //var ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  //var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );


  function OpticsLabModel() {

    //var opticsLabModel = this;

    PropertySet.call( this, {
      processRaysCount: 0            //@private, number of times processRays() called, flag for further processing
    } );
    this.processingRays = false;  //true if rays are being processed,
                              // needed to ensure current processing to end before new processing begins

    this.sources = new ObservableArray();     //source of light rays
    this.components = new ObservableArray();  //component = lens, mirror, or mask
    this.pieces = new ObservableArray();      //piece = source or component
    this.maxLength = 2000;  //maximum length of segment of rayPath
    this.maxNbrOfRaysFromASource = 20;
    this.maxNbrIntersections = 100;  //maximum number of segments in a raypath, to prevent endless loops
    this.intersectionCounter = 0;

    //this.sources = [];
    //this.components = [];
  }

  return inherit( PropertySet, OpticsLabModel, {

      addSource: function( source ) {
        this.sources.add( source );
        this.pieces.add( source );
        source.setPosition( source.position );
        //this.sources.push( source );
      },
      addComponent: function( component ) {
        this.components.add( component );
        this.pieces.add( component );
        //this.components.push( component );
      },
      removeSource: function( source ) {
        this.sources.remove( source );
        this.processRays();
      },
      removeComponent: function( component ) {
        this.components.remove( component );
        this.processRays();
      },
      processRays: function(){
        //loop through all sources
        for (var i = 0; i < this.sources.length; i++ ){
          this.updateSourceLines( this.sources.get( i ));   //sources is an observable array, hence .get(i)
        }
        this.processRaysCount += 1;  //increment number of times processRays called
      },
      updateSourceLines: function( source ) {
        this.processingRays = true;
        this.intersectionCounter = 0;
        //loop thru all rayPaths of this source
        for ( var r = 0; r < source.rayPaths.length; r++ ) {
          var rayPath = source.rayPaths[ r ];
          rayPath.clearPath();
          var startPoint = rayPath.startPos; //rayPath.segments[ 0 ].getStart();
          var direction = rayPath.startDir;
          this.launchRay( rayPath, startPoint, direction );

        }//end rayPath loop
        this.processingRays = false;
      }, //end updateSourceLines()

      launchRay: function( rayPath, startPoint, direction ){
        var dir = direction;
        var intersection = null;
        var distanceToIntersection = this.maxLength;
        var rayTip = startPoint.plus( dir.timesScalar( this.maxLength ) );

        //loop thru all components, checking for intersection of ray and component
        var componentIntersectedIndex;
        for ( var j = 0; j < this.components.length; j++ ) {
          var compDiameter = this.components.get( j ).diameter;
          var compCenter = this.components.get( j ).position;
          var compAngle = -this.components.get( j ).angle;
          var sinAngle = Math.sin( compAngle );
          var cosAngle = Math.cos( compAngle );
          var thisIntersection = Util.lineSegmentIntersection(
            startPoint.x, startPoint.y, rayTip.x, rayTip.y,
            compCenter.x - ( compDiameter / 2 ) * sinAngle,
            compCenter.y - ( compDiameter / 2 ) * cosAngle,
            compCenter.x + ( compDiameter / 2 ) * sinAngle,
            compCenter.y + ( compDiameter / 2 ) * cosAngle );
          if( thisIntersection !== null ){
            var dist = thisIntersection.distance( startPoint );
            //console.log( 'dist = ' + dist );
            if ( dist > 2 &&  dist < distanceToIntersection ) {    //> 10 to be sure component does not intersect its own starting ray
              distanceToIntersection = dist;
              intersection = thisIntersection;
              componentIntersectedIndex = j;
            }
          }
        }//end component loop

        if ( intersection !== null ) {
          rayPath.addSegment( startPoint, intersection );
          var tailSegmentNbr = rayPath.segments.length - 1;
          this.processIntersection( rayPath, intersection, tailSegmentNbr , componentIntersectedIndex );
          rayPath.nbrSegments += 1;  //increment segment counter to check for runaway raypath
        }
        else {
          rayPath.addSegment( startPoint, rayTip );   //rayPath ends
        }

      }, //end launchRay()


      processIntersection: function( rayPath, intersection, segmentNbr, componentNbr ){
        var incomingRayDir = rayPath.dirs[ segmentNbr ];
        //console.log( 'rayDir in degs is ' + incomingRayDir.angle()*180/Math.PI );
        //var angleInRads = incomingRayDir.angle();
        var incomingAngle =  incomingRayDir.angle();   //angle in rads between direction of ray and component normal
        var outgoingAngle;
        var component = this.components.get( componentNbr );
        var componentAngle = component.angle;  //tilt of component = angle between horizontal and component normal
        var componentNormal = new Vector2( Math.cos( componentAngle ), Math.sin( componentAngle )) ;
        var componentParallel = new Vector2( -Math.sin( componentAngle ), Math.cos( componentAngle ) ) ;
        //var angleInRads = incomingRayDir.angleBetween( componentNormal );  //NO GOOD: .angleBetween is always positive
        var angleInRads = incomingAngle - componentAngle;
        //var r = ( intersection.y - component.position.y );
        //var r = intersection.distance( component.position );       //NO GOOD, distance is positive always
        //normalDirection is true if the ray direction is along the direction of the component normal +/- 90 degrees
        var normalDirection = true;
        if( incomingRayDir.dot( componentNormal ) < 0 ){
          normalDirection = false;
        }

        var r = ( intersection.minus( component.position )).dot(componentParallel);

        var f = component.f;   //f = focal length
        var tanTheta = Math.tan( angleInRads );
        //console.log( ' tanAngle is ' + tanTheta );
        var newDir;
        if( rayPath.nbrSegments > rayPath.maxNbrSegments ){
          //do nothing, ray terminates if too many segments, probably caught in infinite reflection loop
          console.log( 'Max number of raypath segments exceeded' );
        }else if( component.type === 'converging_lens' || component.type === 'diverging_lens' ){
          if( normalDirection ){
            outgoingAngle = - Math.atan( (r/f) - tanTheta ) + componentAngle;
          }else{
            //newAngleInRads = Math.PI + Math.atan( (r/f) + tanTheta ) - componentAngle;
            outgoingAngle = Math.PI + Math.atan( (r/f) + tanTheta ) + componentAngle;
          }

          newDir = new Vector2.createPolar( 1, outgoingAngle );
          this.launchRay( rayPath, intersection, newDir );

        }else if ( component.type === 'converging_mirror' ) {
          if( normalDirection ){
            outgoingAngle = Math.PI + Math.atan( (r / f) - tanTheta ) + componentAngle;
            //console.log( 'tanThetaIncoming = ' + tanTheta + '    Math.atan( (r/f) + tanTheta  = ' + Math.atan( (r / f) + tanTheta ));
            newDir = new Vector2.createPolar( 1, outgoingAngle );
            this.launchRay( rayPath, intersection, newDir );
          }

          //console.log( 'It is a curved mirror.' );
        }else if( component.type === 'diverging_mirror' ){
          if( normalDirection ){
            outgoingAngle = Math.PI + Math.atan( (r / f) - tanTheta )  + componentAngle;
            newDir = new Vector2.createPolar( 1, outgoingAngle );
            this.launchRay( rayPath, intersection, newDir );
          }

        }else if( component.type === 'plane_mirror' ){
          //console.log( 'It is a plane mirror.' );
          if( normalDirection ){
            outgoingAngle = Math.PI - angleInRads  + componentAngle;
            newDir = new Vector2.createPolar( 1, outgoingAngle );
            this.launchRay( rayPath, intersection, newDir );
          }


        }else if( component.type === 'simple_mask' ){
          //Do nothing. The rayPath ends at a mask.
          //console.log( 'It is a mask.' );
        }else {
          console.log( 'ERROR: intersection component is unknown.' );
        }
      }//end processIntersection()
    }
  );
} );