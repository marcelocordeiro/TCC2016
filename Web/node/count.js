/**
 * count.js - EclairJS code that talks to Spark to run analytics (word count) on a text file.
 */

var eclairjs = require('eclairjs');
var spark = new eclairjs();

var sparkSession = spark.sql.SparkSession.builder()
  .appName("Word Count")
  .getOrCreate();

function startCount(file, callback) {
    var rdd = sparkSession.read().textFile(file).rdd();

    var rdd2 = rdd.flatMap(function(sentence) {
      return sentence.split(" ");
    });

    var rdd3 = rdd2.filter(function(word) {
      return word.trim().length > 0;
    });

    var rdd4 = rdd3.mapToPair(function(word, Tuple2) {
      return new Tuple2(word.toLowerCase(), 1);
    }, [spark.Tuple2]);

    var rdd5 = rdd4.reduceByKey(function(value1, value2) {
      return value1 + value2;
    });

    var rdd6 = rdd5.mapToPair(function(tuple, Tuple2) {
      return new Tuple2(tuple._2() + 0.0, tuple._1());
    }, [spark.Tuple2]);

    var rdd7 = rdd6.sortByKey(false);

    rdd7.take(10).then(function(val) {
      callback(val);
    }).catch(function(ex){console.log("An error was encountered: ",ex)});
}

// Create a wrapper class so we can interact with this module from Node.js.
function Count() {
}

Count.prototype.start = function(file, callback) {
  startCount(file, callback);
}

Count.prototype.stop = function(callback) {
  if (sparkSession) {
    console.log('stop - SparkSession exists');
    sparkSession.stop().then(callback).catch(callback);
  }
}

module.exports = new Count();
There are a number of things going on in count.js. Let me break them down for you. The Count class is created which wrappers the EclairJS logic, and provides a nexus between Node.js and Spark. This allows you to make calls to the EclairJS side of things from the Node.js side of things. By offering start and stop methods, you have a mechanism to control when the Spark analytics run from the Node.js side. Calling start() invokes the local startCount() function, and that’s where the EclairJS/Spark code gets kicked off. You can read in a text file, break it up into lines and then into words, and then keep a count of each word while removing any duplicates. The results are sorted the top 10 most commonly encountered words are passed back to the Node.js side of things.
The last piece of code you need to add in this section will hook up the call to the EclairJS code to start the counting process and capture the results. Edit app.js and append the following to the end of the file:

var count = require('./count.js');
var file = 'file:/data/dream.txt';
count.start(file, function(results){
	//TODO:  SOMETHING BETTER WITH RESULTS HERE
	console.log('results: ',results);
});

// stop spark  when we stop the node program
process.on('SIGTERM', function () {
  count.stop(function() {
    console.log('SIGTERM - stream has been stopped');
    process.exit(0);
  });
});

process.on('SIGINT', function () {
  count.stop(function() {
    console.log('SIGINT - stream has been stopped');
    process.exit(0);
  });
});
