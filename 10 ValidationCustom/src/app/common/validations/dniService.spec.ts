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
