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

    function FocalPointGraphic( size ) {

        var focalPointGraphic = this;
        Node.call( focalPointGraphic );

        var R = size/2;
        var strokeInfo = { stroke: 'yellow', lineWidth: 3 };
        var line1 = new Line( -R, -R, R, R, strokeInfo );
        var line2 = new Line( R, -R, - R, R, strokeInfo );
        this.children = [ line1, line2 ];



    }

    return inherit( Node, FocalPointGraphic, {
            myFunction: function() {
            }



        }//end inherit
    );
} );