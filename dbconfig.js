require('dotenv').config()

// TODO: Agregar conección vía stringconnect

const config = {
    user : process.env.DBUSER,
    password : process.env.DBPASSWORD, 
    server : process.env.DBSERVER, 
    database : process.env.DATABASE, 
    options:{
        trustedconnection: true,
        enableArithAbort : true, 
        instancename : process.env.INSTANCENAME, 
    },
    port : Number(process.env.DBPORT)
}


module.exports = config; 