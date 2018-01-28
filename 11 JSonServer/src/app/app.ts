import * as angular from 'angular';
import { routing } from './app.routes'
import {AppComponent} from './app.component';
import { components } from './components'

angular.module('app', [
    'ui.router',
    components.name
  ])
  .config(routing)
  .component('app', AppComponent)
;
