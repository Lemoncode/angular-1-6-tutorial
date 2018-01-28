import * as angular from 'angular'
import {} from 'angular-mocks';
import {LoginModule} from './index'
import { StateService } from '@uirouter/angularjs'

describe('LoginPage', () => {

  let $componentController;
  let loginService;
  let toastr;
  let $q  : angular.IQService;
  let $state: StateService;

  describe('Login Success case', () => {

    beforeEach(() => {    
      window['module'](LoginModule.name);

      window['module']($provide => {
        $provide.value('LoginService', {
          validateLogin: (user : string, pwd: string) => {                          
              return {
                then: (fresult) => {                
                  fresult(true);
                }
              }              
          }        
        });        
      });

      window['module']($provide => {
        $provide.value('$state', {
          go: (state : string) => {
            return 
          }                  
        });        
      });
      
    });

    beforeEach(inject((_$componentController_, _LoginService_, _toastr_, _$state_: StateService) => {
      this.$componentController = _$componentController_;
      this.loginService = _LoginService_; 
      this.toastr = _toastr_;    
      this.$state = _$state_;
    }));

    it('is registered', () => {    
      const controller = this.$componentController('loginPage');    

      expect(controller).toBeDefined();
    })

    it('has defined doLogin method', () => {        
      const component = this.$componentController('loginPage');    

      expect(component.doLogin).toBeDefined();
    })  

    it('doLogin method calls LoginService.validateLogin', () => {        
      const component = this.$componentController('loginPage');    
      spyOn(this.loginService, 'validateLogin').and.callThrough();

      component.doLogin('something', 'whatever');

      expect(this.loginService.validateLogin).toHaveBeenCalled();
    }) 

    it('doLogin (success) method do not call toastr.error', () => {        
      const component = this.$componentController('loginPage');    
      spyOn(this.toastr, 'error').and.callThrough();
      spyOn(this.$state, 'go').and.callThrough();

      component.doLogin('something', 'whatever');
      

      expect(this.toastr.error).toHaveBeenCalledTimes(0);
      expect(this.$state.go).toHaveBeenCalled();
    })  
     
  });

  describe('Login failed case', () => {

    beforeEach(() => {    
      window['module'](LoginModule.name);      

      window['module']($provide => {
        $provide.value('LoginService', {
          validateLogin: (user : string, pwd: string) => {                          
              return {
                then: (fresult) => {                
                  fresult(false);
                }
              }              
          }        
        });   

        $provide.value('toastr', {
          error: (message : string) => {
            console.log("*** toastr error mock false***")
            return;
          }        
        });                     

        window['module']($provide => {
          $provide.value('$state', {
            go: (state : string) => {
              return 
            }                  
          });        
        });
        
      });                  
    });

    beforeEach(inject((_$componentController_, _LoginService_, _toastr_) => {
      this.$componentController = _$componentController_;
      this.loginService = _LoginService_;
      this.toastr = _toastr_;      
      this.$q = $q;
    }));

    it('doLogin method calls toastr.error', () => {        
      const component = this.$componentController('loginPage');    
      spyOn(this.toastr, 'error').and.callThrough();

      component.doLogin('something', 'whatever');

      expect(this.toastr.error).toHaveBeenCalled();
    })  
        
  });

});
