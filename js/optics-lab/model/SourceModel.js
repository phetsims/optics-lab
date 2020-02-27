// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model of source of light = array of rays
 * Rays are either a fan (point source) or a beam (parallel rays)
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import opticsLab from '../../opticsLab.js';
import RayPath from './RayPath.js';
import Type from './Type.js';

class SourceModel {
  /**
   *
   * @param {OpticsLabModel} mainModel for this sim
   * @param {Type} type = Type.FAN_SOURCE|Type.BEAM_SOURCE = fan of diverging rays or beam of parallel rays
   * @param {number} nbrOfRays
   * @param {Vector2} position
   * @param {number} spread = for fan source, range of angles in degrees; for beam, spread is zero
   * @param {number} height = for beam source, range of y-position in cm; for fan, height is zero
   */
  constructor( mainModel, type, nbrOfRays, position, spread, height ) {

    // @private position of source on stage
    this.positionProperty = new Vector2Property( position );

    // @private, {Property.<number>} number of rays
    this.nbrOfRaysProperty = new NumberProperty( nbrOfRays );

    // @public {Property.<number>} spread of point source (fan source) in degrees
    this.spreadProperty = new NumberProperty( spread );

    // @public {Property.<number>} width of source, if beam
    this.widthProperty = new NumberProperty( height );

    // @private {Property.<number>} angle in rads of beam source, 0 = horizontal. + = CCW, - = CW
    this.angleProperty = new NumberProperty( 0 );

    //@private {Property.<string|Color>} color of ray in the view (not really part of the model, but it
    //is convenient to put all the Properties of a Source in one place)
    this.colorProperty = new Property( '#FFF' );

    this.mainModel = mainModel;

    this.type = type; // {Type.FAN_SOURCE|Type.BEAM_SOURCE}

    if ( type === Type.FAN_SOURCE ) {
      this.spreadProperty.value = spread;
      this.height = 0;
    }
    else if ( type === Type.BEAM_SOURCE ) {
      this.spreadProperty.value = 0;
      this.height = height;
    }

    this.nbrOfRaysProperty.lazyLink( () => {
      this.createRays();
      this.mainModel.processRays();
    } );
    this.spreadProperty.lazyLink( () => {
      this.createRays();
      this.mainModel.processRays();
    } );
    this.widthProperty.lazyLink( () => {
      this.createRays();
      this.mainModel.processRays();
    } );
    this.angleProperty.lazyLink( () => {
      this.createRays();
      this.mainModel.processRays();
    } );

    this.rayPaths = [];    //an array of RayPaths

    this.createRays();

  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.nbrOfRaysProperty.reset();
    this.spreadProperty.reset();
    this.widthProperty.reset();
    this.angleProperty.reset();
    this.colorProperty.reset();
  }

  /**
   * Adds rays
   * @private
   */
  createRays() {
    this.rayPaths = [];  //clear any current rays
    this.nbrOfRaysProperty.value = Utils.roundSymmetric( this.nbrOfRaysProperty.value );  //slider may produce non-integer number of rays
    //for fan source
    let lowestAngle = -this.spreadProperty.value / 2;  //in degrees
    let deltaAngle;
    if ( this.nbrOfRaysProperty.value === 1 ) {
      deltaAngle = 0;
      lowestAngle = 0;  //if only one ray, ray is horizontal
    }
    else {
      deltaAngle = this.spreadProperty.value / ( this.nbrOfRaysProperty.value - 1 );    //in degrees
    }
    let theta = ( lowestAngle ) * Math.PI / 180; //in radians
    let dir = new Vector2( Math.cos( theta ), Math.sin( theta ) );
    let relativeStartPos = new Vector2( 0, 0 );

    //for beam source
    let lowestPos;   //in cm
    let startPos;
    let deltaPos;
    const sinAngle = Math.sin( -this.angleProperty.value );   //in screen coords, + angle is CW
    const cosAngle = Math.cos( -this.angleProperty.value );
    const h = this.widthProperty.value;
    if ( this.nbrOfRaysProperty.value === 1 ) {
      lowestPos = new Vector2( 0, 0 );
      deltaPos = new Vector2( 0, 0 );
    }
    else {
      lowestPos = new Vector2( h * sinAngle / 2, h * cosAngle / 2 );
      deltaPos = new Vector2( -h * sinAngle / ( this.nbrOfRaysProperty.value - 1 ),
        -h * cosAngle / ( this.nbrOfRaysProperty.value - 1 ) );

    }
    startPos = lowestPos;

    //loop through and initialize all rayPaths of the source
    for ( let i = 0; i < this.nbrOfRaysProperty.value; i++ ) {
      if ( this.type === Type.FAN_SOURCE ) {
        theta = ( lowestAngle + i * deltaAngle ) * Math.PI / 180;  //in radians
        relativeStartPos = new Vector2( 0, 0 );
        dir = new Vector2( Math.cos( theta ), Math.sin( theta ) );
        //endPosition = this.position.plus( dir.timesScalar( this.maxLength ));

        this.rayPaths[ i ] = new RayPath( relativeStartPos, dir );
        this.rayPaths[ i ].startPos = this.positionProperty.value;
        //this.rayPaths[i].addSegment( this.position, endPosition );
      }
      else if ( this.type === Type.BEAM_SOURCE ) {
        dir = new Vector2( cosAngle, -sinAngle );
        relativeStartPos = lowestPos.plus( deltaPos.timesScalar( i ) );
        startPos = this.positionProperty.value.plus( lowestPos ).plus( deltaPos.timesScalar( i ) );
        this.rayPaths[ i ] = new RayPath( relativeStartPos, dir );
        this.rayPaths[ i ].startPos = startPos;
      }
    }
  }

