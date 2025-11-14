/**
 * Created by Zeeshan on 10/25/2016.
 * Last updated March 20th, 2018
 */

//------------------------------------------------------
//sendgrid to send emails
//Web Link=> https://sendgrid.com/
//Run : node send_grid.js
//------------------------------------------------------

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const SENDGRID_APIKEY = process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY';

const sgOptions = {
    auth: {
        api_key: SENDGRID_APIKEY
    }
};

const transporter = nodemailer.createTransport(sgTransport(sgOptions));

const subject = 'Hello Developer!';
const from = 'Node-Cheat <nodecheat@github.com>';

// TODO: come up with all set ready to use utility
const _sendMail = async (options) => {
   const mailOptions = {
        from: options.from || from,
        to: options.to,
        subject: options.subject || subject,
        html: options.template,
    };
    console.log('sending mail');
    await transporter.sendMail(mailOptions);
}

_sendMail({to: 'zishon89us@hotmail.com',template: '<strong>I am sent from Node-Cheat using sendgrid :)</strong>'});
