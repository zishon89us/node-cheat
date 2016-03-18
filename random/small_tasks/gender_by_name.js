/**
 * Created by Zeeshan on 3/18/2016.
 */


//------------------------------------------------------
//Find gender using first_name and last_name
//Web Link=> http://api.namsor.com/
//------------------------------------------------------

var request = require('request');

var firstName = 'Zeeshan',
    lastName = 'Memon',
    url = "http://api.namsor.com/onomastics/api/json/gender/" + firstName + "/" + lastName;

request( url, function (err, resp, body) {
    if (!err && resp.statusCode == 200) {
        console.log("namsor response:", JSON.parse(body));
    }
});


//------------------------------------------------------
//Find gender using first_name or first_name and last_name
//Web Link=> https://genderize.io/#overview
//------------------------------------------------------



