
//------------------------------------------------------
//MongoDB Bulk Upsert: Create documents if not exist or update them
//Web Link=> https://docs.mongodb.com/manual/reference/method/Bulk.find.upsert/
//Run : node bulk-update.js
//------------------------------------------------------

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const client = new MongoClient('mongodb://127.0.0.1:27017', { useUnifiedTopology: true });
client.connect(async err => {
	if (err) {
		console.log('DB Connection Error ', err);
	} else {
		const db = client.db('node-cheat-db');

		// lets assume you've read all file contents and data is now ready for db operation
		let records = [
			{first: 'john', last: 'doe', email: 'johen@doe.com'},
			{first: 'jack', last: 'doe', email: 'jack@doe.com'},
			{first: 'jill', last: 'doe_updated', email: 'jill@doe.com'}
		];

		// prepare bulk upsert so that new records are created and existing are updated
		let bulk = db.collection('users').initializeOrderedBulkOp();
		for (var i = 0; i < records.length; i++) {
			bulk.find({
        "email": records[i].email // at least 1 key should be treated as PK; in this example email is PK
	    }).upsert(records[i]).replaceOne(records[i]);
		}
		bulk.execute(function (err,updateResult) {
				if (updateResult.result.ok != 1) {
					console.log('Bulk Upsert Error');
				} else {
							console.log(`Inserted: ${updateResult.result.nUpserted} and Updated: ${updateResult.result.nModified}`);
				}
		});
	}
});
