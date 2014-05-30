// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Optics Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {BarMagnetModel} model
   * @constructor
   */
  function OpticsLabScreenView( model ) {

    var opticsLabScreenView = this;
    ScreenView.call( opticsLabScreenView, {renderer: 'svg'} );

    var sources = [];
    var walls = [];

    var updateSourceLines = function( source ) {
      var lines = source.lines;
      for ( var j = 0; j < lines.length; j++ ) {
        var line = lines[j];
        var dt = Vector2.createPolar( 10000, line.lineAngle );

        //see if it hits a wall

        var intersection = null;
        var sourceCenterX = source.circle.centerX;
        var sourceCenterY = source.circle.centerY;
        for ( var i = 0; i < walls.length; i++ ) {
          var wall = walls[i];
          var wallIntersection = Util.lineSegmentIntersection( sourceCenterX, sourceCenterY, sourceCenterX + dt.x, sourceCenterY + dt.y, wall.centerX, wall.top, wall.centerX, wall.bottom );
          if ( wallIntersection ) {
            intersection = wallIntersection;
            break;
          }
        }
        if ( intersection ) {
          line.setLine( sourceCenterX, sourceCenterY, intersection.x, intersection.y );
        }
        else {
          line.setLine( sourceCenterX, sourceCenterY, sourceCenterX + dt.x, sourceCenterY + dt.y );
        }
      }
    };

    var updateAllSources = function() {
      for ( var i = 0; i < sources.length; i++ ) {
        var source = sources[i];
        updateSourceLines( source );
      }
    };

    for ( var i = 0; i < 5; i++ ) {
      (function( i ) {
        var circle = new Circle( 20, {stroke: 'white', lineWidth: 4, centerX: 100, centerY: i * 60 + 10, cursor: 'pointer'} );
        opticsLabScreenView.addChild( circle );

        //Add the lines
        var numLines = 9;
        var maxAngle = Math.PI / 6;
        var linearFunction = new LinearFunction( 0, numLines, -maxAngle, maxAngle );
        var lines = [];
        for ( var k = 0; k < numLines; k++ ) {
          var angle = linearFunction( k );
          var vector = Vector2.createPolar( 10000, angle );
          var line = new Line( circle.centerX, circle.centerY, vector.x + circle.centerX, vector.y + circle.centerY, {stroke: 'white', lineWidth: 1, pickable: false} );
          line.lineAngle = angle;
          opticsLabScreenView.addChild( line );
          lines.push( line );
        }

        var source = {circle: circle, lines: lines};
        circle.addInputListener( new SimpleDragHandler( {
          translate: function( params ) {
            circle.translate( params.delta.x, params.delta.y );
            updateSourceLines( source );
          }
        } ) );
        sources.push( source );
      })( i );
    }

    for ( var i = 0; i < 5; i++ ) {
      (function( i ) {
        var y = i * 110 + 5;
        var wall = new Rectangle( 400, y, 6, 100, {fill: 'white', cursor: 'pointer'} );
        walls.push( wall );
        opticsLabScreenView.addChild( wall );
        wall.addInputListener( new SimpleDragHandler( {
          translate: function( params ) {
            wall.translate( params.delta.x, params.delta.y );
            updateAllSources();
          }
        } ) );
      })( i );
    }

  }

  return inherit( ScreenView, OpticsLabScreenView );
} );