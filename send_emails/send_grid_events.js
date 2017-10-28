(function (module, request) {
    /* 
    Cheat for send grid events management and setup
     */
  return module.exports = {
    enableTracking, /* Enable tracking for events */
    disableTracking, /* Diable tracking for events */
    notificationFilterSetup, /* Setting filters for email notifications */
    activateNotification, /* Activating notifications for Sendgrid user */
    emailSubscribeStatus, /* Getting a list of unsubscribed emails in sub user system */
    addSendIp /* Setting domain Ip for email sending */
  };
  function enableTracking() {
      var options = {
              method: 'PATCH',
              url: 'https://api.sendgrid.com/v3/tracking_settings/open',
              headers: {
                authorization: 'Basic ' + btoa( USER_NAME + ':' + PASSWORD )
              },
              body: '{"enabled" : true}',
              json: true
            };
            request(options, function (error, response, body) {
              // Error or data handler
            });
  }
  function disableTracking() {
      var options = {
              method: 'PATCH',
              url: 'https://api.sendgrid.com/v3/tracking_settings/open',
              headers: {
                authorization: 'Basic ' + btoa( USER_NAME + ':' + PASSWORD )
              },
              body: '{"enabled" : false}',
              json: true
            };
            request(options, function (error, response, body) {
              // Error or data handler
            });
  }
  function notificationFilterSetup() {
    // `1` is for switching on filter option and `0` is for switching it off  
    var filterData = {
            api_user           : USER_NAME,
            api_key            : API_KEY,
            name               : 'eventnotify',
            processed          : 0, // Notify processed email
            dropped            : 1, // Notify dropped email
            deferred           : 0, // Notify deffered email
            delivered          : 0, // Notify delivered email
            bounce             : 1, // Notify bounce email
            click              : 0, // Notify email click
            open               : 1, // Notify opened email
            unsubscribe        : 0, // Notify unsubscribe email
            group_unsubscribe  : 0, // Notify group unsubscribe
            group_resubscribe  : 0, // Notify group resubscribe
            spamreport         : 0, // Notify spam report
            url                : EVENT_NOTIFICATION_URL // SETUP WEBHOOK URL
          };
          request.post({url:'https://api.sendgrid.com/api/filter.setup.json', formData: filterData}, function (error, httpResponse, body) {
            // Error or data handler
          });
  }
  function activateNotification() {
        var eventData = {
          api_user  : API_USER,
          api_key   : API_KEY,
          user      : USER_NAME,
          task      : 'activate',
          name      : 'eventnotify'
        };
        request.post({url:'https://api.sendgrid.com/apiv2/customer.apps.json', formData: eventData}, function (error, httpResponse, body) {
          // Error and data handler
        });
  }
  function addSendIp() {
        var data = {
            'api_user'  : API_USER,
            'api_key'   : API_KEY,
            'user'      : SENDGRID_USER,
            'task'      : 'append',
            'set'       : 'specify',
            'ip[]'      : DOMAIN_IP
        };
      request.post({url:'https://api.sendgrid.com/apiv2/customer.sendip.json', formData: data}, function (error, httpResponse, body) {
        // Error or data handler
      });
  }

})(module,
   require('request'));