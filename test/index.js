import http from 'http';
import assert from 'assert';

import '../lib/index.js';

describe('Example Node Server', () => {
  it('should return 200', done => {
    http.get('http://127.0.0.1:1337', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});

import {test_result} from '../lib/asyncawait';

describe('Test Example Async', () => {
  it ('should resolve with true', done => {
    test_result().then( res => {
      assert.equal(true, res);
      done();
    })
  })
});
