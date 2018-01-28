import * as angular from 'angular';
import { ClientListComponent } from './client.list.component';
import { ClientListSearchComponent } from './search/client.list.search.component';
import { ClientListResultComponent } from './result/client.list.result.component';
import { ClientListCardComponent } from './result/client.list.card.component'
import { ClientListPage } from './client.list.page';
import { ApiModule } from '../../../api';
import { ClientListMapper } from './mapper';

export const ClientListModule = angular.module('clientlist', [
  ApiModule.name
  ])
  .component('clientlist', ClientListComponent)
  .component('clientlistsearchcomponent', ClientListSearchComponent)
  .component('clientlistresultcomponent', ClientListResultComponent)
  .component('clientlistcardcomponent', ClientListCardComponent) 
  .component('clientListComponent', ClientListComponent)   
  .component('clientListPage', ClientListPage)  
  .service('clientListMapper', ClientListMapper)       
;
