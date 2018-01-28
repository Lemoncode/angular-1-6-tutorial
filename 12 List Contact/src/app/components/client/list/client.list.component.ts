import { Client } from "./viewModel";

export const ClientListComponent = {
  bindings: {
    clientList: '<'
  },  
  controllerAs: 'vm',
  template: require('./clientlist.html') as string,
  controller: class ClientListController {
    clientList: Client[];    
  }
};
