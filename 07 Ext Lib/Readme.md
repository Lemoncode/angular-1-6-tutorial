# Sample 07 - Third partie lib

In this sample we are going to install a third partie lib
and make use of it (toastr implementation)[https://github.com/Foxandxss/angular-toastr], we will use it
in our controller, we will add unit test support for it.

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

- And import it in our test bundle

_./spec.bundle.js_

```diff
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
+ import toastr from 'angular-toastr'

// We use the context method on `require` which Webpack created
// in order to signify which files we actually want to require or import.
// Below, `context` will be a/an function/object with file names as keys.
// Using that regex, we scan within `client/app` and target
// all files ending with `.spec.js` and trace its path.
// By passing in true, we permit this process to occur recursively.
let context = require.context('./src/app', true, /\.spec\.ts/);

// Get all files, for each file, call the context function
// that will require the file and load it here. Context will
// loop and require those spec files here.
context.keys().forEach(context);

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
- We want to show a success toaster when the login is successful and a failure on when the combination
is wrong, let's first create tests for this.

- Now we need to refactor the login page structure: we need
to mock validateLogin in some cases return true in others false.

> We will replace the whole spec and create two configuration groups.

_./src/app/components/login/login.page.spec.ts_

```javascript
import * as angular from 'angular'
import {} from 'angular-mocks';
import {LoginModule} from './index'

describe('LoginPage', () => {

  let $componentController;
  let loginService;

  describe('Login Success case', () => {

    beforeEach(() => {    
      window['module'](LoginModule.name);

      window['module']($provide => {
        $provide.value('loginService', {
          validateLogin: (user : string, pwd: string) => {                          
              return {
                then: (fresult) => {                
                  fresult(true);
                }
              }              
          }        
        });
        
      })    
    });

    beforeEach(inject((_$componentController_, _LoginService_) => {
      this.$componentController = _$componentController_;
      this.loginService = _LoginService_;
    }));

    it('is registered', () => {    
      const controller = this.$componentController('loginPage');    

      expect(controller).toBeDefined();
    })

    it('has defined doLogin method', () => {        
      const component = this.$componentController('loginPage');    

      expect(component.doLogin).toBeDefined();
    })  

    it('doLogin method calls LoginService.validateLogin', () => {        
      const component = this.$componentController('loginPage');    
      spyOn(this.loginService, 'validateLogin').and.callThrough();

      component.doLogin('something', 'whatever');

      expect(this.loginService.validateLogin).toHaveBeenCalled();
    })  
  });

  describe('Login failed case', () => {
    beforeEach(() => {    
      window['module'](LoginModule.name);

      window['module']($provide => {
        $provide.value('loginService', {
          validateLogin: (user : string, pwd: string) => {                          
              return {
                then: (fresult) => {                
                  fresult(false);
                }
              }              
          }        
        });
        
      })    
    });

    beforeEach(inject((_$componentController_, _LoginService_) => {
      this.$componentController = _$componentController_;
      this.loginService = _LoginService_;    
    }));    
  });
});
```

- In order to implement the login failed case we need to request
a toaster component and ensure toastr.error has been called.

_./src/app/components/login/login.page.spec.ts_

```diff
describe('LoginPage', () => {

  let $componentController;
  let loginService;
+ let toastr;

  //(...)

  describe('Login failed case', () => {
    beforeEach(() => {    
      window['module'](LoginModule.name);

      window['module']($provide => {
        $provide.value('loginService', {
          validateLogin: (user : string, pwd: string) => {
            return {
              then: () => {return false}
            };
          }        
        });        
      })          

+      window['module']($provide => {
+        $provide.value('toastr', {
+          error: (message : string) => {
+            return;
+          }        
+        });        
+      })          
      
    });

-    beforeEach(inject((_$componentController_, _LoginService_) => {
+    beforeEach(inject((_$componentController_, _LoginService_, _toastr_) => {  
      this.$componentController = _$componentController_;
      this.loginService = _LoginService_;
+     this.toastr = _toastr_;      
    }));    

+    it('doLogin method calls toastr.error', () => {        
+      const component = this.$componentController('loginPage');    
+      spyOn(this.toastr, 'error').and.callThrough();
+
+      component.doLogin('something', 'whatever');
+
+      expect(this.toastr.error).toHaveBeenCalled();
+    });
    
  });
});
```

_./src/app/components/login/login.page.ts_

- Now it's time to move back to the login controller and implement
the proper notification.

```diff
import { LoginService } from '../../api/login'
+ import * as toastr from 'angular-toastr'

export class LoginPageController {
  loginService : LoginService = null;
+ toastr : toastr;

-  constructor(LoginService : LoginService) {
+  constructor(LoginService : LoginService, toastr : toastr) {
    "ngInject";

    this.loginService = LoginService;
+    this.toastr = toastr;
  }  

  doLogin(login : string, password : string) {
    if(this.loginService.validateLogin(login, password)) {
      console.log('Validation Succeeded');
    } else {
-      console.log('Validation Failed');
+      toastr.error('Incorrect login or password, please try again')
    }
  }
}
```

- If we check the tests we get green lights ! let's add one more test
to ensure on success error toast is not called.

_./src/app/components/login/login.page.spec.ts_

```diff
  describe('Login Success case', () => {

    beforeEach(() => {    
      window['module'](LoginModule.name);

      window['module']($provide => {
        $provide.value('LoginService', {
          validateLogin: (user : string, pwd: string) => {                          
              return {
                then: (fresult) => {                
                  fresult(true);
                }
              }              
          }        
        });        
      });
    });

-   beforeEach(inject((_$componentController_, _LoginService_, _$rootScope_) => {
+   beforeEach(inject((_$componentController_, _LoginService_, _toastr_) => {
      this.$componentController = _$componentController_;
      this.loginService = _LoginService_;
      this.$rootScope =  _$rootScope_;
+     this.toastr = _toastr_; 
    }));


/// ...
    it('doLogin method calls LoginService.validateLogin', () => {        
      const component = this.$componentController('loginPage');    
      spyOn(this.loginService, 'validateLogin').and.callThrough();

      component.doLogin('something', 'whatever');

      expect(this.loginService.validateLogin).toHaveBeenCalled();
    }) 


+    it('doLogin (success) method do not call toastr.error', () => {        
+      const component = this.$componentController('loginPage');    
+      spyOn(this.toastr, 'error').and.callThrough();
+
+      component.doLogin('something', 'whatever');

+      expect(this.toastr.error).toHaveBeenCalled();
+    })  
```

> If we run the app we won't see this in action, why? because 
  1. We are not using loginPage in our routing.
  2. We haven't hooked the button click event to anything
  3. We haven't binded the form fields to variables.

- Let's start by using loginPage in our Routes file

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

- Now we have a container (loginPage) that contains the logic, and a dummy child component (login)

> We need to first expose an OnLogin event like in the dummy component and hook it to 
the container (LoginPage) do login method

- First let's expose a callback parameter to our loginComponent and define the fields that will be binded to
our form fields (user and password)

_./src/app/components/login.component.ts_

```diff
export const LoginComponent = {
  template: require('./login.html') as string
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

_./src/app/components/login.html_
```diff
- <button type="submit" class="btn btn-sm btn-default">Sign in</button>
+ <button type="submit" class="btn btn-sm btn-default" ng-click="vm.onDoLogin({user:'bad', pass:'user'})">Sign in</button>
```
- And in the login page let's tie together the controller DoLogin on the component on-do-login event

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

```cmd
npm start
```

- Let's bind now real time information from the form inputs, remember that in the component we have 
defined

_./src/components/login/login.component.ts_
```
  controller: class LoginController {
    user: string;
    password: string;
```

- We can bind this in the inputs and pass that info the OnDoLogin

```diff
  <form role="form">
    <div class="form-group">
      <label for="exampleInputEmail1">Username or Email</label>
-      <input type="email" class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email">
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
    "ngInject";

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

```

> If you are not using ngInject remember to add LoginPageController.$inject = ['LoginService', 'toastr', '$state'];