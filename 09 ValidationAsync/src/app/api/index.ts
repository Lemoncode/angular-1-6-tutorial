import * as angular from 'angular';
import { LoginService } from './login';
import { GitHubService } from './github'

export const ApiModule = angular.module('api', [
  ])
  .service('LoginService', LoginService)
  .service('GitHubService', GitHubService);
