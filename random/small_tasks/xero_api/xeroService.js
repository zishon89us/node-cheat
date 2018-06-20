
var moment = require('moment')
var path = require('path');
var fs = require('fs');
var queryString = require('querystring');
var Xero = require('xero');
var xero = new Xero(XERO_CONSUMER_KEY, XERO_CONSUMER_SECRET,
    fs.readFileSync(XERO_PRIVATE_KEY)/*, undefined,
    {'If-Modified-Since':'2016-01-26T19:03:08'}//start date when account is created*/
    //If we don't want to include system accounts just un comment above code with correct start date of  Xero organization
);



var XeroService = (function(){

    var XeroService = function(){

    };

    XeroService.prototype.getActiveAccounts = function(){
        var api = '/Accounts?'+queryString.stringify({where: 'Status="ACTIVE"'});
        //filter example 'Status="ACTIVE"&SystemAccount!=null'
        xero.call('GET', api, {}/*Body data*/, function(err, data) {
            // Error OR data handler
        });
    };

    XeroService.prototype.getPayments = function(startDate, endDate, callback){
        //filter example : Date >= DateTime(2015, 12, 1) && Date < DateTime(2015, 12, 28)
        //Payments
        var format = 'YYYY, MM, DD';/*'YYYY, MM, DD'*/
        var condition = '';
            if(startDate){
                condition += 'Date >= DateTime('+moment(startDate).format(format)+')';
            }
            if(startDate && endDate){
                condition +=' && ';
            }
            if(endDate){
                condition += 'Date < DateTime('+moment(endDate).format(format)+')';
            }

        var api = '/Payments?'+queryString.stringify({where: condition});
        xero.call('GET', api, {}/*form data*/, function(err, data) {
            // Error OR data handler
        });
    };

    XeroService.prototype.getBalanceSheet = function(date, callback){
        var api = '/Reports/BalanceSheet?'+queryString.stringify({
                date:moment(date).format('YYYY-MM-DD')
            });
        xero.call('GET', api, {}/*form data*/, function(err, data) {
             // Error OR data handler
        });
    };

    XeroService.prototype.getInvoices = function(startDate, endDate, callback){
        //filter example : Date >= DateTime(2015, 12, 1) && Date < DateTime(2015, 12, 28)
        //Invoices
        var format = 'YYYY, MM, DD';/*'YYYY, MM, DD'*/
        var condition = '';
        if(startDate){
            condition += 'Date >= DateTime('+moment(startDate).format(format)+')';
        }
        if(startDate && endDate){
            condition +=' && ';
        }
        if(endDate){
            condition += 'Date < DateTime('+moment(endDate).format(format)+')';
        }

        var api = '/Invoices?'+queryString.stringify({where: condition});

        xero.call('GET', api, {}/*form data*/, function(err, data) {
             // Error OR data handler
        });
    };

    var xeroInstance = new XeroService();
    return {
        getActiveAccounts : xeroInstance.getActiveAccounts, // Fecthing active accounts
        getInvoices : xeroInstance.getInvoices, // Fetching Invoices via date filter
        getPayments : xeroInstance.getPayments, // Fetching payments via date filter
        getBalanceSheet : xeroInstance.getBalanceSheet // Fetching balance sheets via date filter
    }
})();

module.exports = XeroService;

