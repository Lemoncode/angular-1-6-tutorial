# Sample 10 - Custom Validation

In this sample we will add a validation that needs custom login.

We will replace our github validatin with a NIF validation (login
should be a valid DNI)

Summary steps:

- Add a regex format validator (standard)
- Implement the DNI validation algorithm in a service, Following TDD
- Integrate it in a directive, add tests to this directive (mock DNI.
- Include it in the input field (replace github with this one).
- Add the ng-message entry.

Implementation:

- Let's start by implement a DNI service that will perform the validation login, we 
will start by implementing a test and move on implementing the service (on this
documentation we will paste all the tests in one go, but when implementing it 
rather follow an step by step approach).

_./src/app/common/validations/dniService.spec.ts_

```javascript
import * as angular from 'angular'
import {} from 'angular-mocks';
import { DNIService } from './dniService';

describe('dniService', () => {
  describe('validate', () => {
    it('dniService exists', () => {    
      const dniService = new DNIService();
  
      expect(dniService).toBeDefined();
      expect(dniService.isValid).toBeDefined();
    })    
  });

  describe('validate', () => {
    it('wrong format', () => {    
      const dniService = new DNIService();

      const result = dniService.isValid('whatever');

      expect(result).toBeFalsy();      
    })    

    it('right dni wrong format', () => {    
      const dniService = new DNIService();

      const result = dniService.isValid('12345678 Z');

      expect(result).toBeFalsy();      
    })    

    it('right dni right format', () => {    
      const dniService = new DNIService();

      const result = dniService.isValid('12345678Z');

      expect(result).toBeTruthy();      
    })    
    
    it('right dni right format second set', () => {    
      const dniService = new DNIService();

      const result = dniService.isValid('59858702Y');

      expect(result).toBeTruthy();      
    })    

    it('right dni right format, bad value', () => {    
      const dniService = new DNIService();

      const result = dniService.isValid('12345678E');

      expect(result).toBeFalsy();      
    })    


  });
  
});
```


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
    var directive = (DNIService: DNIService) => {
      "ngInject";
      return new dniValidate(DNIService);
    };
    
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

_./src/app/common/validations/dniValidate.spec.ts_

```javascript
import * as angular from 'angular'
import {} from 'angular-mocks';
import { commonModule } from '../index'
import { DNIService } from './dniService'

describe('dniValidate', () => {
  let parentScope;
  let element;
  let form;

  beforeEach(() => {    
      window['module'](commonModule.name);      

      window['module']($provide => {
        //public isValid(dni : string) : boolean {         
        $provide.value('DNIService', {
          isValid: (dni : string)  : boolean => { 
            // just an easy fake case 1 is valid DNI, other not valid
            return (dni === '1'); 
          }        
        }); 
      });  
    
  });

  beforeEach(inject(($compile, $rootScope) => {
    // https://velesin.io/2016/08/23/unit-testing-angular-1-5-components/
    // 1:
    parentScope = $rootScope.$new();      
    // 2:
    element = angular.element(`
                        <form name="testForm">                                                
                            <input 
                                  name="dniField"                                      
                                  dni-validate=""
                                  ng-model="dni"                                  
                                  />                                                                  
                        </form>
    `);

    $compile(element)(parentScope);
    parentScope.$digest();
    form = parentScope.testForm;
  }));
  
  it('should be valid form if dni is valid (mocked dni service)', () => {
      form.dniField.$setViewValue('1');
      parentScope.$digest();
      
      expect(form.dniField.$error.validDNI).toBeUndefined();
  });

  it('should be invalid form if dni is not valid (mocked dni service)', () => {
      form.dniField.$setViewValue('0');
      parentScope.$digest();
      
      expect(form.dniField.$error.validDNI).toBeDefined();
  });
});
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
+     ng-pattern="^\d{9}\W$"
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

Some excercises and challenges:

- What if I want to automatically transform a lower case letter into uppercase

http://stackoverflow.com/questions/16388562/angularjs-force-uppercase-in-textbox
https://github.com/angular-ui/ui-mask
http://embed.plnkr.co/5Xqeh4/
http://embed.plnkr.co/DgWeerIlDjFpZO6DCzDD/

- Now I want to display the DNI (ready only) but in a given format 9999999-W

https://docs.angularjs.org/guide/filter



