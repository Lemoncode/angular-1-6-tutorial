# Filter elements list by search term

## Steps.

### Step 1. We want to search the search input an notify the parent component to perform a new search, we can proceed as follows, creating some bindings that search the data between components.

__client.list.search.component.html__

```diff
<div class="input-group">
-   <input type="text" class="form-control" placeholder="Search" />
+   <input type="text" class="form-control" placeholder="Search" ng-model="vm.term" />
 
    <span class="input-group-btn">
-       <button class="btn btn-primary" type="button">
+       <button class="btn btn-primary" type="button" ng-click="vm.dosearch()">
            <i class="glyphicon glyphicon-search"></i>
        </button>
    </span>
</div>
```

__client.list.search.component.ts__

```diff
export const ClientListSearchComponent = {
+   bindings: {
+       term: '=',
+       dosearch: '&',
+   },
    template: require('./client.list.search.component.html') as string,
    controllerAs: 'vm',
};
```

* We are declaring a two way binding and an output binding.

### Step 2. The father of this component is `client.list.component` so here we have todefine the bindings as well.

__client.list.component.ts__

```diff
import { Client } from "./viewModel";

export const ClientListComponent = {
  bindings: {
    clientList: '<',
+   dosearch: '&',
+   term: '='
  },
  controllerAs: 'vm',
  template: require('./clientlist.html') as string,
  controller: class ClientListController {
    clientList: Client[];
  }
};
```

### Step 3. On `client.list.page` we have to define the template with the new bindings

__client.list.page.ts__

```diff
import { ClientListPageController as controller } from './client.list.page.controller';

export const ClientListPage = {
-   template: '<clientlistcomponent client-list="vm.clientList"/>',
+   template: '<clientlistcomponent term="vm.term" client-list="vm.clientList" dosearch="vm.dosearch()"/>',
    controller,
    controllerAs: 'vm'
};
```

### Step 4. We have to update `client.list.component` (clientlist.html) template with new bindings

__clientlist.html__

```diff
<div> 
- <clientlistsearchcomponent></clientlistsearchcomponent>
+ <clientlistsearchcomponent term="vm.term" dosearch="vm.dosearch()"></clientlistsearchcomponent>
  <clientlistresultcomponent client-list="vm.clientList"></clientlistresultcomponent>
</div>
```

### Step 5. Now in `client.list.page.controller.ts` lets add dummy logic to check that everything is wire up as we expected.

__client.list.page.controller.ts__

```diff
import { Client } from './viewModel';
import { ClientApiService } from '../../../api/clientApi';
import { ClientListMapper } from './mapper';

export class ClientListPageController {
  clientList: Client[];
  clientApiService: ClientApiService;
  clientListMapper : ClientListMapper;
+
+ term : string;
+
+ dosearch = () => {
+   console.log('*****');
+   console.log(this.term);
+ }
+
  constructor(clientApiService : ClientApiService, clientListMapper : ClientListMapper) {
    this.clientApiService = clientApiService;
    this.clientListMapper = clientListMapper;      
  }

  $onInit = () => {
    this.term = 'test';

    this.clientApiService.getClientList().then(
      (clients) => {
        this.clientList = this.clientListMapper.ClientListFromModelToVm(clients);          
      }
    );
  }
}

ClientListPageController.$inject = ['ClientApiService','clientListMapper'];

```

* Check out console to test if everything goes right.