export const ClientListCardComponent = {
  bindings: {
    client: '<',
    details: '<',
  },  
  template: require('./client.list.card.component.html') as string,
  controllerAs: 'vm'
};