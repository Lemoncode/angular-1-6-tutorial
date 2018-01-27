
export class LoginService {
  $q: angular.IQService = null;

  constructor($q: angular.IQService) {  
    "ngInject";

    this.$q = $q;
  }

  public validateLogin(user: string, pwd: string): angular.IPromise<boolean> {

    const deferred = this.$q.defer<boolean>();
    const validationResult = (user === 'admin' && pwd === 'test');
    deferred.resolve(validationResult);

    return deferred.promise;
  }
}

LoginService.$inject = ['$q'];
