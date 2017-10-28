/**
 * Created by Zeeshan on 8/20/2017.
 */

//------------------------------------------------------
//Simple Express Server to download files
//Web Link=>
//------------------------------------------------------

const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

// or use absolute paths
app.use(serve(__dirname + '/public'));

app.listen(3000);

console.log('listening on port 3000');