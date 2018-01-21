import * as angular from 'angular';
import { LoginModule } from './login';
import { ClientListModule } from './client/list'

export const components = angular.module('components', [
  LoginModule.name,
  ClientListModule.name,
]);