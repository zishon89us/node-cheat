/**
 * Created by Zeeshan on 10/25/2016.
 */

//------------------------------------------------------
//sendgrid to send emails
//Web Link=> https://sendgrid.com/
//Run : node send_grid.js
//------------------------------------------------------

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(`YOUR_SENDGRID_API_KEY`);
const msg = {
    to: 'zishon89us@hotmail.com',
    from: 'Zeeshan Hassan <zishon89us@hotmail.com>',
    subject: 'Hello Developer!',
    text: 'I am sent from Node-Cheat using sendgrid :)',
    html: '<strong>Okay Take Care!!</strong>',
};
sgMail.send(msg);