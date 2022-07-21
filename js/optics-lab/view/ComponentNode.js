// Copyright 2015-2022, University of Colorado Boulder

/**
 * Node for component, which can be either lens, mirror, plane mirror, or mask
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Circle, Node, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import opticsLab from '../../opticsLab.js';
import ComponentGraphic from './ComponentGraphic.js';

class ComponentNode extends Node {
  /**
   * Constructor for ComponentNode which renders sample element as a scenery node.
   * @param {ComponentModel} componentModel
   * @param {OpticsLabScreenView} mainView
   */
  constructor( componentModel, mainView ) {

    super( {
      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    this.pieceModel = componentModel;
    this.type = componentModel.type;

    this.showFocalPointsProperty = new Property( false );

    const height = componentModel.diameterProperty.value;

    const radius = componentModel.radiusProperty.value;    //radius of curvature
    const index = componentModel.indexProperty.value;

    const componentGraphic = new ComponentGraphic( componentModel.type, height, radius, index );
    const angle = componentModel.angleProperty.value;
    const rotationHandle = new Circle( 5, {
      x: Math.sin( angle ) * height / 2,
      y: Math.cos( angle ) * height / 2,
      fill: 'yellow'
    } );
    this.addChild( componentGraphic );
    this.addChild( rotationHandle );

    // When dragging, move the sample element
    let mouseDownPosition;
    this.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,
        start: e => {
          mainView.setSelectedPiece( this );
          const position = this.globalToParentPoint( e.pointer.point );
          const currentNodePos = componentModel.positionProperty.value;
          mouseDownPosition = position.minus( currentNodePos );
          //this.mouseDownPosition = e.pointer.point;
        },

        drag: e => {
          const position = this.globalToParentPoint( e.pointer.point ).minus( mouseDownPosition );
          componentModel.setPosition( position );
        },
        end: e => {
          const position = this.globalToParentPoint( e.pointer.point );
          if ( mainView.toolDrawerPanel.visibleBounds.containsPoint( position ) ) {
            mainView.removePiece( this );
          }
        }
      } ) );

    rotationHandle.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      //start function for testing only
      start: e => {
        mainView.setSelectedPiece( this );
      },

      drag: e => {
        const mousePosRelative = rotationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
        const angle = mousePosRelative.angle - Math.PI / 2;  //angle = 0 when beam horizontal, CW is + angle
        componentModel.setAngle( angle );

      }
    } ) );//end rotationHandle.addInputListener()

    // Register for synchronization with pieceModel.
    componentModel.positionProperty.link( position => {
      this.translation = position;
    } );
    componentModel.angleProperty.link( angle => {
      componentGraphic.rotation = angle;
      const cosAngle = Math.cos( angle );
      const sinAngle = Math.sin( angle );
      const diameter = componentModel.diameterProperty.value;
      rotationHandle.translation = new Vector2( -( diameter / 2 ) * sinAngle, ( diameter / 2 ) * cosAngle );
    } );
    componentModel.diameterProperty.link( diameter => {
      componentGraphic.setDiameter( diameter );
      const angle = componentModel.angleProperty.value;
      const cosAngle = Math.cos( angle );
      const sinAngle = Math.sin( angle );
      //var diameter = componentModel.diameter;
      rotationHandle.translation = new Vector2( -( diameter / 2 ) * sinAngle, ( diameter / 2 ) * cosAngle );
    } );
    componentModel.radiusProperty.link( R => {
      componentGraphic.setRadius( R );
    } );
    componentModel.indexProperty.link( n => {
      componentGraphic.setIndex( n );
    } );
    this.showFocalPointsProperty.link( isVisible => {
      componentGraphic.setFocalPointsVisibility( isVisible );
    } );

    componentModel.fProperty.link( focalLength => {
      if ( focalLength ) {
        componentGraphic.setFocalPointPositions( focalLength );
      }
    } );
  }
}

opticsLab.register( 'ComponentNode', ComponentNode );
export default ComponentNode;