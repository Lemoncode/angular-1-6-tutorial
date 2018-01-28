import { Client } from "../viewModel";

export const ClientListResultComponent = {
  bindings: {
    clientList: '<'
  },
  controllerAs: 'vm',
  template: require('./client.list.result.component.html') as string,
  controller: class ClientListResultController {
    clientList: Client[];
  }
};
