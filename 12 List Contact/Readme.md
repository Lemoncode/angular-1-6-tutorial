# Sample 12 - List Contact

In this sample we are going to read from the JSON REST API that we have previously created and load
the client list component with that data.

We will perform this in a progressive development approach.

Summary steps:

- Create a viewmodel.
- Create a client page controller.
- Add fake data.
- Update client list component to accept a list of clients.
- Update client list component html template to iterate through the list of clientes and display it.
- Create a rest-model entity to hold the client model entity.
- Create a service API entry to read from the rest api.
- Create a mapper service to convert from model to viewmodel.
- Make the call in the page init and replace harcoded data.

Implementation:

- Under the client folder let's create a viewModel.ts file

_./src/app/api/components/client/list/viewModel.ts_

```javascript
export interface Client {
  id : string,
  name : string,
  status : string,
}
```

- Let's do like we did with the login functinallity create a page + controller.

_./src/app/api/components/client/list/client.list.page.controller.ts_

```javascript
export class ClientListPageController {

  constructor() {
    "ngInject";
  }
}
```

_./src/app/api/components/client/list/client.list.page.ts_

```javascript
import { ClientListPageController as controller } from './client.list.page.controller'

export const ClientListPage = {
  template: '<client-list-component/>',
  controller,
  controllerAs: 'vm'
};
```

- Let's register the page in the index module definition.

_./src/app/components/client/index.js_

```diff
import * as angular from 'angular';
import { ClientListComponent } from './client.list.component';
import { ClientListSearchComponent } from './search/client.list.search.component';
import { ClientListResultComponent } from './result/client.list.result.component';
import { ClientListCardComponent } from './result/client.list.card.component'
+ import { ClientListPage } from './client.list.page';

export const ClientListModule = angular.module('clientlist', [
  ])
  .component('clientlist', ClientListComponent)
  .component('clientlistsearchcomponent', ClientListSearchComponent)
  .component('clientlistresultcomponent', ClientListResultComponent)
  .component('clientlistcardcomponent', ClientListCardComponent) 
+  .component('clientListPage', ClientListPage)         
;
```

- Let's replace in the routes file the previous client list component with the page.

_./src/app/app.routes.ts_

```diff
  $stateProvider.state('clients', <Ng1StateDeclaration>{
    url: '/clients',
    views: {
-      'content@': { template: '<clientlist></clientlist>' }
+      'content@': { template: '<client-list-page></client-list-page>' }
    }
  }
  );
```

- Let's give a try and ensure that the app is still working ;-)

```cmd
npm start
```

- Now let's go back to the client list page controller and add some harcoded data.

```diff
+ import {Client} from './viewModel';

export class ClientListPageController {
+    clientList : Client[];

    constructor() {
      "ngInject";
    }

+    $onInit = () => {
+      this.clientList = [
+        {
+          id : '1',
+          name : 'fake client A',
+          status : 'fake status client A',
+        },
+        {
+          id : '1',
+          name : 'fake client A',
+          status : 'fake status client A',
+        },        
+      ]
+    }    
}
```

- Now we need to pass down this list to the clientListComponent, let's start by defining this parameter in the 
clientListComponent

_./src/app/components/client/list/client.list.component.ts_

```diff
export const ClientListComponent = {
+  bindings: {
+    clientList: '<'
+  },  
  template: require('./clientlist.html') as string
};
```

- Next step is to really pass it in the client list page template

_./src/app/components/client/list/client.list.page.ts_

```diff
import { ClientListPageController as controller } from './client.list.page.controller'

export const ClientListPage = {
-  template: '<client-list-component/>',
+  template: '<client-list-component client-list="vm.clientList"/>',
  controller,
  controllerAs: 'vm'
};
```

- We can now run and setup some break point to ensure this is working

- Next step let's update the HTML of the clientList component and use the real list:

_./src/app/components/client/list/client.list.component.ts_

```diff
+ import { Client } from "./viewModel";

export const ClientListComponent = {
+  bindings: {
+    clientList: '<'
+  },  
+  controllerAs: 'vm',
  template: require('./clientlist.html') as string,
+  controller: class ClientListController {
+    clientList: Client[];
+  }
};
```

- Let's pass this parameter in the clientlist.html

_./src/app/components/client/list/clientList.html_

```diff
<div>
  <clientlistsearchcomponent></clientlistsearchcomponent>  
-  <clientlistresultcomponent></clientlistresultcomponent>
+  <clientlistresultcomponent client-list="vm.clientList"></clientlistresultcomponent>
</div>
```

- Is time to propagate down the clientList parameter to the client list result

_./src/app/components/client/list/result/client.list.result.component.ts_

```diff
+ import { Client } from "../viewModel";

export const ClientListResultComponent = {
+  bindings: {
+    clientList: '<'
+  },    
+  controllerAs: 'vm',
  template: require('./client.list.result.component.html') as string,
+  controller: class ClientListResultController {
+    clientList: Client[];
+    
+  }  
};
```

- And in the HTML template let's iterate over that list and display the data from the list.

_./src/app/components/client/list/result/client.list.result.component.html_

```diff
<div style="display:flex;flex-direction:column">
+ <clientlistcardcomponent ng-repeat="client in vm.clientList" client="client.name" details="client.status"></clientlistcardcomponent> 
-  <clientlistcardcomponent client="'My sport dealer'" details="'Lorem ipsum dolor sit amet, consectetur..'"></clientlistcardcomponent>
-  <clientlistcardcomponent client="'We Run'" details="'Lorem ipsum dolor sit amet, consectetur..'"/></clientlistcardcomponent>
</div>
```

> Excercise let's play with Search functionallity

