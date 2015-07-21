/**
 * Created by Dubson on 7/20/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'KITE/segments/Line' );
    var Shape = require( 'KITE/Shape' );
    //
    // var Ray2 = require( 'DOT/Ray2' );
    //var Vector2 = require( 'DOT/Vector2' );

    /**
     *
     * @param relativeStartPos
     * @param startDir
     * @constructor
     */

    function FocalPointGraphic( ) {

        var focalPointGraphic = this;
        Node.call( focalPointGraphic );
        //PropertySet.call( this, {
        //  startPosition: startPosition             //@private, position of source on stage
        //} );
        var length = 15;
        var line1 = new Line()
        this.startDir = startDir;    //starting direction of the first segment, the one thing that never changes
        this.relativeStartPos = relativeStartPos;  //starting position, relative to source center, of the first segment
        this.rayPath = this;
        //this.mainModel = mainModel;

        this.maxLength = 2000;  //maximum length of rays in pixels

        //An array of Kite.Line segments.  Kite.Line functions include
        //getStart(), getEnd(), getStartTangent() which returns direction

        this.segments = [];     //an array of line segments
        this.dirs = [];         //array of directions, corresponding to the segments
        this.lengths = [];      //array of lengths of the segments

        this.shape = new Shape();


    }

    return inherit( Node, FocalPointGraphic, {
            clearPath: function() {
                this.segments = [];
                this.dirs = [];
                this.lengths = [];
            }



        }//end inherit
    );
} );