#find-async
-----------

Meteor package that extends Meteor.Collection with asynchronous database calls and aggregation.  Reduced time in some methods by 80% by making db queries concurrent.

#Installation

In your meteor app run:

    meteor add mikowals:find-async

#Usage

    // on server
    var Data = new Meteor.Collection('data');
    var indexes = _.range( 10 );
    indexes.forEach( function( ii ){
      Data.insert({index:ii})
    });

    var randomFutures = _.shuffle( indexes ).map( function( ii ){
      return Data.findOneFuture( {index: ii});  //all requests to mongo made without yielding
    });

    Future.wait( randomFutures ); //yield here and wait for all database calls to return

    var randomData = _.invoke( randomFutures, 'get'); //convert array of futures to array of objects


#Functions added


* **findOneAsync()**, **findAsync()**, **aggregateAsync()**, **distinctAsync()**, **groupAsync()**, **countAsync()** - Asynchronous functions that expect a callback as the last argument.

* **aggregate()**, **distinct()**, **group()**, **count()** - Synchronous [Mongo driver aggregation functions](http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#aggregate).

* **findOneFuture()**, **findFuture()**, **aggregateFuture()**, **distinctFuture()**, **groupFuture()**, **countFuture()** - Synchronous functions that will not yield and return future you can wait on.  `Future` is exported to access Npm.require( 'fibers/future');

* **findOnePromise()**, **findPromise()**, **aggregatePromise()**, **distinctPromise()**, **groupPromise()**, **countPromise()** - Wait for database values using ECMAScript 6 promises.  [Promise API detailed here](http://www.html5rocks.com/en/tutorials/es6/promises/#toc-api).
