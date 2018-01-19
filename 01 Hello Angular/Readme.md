# Sample 01 - Hello Angular

- Let's start by installing Angular library (version 1.6.3):

```cmd
npm install angular@1.6.3 --save
```

- Let's install angular 1.6.3 typings

```
npm install @types/angular --save-dev
```

- Since we are going to import inline templates, we will install a webpack raw-loader

```cmd
npm install raw-loader --save-dev
```

- Adding the loader to the _webpack.config.json_

```diff
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
            useBabel: true
          }        
      },
+      { 
+        test: /\.html$/,
+        exclude: /node_modules/,
+        loader: 'raw-loader'
+      },      
```
- In order to use "require" to load the templates we will have to install webpack-env 
plus it's typings.

```cmd
npm install webpack-env --save-dev
```
```cmd
npm install @types/webpack-env --save-dev
```

- We have to configure this type as global in our _tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "es6",
    "moduleResolution": "node",
    "noImplicitAny": false,
    "removeComments": true,
    "sourceMap": true,
+    "types": [
+      "webpack-env"
+    ],    
    "jsx": "react",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": false,
    "noLib": false,
    "preserveConstEnums": true,
    "suppressImplicitAnyIndexErrors": true
  },
  "compileOnSave": false,
  "exclude": [
    "node_modules"
  ],  
  "atom": {
    "rewriteTsconfig": false
  }
}
```

- Let's create a vendor section in our webpack.config.js and include angular

```diff
  entry: {
    app: './main.ts',
+    vendor: [
+      'angular',
+    ],    
    appStyles: [
      '../node_modules/bootstrap/dist/css/bootstrap.css',
      './mystyles.scss',       
    ]
  },

```

- Let's create an _app_ subfolder and _src_ and create the app component:

./src/app/app.html

```html
<div>
    <h1>Hello From Angular app!</h1>
</div>
```
- Now it's time to create a module and register our brand new _AppComponent_

_./src/app/app.ts_

```javascript
import * as angular from 'angular';
import {AppComponent} from './app.component';

angular.module('app', [
  ])
  .component('app', AppComponent)
;
```
- It's time to update our webpack.config and make it point to our _app.ts_

```diff
  entry: {
-    app: './main.ts',
+    app: './app/app.ts',
    vendor: [
      'angular',
    ],
```

- Let's remove main.ts file.

- Let's initialize our app in the index.html

```diff
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Angular 1.5 Sample App</title>
  </head>
-  <body>
+  <body ng-app="app" ng-strict-di ng-cloak>
+    <app>
+      ...Loading
+    </app>
+  </body>
-    <div>
-        <h1>00 Boilerplate</h1>
-    </div>
  </body>

</html>
```
- It's time to run our app

```cmd
npm start
```






