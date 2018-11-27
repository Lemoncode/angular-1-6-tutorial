# Sample 05 - Services

It's time to start adding login interaction to our application, in this sample:

  - We will talk about how to structure our app.
  - We will create a loginService, this will be a fake one but returning a promise,
    this will allow us replace this fake implementation with a real one without
    impacting the rest of the application.
  - We will add a loginPage component that will make the login calls and use the
  pure ui login.component.
  - We will show a toast in case the login failed, and redirect to clients page 
  whenever the login has been succesful.

- Structuring the app:
    - We will create an "api" folder where we will place all the access to rest api.
    - We will create a model folder where we will place the application model.
    - We will create a state application where we will hold the global state of the app.
    - We will isolate our login component defining:
        - *ViewModel*: we don't want to mess up with global model entities, rather encapsulate them in a local ViewModel class (it's likely to happen that most entites will be just a one to one mapping, but getting isolation is a great win)
        - *Mappers*: we will need to create mappers from models to viewmodels and viceversa (for common cases we could create a generic mapper).
        - *Services*: same as with the viewmodel, we want to isolate global service calls, this services will take care of asking for the right
        vm parameters and internally call the needed mapper and call the global api.

The final proposed structure:

```
\---src
    |   index.html
    |
    \---app
        +---api
        +---components
        |   \---login
        |   |       index.ts
        |   |       login.component.ts
        |   |       login.html
        |   |       mappers.ts
        |   |       services.ts
        |   |       viewmodel.ts
        |   |
        |   \---client
        +---model
        +---state
```

Advantages of this approach:

  - Developers do not need to have in their mind the whole application picture.
  - Decoupling: a given developer can start working on a given page / component, without having the need to wait for a given
  api or global service to be implemented, he can mock it and move forward.

Drawbacks:

  - More code and plumbing to maintain.

  > Facts based on experience: by following this approach in a given company we managed to cut down the developer ramp up process
  when integrating into a complex project from 3 months to 1 week.

Now that we are going to start coding further than pure UI is time to consider using a TDD approach.

Let's setup the unit test plumbing

- First we will need to install karma test runner

```cmd
npm install karma karma-jasmine karma-sourcemap-loader karma-sourcemap-loader karma-webpack karma-chrome-launcher karma-spec-reporter --save-dev
```

- Let's install a testing library (jasmine):

```
npm install jasmine-core jasmine @types/jasmine --save-dev
```

- Let's install some angular testing helpers.

//npm install angular-mocks@1.6.8

```cmd
npm install angular-mocks @types/angular-mocks --save-dev
```

- Let's update our package json and include a test script:

_./src/package.json_

```diff
  "scripts": {
    "start": "webpack-dev-server --inline",
    "build": "webpack",
+    "test": "karma start --no-single-Run",
+    "test:single": "karma start --single-Run"
-    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Let's create a bundler for all the spec files (tests) that we will create:

_./spec.bundle.js_
```typescript 
/*
 * When testing with Webpack and TS, we have to do some
 * preliminary setup. Because we are writing our tests also in TS,
 * we must transpile those as well, which is handled inside
 * `karma.conf.js` via the `karma-webpack` plugin. This is the entry
 * file for the Webpack tests. Similarly to how Webpack creates a
 * `bundle.js` file for the compressed app source files, when we
 * run our tests, Webpack, likewise, compiles and bundles those tests here.
*/

import angular from 'angular';
import mocks from 'angular-mocks';


// We use the context method on `require` which Webpack created
// in order to signify which files we actually want to require or import.
// Below, `context` will be a/an function/object with file names as keys.
// Using that regex, we scan within ./src/app` and target
// all files ending with `.spec.ts` and trace its path.
// By passing in true, we permit this process to occur recursively.
let context = require.context('./src/app', true, /\.spec\.ts/);

