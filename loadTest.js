// A sample script to demonstrate parallel collection runs using async from:
// https://github.com/postmanlabs/newman/blob/develop/examples/parallel-collection-runs.js

var path = require('path'), 
    async = require('async'), 
    newman = require('newman'),
    util = require('util')
    // options for the parallel collection runs
    options = {
        collection: path.join(__dirname, './ExampleEchoRequestMethodsCollection.json'),
	reporters: 'cli'
    },
    // callback function that marks the end of the current collection run, when called
    parallelCollectionRun = function (done) {
        newman.run(options, done)
	// See https://www.npmjs.com/package/newman#api-reference for options
	.on('request', function(err,summary) {
          // Example of how to dump the object if the Newman API docs are lacking
          // console.log('E: ' + err + " S: " + util.inspect(summary,{showHidden: false, depth: null}));
	  
          // Example of how to print e.g. a single item from the callback object
          // console.log('E: ' + err + " S: " + summary.response.code)
	});
    };

// Run the Postman sample collection thrice, in parallel.
async.parallel([
    parallelCollectionRun,
    parallelCollectionRun,
    parallelCollectionRun
],
// error or null that demonstrates whether or not parallel collection run succeeded
// results as array of collection run summary objects
function (err, results) {
    err && console.error(err);

    results.forEach(function (result) {
        var failures = result.run.failures;

        console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
            `${result.collection.name} ran successfully.`);
    });
});
