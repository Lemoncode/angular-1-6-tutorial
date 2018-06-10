# Sample 07 - Third partie lib

In this sample we are going to install a third partie lib
and make use of it (toastr implementation)[https://github.com/Foxandxss/angular-toastr], we will use it
in our controller.

implementation

- Let's start by installing the library:

```cmd
npm install angular-toastr --save
```

```cmd
npm install @types/angular-toastr --save-dev
```

- Let's add it to our vendor list in webpack.config.js, and let's import the styles

./wepback.config.js

```diff
  entry: {
    app: './app/app.ts',
    vendor: [
      'angular',
+     'angular-toastr', 
    ],    
    appStyles: [
      '../node_modules/bootstrap/dist/css/bootstrap.css',
+      '../node_modules/angular-toastr/dist/angular-toastr.css',
      './mystyles.scss',       
    ]
  },
```

- Let's import it in our login Module:

_./src/app/components/login/index.ts

```diff
import * as angular from 'angular';
import { LoginComponent } from './login.component';
import { LoginPage } from './login.page'
import { ApiModule } from '../../api/index'

export const LoginModule = angular.module('login', [
  ApiModule.name,
+  'toastr'
  ])
  .component('login', LoginComponent)
  .component('loginPage', LoginPage)
;
```
- We want to show a success toaster when the login is successful and a failure on when the combination is wrong.

_./src/app/components/login/login.page.ts_

- Now it's time to move back to the login controller and implement
the proper notification.

_./src/app/components/login/login.page.controller.ts_

```diff
import { LoginService } from '../../api/login'
+ import {IToastrService} from 'angular-toastr';

export class LoginPageController {
  loginService : LoginService = null;
+ toastr : IToastrService;

-  constructor(LoginService : LoginService) {
+  constructor(LoginService: LoginService, toastr : IToastrService) {
    "ngInject";

    this.loginService = LoginService;
+    this.toastr = toastr;
  }  

  doLogin(login : string, password : string) {
    if(this.loginService.validateLogin(login, password)) {
      console.log('Validation Succeeded');
    } else {
-      console.log('Validation Failed');
+      this.toastr.error('Incorrect login or password, please try again')
    }
  }
}

- LoginPageController.$inject = ['LoginService'];
+ LoginPageController.$inject = ['LoginService', 'toastr'];
```

- Now let's give a try and check what happens when we click.

```cmd
npm start
```

- To end up with this sample let's navigate to the clients page, if login is successful.

- First we need to request the IStateService (routing)

_./src/app/components/login/login.page.controller.ts_

```diff
+ import { StateService } from '@uirouter/angularjs'

export class LoginPageController {
  loginService : LoginService = null;
  toastr : angular.toastr.IToastrService;
+  $state: StateService;

 constructor(LoginService : LoginService, 
             toastr : angular.toastr.IToastrService,
+             $state: StateService
             ) {
    "ngInject"; // Wrong go to bottom injector

    this.loginService = LoginService;
    this.toastr = toastr;
+    this.$state = $state;
  }  
```

- Now let's do the navigation on LoginSucceeded

_./src/app/components/login/login.page.controller.ts_

```diff
  doLogin(login: string, password: string) {
    this.loginService.validateLogin(login, password).then(
       (succeeded) => {
         if(succeeded) {
            console.log('login succeeded');
+            this.$state.go('clients');            
         } else {


// ...
- LoginPageController.$inject = ['LoginService', 'toastr'];
+ LoginPageController.$inject = ['LoginService', 'toastr', '$state'];
```

> If you are not using ngInject remember to add LoginPageController.$inject = ['LoginService', 'toastr', '$state'];

- It's time to test it

```
npm start
```