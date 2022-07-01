const fs = require('fs')
const config = require('../dbconfig');
const sql = require('mssql');
const { request, response } = require('express')
const QueryFile = require('../models/queryfile')

function readQuery (request, response) {
    // TODO: Controlar concurrencia en esta función por medio de variable booleana
    // https://stackoverflow.com/questions/45859100/nodejs-running-multiple-queries-using-mssql

    const {namefilequery, queryparams} = request.body;
    let rowCount = 0;
    const BATCH_SIZE = 50;

    const query = new QueryFile(namefilequery);
    //TODO: Mover fs.access a clase QueryFile
    fs.access(query.nameFileQuery, fs.F_OK, (err) => {
        if (err) {
            response.status(400).json({
                error: 'file not found ' + namefilequery
            })
        return
        }
    })

    query.getParams(queryparams)
    query.getQueryMain()

   
    sql.connect(config, () => {
        response.setHeader('Cache-Control', 'no-cache');

        const requestConn = new sql.Request();
        requestConn.stream = true;

        requestConn.query(query.querymain);

        requestConn.on('recordset', () => {
                response.setHeader('Content-Type', 'application/json');
                response.write('[');
        })

        requestConn.on('row', row => {
            if (rowCount > 0)
            response.write(',');

            if (row % BATCH_SIZE === 0)
            response.flush();

            response.write(JSON.stringify(row));
            rowCount++;
        })

        request.on('rowsaffected', rowCount => {
            // Emitted for each `INSERT`, `UPDATE` or `DELETE` statement
            // Requires NOCOUNT to be OFF (default)
            console.log(rowCount)
        })

        requestConn.on('done', ()=> {
            if (rowCount> 0) 
                response.write(']');

            sql.close();
            response.end();
        })
        
        requestConn.on('error', error => {
            response.status(400).json({
                error: error
            })
            return
        })
    })
    sql.on('error', error => {
        response.status(400).json({
            error: error
        })
        return
    })
    
    /*
     try {
        let pool = await sql.connect(config);
        let rs = await pool.request()
            .query(query.querymain);
        rs.arrayRowMode=true
        rs.stream = true
        response.json(rs.recordsets[0]);
        console.log(rs)
         }
    catch (error) {
            response.status(500).json({
                error: error
            })
        }
    */
    
}


module.exports = {
    readQuery
}