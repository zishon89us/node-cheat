/**
 * Created by zeeshan on April 12, 2018.
 */

//------------------------------------------------------
//require from unknown child folder
//Web Link=> https://stackoverflow.com/a/49796481/3539857
//Run : node app.js followed by npm i glob
//------------------------------------------------------

const glob = require( 'glob' );
const path = require( 'path' );

glob.sync( './plugins/**/core/*.js' ).forEach( ( file ) => {
	require( path.resolve( file ) );
});