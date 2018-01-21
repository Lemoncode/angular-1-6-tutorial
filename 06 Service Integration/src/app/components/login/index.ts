import * as angular from 'angular';
import {LoginComponent} from './login.component';
import { LoginPage } from './login.page';

export const LoginModule = angular.module('login', [])
.component('login', LoginComponent)
.component('loginPage', LoginPage)
;