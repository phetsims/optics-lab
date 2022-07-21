// Copyright 2014-2022, University of Colorado Boulder

/**
 * Model for the 'Optics Lab' screen.
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import opticsLab from '../../opticsLab.js';
import OpticsLabConstants from '../OpticsLabConstants.js';
import Type from './Type.js';

class OpticsLabModel {

  constructor() {

    // @private {Property.<number>} number of times processRays() called, flag for further processing
    this.processRaysCountProperty = new NumberProperty( 0 );

    // @public (read-only) boolean
    this.processingRays = false;  //true if rays are being processed,
    // needed to ensure current processing to end before new processing begins

    // @private {ObservableArrayDef.<SourceModel>}
    this.sources = createObservableArray();     //source of light rays

    // @private {ObservableArrayDef.<ComponentModel>}
    this.components = createObservableArray();  //component = lens, mirror, or mask

    // @private {ObservableArrayDef.<ComponentModel|SourceModel>}
    this.pieces = createObservableArray();      //piece = source or component
  }


  /**
   * @public
   */
  reset() {
    this.sources.clear();
    this.components.clear();
    this.pieces.clear();
    this.processRaysCountProperty.reset();
  }

  /**
   * Adds a source of light to the model
   * @param {SourceModel} source
   * @public
   */
  addSource( source ) {
    this.sources.add( source );
    this.pieces.add( source );
    source.setPosition( source.positionProperty.value );
  }

  /**
   * Adds a component (lens/mirror) to the model
   * @param {ComponentModel} component
   * @public
   */
  addComponent( component ) {
    this.components.add( component );
    this.pieces.add( component );
  }

  /**
   * Removes a source of light from the model
   * @param {SourceModel} source
   * @public
   */
  removeSource( source ) {
    if ( this.sources.includes( source ) ) {
      this.sources.remove( source );
    }

    this.processRays();
  }

  /**
   * Removes a component (mirror/lens) from the model
   * @param {ComponentModel} component
   * @public
   */
  removeComponent( component ) {
    if ( this.components.includes( component ) ) {
      this.components.remove( component );
    }
    this.processRays();
  }

  /**
   * @public
   */
  processRays() {
    //loop through all sources
    for ( let i = 0; i < this.sources.length; i++ ) {
      this.updateSourceLines( this.sources.get( i ) );   //sources is an observable array, hence .get(i)
    }
    this.processRaysCountProperty.value += 1;  //increment number of times processRays called
  }

  /**
   *
   * @param {SourceModel} source
   * @private
   */
  updateSourceLines( source ) {
    this.processingRays = true;
    //loop thru all rayPaths of this source
    for ( let r = 0; r < source.rayPaths.length; r++ ) {
      const rayPath = source.rayPaths[ r ];
      rayPath.clearPath();
      const startPoint = rayPath.startPos; //rayPath.segments[ 0 ].getStart();
      const direction = rayPath.startDir;
      this.launchRay( rayPath, startPoint, direction );

    }//end rayPath loop
    this.processingRays = false;
  } //end updateSourceLines()

  /**
   *
   * @param {RayPath} rayPath
   * @param {Vector2} startPoint
   * @param {Vector2} direction
   * @private
   */
  launchRay( rayPath, startPoint, direction ) {
    const dir = direction;
    let intersection = null;
    let distanceToIntersection = OpticsLabConstants.MAXIMUM_RAY_LENGTH;
    const rayTip = startPoint.plus( dir.timesScalar( OpticsLabConstants.MAXIMUM_RAY_LENGTH ) );

    //loop thru all components, checking for intersection of ray and component
    let componentIntersectedIndex;
    for ( let j = 0; j < this.components.length; j++ ) {
      const compDiameter = this.components.get( j ).diameterProperty.value;
      const compCenter = this.components.get( j ).positionProperty.value;
      const compAngle = -this.components.get( j ).angleProperty.value;
      const sinAngle = Math.sin( compAngle );
      const cosAngle = Math.cos( compAngle );
      const thisIntersection = Utils.lineSegmentIntersection(
        startPoint.x, startPoint.y, rayTip.x, rayTip.y,
        compCenter.x - ( compDiameter / 2 ) * sinAngle,
        compCenter.y - ( compDiameter / 2 ) * cosAngle,
        compCenter.x + ( compDiameter / 2 ) * sinAngle,
        compCenter.y + ( compDiameter / 2 ) * cosAngle );
      if ( thisIntersection !== null ) {
        const dist = thisIntersection.distance( startPoint );
        if ( dist > 2 && dist < distanceToIntersection ) {    //> 10 to be sure component does not intersect its own starting ray
          distanceToIntersection = dist;
          intersection = thisIntersection;
          componentIntersectedIndex = j;
        }
      }
    }//end component loop

    if ( intersection !== null ) {
      rayPath.addSegment( startPoint, intersection );
      const tailSegmentNbr = rayPath.segments.length - 1;
      this.processIntersection( rayPath, intersection, tailSegmentNbr, componentIntersectedIndex );
      rayPath.nbrSegments += 1;  //increment segment counter to check for runaway raypath
    }
    else {
      rayPath.addSegment( startPoint, rayTip );   //rayPath ends
    }

  } //end launchRay()

  /**
   *
   * @param {RayPath} rayPath
   * @param {Vector2} intersection
   * @param {number} segmentNbr
   * @param {number} componentNbr
   * @private
   */
  processIntersection( rayPath, intersection, segmentNbr, componentNbr ) {
    const incomingRayDir = rayPath.dirs[ segmentNbr ];
    const incomingAngle = incomingRayDir.angle;   //angle in rads between direction of ray and component normal
    let outgoingAngle;
    const component = this.components.get( componentNbr );
    const componentAngle = component.angleProperty.value;  //tilt of component = angle between horizontal and component normal
    const componentNormal = new Vector2( Math.cos( componentAngle ), Math.sin( componentAngle ) );
    const componentParallel = new Vector2( -Math.sin( componentAngle ), Math.cos( componentAngle ) );
    const angleInRads = incomingAngle - componentAngle;
    let normalDirection = true;
    if ( incomingRayDir.dot( componentNormal ) < 0 ) {
      normalDirection = false;
    }

    const r = ( intersection.minus( component.positionProperty.value ) ).dot( componentParallel );

    const f = component.fProperty.value;   //f = focal length
    const tanTheta = Math.tan( angleInRads );
    let newDir;
    if ( rayPath.nbrSegments > rayPath.maxNbrSegments ) {
      //do nothing, ray terminates if too many segments, probably caught in infinite reflection loop
      console.log( 'Max number of raypath segments exceeded' );
    }
    else if ( component.type === Type.CONVERGING_LENS || component.type === Type.DIVERGING_LENS ) {
      if ( normalDirection ) {
        outgoingAngle = -Math.atan( ( r / f ) - tanTheta ) + componentAngle;
      }
      else {
        outgoingAngle = Math.PI + Math.atan( ( r / f ) + tanTheta ) + componentAngle;
      }

      newDir = Vector2.createPolar( 1, outgoingAngle );
      this.launchRay( rayPath, intersection, newDir );

    }
    else if ( component.type === Type.CONVERGING_MIRROR ) {
      if ( normalDirection ) {
        outgoingAngle = Math.PI + Math.atan( ( r / f ) - tanTheta ) + componentAngle;
        newDir = Vector2.createPolar( 1, outgoingAngle );
        this.launchRay( rayPath, intersection, newDir );
      }

    }
    else if ( component.type === Type.DIVERGING_MIRROR ) {
      if ( normalDirection ) {
        outgoingAngle = Math.PI + Math.atan( ( r / f ) - tanTheta ) + componentAngle;
        newDir = Vector2.createPolar( 1, outgoingAngle );
        this.launchRay( rayPath, intersection, newDir );
      }

    }
    else if ( component.type === Type.PLANE_MIRROR ) {
      if ( normalDirection ) {
        outgoingAngle = Math.PI - angleInRads + componentAngle;
        newDir = Vector2.createPolar( 1, outgoingAngle );
        this.launchRay( rayPath, intersection, newDir );
      }

    }
    else if ( component.type === Type.SIMPLE_MASK ) {
      //Do nothing. The rayPath ends at a mask.
    }
    else {
      console.log( 'ERROR: intersection component is unknown.' );
    }
  }//end processIntersection()
}

opticsLab.register( 'OpticsLabModel', OpticsLabModel );
export default OpticsLabModel;