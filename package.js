Package.describe({
  "name": "mikowals:find-async",
  "version": "0.0.8",
  "git": "https://github.com/mikowals/find-async.git",
  "summary": "Extend Meteor.Collection with asynchronous mongo functions and aggregation."
});
Npm.depends({
//  "fibers":"1.0.2"
})
Package.onUse( function( api ){
  api.versionsFrom( 'METEOR@0.9.1' );
  api.use( ['mquandalle:harmony@1.2.1', 'mongo', 'meteor'], 'server');
  api.addFiles( 'findAsync.next.js', 'server');
  api.export( 'Future', 'server');
});

Package.onTest( function( api ){
  api.use( ['mikowals:harmony', 'mikowals:find-async','mongo', 'tinytest', 'test-helpers'], 'server');
  api.addFiles('findAsync-test.next.js', 'server');
});
