import { Client } from './viewModel';
import { ClientApiService } from '../../../api/clientApi';
import { ClientListMapper } from './mapper';

export class ClientListPageController {
  clientList: Client[];
  clientApiService: ClientApiService;
  clientListMapper : ClientListMapper;

  constructor(clientApiService : ClientApiService, clientListMapper : ClientListMapper) {
    "ngInject";

    this.clientApiService = clientApiService;
    this.clientListMapper = clientListMapper;      
  }

  $onInit = () => {
    this.clientApiService.getClientList().then(
      (clients) => {
        this.clientList = this.clientListMapper.ClientListFromModelToVm(clients);          
      }
    );
  }
}

ClientListPageController.$inject = ['ClientApiService','clientListMapper'];
