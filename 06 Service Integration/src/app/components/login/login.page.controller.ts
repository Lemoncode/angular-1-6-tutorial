import { LoginService } from '../../api/login'

export class LoginPageController {
  loginService: LoginService = null;

  constructor(LoginService: LoginService) {
    "ngInject";

    this.loginService = LoginService;
  }

  doLogin(login: string, password: string) {
    this.loginService.validateLogin(login, password).then(
       (succeeded) => {
         if(succeeded) {
            console.log('login succeeded');
         } else {
           console.log('login failed');
         }
       }
    );
  }
}
