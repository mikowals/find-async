var testCol = new Meteor.Collection( 'testCol');


Tinytest.add( 'find-async - test findOneFuture',  test => {
  testCol.remove({});
  var insertedId = testCol.insert({data: 'nonsense', aNumber: 10});
  var testResult = testCol.findOneFuture( {}, {fields:{data:1, aNumber: 1}});
  test.instanceOf( testResult, Future, 'should be able to get a future from a collection' );
  test.equal( testResult.wait(), {data: 'nonsense', aNumber: 10, _id: insertedId }, 'waiting for future should return data inserted');

  var p = testCol.findOnePromise( {}, {fields:{data:1, aNumber: 1}} );
  var fut = new Future;
  p.then( ( res ) => {
    fut.return ( res );
  }, ( rej ) => {
    throw rej
  });
  test.equal( fut.wait(), {data: 'nonsense', aNumber: 10, _id: insertedId }, 'findOnePromise should return same object');

  testCol.remove({});
});

Tinytest.add( 'find-async - async functions are truely async',  test => {
  testCol.remove({});
  testCol.upsert({name:"Enrique"},{name: 'Enrique', address:"3rd rock" });
  testCol.upsert({name:"Paulo"},{name: 'Paulo', address:"3rd rock" });
  var temp = "";
  var fut = new Future();

  testCol.findOneAsync( {name: "Enrique"},
    ( err, val) =>{
      if (val && val.name) {
        temp = val.name;
        console.log( 'in Async: name is ', val.name);
      }
      fut.return( err || val.name );
  });
  test.equal(temp, "", 'string should be empty before callback completes');
  console.log('test print 1');
  console.log('test print 2');
  console.log('test print 3');
  test.equal( fut.wait(), temp, 'string should have name after wait');

  var testResult = testCol.findOneFuture( {name: "Enrique"});
  test.throws( testResult.get.bind( testResult), "Future must resolve before value is ready", "get should fail while waiting for db" );

  test.equal( testResult.wait().name, "Enrique", "get() should return value after wait()");

  testCol.remove({});
});

Tinytest.add( 'find-async - Mongo driver distinct',  test => {
  testCol.remove({});
  testCol.upsert({name:"Enrique"},{name: 'Enrique', address:"3rd rock" });
  testCol.upsert({name:"Paulo"},{name: 'Paulo', address:"3rd rock" });

  var testResult = testCol.distinct("name");

  test.length( testResult, 2, "should have 2 distinct names" );
  testResult = testCol.distinct( "address" );
  test.length( testResult, 1, "should have one distinct address");

  testCol.remove({});
});


Tinytest.add( 'find-async - test aggregate',  test => {
  testCol.remove( {} );
  [ for ( sex of ['male', 'female']) for ( number of [1,2,3,4,5]) testCol.insert( {_id: sex + number, sex, number})];

  var pipeline = [{$group:{_id: '$sex', count: {$sum: 1}}}];
  var fut = testCol.aggregateFuture( pipeline );
  test.instanceOf( fut, Future, 'aggregateFuture should return a future' );
  var res = fut.wait();
  test.length( res, 2, 'aggregateFuture should return 2 groups');
  test.equal( res, [{_id: 'female', count: 5}, {_id: 'male', count: 5}], 'aggregateFuture should give the expected count');

  res = testCol.aggregate( pipeline );
  test.length( res, 2, 'aggregate should return 2 groups');
  test.equal( res, [{_id: 'female', count: 5}, {_id: 'male', count: 5}], 'aggregate should have 5 of each group');
  var newFut = testCol.countFuture( {sex: 'female'});
  test.equal( newFut.wait(), 5, 'count should find 5 females');
  testCol.remove( {});
});
