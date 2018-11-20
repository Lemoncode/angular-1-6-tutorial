# Sample 09 - Async Validation


In this sample we will add an async validation, hitting a real rest api.

We will enforce that the login name must exists on GitHub.

Summary steps:

- Add the a service that will hit github rest-api.
- Add the directive that will perform the validation.
- Include it in the input field.

Implementation:

- Let's create a github api service:


_./src/app/api/github.ts_

```javascript
export class GitHubService {    
  constructor(private $q : angular.IQService, private $http : angular.IHttpService) {
  }

  public acccountExists(login : string) : angular.IPromise<boolean> {         

    const deferred = this.$q.defer<boolean>();    
    const url = `https://api.github.com/users/${login}`;

    // TODO: on the error side we should check the error code, e.g.
    // if github is down we should return false
    this.$http.get(url)
      .then(
            (response) => deferred.resolve(true),
            (error) => deferred.resolve(false)
            );

    return deferred.promise;
  }
}

GitHubService.$inject = ['$q', '$http'];
```

- Let's register this new service:

_./src/app/api/index.ts_

```diff
import * as angular from 'angular';
import { LoginService } from './login';
+ import { GitHubService } from './github'

export const ApiModule = angular.module('api', [
  ])
  .service('LoginService', LoginService)
+ .service('GitHubService', GitHubService)  
;
```

- Now it's time to create a directive that will integrate with the form,
since we won't expect that this validation will be only be called on 
this page we will keep it local, if in the future it's needed to be shared
we could promote it to a ./common/validations folder.

_./src/components/login/validations/githublogin.ts_

```javascript
import { GitHubService } from '../../../api/github';


export class validGithubLogin implements angular.IDirective {
  public link: (scope: angular.IScope, elem: ng.IAugmentedJQuery, attrs: angular.IAttributes, ngModel: angular.INgModelController) => void;
  restrict = 'A';
  require = 'ngModel';


  constructor($q: angular.IQService, GitHubService: GitHubService)
  {
    validGithubLogin.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: angular.INgModelController) =>
    {
       
       ngModel.$asyncValidators["validGithubLogin"] = (modelValue, viewValue) => {
          if(ngModel.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.resolve();
          }

          return GitHubService.acccountExists(modelValue)
                    .then((result) => {
                      if(result) {
                          return true;
                      } else {
                          return $q.reject('Not valid Github User')
                      }
                    });
       }
    }
  }


  public static Factory() {
    var directive = ['$q', 'GitHubService', ($q: angular.IQService,GitHubService: GitHubService) => {
      return new validGithubLogin($q, GitHubService);
    }];
    
    return directive;
  }
}
```

- Let's register it

_./src/login/index.ts_

```diff
import * as angular from 'angular';
import { LoginComponent } from './login.component';
import { LoginPage } from './login.page'
import { ApiModule } from '../../api/index'
+ import { validGithubLogin } from './validations/githublogin'

export const LoginModule = angular.module('login', [
  ApiModule.name,
  'toastr',
  'ngMessages',
  ])
  .component('login', LoginComponent)
  .component('loginPage', LoginPage)
+ .directive('validGithubLogin', validGithubLogin.Factory())  
;
```

- Now let's configure the error message for this validation:

_./src/components/login/login.html_

```diff
<script type="text/ng-template" id="form-error-messages">
  <div ng-message="required">Please inform the field</div>
+  <div ng-message="validGithubLogin">Login does not exists on Github</div>
</script>
```

- And add it as attribute on the login input element, plus fire it only when the input looses focus:

_./src/components/login/login.html_

```diff
<input class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email"
      name="loginField"    
      ng-required="{true}" 
+     valid-github-login
      ng-model="vm.user"
+     ng-model-options="{updateOn: 'blur'}"
      >
```


- One more thing to add, on the button we will disable it as well when
the async validation is in progress.

_./src/components/login/login.html_

```diff
<button type="submit" class="btn btn-sm btn-default"
-  ng-disabled="loginForm.$pristine || loginForm.$invalid"  
+  ng-disabled="loginForm.$pristine || loginForm.$invalid || loginForm.$pending"  
  ng-click="vm.onDoLogin({user: vm.user, pass: vm.password})"
>Sign in</button>
```

- Let's run the sample and check that the validation is running.

> Beware when running this, github will block more than 50 request per hour
coming from the same ip address.

```cmd
npm start
```
