'use strict';

/**
 * Creates the public waitlist table and its restricted write function.
 *
 * The SQL lives beside the generated db-migrate wrapper so the database
 * objects remain reviewable and reversible as one migration.
 */
var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

function runSql(db, filename) {
  /** Execute one of this migration's checked-in SQL files. */
  var filePath = path.join(__dirname, 'sqls', filename);
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
      if (err) return reject(err);
      resolve(db.runSql(data));
    });
  });
}

exports.up = function(db) {
  /** Apply the waitlist schema and write boundary. */
  return runSql(db, '20261014190000-waitlist-function-up.sql');
};

exports.down = function(db) {
  /** Remove the waitlist schema and write boundary. */
  return runSql(db, '20261014190000-waitlist-function-down.sql');
};

exports._meta = {
  version: 1,
};
