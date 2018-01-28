import * as angular from 'angular';
import {LoginComponent} from './login.component';
import { LoginPage } from './login.page';
import { ApiModule } from '../../api/index'

export const LoginModule = angular.module('login', [
    ApiModule.name,
    'ngMessages',
    'toastr'
])
.component('login', LoginComponent)
.component('loginPage', LoginPage)
;