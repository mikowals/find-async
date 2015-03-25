Package.describe({
  "name": "mikowals:find-async",
  "version": "1.0.0",
  "git": "https://github.com/mikowals/find-async.git",
  "summary": "Extend Meteor.Collection with asynchronous mongo functions and aggregation."
});

Package.onUse( function( api ){
  api.versionsFrom( 'METEOR@1.0.3' );
  api.use( ['grigio:babel@0.0.12', 'mongo'], 'server');
  api.addFiles( 'findAsync.es6.js', 'server');
  api.export( 'Future', 'server');
});

Package.onTest( function( api ){
  api.use( ['grigio:babel', 'mongo','mikowals:find-async', 'tinytest', 'test-helpers'], 'server');
  api.addFiles('findAsync-test.es6.js', 'server');
});
