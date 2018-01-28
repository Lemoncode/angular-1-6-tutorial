export const LoginComponent = {
  template: require('./login.html') as string,
  bindings: {
    onDoLogin: '&'
  },
  controllerAs: 'vm',
  controller: class LoginController {
    user: string;
    password: string;

    $onInit = () => {
      this.user = '';
      this.password = '';
    }
  }
};