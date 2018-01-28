import { ClientListPageController as controller } from './client.list.page.controller'

export const ClientListPage = {
  template: '<client-list-component client-list="vm.clientList"/>',
  controller,
  controllerAs: 'vm'
};
