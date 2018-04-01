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

const emailUtil = {
  _sendMail: async (options) => {
    // TODO: complete this
  },

  verificationCode: async (email, verificationCode) => {
    // TODO: complete this
  },

  forgotPassword: async (email, code) => {
    // TODO: complete this
  },

  specialAccountCreated: async (email, pass) => {
    // TODO: complete this
  },

  contactUs: async (payload) => {
    // TODO: complete this
  }

};

module.exports = emailUtil;
