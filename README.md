# Example Node Server w/ Babel

### Getting Started

#### Setup your shell to run package-local commands

After installing all the dependencies, the result binaries will be placed in the `./node_modules/.bin/` folder. In order to run those to in a command line, append the following line to your `~/.bash_profile` file:
```
export PATH=./node_modules/.bin/:$PATH
```

#### Initial installation

*(These steps are just for reference, the checked-in `package.json` file should already contain all the dependencies)*

First we'll install `babel-cli`.

```shell
$ npm install --save-dev babel-cli
```

Along with some [presets](http://babeljs.io/docs/plugins/#presets).

```shell
$ npm install --save-dev babel-preset-es2015 babel-preset-stage-2
```

Then create our server in `index.js`.

```shell
$ touch index.js
```
```js
import 'babel-polyfill';
import http from 'http';

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

Then we'll add our first `npm start` script in `package.json`.

```diff
  "scripts": {
+   "start": "babel-node index.js --presets es2015,stage-2"
  }
```

Now let's start our server.

```shell
$ npm start
```

You should now be able to visit `http://127.0.0.1:1337` and see `Hello World`.

### Watching file changes with `nodemon`

We can improve our `npm start` script with `nodemon`.

```shell
$ npm install --save-dev nodemon
```

Then we can update our `npm start` script.

```diff
  "scripts": {
-   "start": "babel-node index.js"
+   "start": "nodemon index.js --exec babel-node --presets es2015,stage-2"
  }
```

Then we'll restart our server.

```shell
$ npm start
```

You should now be able to make changes to `index.js` and our server should be
restarted automatically by `nodemon`.

Go ahead and replace `Hello World` with `Hello {{YOUR_NAME_HERE}}` while our
server is running.

If you visit `http://127.0.0.1:1337` you should see our server greeting you.

### Getting ready for production use

So we've cheated a little bit by using `babel-node`. While this is great for
getting something going. It's not a good idea to use it in production.

We should be precompiling your files, so let's do that now.

First let's move our server `index.js` file to `lib/index.js`.

```shell
$ mv index.js lib/index.js
```

And update our `npm start` script to reflect the location change.

```diff
  "scripts": {
-   "start": "nodemon index.js --exec babel-node --presets es2015,stage-2"
+   "start": "nodemon lib/index.js --exec babel-node --presets es2015,stage-2"
  }
```

Next let's add two new tasks `npm run build` and `npm run serve`.

```diff
  "scripts": {
    "start": "nodemon lib/index.js --exec babel-node --presets es2015,stage-2",
+   "build": "babel lib -d dist --presets es2015,stage-2",
+   "serve": "node dist/index.js"
  }
```

Now we can use `npm run build` for precompiling our assets, and `npm run serve`
for starting our server in production.

```shell
$ npm run build
$ npm run serve
```

This means we can quickly restart our server without waiting for `babel` to
recompile our files.

Oh let's not forget to add `dist` to our `.gitignore` file.

```shell
$ touch .gitignore
```

```
dist
```

This will make sure we don't accidentally commit our built files to git.

### Saving Babel options to `.babelrc`

Let's create a `.babelrc` file.

```shell
$ touch .babelrc
```

This will host any options we might want to configure `babel` with.

```json
{
  "presets": ["es2015", "stage-2"],
  "plugins": []
}
```

Now we can remove the duplicated options from our npm scripts

```diff
  "scripts": {
+   "start": "nodemon lib/index.js --exec babel-node",
+   "build": "babel lib -d dist",
    "serve": "node dist/index.js"
  }
```

### Testing the server

Finally let's make sure our server is well tested.

Let's install `mocha`.

```shell
$ npm install --save-dev mocha
```

And create our test in `test/index.js`.

```shell
$ mkdir test
$ touch test/index.js
```

```js
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
```

Next, install `babel-register` for the require hook.

```shell
$ npm install --save-dev babel-register
```

Then we can add an `npm test` script.

```diff
  "scripts": {
    "start": "nodemon lib/index.js --exec babel-node",
    "build": "babel lib -d dist",
    "serve": "node dist/index.js",
+   "test": "mocha --compilers js:babel-register"
  }
```

Now let's run our tests.

```shell
$ npm test
```

You should see the following:

```shell
Server running at http://127.0.0.1:1337/

  Example Node Server
    ✓ should return 200

  1 passing (43ms)
```

That's it!

## Adding async/await support

Main Reference for most of these instructions is: http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await


In order to make `async/await` (ES7) constructs work, we need to add the `babel-polyfill`(https://babeljs.io/docs/usage/polyfill/) module:

```shell
$ npm install --save-dev babel-polyfill
```

Now let's create an extra file with some functions that are using the async/await pattern:
```shell
$ touch lib/asyncawait.js
```
```js
async function test() {
  return new Promise((resolve, reject) => {
    resolve(true);
  })
}

async function test_result() {
  const result = await test();
  return result;
}

export { test_result };
```

In order for async/await to work properly, your entry file (e.g. index.js or main.js or w/e) should have `import 'babel-polyfill';` as its first line, so with our next step we add this as a first line to `lib/index.js`:

```js
import 'babel-polyfill';
```

Then add a call to test_result(). Remember, an `async` function always returns a promise, so in the main code we need to treat its result as such:

```js
import {test_result} from './asyncawait';

test_result().then((arg) => {
  console.log("Then:", arg);
});
```

If you now run the index.js file (whether via babel-node or transpiled `dist/index.js` file, the "Then: true" line should print at the end of its output:
```
Server running at http://127.0.0.1:1337/
Then: true
```

### Adding async/await test

In our main mocha file, `test/index.js`, add the following test suite:
```js
import {test_result} from '../lib/asyncawait';

describe('Test Example Async', () => {
  it ('should resolve with true', done => {
    test_result().then( res => {
      assert.equal(true, res);
      done();
    })
  })
});
```
