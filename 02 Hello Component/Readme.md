# Sample 00 - Boiler plate

- Let's start by initializing our package json project

```cmd
npm init
```

- Let's install the following packages

```cmd
npm install webpack webpack-dev-server typescript awesome-typescript-loader --save-dev
```

```cmd
npm install babel-core babel-preset-env --save-dev
```

```cmd
npm install node-sass sass-loader style-loader css-loader html-webpack-plugin extract-text-webpack-plugin 
file-loader url-loader --save-dev
```

```cmd
npm install bootstrap --save
```

- Create .Babelrc configuration

_./.babelrc_

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```

Let's create tsconfig.json

_./tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "es6",
    "moduleResolution": "node",
    "noImplicitAny": false,
    "removeComments": true,
    "sourceMap": true,
    "jsx": "react",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": false,
    "noLib": false,
    "preserveConstEnums": true,
    "suppressImplicitAnyIndexErrors": true,
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

- Let's create a webpack.config.js

```javascript
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var basePath = __dirname;

module.exports = {
  context: path.join(basePath, 'src'),
  resolve: {
    extensions: ['.js', '.ts']
  },
  entry: {
    app: './main.ts',
    appStyles: [
      './mystyles.scss',
    ]
  },
  output: {
    path: path.join(basePath, 'dist'),
    filename: '[chunkhash].[name].js',
  },
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
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', },
            { loader: 'sass-loader', },
          ],
        }),
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
          },
        }),
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
  },
  // For development https://webpack.js.org/configuration/devtool/#for-development
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
  },
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
			hash: true,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new ExtractTextPlugin({
      filename: '[chunkhash].[name].css',
      disable: false,
      allChunks: true,
    }),
  ],
};
```

- Let's update our package.json

```diff
  "scripts": {
+    "start": "webpack-dev-server --inline",
+    "build": "webpack",
-    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Let's create a new folder called _src_

```cmd
mkdir src
```

- Let's create a simple typescript file

_./src/main.ts_

```typescript
var App = console.log('Hello from ts');

export default App;
```

- And a _index.html_ file

_./src/index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Angular 1.5 Sample App</title>
  </head>
  <body>
    <div>
        <h1>00 Boilerplate</h1>
    </div>
  </body>
</html>
```

- It's time to create a _webpack.config.js_ file.

```javascript

```

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

```javascript
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
    vendor: [
+      'angular',
    ],    
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

_./src/app/app.component.ts_

```javascript
export const AppComponent = {
  template: require('./app.html') as string
};
```

- Now it's time to create a module and register our brand new _AppComponent_

_./src/app/app.ts_

```javascript
import angular from 'angular';
import appComponent from './app.component';

angular.module('app', [
  ])
  .component('app', appComponent)
;

```

- It's time to update our webpack.config and make it point to our _app.ts_

```
  entry: {
-    app: './main.ts',
+    app: './app/app.ts',
    vendor: [
      'angular',
    ],
```

- Let's remove main.ts file.

- Let's initialize our app in the index.html

```
<html>
  <head>
    <meta charset="utf-8">
    <title>Angular 1.5 Sample App</title>
  </head>
 <body ng-app="app" ng-strict-di ng-cloak>
    <app>
      ...Loading
    </app>
  </body>
</html>
```

- It's time to run our app

```cmd
npm start
```

# Sample 02 - Hello Component

let's start creating components, we will start using a simple structure, later on if the project grows we can refactor it (in the beginning YAGNI, if 
needed we can create a common components section, or a pages subsection...).

- We will start by creating a _components_ folder under the _src/app_ path.

- We will create a dumb login component.

_./src/app/components/login/login.html_
```html
<div>
    <h1>Hello From Login Component !</h1>
</div>
```

_./src/app/components/login/login.component.ts_
```javascript

export const LoginComponent = {
  template: require('./login.html') as string
};
```


- And we will wrap it in a module:


_./src/app/components/login/index.ts_
```javascript
import * as angular from 'angular';
import { LoginComponent } from './login.component';

export const LoginModule = angular.module('login', [
  ])
  .component('login', LoginComponent)
;
```



- All this components will be wrapped in a components module.

_./src/app/components/index.ts_
```javascript
import * as angular from 'angular';
import { LoginModule  } from './login';

export const components = angular.module('components', [
     LoginModule.name
  ])  
;
```

- Let's register this components in our app module

_./src/app/app.ts_
```diff
import * as angular from 'angular';
import {AppComponent} from './app.component';
+ import { components } from './components'

angular.module('app', [
+     components.name
  ])
  .component('app', AppComponent)
;
```

- Let's update the _app.html_ template and instantiate our login component

_./src/app/app.html_
```diff
<div>
    <h1>Hello From Angular app!</h1>
+    <login></login>
</div>
```

- Let's run the sample

```cmd
npm start
```