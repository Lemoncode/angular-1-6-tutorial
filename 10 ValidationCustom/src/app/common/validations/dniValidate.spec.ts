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
