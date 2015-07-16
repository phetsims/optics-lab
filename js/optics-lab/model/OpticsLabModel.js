
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Optics Lab' screen.
 *
 * @author Mike Dubson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComponentModel = require( 'OPTICS_LAB/optics-lab/model/ComponentModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var SourceModel = require( 'OPTICS_LAB/optics-lab/model/SourceModel' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );


  function OpticsLabModel() {

    var opticsLabModel = this;

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
      addPiece: function( type ){
        switch( type ){
          case 'fan_source':
            //SourceModel( mainModel, type, nbrOfRays, position, spread, height )
            //var sourcePosition = new Vector2( 300, 300 );
            //var sourceModel = new SourceModel( this, 'fan', 20, sourcePosition, 45, 0 );
            //this.addSource( sourceModel );
            console.log( 'piece added is ' + type );
            break;
          case 'beam_source':
            console.log( 'piece added is ' + type );
            break;
          case 'converging_lens':
            console.log( 'piece added is ' + type );
            break;
          case 'diverging_lens':
            console.log( 'piece added is ' + type );
            break;
          case 'converging_mirror':
            console.log( 'piece added is ' + type );
            break;
          case 'plane_mirror':
            console.log( 'piece added is ' + type );
            break;
          case 'diverging_mirror':
            console.log( 'piece added is ' + type );
            break;
          case 'simple_mask':
            console.log( 'piece added is ' + type );
            break;
          case 'slit_mask':
            console.log( 'piece added is ' + type );
            break;
        }//end switch
      },
      addSource: function( source ) {
        this.sources.add( source );
        //source.setPosition( source.position );
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
        //var intersection;   //Vector2
        //var distanceToIntersection;   //Number = length of ray

        //loop thru all rayPaths of this source
        for ( var r = 0; r < source.rayPaths.length; r++ ) {
          var rayPath = source.rayPaths[ r ];
          rayPath.clearPath();
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
        //var rayPath = rayPath;
        //var startPoint = startPoint;
        var dir = direction;
        var intersection = null;
        var distanceToIntersection = this.maxLength;
        var rayTip = startPoint.plus( dir.timesScalar( this.maxLength ) );

        //loop thru all components
        var componentIntersectedNbr;
        for ( var j = 0; j < this.components.length; j++ ) {
          var compDiameter = this.components.get( j ).diameter;
          var compCenter = this.components.get( j ).position;
          var thisIntersection = Util.lineSegmentIntersection(
            startPoint.x, startPoint.y, rayTip.x, rayTip.y,
            compCenter.x, compCenter.y - compDiameter / 2, compCenter.x, compCenter.y + compDiameter / 2 );
          if( thisIntersection !== null ){
            var dist = thisIntersection.distance( startPoint );
            //console.log( 'dist = ' + dist );
            if ( dist > 10 &&  dist < distanceToIntersection ) {    //have to be sure component does not intersect its own starting ray
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
          rayPath.addSegment( startPoint, rayTip );   //rayPath ends
        }
      }, //end launchRay()


      processIntersection: function( rayPath, intersection, segmentNbr, componentNbr ){
        //var rayPath = rayPath;
        var incomingRayDir = rayPath.dirs[ segmentNbr ];
        //console.log( 'rayDir in degs is ' + incomingRayDir.angle()*180/Math.PI );
        var angleInRads = incomingRayDir.angle();
        var newAngleInRads;  // = angleInRads + 0.1*( Math.random() - 0.5 );
        //var newSegment = Vector2.createPolar( this.maxLength, newAngleInRads );
        //var segment = rayPath.segments[ segmentNbr ];
        var component = this.components.get( componentNbr );
        var r = ( intersection.y - component.position.y );
        var f = component.f;
        var tanTheta = Math.tan( angleInRads );
        //console.log( ' tanAngle is ' + tanTheta );
        var newDir;


        if( component.type === 'lens' ){
          //console.log( 'It is a lens.' );
          //var randomOutgoingRayDir = incomingRayDir +
          var fromLeft = false;
          var angleInDegrees = angleInRads*180/Math.PI;
          var sizeAngleInDegrees = Math.abs( angleInDegrees );
          if( sizeAngleInDegrees < 90 ){ fromLeft = true; }
          if( fromLeft ){
            newAngleInRads = - Math.atan( (r/f) - tanTheta );
          }else{
            newAngleInRads = Math.PI +
                             Math.atan( (r/f) + tanTheta );
          }

          newDir = new Vector2.createPolar( 1, newAngleInRads );
          //newSegment = Vector2.createPolar( this.maxLength, newAngleInRads );
          //rayPath.addSegment( intersection, intersection.plus( newSegment ));
          this.launchRay( rayPath, intersection, newDir );

        }else if ( component.type === 'curved_mirror' ){
          //console.log( 'It is a curved mirror.' );
        }else if( component.type === 'plane_mirror' ){
          //console.log( 'It is a plane mirror.' );
          newAngleInRads = Math.PI - angleInRads;
          newDir = new Vector2.createPolar( 1, newAngleInRads );
          this.launchRay( rayPath, intersection, newDir );

        }else if( component.type === 'mask' ){
          //Do nothing. The rayPath ends at a mask.
          //console.log( 'It is a mask.' );
        }else {
          console.log( 'ERROR: intersection component is unknown.' );
        }
      }//end processIntersection()
    }
  );
} );