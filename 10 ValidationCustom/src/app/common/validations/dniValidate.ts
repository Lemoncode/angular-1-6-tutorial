import { DNIService } from './dniService';


export class dniValidate implements angular.IDirective {
  public link: (scope: angular.IScope, elem: ng.IAugmentedJQuery, attrs: angular.IAttributes, ngModel: angular.INgModelController) => void;
  restrict = 'A';
  require = 'ngModel';


  constructor(DNIService: DNIService)
  {
    dniValidate.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: angular.INgModelController) =>
    {
      ngModel.$parsers.unshift((viewValue) => {
        ngModel.$setValidity('validDNI', DNIService.isValid(viewValue));

        return viewValue;
      });
    }
  }


  public static Factory() {
    var directive = ['DNIService', (DNIService: DNIService) => {
      "ngInject";
      return new dniValidate(DNIService);
    }];
    
    return directive;
  }
}
