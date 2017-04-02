/**
 * Created by zeeshan on 10/23/2016.
 */

var cron = require('node-cron'),
    chalk = require('chalk'),
    log = function (msg, color) {
        color = color || 'blue';
        console.log(chalk[color](msg), chalk.green(new Date()));
    };

    log('Starting Now');
//------------------------------------------------------
//run script every minute
//Web Link=>
//Run : node crone_jobs
//------------------------------------------------------

//https://www.thesitewizard.com/general/set-cron-job.shtml
//http://stackoverflow.com/questions/22509869/how-to-set-a-cron-job-to-run-every-3-hours
//http://stackoverflow.com/questions/3474280/how-to-set-up-a-cron-job-to-run-an-executable-every-hour

/*cron.schedule('*!/10 * * * * *', function(){
 console.log('running a task every minute 10th sec');
 });*/

/*cron.schedule('1-5 * * * * *', function(){
 console.log('running a task every minute 1-5');
 });*/

/*cron.schedule('* * * * * *', function(){
 console.log('running a task every sec');
 });

 cron.schedule('* * * * *', function(){
 console.log('running a task every min');
 });*/

/*cron.schedule('0 * * * *', function () {
    log('running a task every hour ');
});*/

cron.schedule('0 * * * *', function () {
    log('running a task every hour ', 'red');
});

cron.schedule('30 * * * *', function () {
    log('running a task every 30 ', 'green');
});

cron.schedule('*/30 * * * *', function () {
    log('running a task every */30 ', 'blue');
});

cron.schedule('*/15 * * * *', function () {
    log('running a task every 15 min ', 'yellow');
});

/*cron.schedule('*!/2 * * * *', function () {
    log('running a task every *!/2 ', 'yellow');
});*/

/*var task = cron.schedule('*!/10 * * * * *', function(){
 console.log('running a task every 10 sec');
 });*/

//task.start();
//task.stop();