import { LoginPageController as controller } from './login.page.controller'

export const LoginPage = {
  template: '<login on-do-login="vm.doLogin(user, pass)"/>',
  controller,
  controllerAs: 'vm'
};
