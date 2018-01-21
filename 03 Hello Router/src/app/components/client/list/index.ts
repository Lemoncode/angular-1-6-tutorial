import * as angular from 'angular';
import { ClientListComponent } from './client.list.component';

export const ClientListModule = angular.module('clientlist', [
  ])
  .component('clientlist', ClientListComponent)
;