// Get all files, for each file, call the context function
// that will require the file and load it here. Context will
// loop and require those spec files here.
context.keys().forEach(context);
```

- Now let's define the test runner configuration (karma):

_./karma.conf.js_
```javascript
var webpackConfig = require('./webpack.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'spec.bundle.js'
    ],
    exclude: [],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-spec-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-webpack")
    ],
    preprocessors: {
      'spec.bundle.js': ['webpack', 'sourcemap']
    },
    webpack: {
      resolve: {
        extensions: ['.js', '.ts', '.json'],
      },
      devtool: 'inline-source-map',
      module: {

        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true
            }
          },
          {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'raw-loader'
          },
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  camelCase: true
                }
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
          {
            test: /\.css$/,
            include: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader"
            ]
          },
          // Loading glyphicons => https://github.com/gowravshekar/bootstrap-webpack
          // Using here url-loader and file-loader
          {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
          },
          {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader'
          },
          {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
          },
        ],
      }
    },
    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  });
};
```

> We are repeating here some wepback config, one thing that we can do is create a base webpack config and use it here (webpack merge).

- Let's configure our tsconfig to setup jasmine as global types

_./tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "es6",
    "moduleResolution": "node",
    "noImplicitAny": false,
    "removeComments": true,
    "sourceMap": true,
    "types": [
+      "jasmine",
      "webpack-env"
    ],    
    "jsx": "react",
```

- Let's define a dummy test just to ensure we have properly configured our testing enviroment

./src/app/api/login.spec.ts

```javascript
describe('login', () => {
  describe('performLogin', () => {
    it('remove this test, dummy karma test', () => {
      const dummy = true;

      expect(dummy).toBeTruthy();
    })
  })
})
```

- Let's give a try and run the test suite

```
npm test
```

> We can keep it watching and exucting the tests again on every change by calling _npm run test:watch_

- We can try to follow TDD, let's start by definining a test expecting a simple LoginService,if we implement it we get red lights, or even cannot execute (expected the services does not exist)

__/src/app/login.spec.ts__

```diff
describe('login', () => {
  describe('performLogin', () => {
-    it('remove this test, dummy karma test', () => {
-      const dummy = true;
-
-      expect(dummy).toBeTruthy();
-    })

+        it('Login Service exists', () => {    
+          const loginService = new LoginService();
+      
+          expect(loginService).toBeDefined();
+          expect(loginService.validateLogin).toBeDefined();
+        })
      })
    })
  })
})

```

- Now let's define a basic login service (no promises yet) and add a proper test.

_./src/app/api/login.ts_

```javascript
export class LoginService {
  constructor() {
  }

  public validateLogin(user : string, pwd: string) : boolean { 
    return false;   
  }
}
```

- And add the import to the spec


_./src/app/login.spec.ts_

```diff
+ import { LoginService } from "./login"

describe('login', () => {
  describe('performLogin', () => {
// (...)
```

- We got green lights, let's define a new test, we will start by testing that given a 
userId and passowrd (admin / test) the login service shold return valid login.
Jumping into the specs:

./src/app/login.spec.ts
```diff
import { LoginService } from "./login"

describe('login', () => {
  describe('performLogin', () => {
    it('Login Service exists', () => {    
      const loginService = new LoginService();
  
      expect(loginService).toBeDefined();
      expect(loginService.validateLogin).toBeDefined();
    })

+    it('valid login', () => {      
+      const loginService = new LoginService();

+      const result = loginService.validateLogin('admin', 'test');

+      expect(result).toBeTruthy();
+    })
+  })
+ })
```

- Now let's add the functionallity 

__./src/app/login.ts__

```diff
export class LoginService {
  constructor() {
  }

  public validateLogin(user : string, pwd: string) : boolean { 
+    return (user === 'admin' && pwd === 'test');       
  }
}

```

- Test passing, we can implement the other way around, introduce a test where we test against a not valid login

__./src/app/login.spec.ts__

