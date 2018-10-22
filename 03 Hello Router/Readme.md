# Sample 03 - Routing

Most of the web applications follow the SPA approach. In this sample we are going to add the
needed plumbing to setup ui-router and will create a couple of dummy pages to add navigation.

- We will use ui-router let's install the library (in this case we don't need to install
the typings, they are already included in the lib itself)

```cmd
npm install @uirouter/angularjs --save
```

- Let's add this library to our webpack.config.js libs entry.

_./webpack.config.js_

```diff
  entry: {
    app: './app/app.ts',
    vendor: [
      'angular',        
+      '@uirouter/angularjs',
    ],    

```

- Let's add this third partie module as a reference on our application.

_./src/app/app.ts_

```diff
import * as angular from 'angular';
import {AppComponent} from './app.component';
import { components } from './components'

angular.module('app', [
+     'ui.router',
    components.name
  ])
  .component('app', AppComponent)
;
```

- The next step is to define our routing config, let's create a file called app.routes.ts 
there we will setup the ui-router and setup a route to a login pages

*** Old school working

_./src/app/app.routes.ts_

```javascript
import * as angular from 'angular';
import {StateProvider, UrlRouterProvider, Ng1StateDeclaration} from '@uirouter/angularjs'


// https://github.com/ngParty/ng-metadata/issues/206
export const routing = ['$locationProvider', '$stateProvider', '$urlRouterProvider',
($locationProvider: angular.ILocationProvider,
  $stateProvider: StateProvider,
  $urlRouterProvider: UrlRouterProvider

) => {
  "ngInject";

  // html5 removes the need for # in URL
  $locationProvider.html5Mode({
    enabled: false
  });

  $stateProvider.state('home', <Ng1StateDeclaration>{
    url: '/home',
    views: {
      'content@': { template: '<login></login>' }
    }
  }
  );

  $urlRouterProvider.otherwise('/home');

}]
```


*** Assuming ng-annotate is working, do not use.

_./src/app/app.routes.ts_

```javascript
import * as angular from 'angular';
import {StateProvider, UrlRouterProvider, Ng1StateDeclaration} from '@uirouter/angularjs'


// https://github.com/ngParty/ng-metadata/issues/206
export const routing = ($locationProvider: angular.ILocationProvider,
  $stateProvider: StateProvider,
  $urlRouterProvider: UrlRouterProvider

) => {
  "ngInject";

  // html5 removes the need for # in URL
  $locationProvider.html5Mode({
    enabled: false
  });

  $stateProvider.state('home', <Ng1StateDeclaration>{
    url: '/home',
    views: {
      'content@': { template: '<login></login>' }
    }
  }
  );

  $urlRouterProvider.otherwise('/home');

}
```
- _Hold on a second_ What's this _ngInject_ string? We are using strict-di and we should now enumerate as
string all the services we are injecting in the function (this is done to avoid issues when using the uglified
version of this files), _ngInject_ does that for us, but we need to add a new plugin into wepack. first let's install
it:

**** NgAnnotate is an abandone project not working fine, need to jump back to old
schoolk annotation (But comment how it works).

> https://github.com/huston007/ng-annotate-loader/issues/17

```cmd
npm install ng-annotate-webpack-plugin --save-dev
```

- Now let's add it to our _webpack.config.js_

```diff
+   var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

// ...

  plugins: [
+    new ngAnnotatePlugin({
+            add: true,
+            // other ng-annotate options here 
+    }),        
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
    })
  ],

```

- Let's setup this routing into the main app:

_./src/app/app.ts_

```diff
  import * as angular from 'angular';
+ import { routing } from './app.routes';
  import {AppComponent} from './app.component';
  import { components } from './components'

  angular.module('app', [
      'ui.router',
      components.name
    ])
+ .config(routing)
    .component('app', AppComponent)
  ;
```

- Now let's jump back into our _app.html_ template and replace the login component
with the navigation place holder.

_./src/app/app.html_

```diff
<div>
    <h1>Hello From Angular app!</h1>
-    <login></login>
+    <div ui-view="content"></div>
</div>
```

- Now if we start the app the exact same display as before will be shown, but this time
using ui-router.

```cmd
npm start
```

- It's time to move forward using the ui-router, we will create a second page and add a 
navigation link from login page to that second page.

_./src/components/client/list/clientlist.html_

```javascript
<div>
    <h1>Hello From Client Component !</h1>
</div>
```

_./src/components/client/list/client.list.component.ts_

```javascript
export const ClientListComponent = {
  template: require('./clientlist.html') as string
};
```

_./src/client/list/index.ts_

```javascript
import * as angular from 'angular';
import { ClientListComponent } from './client.list.component';

export const ClientListModule = angular.module('clientlist', [
  ])
  .component('clientlist', ClientListComponent)
;
```

- Let's add this module to our components module.

_./src/components/index.ts_

```diff
  import * as angular from 'angular';
  import { LoginModule  } from './login';
+ import { ClientListModule } from './client/list'

  export const components = angular.module('components', [
       LoginModule.name,
+      ClientListModule.name       
    ])  
  ;
```

- Now it's time to add a new route pointing to this client.

_./src/app.routes.ts_

```diff
import * as angular from 'angular';
import "angular-ui-router";

export const routing = ($locationProvider: angular.ILocationProvider,
                $stateProvider: angular.ui.IStateProvider,
                $urlRouterProvider: angular.ui.IUrlRouterProvider) =>  {    
    "ngInject";


    // html5 removes the need for # in URL
    $locationProvider.html5Mode({
        enabled: false
    });

    $stateProvider.state('home', <ng.ui.IState>{
        url: '/home',
        views: {
            'content@': { template: '<login></login>' }
        }
      }
    );

+    $stateProvider.state('clients', <Ng1StateDeclaration>{
+        url: '/clients',
+        views: {
+            'content@': { template: '<clientlist></clientlist>' }
+        }
+      }
+    );


    $urlRouterProvider.otherwise('/home');
}

```
- To check that we are running on the right track, we can just launch our project and in the browser
navigate to: http://localhost:8080/#!/clients

```cmd
npm start
```

- Let's add a link from the login page to the clients page:

_./src/app/components/login/login.html_
```diff
<div>
    <h1>Hello From Login Component !</h1>
+    <a ui-sref="clients">Navigate to clients</a>
</div>
```

- We can try the sample:

```cmd
npm start
```


