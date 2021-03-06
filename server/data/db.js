var connection = {
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  },
  useNullAsDefault: true
};

if (process.env.PG_CONNECTION_STRING) {
  connection = {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: 'knex,public',
    useNullAsDefault: true
  };
}

var knex = require('knex')(connection);
var bookshelf = require('bookshelf')(knex);

exports.User = bookshelf.Model.extend({
  tableName: 'users'
});

exports.init = Promise.resolve().then(function () {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.increments();
    table.string('name');
    table.string('key');
    table.timestamps();
  });
}).then(function () {
  return exports.User.collection().fetchOne();
}).then(function (user) {
  if (user) return '';

  var demoUser = new exports.User({
    name: 'admin',
    key: 'password'
  });
  return demoUser.save();
});
