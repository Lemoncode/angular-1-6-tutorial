import * as angular from 'angular'
import { } from 'angular-mocks';
import { LoginModule } from './index'

describe('LoginPage', () => {

  let $componentController;
  let loginService;

  beforeEach(() => {
    // load the login Module
    window['module'](LoginModule.name);

    window['module']($provide => {
      $provide.value('LoginService', {
        validateLogin: (user: string, pwd: string) => {
          return {
            then: (fresult) => fresult(true)
          }
        }
      });
    })
  });

  beforeEach(inject((_$componentController_, _LoginService_) => {
    this.$componentController = _$componentController_;
    this.loginService = _LoginService_;
  }));

  it('is registered', () => {
    // Extract the component controller from the login page
    const controller = this.$componentController('loginPage');

    expect(controller).toBeDefined();
  })

  it('has defined doLogin method', () => {
    const controller = this.$componentController('loginPage');

    expect(controller.doLogin).toBeDefined();
  })

  it('execute doLogin method', () => {
    const controller = this.$componentController('loginPage');
    spyOn(this.loginService, 'validateLogin').and.callThrough();

    controller.doLogin('admin', 'test');

    expect(this.loginService.validateLogin).toHaveBeenCalled();
  })
});
