import * as angular from 'angular';
import { DNIService } from './validations/dniService';
import { dniValidate } from './validations/dniValidate';

export const commonModule = angular.module('common', [
  ])
  .service('DNIService', DNIService) 
  .directive('dniValidate', dniValidate.Factory()) 
;
