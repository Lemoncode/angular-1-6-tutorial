import {Client} from './viewModel';

export class ClientListPageController {
    clientList : Client[];

    constructor() {
      "ngInject";
    }

    $onInit = () => {
      this.clientList = [
        {
          id : '1',
          name : 'fake client A',
          status : 'fake status client A',
        },
        {
          id : '1',
          name : 'fake client A',
          status : 'fake status client A',
        },        
      ]
    }    
}
  