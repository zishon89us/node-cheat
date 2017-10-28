(function (module, request) {
    /* 
    Cheat for sub user management in sendgrid
    Api node http client request
     */
  return module.exports = {
    addSubUser, /* Method for adding a sub user in system */
    updateSubUser, /* Method for updating sub user info in system */
    unsubscribeSubUser, /* Unsubscribing user from sub user system */
    subscribeSubUser, /* Subscribing in sub user system */
    emailSubscribeStatus, /* Getting a list of unsubscribed emails in sub user system */
    removeSubUser /* Remove sub user from system */
  };

  function addSubUser () {
    var formData = {
      'api_user'          : API_USER,
      'api_key'           : API_KEY,
      'username'          : SUB_USER_IDENTIFIER,
      'email'             : SUB_USER_EMAIL,
      'password'          : SUB_USER_PASSWORD,
      'confirm_password'  : SUB_USER_PASSWORD, // For confirmation
      'first_name'        : SUB_USER_FIRST_NAME,
      'last_name'         : SUB_USER_LAST_NAME,
      'address'           : SUB_USER_ADDRESS,
      'city'              : SUB_USER_CITY,
      'state'             : SUB_USER_STATE,
      'zip'               : SUB_USER_ZIP,
      'country'           : SUB_USER_COUNTRY,
      'phone'             : SUB_USER_PHONE,
      'website'           : SUB_USER_WEBSITE,
      'company'           : SUB_USER_COMPANY
    };
    request.post({url:'https://api.sendgrid.com/apiv2/customer.add.json', formData: formData}, function (error, httpResponse, body) {
        //Error or data handler
    });
  };

  function updateSubUserName () {
    var formData = {
      'api_user': API_USER,
      'api_key' : API_KEY,
      'username': SUB_USER_NAME,
      'task': 'setUsername',
      'user' : OLD_USER_NAME
    };
    request.post({url:'https://api.sendgrid.com/apiv2/customer.profile.json', formData: formData}, function (error, httpResponse, body) {
        // Error or data handler
    });
  };

  function updateSubUserPassword () {
    var data ={
        'api_user'        : API_USER,
        'api_key'         : API_KEY,
        'user'            : SUB_USER_NAME,
        'password'        : SUB_USER_PASSWORD,
        'confirm_password': SUB_USER_PASSWORD
    };
    request.post({url:'https://api.sendgrid.com/apiv2/customer.password.json', formData: data, json:true}, function (error, httpResponse, body) {
        // Error or data handler
    });
  };

  
  function removeSubUser (userEmail, callBack) {
    var formData = {
      'api_user': API_USER,
      'api_key' : API_KEY,
      'user'    : SUB_USER_IDENTIFIER
    };
    request.post({url:'https://api.sendgrid.com/apiv2/customer.delete.json', formData:formData, json:true}, function (error, httpResponse, body) {
      // Error or data handler
    });
  };

  function unsubscribeSubUser () {
    var formData = {
      'api_user': API_USER,
      'api_key' : API_KEY,
      'user'    : SUB_USER_NAME,
      'task'    : 'add',
      'email'   : USER_EMAIL, // Email to unsubscribe
    };
    request.post({url:'https://api.sendgrid.com/api/user.unsubscribes.json', formData:formData, json:true}, function (error, httpResponse, body) {  
      // Error or data handler
    });
  };

  function reSubscribeSubUser () {
    var formData = {
      'api_user'  : API_USER,
      'api_key'   : API_KEY,
      'user'      : SUB_USER_NAME,
      'task'      : 'delete',
      'email'     : USER_EMAIL, // Email to subscribe
    };
    request.post({url:'https://api.sendgrid.com/api/user.unsubscribes.json', formData:formData, json:true}, function (error, httpResponse, body) {
      // Error or data handler
    });
  };

  function listUnsubsribeUsers (){
    var formData = {
      'api_user': API_USER,
      'api_key' : API_KEY,
      'user'    : SUB_USER_NAME,
      'task'    : 'get'
    };
    request.post({url:'https://api.sendgrid.com/api/user.unsubscribes.json', formData:formData, json:true}, function (error, httpResponse, body) {
      // Error or data handler
    });
  };

})(module,
   require('request'));