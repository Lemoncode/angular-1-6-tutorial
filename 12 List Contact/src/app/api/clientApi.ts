import { Client } from "./model/client";


export class ClientApiService {
  $http: angular.IHttpService = null;

  constructor($http: angular.IHttpService, private $q : angular.IQService) {  
    "ngInject";

    this.$http = $http;
  }

  public getClientList(): angular.IPromise<Client[]> {
    const deferred = this.$q.defer<Client[]>();

    // TODO This could be configured, baseURL and environment variable in webpack
    this.$http.get('http://localhost:3000/clients').then(
      (result) => {
        const clients =  result.data as Client[];
        deferred.resolve(clients);
      }
    );
    return deferred.promise;
  }
}

ClientApiService.$inject = ['$http','$q'];
