import { LoginService } from "./login"
import * as angular from 'angular'
import 'angular-mocks';

describe('login', () => {
  describe('performLogin', () => {
    let $q;
    let $rootScope;

    beforeEach(() => {                  
      angular['mock'].inject((_$q_, _$rootScope_) => {
          this.$q = _$q_;
          this.$rootScope = _$rootScope_;
      });    
    });

    it('Login Service exists', () => {    
      const loginService = new LoginService(this.$q);
  
      expect(loginService).toBeDefined();
      expect(loginService.validateLogin).toBeDefined();
    })

    it('valid login', () => {      
      const loginService = new LoginService(this.$q);
      const promise = loginService.validateLogin('admin', 'test');      
             
      promise.then((loginSucceeded) => {        
        expect(loginSucceeded).toBeTruthy();    
      })
      // Force deferred promise to be resolved
      this.$rootScope.$digest();      
    });
    
    it('invalid login', () => {      
      const loginService = new LoginService(this.$q);
      const promise = loginService.validateLogin('admin', 'wrongpassword');      
             
      promise.then((loginSucceeded) => {        
        expect(loginSucceeded).toBeFalsy();    
      })
      // Force deferred promise to be resolved
      this.$rootScope.$digest();      
    });    
  });  
});