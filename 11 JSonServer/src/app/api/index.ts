import * as angular from 'angular';
import { LoginService } from './login';

export const ApiModule = angular.module('api', [
  ])
  .service('LoginService', LoginService);
