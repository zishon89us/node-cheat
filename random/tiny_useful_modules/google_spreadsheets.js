/**
 * Created by Zeeshan on 3/7/2016.
 */

//------------------------------------------------------
//read google_spreadsheet and parse it
//Web Link=> https://docs.google.com/spreadsheets/d/1OmqePbgblBhWjTmsW3xmIZjx0ZIZRuzOuxxtvBluTlM/edit#gid=0
//------------------------------------------------------

var GoogleSpreadsheet = require("google-spreadsheet"),
    _ = require('underscore');

var sheetId = "1OmqePbgblBhWjTmsW3xmIZjx0ZIZRuzOuxxtvBluTlM",
    sheet = new GoogleSpreadsheet(sheetId);

sheet.getRows(1, {}, function (err, rows) {
    if (err) throw err;

    _.each(rows, function (row) {
        console.log(row.city, row.country);
    });

});

