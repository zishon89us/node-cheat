/**
 * Created by zeeshan on 10/23/2016.
 */

var cron = require('node-cron');

//------------------------------------------------------
//run script every minute
//Web Link=>
//Run : node crone_jobs
//------------------------------------------------------


cron.schedule('*/10 * * * * *', function(){
    console.log('running a task every minute 10th sec');
});

cron.schedule('1-5 * * * * *', function(){
    console.log('running a task every minute 1-5');
});

/*var task = cron.schedule('*!/10 * * * * *', function(){
    console.log('running a task every 10 sec');
});*/

//task.start();
//task.stop();