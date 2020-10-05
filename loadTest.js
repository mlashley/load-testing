// A sample script to demonstrate parallel collection runs using async from:
// https://github.com/postmanlabs/newman/blob/develop/examples/parallel-collection-runs.js

var path = require('path'),
    async = require('async'),
    newman = require('newman'),
    util = require('util')
    // options for the parallel collection runs
    options1 = {
      collection: path.join(__dirname, './ExampleEchoRequestMethodsCollection.json'),
      reporters: 'cli'
    },
    options2 = {
      collection: path.join(__dirname, './AnotherEchoRequestMethodsCollection.json'),
      reporters: 'cli'
    },
    // callback function that marks the end of the current collection run, when called
    parallelCollectionRun1 = function (done) {
        newman.run(options1, done)
        // See https://www.npmjs.com/package/newman#api-reference for options
        .on('request', function(err,summary) {
          // Example of how to dump the object if the Newman API docs are lacking
          // console.log('E: ' + err + " S: " + util.inspect(summary,{showHidden: false, depth: null}));

          // Example of how to print e.g. a single item from the callback object
          // console.log('E: ' + err + " S: " + summary.response.code)
	       });
    },
    parallelCollectionRun2 = function (done) {
        newman.run(options2, done)
    };

// Run the Postman sample collection thrice, in parallel.
async.parallel([
    parallelCollectionRun1,
    parallelCollectionRun2,
//    parallelCollectionRun,
],
// error or null that demonstrates whether or not parallel collection run succeeded
// results as array of collection run summary objects
function (err, results) {
    err && console.error(err);
    var output = [];

    results.forEach(function (result) {
        var details = []
        result.run.executions.forEach(function (execution) {
          details.push({  "name": execution.item.name,
                          "responseTime": execution.response.responseTime,
                          "responseCode": execution.response.code
          });
        });
        // You might do this to log one JSON blob per collection-run
        // console.log(JSON.stringify({ "timingSummary": result.run.timings,
        //               "stats": result.run.stats,
        //               "details": details
        // }));

        // You might do this to wrap all collection runs into a single JSON blob (note the logger is outside the loop 'AAA')
        output.push({ "collection": result.collection.name,
                      "timingSummary": result.run.timings,
                      "stats": result.run.stats,
                      "details": details
        });

        var failures = result.run.failures;

        console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
            `${result.collection.name} ran successfully.`);
    });
    console.log(JSON.stringify(output)); /// logger for 'AAA'
});
