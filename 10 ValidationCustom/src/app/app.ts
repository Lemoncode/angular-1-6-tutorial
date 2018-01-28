import * as angular from 'angular';
import { routing } from './app.routes'
import {AppComponent} from './app.component';
import { components } from './components'
import { commonModule } from './common';

angular.module('app', [
    'ui.router',
    components.name,
    commonModule.name
  ])
  .config(routing)
  .component('app', AppComponent)
;
