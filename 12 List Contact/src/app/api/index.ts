import * as angular from 'angular';
import { LoginService } from './login';
import { ClientApiService } from './clientApi';

export const ApiModule = angular.module('api', [
  ])
  .service('LoginService', LoginService)
  .service('ClientApiService', ClientApiService)
;
