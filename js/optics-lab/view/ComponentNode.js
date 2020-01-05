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
      this.mainView = mainView;
      this.modelViewTransform = mainView.modelViewTransform;
      this.type = this.pieceModel.type;

      this.showFocalPointsProperty = new Property( false );

      const height = this.pieceModel.diameterProperty.value;

      const radius = this.pieceModel.radiusProperty.value;    //radius of curvature
      const index = this.pieceModel.indexProperty.value;

      this.componentGraphic = new ComponentGraphic( this.type, height, radius, index );
      const angle = this.pieceModel.angleProperty.value;
      this.rotationHandle = new Circle( 5, {
        x: Math.sin( angle ) * height / 2,
        y: Math.cos( angle ) * height / 2,
        fill: 'yellow'
      } );
      this.addChild( this.componentGraphic );
      this.addChild( this.rotationHandle );

      // When dragging, move the sample element
      let mouseDownPosition;
      this.addInputListener( new SimpleDragHandler(
        {
          // When dragging across it in a mobile device, pick it up
          allowTouchSnag: true,
          start: e => {
            self.mainView.setSelectedPiece( self );
            self.mainView.setSelectedPieceType( self );
            const position = self.globalToParentPoint( e.pointer.point );
            const currentNodePos = self.pieceModel.positionProperty.value;
            mouseDownPosition = position.minus( currentNodePos );
            //self.mouseDownPosition = e.pointer.point;
          },

          drag: e => {
            let position = self.globalToParentPoint( e.pointer.point );
            position = position.minus( mouseDownPosition );
            self.pieceModel.setPosition( position );
          },
          end: e => {
            const position = self.globalToParentPoint( e.pointer.point );
            if ( self.mainView.toolDrawerPanel.visibleBounds.containsCoordinates( position.x, position.y ) ) {
              self.mainView.removePiece( self );
            }
          }
        } ) );

      this.rotationHandle.addInputListener( new SimpleDragHandler( {
        allowTouchSnag: true,
        //start function for testing only
        start: e => {
          self.mainView.setSelectedPiece( self );
          self.mainView.setSelectedPieceType( self );
        },

        drag: e => {
          const mousePosRelative = self.rotationHandle.globalToParentPoint( e.pointer.point );   //returns Vector2
          const angle = mousePosRelative.angle - Math.PI / 2;  //angle = 0 when beam horizontal, CW is + angle
          self.pieceModel.setAngle( angle );

        }
      } ) );//end this.rotationHandle.addInputListener()

      // Register for synchronization with pieceModel.
      this.pieceModel.positionProperty.link( position => {
        this.translation = position;
      } );
      this.pieceModel.angleProperty.link( angle => {
        this.componentGraphic.rotation = angle;
        const cosAngle = Math.cos( angle );
        const sinAngle = Math.sin( angle );
        const diameter = this.pieceModel.diameterProperty.value;
        this.rotationHandle.translation = new Vector2( -( diameter / 2 ) * sinAngle, ( diameter / 2 ) * cosAngle );
      } );
      this.pieceModel.diameterProperty.link( diameter => {
        this.componentGraphic.setDiameter( diameter );
        const angle = this.pieceModel.angleProperty.value;
        const cosAngle = Math.cos( angle );
        const sinAngle = Math.sin( angle );
        //var diameter = self.pieceModel.diameter;
        this.rotationHandle.translation = new Vector2( -( diameter / 2 ) * sinAngle, ( diameter / 2 ) * cosAngle );
      } );
      this.pieceModel.radiusProperty.link( R => {
        this.componentGraphic.setRadius( R );
      } );
      this.pieceModel.indexProperty.link( n => {
        this.componentGraphic.setIndex( n );
      } );
      this.showFocalPointsProperty.link( isVisible => {
        this.componentGraphic.setFocalPointsVisibility( isVisible );
      } );

      this.pieceModel.fProperty.link( focalLength => {
        if ( focalLength ) {
          this.componentGraphic.setFocalPointPositions( focalLength );
        }
      } );

    }
  }

  return opticsLab.register( 'ComponentNode', ComponentNode );

} );