```diff
import { LoginService } from "./login"

describe('login', () => {
  describe('performLogin', () => {
    it('Login Service exists', () => {    
      const loginService = new LoginService();
  
      expect(loginService).toBeDefined();
      expect(loginService.validateLogin).toBeDefined();
    });

    it('valid login', () => {      
      const loginService = new LoginService();

      const result = loginService.validateLogin('admin', 'test');

      expect(result).toBeTruthy();
    });

+    it('invalid login', () => {      
+      const loginService = new LoginService();
+
+      const result = loginService.validateLogin('admin', 'wrongpassword');
+
+      expect(result).toBeFalsy();
+    });
  })
})

```

- We got green lights, it's time to think about the implementation we have done, on one hand this login is supposed to be async, we should introduce Q and return a Promise<bool> result. Let's refactor the code and start checking the we are getting red lights (time to fix the tests as well).

> Here we could do it the other way around, change the tests and then updated the code.

_./src/app/login.ts_

```diff
export class LoginService {
+  $q : angular.IQService = null;

-   constructor() {
+    constructor($q : angular.IQService) {
+  this.$q = $q;
  }

+  public validateLogin(user : string, pwd: string) : angular.IPromise<boolean> {         
+
+    const deferred = this.$q.defer<boolean>();
+    const validationResult = (user === 'admin' && pwd === 'test');
+    deferred.resolve(validationResult);
+
+    return deferred.promise;
+  }


-  public validateLogin(user : string, pwd: string) : boolean {         
-    return (user === 'admin' && pwd === 'test');       
-  }
}

+LoginService.$inject = ['$q'];
```

- It's time to use mocking let's install angular mocks

```
npm install angular-mocks @types/angular-mocks --save-dev
```

- Let's update the tests:

> One more thing to add: since we are working with a pure mocked api we are not hitting $http,later on we will have to add a refactor for this. What can we do? Create a real API, or create a fake on but really hit $http service.

_./src/app/api/login.ts_

```diff
export class LoginService {
+  $q : angular.IQService = null;

-  constructor() {  
+  constructor($q : angular.IQService) {
+    this.$q = $q;
+  }

+  public validateLogin(user : string, pwd: string) : angular.IPromise<boolean> {         

+    const deferred = this.$q.defer<boolean>();
+    const validationResult = (user === 'admin' && pwd === 'test');
+    deferred.resolve(validationResult);

+    return deferred.promise;
+  }

-  public validateLogin(user : string, pwd: string) : boolean {         
-    return (user === 'admin' && pwd === 'test');       
-  }
}
```

- Let's refactor our tests, for the sake of simplicity we are going to paste the 
whole file content

./src/app/login.spec.ts

```javascript
import { LoginService } from "./login"
import * as angular from 'angular'
import 'angular-mocks';

describe('login', () => {
  describe('performLogin', () => {
    let $q;
    let $rootScope;

    beforeEach(() => {                  
      angular['mock'].inject((_$q_, _$rootScope_) => {
          this.$q = _$q_;
          this.$rootScope = _$rootScope_;
      });    
    });

    it('Login Service exists', () => {    
      const loginService = new LoginService(this.$q);
  
      expect(loginService).toBeDefined();
      expect(loginService.validateLogin).toBeDefined();
    })

    it('valid login', () => {      
      const loginService = new LoginService(this.$q);
      const promise = loginService.validateLogin('admin', 'test');      
             
      promise.then((loginSucceeded) => {        
        expect(loginSucceeded).toBeTruthy();    
      })
      // Force deferred promise to be resolved
      this.$rootScope.$digest();      
    });
    
    it('invalid login', () => {      
      const loginService = new LoginService(this.$q);
      const promise = loginService.validateLogin('admin', 'wrongpassword');      
             
      promise.then((loginSucceeded) => {        
        expect(loginSucceeded).toBeFalsy();    
      })
      // Force deferred promise to be resolved
      this.$rootScope.$digest();      
    });    
  });  
});
```

