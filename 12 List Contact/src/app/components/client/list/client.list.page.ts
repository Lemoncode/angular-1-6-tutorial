import { ClientListPageController as controller } from './client.list.page.controller'

export const ClientListPage = {
  template: '<clientlistcomponent client-list="vm.clientList"/>',
  controller,
  controllerAs: 'vm'
};
