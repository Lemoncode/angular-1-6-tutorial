/// <reference types="angular-ui-router" />
import * as angular from 'angular';
import "angular-ui-router";

export const routing = ($locationProvider: angular.ILocationProvider,
  $stateProvider: angular.ui.IStateProvider,
  $urlRouterProvider: angular.ui.IUrlRouterProvider

) => {
  "ngInject";

  // html5 removes the need for # in URL
  $locationProvider.html5Mode({
    enabled: false
  });

  $stateProvider.state('home', <ng.ui.IState>{
    url: '/home',
    views: {
      'content@': { template: '<login></login>' }
    }
  }
  );

  $urlRouterProvider.otherwise('/home');

}