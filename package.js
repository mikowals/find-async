Package.describe({
  "name": "mikowals:find-async",
  "version": "0.0.6",
  "git": "https://github.com/mikowals/find-async.git",
  "summary": "Extend Meteor.Collection with asynchronous mongo functions and aggregation."
});
Npm.depends({
//  "fibers":"1.0.2"
})
Package.onUse( function( api ){
  api.use( ['mquandalle:harmony@1.2.1'], 'server');
  api.addFiles( 'findAsync.next.js', 'server');
  api.export( 'Future', 'server');
});

Package.onTest( function( api ){
  api.use( ['mikowals:harmony@1.2.1', 'mikowals:find-async', 'tinytest', 'test-helpers'], 'server');
  api.addFiles('findAsync-test.next.js', 'server');
})
