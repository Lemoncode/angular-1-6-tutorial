# Sample 06 - Service Integration (login)

Let's integrate the login service into our login page.

  - We will add a loginPage component that will make the login calls and use the
  pure ui login.component.
  - We will show a toast in case the login failed, and redirect to clients page 
  whenever the login has been succesful.

  Summary steps:
  - TODO ADD summary steps

Implementation

  - We are going to create a loginPage, let's define a controller for this
  page:

  _./src/app/components/login/login.page.controller.ts_

``` javascript
export class LoginPageController {
  constructor() {

  }  
}
 ```

  - Create a simple loginPage that will consume our loginComponent.

_./src/app/components/login/login.page.ts_

```javascript
import { LoginPageController as controller } from './login.page.controller'

export const LoginPage = {
  template: '<login/>',
  controller,
  controllerAs: 'vm'
};
```
- Let's register the LoginPage:

_./src/app/components/login/index.ts_

```diff
import * as angular from 'angular';
import { LoginComponent } from './login.component';
+ import { LoginPage } from './login.page';

export const LoginModule = angular.module('login', [
  ])
  .component('login', LoginComponent)
+  .component('loginPage', LoginPage)
;
```

- Let's define a DoLoginMethod

```diff
export class LoginPageController {
  constructor() {

  }  

+  doLogin(login : string, password : string) {
+  }
}
```

- It's time to implement the functionallity for doLogin, we need to inject the loginService that we have previously created and inject the login service, in the doLogin we willcall this service (same thing here as before, this time we will first implement, testsbreak then refactor, we could do it the other way around).

- First step (we have forgotten to do that) create an index.js defining the api services module.

_./src/app/api/index.ts_

```javascript
import * as angular from 'angular';
import { LoginService } from './login';

export const ApiModule = angular.module('api', [
  ])
  .service('LoginService', LoginService)
  
;
```

- Now let's import it at loginModule level.

_./src/app/components/login/index.ts_

```diff
import * as angular from 'angular';
import { LoginComponent } from './login.component';
import { LoginPage } from './login.page';
+ import { ApiModule } from '../../api';

export const LoginModule = angular.module('login', [
+  ApiModule.name
  ])
  .component('login', LoginComponent)
  .component('loginPage', LoginPage)
;
```

- Let's use the service in the loginPage

_./src/app/components/login/login.page.controller.ts_

```diff

+ import { LoginService } from '../../api/login'


export class LoginPageController {
+  loginService : LoginService = null;

-  constructor() {
+  constructor(LoginService : LoginService) {
+    "ngInject";

+    this.LoginService = LoginService;
  }  

  doLogin(login : string, password : string) {
+    this.loginService.validateLogin(login, password).then(
+       (succeeded) => {
+         if(succeeded) {
+            console.log('login succeeded');
+         } else {
+           console.log('login failed');
+         }
+       }
+    );
  }
}

+LoginPageController.$inject = ['LoginService'];
```

- Let's replace in the app routes the current component that we are using for the login route with the new login page.

_./src/app/app.routes.ts_

```diff
  $stateProvider.state('home', <Ng1StateDeclaration>{
    url: '/home',
    views: {
-      'content@': { template: '<login></login>' }
+      'content@': { template: '<login-page></login-page>' }
    }
  }
  );
}]
```

- Let's make a quick check and ensure the site is still working (no console log yet).

```
npm start
```

- Time to move on: we need to hook the _doLogin_ method in the page with the button on the login component, let's go step by step.

- First let's expose a callback parameter to our loginComponent and define the fields that will be binded to our form fields (user and password).

_./src/app/components/login.component.ts_

```diff
export const LoginComponent = {
  template: require('./login.html') as string,
+  bindings: {
+    onDoLogin: '&'    
+  },
+  controllerAs: 'vm',
+  controller: class LoginController {
+    user :string;
+    password : string;
+
+    $onInit = () => {
+      this.user = '';
+      this.password = '';
+    }
+  }  
};
```

- Now in the component HTML, in the button tag let's call that param with some harcoded info:

_src/app/components/login.html_

```diff
- <button type="submit" class="btn btn-sm btn-default">Sign in</button>
+ <button type="submit" class="btn btn-sm btn-default" ng-click="vm.onDoLogin({user:'bad', pass:'user'})">Sign in</button>
```

- And in the login page let's tie together the controller DoLogin on the component on-do-login event.

_./src/app/components/login.page.ts_

```diff
import { LoginPageController as controller } from './login.page.controller'

export const LoginPage = {
-  template: '<login/>',
+ template: '<login on-do-login="vm.doLogin(user, pass)"/>',
  controller,
  controllerAs: 'vm'
};
```

- Now let's give a try and check what happens when we click.

```
npm start
```

- Errors? Yeah (open console), ngInject seems not to be working as expected (it's an abandoned projects there's a fork to patch and loader but not quite maintained), let's manually hook this injects, let's place this line of code at the bottom of our file.

_./src/app/components/login/login.page.controller.ts_

```javascript
LoginPageController.$inject = ['LoginService'];
``` 

- Same happens with _LoginService_, are you able to fix this without taking a look at the solution?

_./src/app/api/login.ts_

```
LoginService.$inject = ['$q'];
```

- Let's bind now real time information from the form inputs, remember that in the component we have defined

_./src/components/login/login.component.ts_

```javascript
  controller: class LoginController {
    user: string;
    password: string;
```
- We can bind this in the inputs and pass that info the OnDoLogin

```diff
  <form role="form">
    <div class="form-group">
      <label for="exampleInputEmail1">Username or Email</label>
-      <input class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email">
+      <input class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email"
+       ng-model="vm.user">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password
        <a href="/sessions/forgot_password">(forgot password)</a>
      </label>
-      <input type="password" class="form-control" style="border-radius:0px" id="exampleInputPassword1" placeholder="Password">
+      <input type="password" class="form-control" style="border-radius:0px" id="exampleInputPassword1" placeholder="Password"
+       ng-model="vm.password">
    </div>
-    <button type="submit" class="btn btn-sm btn-default" ng-click="vm.onDoLogin({user:'bad', pass:'user'})">Sign in</button>
+     <button type="submit" class="btn btn-sm btn-default" 
+      ng-click="vm.onDoLogin({user:vm.user, pass: vm.password})">Sign in</button>
  </form>
```

- Let's give a try and check that entering the key pair 'admin'/'test' on the login
form inputes we get a success message on the console log.

```
npm start
```

> We will get an error here !!! 'user' will be undefined, what's going on here? ime to review and lear from what we have done, and finally realize it was an stupid bug, if we use the type "email" in the login input validation will be thrown and data won't be propagated we have to remove that here.

__login.html__
```diff
-<input type="email" class="form-control" style="border-radius:0px" id="exampleInputEmail1"
-                                placeholder="Enter email" ng-model="vm.user">
+<input type="text" class="form-control" style="border-radius:0px" id="exampleInputEmail1"
+                               placeholder="Enter email" ng-model="vm.user">
```