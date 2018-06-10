# Sample 10 - Custom Validation

In this sample we will add a validation that needs custom login.

We will replace our github validation with a NIF validation (login
should be a valid DNI)

Summary steps:

- Add a regex format validator (standard)
- Implement the DNI validation algorithm in a service.
- Integrate it in a directive.
- Include it in the input field (replace github with this one).
- Add the ng-message entry.

Implementation:

- Let's start by implement a DNI service that will perform the validation login.

> Talk here about clean code, extracted implementation vs current: https://donnierock.com/2011/11/05/validar-un-dni-con-javascript/

_./src/app/common/validations/dniService.ts_

```javascript
export class DNIService {  
  constructor() {
    "ngInject";    
  }

  // dni format: 99999999X  
  public isValid(dni : string) : boolean {         
    
    // If the input has not the valid format we just skip
    // and return true
    let result = this.isValidFormat(dni);

    if(result) {
      const dniNumbersPart =  this.extractNumber(dni);
      const dniLetterPart  = this.extractLetter(dni);
      const expectedLetter = this.calculateExpectedLetter(dniNumbersPart);
      result = (dniLetterPart === expectedLetter);    
    }

    return result;
  }


  private isValidFormat(dni : string) {
    const dniFormat = /^\d{5,8}[A-Z]$/;    
    
    return(dniFormat.test(dni))     
  }

  private extractNumber(dni : string) : number
  {
    return Number(dni.substr(0,dni.length-1));
  }

  private extractLetter(dni : string) : string
  {
    return dni.substr(dni.length-1,1).toUpperCase();
  }

  private calculateExpectedLetter(DniNumbersPart : number) : string
  {
    var lookup = 'TRWAGMYFPDXBNJZSQVHLCKE';        
    return (lookup.charAt(DniNumbersPart % 23));
  }
  
}
```

_./src/app/common/index.ts_

```javascript
import * as angular from 'angular';
import { DNIService } from './validations/dniService';

export const commonModule = angular.module('common', [
  ])
  .service('DNIService', DNIService)  
;
```
_./src/app/app.ts_

```diff
import * as angular from 'angular';
import { routing } from './app.routes'
import {AppComponent} from './app.component';
import { components } from './components';
+ import { commonModule } from './common';


angular.module('app', [
    'ui.router',    
    components.name,
+    commonModule.name
  ])
  .config(routing)
  .component('app', AppComponent)
;
```

- Now we will implement a directive, that will make use of this validationDNI service.

_./src/app/common/validations/dniValidate.ts_

```javascript
import { DNIService } from './dniService';


export class dniValidate implements angular.IDirective {
  public link: (scope: angular.IScope, elem: ng.IAugmentedJQuery, attrs: angular.IAttributes, ngModel: angular.INgModelController) => void;
  restrict = 'A';
  require = 'ngModel';


  constructor(DNIService: DNIService)
  {
    dniValidate.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: angular.INgModelController) =>
    {
      ngModel.$parsers.unshift((viewValue) => {
        ngModel.$setValidity('validDNI', DNIService.isValid(viewValue));

        return viewValue;
      });
    }
  }


  public static Factory() {
    var directive = ['DNIService',(DNIService: DNIService) => {
      "ngInject";
      return new dniValidate(DNIService);
    }];
    
    return directive;
  }
}
```

_./src/app/common/index.ts_

```diff
import * as angular from 'angular';
import { DNIService } from './validations/dniService';
+ import { dniValidate } from './validations/dniValidate'

export const commonModule = angular.module('common', [
  ])
  .service('dniService', DNIService)  
+  .directive('dniValidate', dniValidate.Factory())
;
```

- It's time replace the githubvalidation and use our dni validation in the login form

Add a new message for this validation:

_./src/app/components/login/login.html_

```diff
<script type="text/ng-template" id="form-error-messages">
  <div ng-message="required">Please inform the field</div>
  <div ng-message="validGithubLogin">Login does not exists on Github</div>
+  <div ng-message="validDNI">DNI is not valid</div>
</script>
```

Now let's add two validations on the form: first a RegEx one to ensure that the format is 
correct (^\d{7}\W$), then the validation that checks that the dni letter matches.

```diff
<input class="form-control" style="border-radius:0px" id="exampleInputEmail1" placeholder="Enter email"
      name="loginField"    
      ng-required="{true}"                                       
-      valid-github-login=""
+     ng-pattern="/^\d{9}\W$/"
+     dni-validate=""
      ng-model="vm.user"
      ng-model-options="{updateOn: 'blur'}"
      >
```

We will need to fine tune the ng-message on this case, it would be weird to return a 
"RegEx is not valid message", instead, "DNI is composed of 8 letters plus a word, capital 
letters e.g. 12345678U".

```diff
<div ng-messages="loginForm.loginField.$error">  
+    <div ng-message="pattern">DNI is composed of 8 letters plus a word, capital letters e.g. 12345678U</div> 
  <div ng-messages-include="form-error-messages">
  </div>
</div>                                     
```
- Let's give a try:

```bash
npm start
```

> Take a look to the implemented code there are some updates nested ng-message not
working, but general yes.

Some excercises and challenges:

- What if I want to automatically transform a lower case letter into uppercase

http://stackoverflow.com/questions/16388562/angularjs-force-uppercase-in-textbox
https://github.com/angular-ui/ui-mask
http://embed.plnkr.co/5Xqeh4/
http://embed.plnkr.co/DgWeerIlDjFpZO6DCzDD/

- Now I want to display the DNI (ready only) but in a given format 9999999-W

https://docs.angularjs.org/guide/filter



