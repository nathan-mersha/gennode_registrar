/**
 * @author              Nathan Mersha
 * @name                Gennode Registrar
 * @module              index.js
 * @description         Module registers routes on gennode_authorization server.
 * @copyright           June 9, 2019
 */

class GennodeRegistrar{

    /**
     * @name                - Constructor
     * @description         - Constructs class using serviceName and serviceId values.
     * @param serviceName   - Service Name
     * @param serviceId     - Service Id
     * @param gennodeAuthorizationEndPoint - Service authorization endpoint
     */
    constructor(serviceName, serviceId, gennodeAuthorizationEndPoint){
        this.request        = require('request');
        this.listEndpoints  = require('express-list-endpoints');
        this.routes         = [];

        this.serviceName    = serviceName;
        this.serviceId      = serviceId;
        this.gennodeAuthURL = gennodeAuthorizationEndPoint;
    }

    /**
     * @name                - Registers
     * @description         - Registers express application instance routes.
     * @param app           - Express instance.
     * @param callback      - Callback function (error, response, body)
     */
    register(app, callback){
        this.routes = this.refactorRoutes(this.listEndpoints(app));
        this.sendRequest(this.constructBody(),"POST",this.gennodeAuthURL,callback);
    }

    /**
     * @name                - Register directly
     * @description         - Sends routes directly, instead of using the express instance, convenient for other frameworks
     * "routes": [
             {
               "method": "POST",
               "route": "http://root/sample",
               "group": "Company",
               "name": "Create company",
               "description": "Create company data."
             },
             {
               "method": "GET",
               "route": "http://root/sample",
               "group": "Company",
               "name": "Retrieves company",
               "description": "Retrieves company data."
             }
        ]
     * @param routes        - Service routes.
     * @param callback      - Callback function (error, response, body)
     */
    registerDirectly(routes,callback){
        this.routes = routes;
        this.sendRequest(this.constructBody(),"POST",this.gennodeAuthURL,callback);
    }

    /**
     * @name                - Refactor routes
     * @description         - Refactor routes to suit gennode authorization service
     * @param routes        - Routes
     * @returns {Array}     - Refactored route
     */
    refactorRoutes(routes){
        let constructedRoutes = [];

        routes.forEach((endPoint)=> {
            endPoint.methods.forEach((method) => {
                let routeData = {
                    method : method,
                    route : endPoint.path,
                    group : endPoint.path,
                    name : `${endPoint.path} ${method}`,
                    description : `${method} method for route : ${endPoint.path}, for service : ${this.serviceName}`,
                };
                constructedRoutes.push(routeData);
            });
        });
        return constructedRoutes;
    }

    /**
     * @name                - Send request
     * @description         - Sends request
     * @param body          - Body to send
     * @param method        - Http Method
     * @param endPoint      - Endpoint
     * @param callback      - Callback function (error, response, body)
     */
    sendRequest(body, method, endPoint, callback){

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
    constructBody(){
        return {
            "name": this.serviceName,
            "serviceId": this.serviceId,
            "routes": this.routes
        }
    }
}

module.exports = GennodeRegistrar;
