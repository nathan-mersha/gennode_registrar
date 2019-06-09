# GenNode Registrar

#### Author
Nathan Mersha

### Installation

Gennode registrar is available on npm, type:

`$ sudo npm i -g gennode_registrar`

and install it globally, now you can use it from the command line.

### Description
This module registers service routes on [gennode_authorization](https://www.npmjs.com/package/gennode_authorization) service.

### Example

> **Create New Instance**
>
> `let gennodeRegistrar = require('gennode_registrar'),`
>
> `registrar = new gennodeRegistrar(serviceName,serviceCode,authorizationURL);`
>
> **Register Service Endpoints**
>
> `registrar.register(app,(error,response,body)=>{});`

### Contributing
**Want to contribute, then visit repo [here](https://github.com/nathan-mersha/gennode_registrar.git)**
