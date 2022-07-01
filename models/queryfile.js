// Class Connection archivo.Json

class QueryFile {
    constructor(nameFileQuery) { 

        this.nameFileQuery = __dirname + '/../menu/'+ nameFileQuery 
        const file = require(this.nameFileQuery ) 
        
        this.queryheader = file.queryheader
        this.queryparams = file.queryparams
        this.querymain = file.querymain
        this.queryexec = file.queryexec
    }

    setHeader () {

        // TODO: pasar valor de header a propiedad value en queryparams
        this.queryparams.map(p => {
            var rgx = '«' + p.name + '»'
            this.queryheader= this.queryheaderreplace(new RegExp(rgx,'gi'), p.value)
        })

    }
    
    getParams (queryparams) {
            // Propiedad viene desde body del request
            this.queryparams= queryparams
    }

    getQueryMain () {
        this.queryparams.map(p => {
            var rgx = '«' + p.name + '»'
            this.querymain = this.querymain.replace(new RegExp(rgx,'gi'), p.value)
        })
    }

    getQueryExec () {
        this.queryparams.map(p => {
            var rgx = '«' + p.name + '»'
            this.queryexec = this.queryexec.replace(new RegExp(rgx,'gi'), p.value)
        })
    }

}

module.exports = QueryFile;