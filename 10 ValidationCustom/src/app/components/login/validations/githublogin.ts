import { GitHubService } from '../../../api/github';


export class validGithubLogin implements angular.IDirective {
  public link: (scope: angular.IScope, elem: ng.IAugmentedJQuery, attrs: angular.IAttributes, ngModel: angular.INgModelController) => void;
  restrict = 'A';
  require = 'ngModel';


  constructor($q: angular.IQService, GitHubService: GitHubService)
  {
    validGithubLogin.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: angular.INgModelController) =>
    {
       
       ngModel.$asyncValidators["validGithubLogin"] = (modelValue, viewValue) => {
          if(ngModel.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.resolve();
          }

          return GitHubService.acccountExists(modelValue)
                    .then((result) => {
                      if(result) {
                          return true;
                      } else {
                          return $q.reject('Not valid Github User')
                      }
                    });
       }
    }
  }


  public static Factory() {
    var directive = ['$q', 'GitHubService', ($q: angular.IQService, GitHubService: GitHubService) => {
      "ngInject";
      return new validGithubLogin($q, GitHubService);
    }];
    
    return directive;
  }
}
