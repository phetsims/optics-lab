// Copyright 2015-2019, University of Colorado Boulder

/**
 * Node for component, which can be either lens, mirror, plane mirror, or mask
 *
 * @author Michael Dubson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const ComponentGraphic = require( 'OPTICS_LAB/optics-lab/view/ComponentGraphic' );
  const Node = require( 'SCENERY/nodes/Node' );
  const opticsLab = require( 'OPTICS_LAB/opticsLab' );
  const Property = require( 'AXON/Property' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Vector2 = require( 'DOT/Vector2' );

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

      const self = this;
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
            mainView.setSelectedPiece( self );
            mainView.setSelectedPieceType( self );
            const position = this.globalToParentPoint( e.pointer.point );
            const currentNodePos = componentModel.positionProperty.value;
            mouseDownPosition = position.minus( currentNodePos );
            //self.mouseDownPosition = e.pointer.point;
          },

          drag: e => {
            let position = this.globalToParentPoint( e.pointer.point );
            position = position.minus( mouseDownPosition );
            componentModel.setPosition( position );
          },
          end: e => {
            const position = this.globalToParentPoint( e.pointer.point );
            if ( mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y ) ) {
              mainView.removePiece( self );
            }
          }
        } ) );

      rotationHandle.addInputListener( new SimpleDragHandler( {
        allowTouchSnag: true,
        //start function for testing only
        start: e => {
          mainView.setSelectedPiece( self );
          mainView.setSelectedPieceType( self );
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
  return opticsLab.register( 'ComponentNode', ComponentNode );
} );