import * as angular from 'angular';
import { LoginModule } from './login';


export const components = angular.module('components', [
  LoginModule.name
]);