/**
 * Created by zeeshan on April 1, 2018.
 */

//------------------------------------------------------
//Plug n Play email sending module, just required and use :)
//Web Link=>
//------------------------------------------------------

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// const debug = require('debug')('node-cheat:emails_module');

const SENDGRID_APIKEY = 'API_KEY_HERE'; // ideally should be in env vars

const sgOptions = {
  auth: {
    api_key: SENDGRID_APIKEY
  }
};

const transporter = nodemailer.createTransport(sgTransport(sgOptions));

const subject = 'Hello Developer!';
const from = 'Node-Cheat <nodecheat@github.com>';
const contactEmail = 'hello@node-cheat.com';

const emailUtil = {
  _sendMail: async (options) => {
    // TODO: complete this
	const footer = `<div>Add footer content here, may be add unsubscribe link or company info</div>`;

	const mailOptions = {
		from,
		to: options.email,
		subject: options.subject || subject,
		html: `<div>${options.template} <br/> ${footer} </div>`,
	};
	await transporter.sendMail(mailOptions);
  },

  verificationCode: async (email, verificationCode) => {
	const template = `<p>Please use this verification code: <em>${verificationCode}</em></p>`;
	emailUtil._sendMail({
		email, template, subject, subscriber,
	});
  },

  forgotPassword: async (email, code) => {
    // TODO: complete this
  },

  specialAccountCreated: async (email, pass) => {
    // TODO: complete this
  },

  contactUs: async (payload) => {
	const mailOptions = {
		from: `Hello <${payload.email}>`,
		to: `${contactEmail}`,
		subject: payload.subject || `${env.NAME} Contact Us Form"`,
		text: payload.message,
	};
	transporter.sendMail(mailOptions);
  }

};

module.exports = emailUtil;