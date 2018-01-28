export class GitHubService {    
  constructor(private $q : angular.IQService, private $http : angular.IHttpService) {
    "ngInject";
  }


  public acccountExists(login : string) : angular.IPromise<boolean> {         

    const deferred = this.$q.defer<boolean>();    
    const url = `https://api.github.com/users/${login}`;

    // TODO: on the error side we should check the error code, e.g.
    // if github is down we should return false
    this.$http.get(url)
      .then(
            (response) => deferred.resolve(true),
            (error) => deferred.resolve(false)
            );

    return deferred.promise;
  }
}

GitHubService.$inject = ['$q', '$http'];
