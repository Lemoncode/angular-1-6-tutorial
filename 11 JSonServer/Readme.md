# Sample 11 - JSON Server

Building Front is nice, but we need to interact with a REST API to get grap of real user experience.

In this sample we are going to setup a simple JSON REST API for sample data.

Summary steps:

- Install the json-server package.
- Define routes.
- Define sample data.
- Run the server.

Implementation:

- Let's install json-server

```cmd
npm install json-server --save-dev
```

- Let's configure the server routes

_./fake-json-server/routes.json_

```json
{
  "/api/*": "/$1"
}
```

- Let's configure test data:

_./fake-json-server/db.json_

```json
{
  "clients": [
    {
      "name": "Soccer stars",
      
      "status": "Pending presenting new materials."
    },
    {
      "name": "We Run",      
      "status": "New running shoes avalable, interested in eva models."
    },    
    {
      "name": "Multi sports",      
      "status": "Not accepting new orders til summer."
    }
  ]
}
```

- In the _package.json_ file let's add a new command to launch this json server.

```diff
{
  "name": "angular-1-6-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server --inline",
+    "api:fake": "json-server  --routes ./fake-json-server/routes.json --watch ./fake-json-server/db.json",
    "build": "webpack",
    "test": "karma start --no-single-Run",
    "test:single": "karma start --single-Run"
  },
```

- Let's run the api fake and check for some routes in a browser

```cmd
npm run api:fake
```

- Let's open the browser and type the following url:

```
http://localhost:3000/api/clients
```