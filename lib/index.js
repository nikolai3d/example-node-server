//This is to make async/await work: http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
import 'babel-polyfill';
// import 'babel-core/register';
import http from 'http';

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

import {test_result} from './asyncawait';

test_result().then((arg) => {
  console.log("Then:", arg);
});
