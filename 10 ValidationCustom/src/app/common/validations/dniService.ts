export class DNIService {  
  constructor() {
    "ngInject";    
  }

  // dni format: 99999999X  
  public isValid(dni : string) : boolean {         
    
    // If the input has not the valid format we just skip
    // and return true
    let result = this.isValidFormat(dni);

    if(result) {
      const dniNumbersPart =  this.extractNumber(dni);
      const dniLetterPart  = this.extractLetter(dni);
      const expectedLetter = this.calculateExpectedLetter(dniNumbersPart);
      result = (dniLetterPart === expectedLetter);    
    }

    return result;
  }


  private isValidFormat(dni : string) {
    const dniFormat = /^\d{5,8}[A-Z]$/;    
    
    return(dniFormat.test(dni))     
  }

  private extractNumber(dni : string) : number
  {
    return Number(dni.substr(0,dni.length-1));
  }

  private extractLetter(dni : string) : string
  {
    return dni.substr(dni.length-1,1).toUpperCase();
  }

  private calculateExpectedLetter(DniNumbersPart : number) : string
  {
    var lookup = 'TRWAGMYFPDXBNJZSQVHLCKE';        
    return (lookup.charAt(DniNumbersPart % 23));
  }
  
}
