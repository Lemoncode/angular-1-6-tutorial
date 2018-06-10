import { LoginService } from '../../api/login';
import {IToastrService} from 'angular-toastr';

export class LoginPageController {
  loginService: LoginService = null;
  toastr : IToastrService;

  constructor(LoginService: LoginService, toastr : IToastrService) {
    this.loginService = LoginService;
    this.toastr = toastr;
  }

  doLogin(login: string, password: string) {
    this.loginService.validateLogin(login, password).then(
      (succeeded) => {
        if (succeeded) {
          console.log('login succeeded');
        } else {
          this.toastr.error('Incorrect login or password, please try again');
        }
      }
    );
  }
}

LoginPageController.$inject = ['LoginService', 'toastr'];
