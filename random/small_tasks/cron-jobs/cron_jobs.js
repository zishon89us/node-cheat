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

//Run every hour
cron.schedule('0 * * * *', function () {
    log('Running a task every hour ', 'red');
});

//Run at 30th minute every hour i.e. 5:30 then 6:30 then 7:30 and so on
cron.schedule('30 * * * *', function () {
    log('Running a task every 30 ', 'green');
});

//Run after each half hour i.e. 5:30 then 6:00 then 6:30 and so on
cron.schedule('*!/30 * * * *', function () {
    log('running a task every *!/30 ', 'blue');
});

//Run quarterly or every 15 min i.e. 5:15 then 5:30 then 5:45 and so on
cron.schedule('*/15 * * * *', function () {
    log('Running a task every 15 min ', 'yellow');
});

//Run after every 2 i.e. 5:00 then 5:02 then 5:04 and so on
cron.schedule('*!/2 * * * *', function () {
    log('Running a task every *!/2 ', 'yellow');
});

//Run after every 10 seconds i.e. 5:00:10 then 5:00:20 then 5:00:30 and so on
cron.schedule('*/10 * * * * *', function(){
 console.log('Running a task every 10 sec', 'green');
 });

//task.start();
//task.stop();