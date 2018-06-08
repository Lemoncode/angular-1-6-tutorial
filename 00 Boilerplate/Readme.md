# Sample 00 - Boiler plate

- Let's start by initializing our package json project

```cmd
npm init
```

- Let's install the following packages

```cmd
npm install webpack webpack-cli webpack-dev-server typescript awesome-typescript-loader --save-dev
```

```cmd
npm install babel-core babel-preset-env --save-dev
```

```cmd
npm install node-sass sass-loader style-loader css-loader html-webpack-plugin mini-css-extract-plugin file-loader url-loader --save-dev
```

```cmd
npm install bootstrap@3.3.7 --save
```

- Create .babelrc configuration

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
    "suppressImplicitAnyIndexErrors": true
  },
  "compileOnSave": false,
  "exclude": [
    "node_modules"
  ]
}
```

- Let's create a webpack.config.js

```javascript
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: "[id].css"
    }),
  ],
};
```

- Let's update our package.json

```diff
  "scripts": {
+    "start": "webpack-dev-server --mode development --inline",
+    "build": "webpack --mode development",
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
const App = console.log('Hello from ts');

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

- And a empty styles files:

_./src/mystyles.scss_
``` 
```

- Let's try that we have built is working, from the console / bash terminal we can run 

```
npm run build 
```

```
npm start
```
