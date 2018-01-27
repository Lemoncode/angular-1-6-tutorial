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

- Start testing that the loginPage component exists.

_./src/app/components/login/login.page.spec.ts_

```javascript
import * as angular from 'angular'
import {} from 'angular-mocks';
import {LoginModule} from './index'

describe('LoginPage', () => {

  let $componentController;

  beforeEach(() => {
    // load the login Module
    window['module'](LoginModule.name);
  });

  beforeEach(inject((_$componentController_) => {
    this.$componentController = _$componentController_;

  }));

  it('is registered', () => {    
    // Extract the component controller from the login page
    const controller = this.$componentController('loginPage');    

    expect(controller).toBeDefined();
  })  
});
```

- This loginPage will expose a method to perform a login (and
will be consumed by login.component), but let's start defininng a
failing test for this.

_./src/app/components/login/login.page.spec.ts_

```diff
import * as angular from 'angular'
import {} from 'angular-mocks';
import {LoginModule} from './index'

describe('LoginPage', () => {

  let $componentController;

  beforeEach(() => {
    // load the login Module
    window['module'](LoginModule.name);
  });

  beforeEach(inject((_$componentController_) => {
    this.$componentController = _$componentController_;

  }));

  it('is registered', () => {    
    // Extract the component controller from the login page
    const controller = this.$componentController('loginPage');    

    expect(controller).toBeDefined();
  })  

+  it('has defined doLogin method', () => {        
+    const controller = this.$componentController('loginPage');    
+
+    expect(controller.doLogin).toBeDefined();
+  })  

});
```

- This test fails as expected, let's implement the doLogin method in the 
loginPageController.

```diff
export class LoginPageController {
  constructor() {

  }  

+  doLogin(login : string, password : string) {
+  }
}
```

- It's time to implement the functionallity for doLogin, we need to inject the loginService
that we have previously created and inject the login service, in the doLogin we will
call this service (same thing here as before, this time we will first implement, tests
break then refactor, we could do it the other way around).

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
import { LoginPage } from './login.page'
+ import { ApiModule } from '../../api/index'

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
```

- Let's add a test case, invoking login result

_./src/app/components/login/login.page.spec.ts_
```diff
it('execute doLogin method', () => {
    const controller = this.$componentController('loginPage');

    expect(controller.doLogin('admin', 'test')).toBeDefined();
})
```

- Now if we see the test we get red lights, we need to import
this module depency in the tests as well.

_./src/app/components/login/login.page.spec.ts_

```diff
import * as angular from 'angular'
import {} from 'angular-mocks';
import {LoginModule} from './index'

describe('LoginPage', () => {

  let $componentController;
+ let loginService;

  beforeEach(() => {    
    window['module'](LoginModule.name);

+    window['module']($provide => {
+      $provide.value('LoginService', {
+        validateLogin: (user : string, pwd: string) => {
+          return {
+            then: (fresult) => fresult(true)      
+          }
+        }
+      });
+    })    
  });

-  beforeEach(inject((_$componentController_) => {
+  beforeEach(inject((_$componentController_, _LoginService_) => {
    this.$componentController = _$componentController_;
+    this.loginService = _LoginService_;
  }));
  
// ...

+  it('doLogin method calls LoginService.validateLogin', () => {        
+    const controller = this.$componentController('loginPage');    
+    spyOn(this.loginService, 'validateLogin').and.callThrough();
+
+    controller.doLogin('admin', 'test');
+
+    expect(this.loginService.validateLogin).toHaveBeenCalled();
+  })  

```



