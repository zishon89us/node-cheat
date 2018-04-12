/**
 * Created by zeeshan on 4/12/2018.
 */

const glob = require( 'glob' );
const path = require( 'path' );

glob.sync( './plugins/**/core/*.js' ).forEach( ( file ) => {
	require( path.resolve( file ) );
});
