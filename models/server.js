const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');


const Db  = require('../dboperations');
const Order = require('../order');
const dboperations = require('../dboperations');

// Class connection Server BackEnd
class Server {
    constructor() {
        
        this.app = express();
        this.router = express.Router();
        this.port = process.env.PORTSERVER;

        // Routes Jompy
        this.routeJompy_query = "/query"
        this.routeJompy_loadquery = "/loadquery"

        //Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }
    middlewares() {

        // Deprecado: Express viene con BodyParser!!
            // this.app.use(bodyParser.urlencoded({ extended: true }));  
            // this.app.use(bodyParser.json());

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use('/api', this.router);
    }

    routes() {
        // Ruta vía Routers
        this.router.use(this.routeJompy_query, require('../routes/query.js'))
        this.router.use(this.routeJompy_loadquery, require('../routes/query.js'))
        // TODO: Ruta carga archivo para FrontEnd??? 
        
        // **** Codigo Ejemplo Begin
        this.router.route('/orders').get((request,response)=>{
            dboperations.getOrders().then(result => {
               response.json(result[0]);
            })
        })
        this.router.route('/orders/:id').get((request,response)=>{
            dboperations.getOrder(request.params.id).then(result => {
               response.json(result[0]);
            })
        })
        this.router.route('/orders').post((request,response)=>{
            let order = {...request.body}
            dboperations.addOrder(order).then(result => {
               response.status(201).json(result);
            })
        })
        // **** Codigo Ejemplo End
    }

    listen() {
        const port = this.PORT || 8090;
        this.app.listen(port);
        console.log('Jompy BackEnd is runnning at ' + port);
    }


}


module.exports = Server;