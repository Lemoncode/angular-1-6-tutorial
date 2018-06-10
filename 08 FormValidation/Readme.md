# Sample 08 - Form Validation

In this sample we will add form validations to our login page.

Summary steps:

- Add the validation constraints.
- Disable the button when the form is not valid.
- Display inline messages displaying the errors.
- Add a custom validation
- Add an async validation directive.
- Playing with touch etc...

Implementation:

- Login user name and password are mandatory fields let's add a validation for that:

_./src/components/login/login.html_

```diff
<div class="form-group">
    <label for="exampleInputEmail1">Username or Email</label>
    <input class="form-control" 
          style="border-radius:0px" 
          id="exampleInputEmail1" 
+         ng-required="{true}"          
          placeholder="Enter email"
          ng-model="vm.user">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Password <a href="/sessions/forgot_password">(forgot password)</a></label>
    <input type="password" 
          class="form-control" 
          style="border-radius:0px" 
          id="exampleInputPassword1" 
+         ng-required="{true}"                    
          placeholder="Password"
          ng-model="vm.password">
</div>
```

- Let's disable the login button when the form is pristine or not valid.

First we need to give a name to our form:

_./src/components/login/login.html_

```diff
-  <form role="form">
+  <form role="form" name="loginForm">
```

Now we can just add a directive that will disable the form

_./src/components/login/login.html_

```diff
<button type="submit" class="btn btn-sm btn-default"
+ ng-disabled="loginForm.$pristine || loginForm.$invalid"
  ng-click="vm.onDoLogin({user: vm.user, pass: vm.password})">
    Sign in
</button>
```

- Let's display inline validation error messages, 

```cmd
npm install angular-messages --save
```

- Let's add it to our login module.

_./src/app/components/login/index.ts_

```diff
export const LoginModule = angular.module('login', [
  ApiModule.name,
+ 'ngMessages',
  'toastr'
  ])
```
- And add it to our wepbpack config as vendor

_./webpack.config.js_

```diff
  vendor: [
    'angular',
    'angular-toastr', 
    'angular-ui-router',
+    'angular-messages', 
  ],    
```

- And to our spec bundle test

_./spec.bundle.js_

```diff
import angular from 'angular';
import mocks from 'angular-mocks';
import 'angular-toastr';
import "angular-ui-router";
+ import 'angular-messages';
```

- Let's add just a message per field, on the next step we will refactor.

_./src/components/login/login.html_

```diff
<div class="form-group">
    <label for="exampleInputEmail1">Username or Email</label>
    <input class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email"
+         name="loginField"    
          ng-required="{true}" 
          ng-model="vm.user">
+  <div ng-messages="loginForm.loginField.$error">
+     <p ng-message="required">Please inform the field</p>
+  </div>
</div>
```

- Let's give a quick try to ensure we are on track.

```bash
npm start
```

- Adding a set of repeated ng-messages per page or app it's a disgusting 
repetitive thask, could it be possible to just use a common template and
be able to override it whenever we want to add a custom message for a 
specific validation in a given field ? Yes let's do that (we could promote
at index.html level).

_./src/components/login/login.html_

```diff
+<script type="text/ng-template" id="form-error-messages">
+  <div ng-message="required">Please inform the field</div>
+</script>
<div>
    <div class="container" style="margin-top:30px">
        <div class="col-md-4 col-md-offset-4">
```

```diff
<input class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email"
      name="loginField"    
      ng-required="{true}" 
      ng-model="vm.user">
- <div ng-messages="loginForm.loginField.$error">
-  <p ng-message="required">Please inform the field</p>
- </div> 
+  <div ng-messages="loginForm.loginField.$error">   
+    <div ng-messages-include="form-error-messages">
+    </div>
+  </div>                                     
```

```diff
<div class="form-group">
    <label for="exampleInputPassword1">Password <a href="/sessions/forgot_password">(forgot password)</a></label>
    <input type="password" 
            class="form-control" 
            style="border-radius:0px" 
            id="exampleInputPassword1" 
            placeholder="Password"
+            name="passwordField"
            ng-required="{true}" 
            ng-model="vm.password">
+  <div ng-messages="loginForm.passwordField.$error">   
+    <div ng-messages-include="form-error-messages">
+    </div>
+  </div>                                     
</div>
```

- Angular validation offers some extra goodies e.g. 

Pristine, Dirty, Touched...

http://stackoverflow.com/questions/25025102/angular-difference-between-pristine-dirty-and-touched-untouched

Validate onBlur

ng-model-options 
{ 'updateOn': 'blur'}

http://stackoverflow.com/questions/14722577/how-to-let-ng-model-not-update-immediately


