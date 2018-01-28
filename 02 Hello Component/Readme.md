# Sample 02 - Hello Component

let's start creating components, we will start using a simple structure, later on if the project grows we can refactor it (in the beginning YAGNI, if 
needed we can create a common components section, or a pages subsection...).

- We will start by creating a _components_ folder under the _src/app_ path.

- We will create a dumb login component.

_./src/app/components/login/login.html_
```html
<div>
    <h1>Hello From Login Component !</h1>
</div>
```

_./src/app/components/login/login.component.ts_
```javascript

export const LoginComponent = {
  template: require('./login.html') as string
};
```


- And we will wrap it in a module:


_./src/app/components/login/index.ts_
```javascript
import * as angular from 'angular';
import { LoginComponent } from './login.component';

export const LoginModule = angular.module('login', [
  ])
  .component('login', LoginComponent)
;
```



- All this components will be wrapped in a components module.

_./src/app/components/index.ts_
```javascript
import * as angular from 'angular';
import { LoginModule  } from './login';

export const components = angular.module('components', [
     LoginModule.name
  ])  
;
```

- Let's register this components in our app module

_./src/app/app.ts_
```diff
import * as angular from 'angular';
import {AppComponent} from './app.component';
+ import { components } from './components'

angular.module('app', [
+     components.name
  ])
  .component('app', AppComponent)
;
```

- Let's update the _app.html_ template and instantiate our login component

_./src/app/app.html_
```diff
<div>
    <h1>Hello From Angular app!</h1>
+    <login></login>
</div>
```

- Let's run the sample

```cmd
npm start
```