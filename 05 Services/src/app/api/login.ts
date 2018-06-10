export class LoginService {
  $q : angular.IQService = null;

  // Missing ngInject or inject
  constructor($q : angular.IQService) {
    this.$q = $q;
  }

  public validateLogin(user : string, pwd: string) : angular.IPromise<boolean> {         

    const deferred = this.$q.defer<boolean>();
    const validationResult = (user === 'admin' && pwd === 'test');
    deferred.resolve(validationResult);

    return deferred.promise;
  }
}
