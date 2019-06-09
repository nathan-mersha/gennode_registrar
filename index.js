/**
 * @author              Nathan Mersha
 * @name                Gennode Registrar
 * @module              index.js
 * @description         Module registers routes on gennode_authorization server.
 * @copyright           June 9
 */

class GennodeRegistrar{

    request         = require('request');
    listEndpoints   = require('express-list-endpoints');
    routes          = [];

    /**
     * @name                - Constructor
     * @description         - Constructs class using serviceName and serviceId values.
     * @param serviceName   - Service Name
     * @param serviceId     - Service Id
     * @param gennodeAuthorizationEndPoint - Service authorization endpoint
     */
    constructor(serviceName, serviceId, gennodeAuthorizationEndPoint){
        this.serviceName            = serviceName;
        this.serviceId              = serviceId;
        this.gennodeAuthEndPoint    = gennodeAuthorizationEndPoint;
    }

    /**
     * @name                - Registers
     * @description         - Registers express application instance routes.
     * @param app           - Express instance.
     * @param callback      - Callback function (error, response, body)
     */
    register(app, callback){
        this.routes = this.listEndpoints(app);
        this.sendRequest(this.constructBody(),"POST",this.gennodeAuthEndPoint,callback);
    }

    /**
     * @name                - Register directly
     * @description         - Sends routes directly, instead of using the express instance, convenient for other frameworks
     * @param routes        - Service routes.
     * @param callback      - Callback function (error, response, body)
     */
    registerDirectly(routes,callback){
        this.routes = routes;
        this.sendRequest(this.constructBody(),"POST",this.gennodeAuthEndPoint,callback);
    }

    /**
     * @name                - Send request
     * @description         - Sends request
     * @param body          - Body to send
     * @param method        - Http Method
     * @param endPoint      - Endpoint
     * @param callback      - Callback function (error, response, body)
     */
    private sendRequest(body, method, endPoint, callback){

        let options = option(method,body); // defines sending options
        this.request(endPoint,options,function (err,res,body) {
            callback(err,res,body)
        });

        /**
         * @name                - Option
         * @description         - Constructs option object
         * @param method        - Http Method
         * @param body          - Request body
         * @returns {{method: *, json: boolean, body: *}}
         */
        function option           (method,body)    {
            return {
                method : method, // defines the method PUT,GET,DELETE,REMOVE
                json : (body !== null), // defines true only when body data is available to attach
                body : body
            }
        }
    }

    /**
     * @name                    - Construct body
     * @description             - Constructs body data
     * @returns {{name: *, serviceId: *, routes: Array}}
     */
    private constructBody(){
        return {
            "name": this.serviceName,
            "serviceId": this.serviceId,
            "routes": this.routes
        }
    }
}

module.exports = GennodeRegistrar;
