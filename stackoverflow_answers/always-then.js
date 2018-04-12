/**
 * Created by zeeshan on April 12, 2018.
 */

//------------------------------------------------------
//Promises - .then no matter resolved or rejected
//Web Link=> https://stackoverflow.com/a/49797011/3539857
//Run :
//------------------------------------------------------

// wrap to always land inside .then
function handleAlwaysThen(UserId) {
	return new Promise((resolve, reject) => {
		getUserData(UserId)
		.then((data) => {
			if (data.Item.UserId == UserId) {
				resolve({success: true, checkFirst: "returning"});
			} else {
				resolve({success: false, checkFirst: "UserId not matched"});
			}
		})
		.catch((err) => {
			resolve({success: false, checkFirst: "firstSession"});
		});
	});
}

// now just handle .then
handleAlwaysThen(UserId)
.then((data) => {
	// do whatever you want with data.success data.checkFirst
});