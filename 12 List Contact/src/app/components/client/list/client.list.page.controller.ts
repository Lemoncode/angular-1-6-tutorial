import {Client} from './viewModel';
import { ClientApiService } from '../../../api/clientApi';
import { ClientListMapper } from './mapper';

export class ClientListPageController {
    clientList : Client[];
    clientApiService : ClientApiService;
    clientListMapper : ClientListMapper;

    constructor(ClientApiService : ClientApiService, clientListMapper : ClientListMapper) {
      "ngInject";

      this.clientApiService = ClientApiService;
      this.clientListMapper = clientListMapper;      
    }

    $onInit = () => {
      this.clientApiService.getClientList().then(
        (clients) => {
          this.clientList = this.clientListMapper.ClientListFromModelToVm(clients);          
        }
      )

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

ClientListPageController.$inject = ['ClientApiService', 'clientListMapper'];
  