  /**
   *
   * @param {number} nbrOfRays
   * @private
   */
  setNbrOfRays( nbrOfRays ) {
    this.nbrOfRaysProperty.value = nbrOfRays;
    this.createRays();
    this.mainModel.processRays();
  }

  /**
   *
   * @param {number} angleInDegrees
   * @private
   */
  setSpreadOfFan( angleInDegrees ) {
    if ( this.type === Type.FAN_SOURCE ) {
      this.spreadProperty.value = angleInDegrees;
      this.createRays();
      this.mainModel.processRays();
    }
  }

  /**
   *
   * @param {number} widthInCm
   * @private
   */
  setWidthOfBeam( widthInCm ) {
    if ( this.type === Type.BEAM_SOURCE ) {
      this.widthProperty.value = widthInCm;
      this.createRays();
      this.mainModel.processRays();
    }
  }


  /**
   * Sets the position of the source
   * @param {Vector2} position
   * @public
   */
  setPosition( position ) {   //position = Vector2

    this.positionProperty.value = position;
    for ( let i = 0; i < this.rayPaths.length; i++ ) {
      if ( this.type === Type.FAN_SOURCE ) {
        this.rayPaths[ i ].startPos = position;
      }
      else if ( this.type === Type.BEAM_SOURCE ) {
        let lowestPos;
        let deltaPos;
        const sinAngle = Math.sin( -this.angleProperty.value );   //in screen coords, + angle is CW
        const cosAngle = Math.cos( -this.angleProperty.value );
        const h = this.widthProperty.value;
        if ( this.nbrOfRaysProperty.value === 1 ) {
          lowestPos = new Vector2( 0, 0 );
          deltaPos = new Vector2( 0, 0 );
        }
        else {
          lowestPos = new Vector2( h * sinAngle / 2, h * cosAngle / 2 );
          deltaPos = new Vector2( -h * sinAngle / ( this.nbrOfRaysProperty.value - 1 ),
            -h * cosAngle / ( this.nbrOfRaysProperty.value - 1 ) );
        }
        const relativePos = lowestPos.plus( deltaPos.timesScalar( i ) );
        const pos = position.plus( relativePos );
        this.rayPaths[ i ].relativeStartPos = relativePos;
        this.rayPaths[ i ].startPos = pos;
        this.rayPaths[ i ].startDir.x = cosAngle;
        this.rayPaths[ i ].startDir.y = -sinAngle;
      }
    }
    if ( !this.mainModel.processingRays ) {
      this.mainModel.processRays();
    }

  }

  /**
   * Sets the rotation angle of the source of light
   * @param {number} angleInRads - angle in radians
   * @public
   */
  setAngle( angleInRads ) {
    this.angleProperty.value = angleInRads;
    if ( this.type === Type.BEAM_SOURCE ) {
      this.setPosition( this.positionProperty.value );
    }
  }
}

opticsLab.register( 'SourceModel', SourceModel );
export default SourceModel;