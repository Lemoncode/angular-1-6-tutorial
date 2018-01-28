import { LoginService } from '../../api/login'
import {IToastrService} from 'angular-toastr'
import { StateService } from '@uirouter/angularjs'

export class LoginPageController {
  loginService: LoginService = null;
  toastr : IToastrService;
  $state: StateService;

  constructor(LoginService: LoginService, toastr : IToastrService, $state: StateService) {
    "ngInject";

    this.loginService = LoginService;
    this.toastr = toastr;
    this.$state = $state;
  }

  doLogin(login: string, password: string) {
    this.loginService.validateLogin(login, password).then(
       (succeeded) => {
         if(succeeded) {
            console.log('login succeeded');
            this.$state.go('clients');            
         } else {
            this.toastr.error('Incorrect login or password, please try again')
         }
       }
    );
  }
}

LoginPageController.$inject = ['LoginService', 'toastr', '$state'];


