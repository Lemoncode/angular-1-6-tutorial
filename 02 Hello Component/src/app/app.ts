import * as angular from 'angular';
import {AppComponent} from './app.component';
import { components } from './components'

angular.module('app', [
    components.name
  ])
  .component('app', AppComponent)
;
