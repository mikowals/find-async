Future = Npm.require('fibers/future');

console.log( new Future().task);
[ 'aggregate', 'count', 'distinct', 'group', 'findOne', 'find' ].forEach( m => {

  //create 'countAsync', 'aggregateAsync', 'groupAsync', and 'findOneAsync' methods for collections
  //these are just direct versions of mongodb driver calls
  Meteor.Collection.prototype[ m + 'Async' ] = function( ...args) {
    var col = MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection( this._name );
    col[ m ].apply( col, args );
  };

  //wrap async functions to return a future, i.e. 'findFuture'
  Meteor.Collection.prototype[ m + 'Future' ] = function ( ...args ) {
    return Future.wrap( this[ m + 'Async' ], args.length ).apply( this, args );
  };

  Meteor.Collection.prototype[ m + 'Promise' ] = function( ...args ){
    var self = this;
    return new Promise( ( resolve, reject ) => {
      var cb = (err,res) => {
        if ( err ) reject( err );
        else resolve( res );
      };

      self[ m + 'Async'].call( self, ...args, cb );
    });
  }
});

//add synchronous versions of methods meteor doesn't provide
[ 'count', 'aggregate', 'group', 'distinct' ].forEach( m => {
  Meteor.Collection.prototype[ m ] = function( ...args ){
    return Meteor._wrapAsync( this[ m + 'Async' ] ).apply( this, args );
  }
});
