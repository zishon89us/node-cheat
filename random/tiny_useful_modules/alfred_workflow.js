/**
 * Created by Zeeshan on 3/6/2016.
 */
var alfredo = require('alfredo');
var Item = alfredo.Item;
var GoogleSpreadsheet = require("google-spreadsheet");
var _ = require('underscore');
var fuzzy = require("fuzzy");

var sheetId = process.argv[2];
var keyword = process.argv[3];

// spreadsheet key is the long id in the sheets URL
var sheet = new GoogleSpreadsheet(sheetId);

sheet.getRows(1, {}, function (err, rows) {
    if (err) throw err;

    var items = [];

    var options = {
        extract: function (el) {
            return el.shorthand; //i worked with the give sheet, this key can be changed as per actual code
        }
    };

    var filtered = fuzzy.filter(keyword, rows, options);

      _.each(filtered, function (row) {
            var item = new Item({
             arg: row.original.links,
             title: row.original.notes,
             subtitle: row.original.links,
             valid: true,
             autocomplete: row.original.keyword
             });

            items.push(item);
        });

    alfredo.feedback(items);
});

