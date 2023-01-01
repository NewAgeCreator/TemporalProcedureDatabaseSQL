const TematRepository = require('../Repository/TematRepository');
const ObiektRepository = require('../Repository/ObiektRepository');
const WarstwaRepository = require('../Repository/WarstwaRepository');

exports.addObiektPage = (req, res, next ) => {
    
    var tr = TematRepository.getTemats()
    var wr = WarstwaRepository.getWarstwas();
    Promise.all([tr, wr])
        .then(results => {
            res.render('./forms/obiekt-form' ,{
                temats : results[0],
                warstwas: results[1],
                obiekt: {},
                navLocation: 'admin', 
                temat: {},
                action: 'Dodaj',
                link: '/obiekt/insert',
                stany_obiektu: [],
                validationErrors: []

            })
        })
}

exports.insertObiekt = (req, res, next) => {
    var data = {...req.body};
    data['GEO'] = prepareGeo(data);
  
    ObiektRepository.insertObiekt(data)
        .then(results => {
            res.redirect('/admin')
        })
        .catch(err => {     
        var tr = TematRepository.getTemats()
        var wr = WarstwaRepository.getWarstwas();
            console.log(err)
        Promise.all([tr, wr])
            .then(results => {
            
            data.VTs = createCorrectDate(data.VTs)
            data.VTe = createCorrectDate(data.VTe)
            data.GEO = JSON.parse(data.GEO);
                res.render('./forms/obiekt-form' ,{
                    temats : results[0],
                    warstwas: results[1],
                    obiekt: data,
                    navLocation: 'admin', 
                    temat: {},
                    action: 'Dodaj',
                    link: '/obiekt/insert',
                    stany_obiektu: [],
                    validationErrors: err.details
                })
            })
        })
    }

    exports.detailsObiekt = (req, res, next) =>{
        var id = req.params['obiektId'];
        var tr = TematRepository.getTemats();
        var wr = WarstwaRepository.getWarstwas();
        var or = ObiektRepository.getCurrentObiektWithId(id);
        var allStany = ObiektRepository.getObiektsWithId(id);
        Promise.all([tr, wr, or, allStany])
        .then(results => {
            results[2][0].VTs = createCorrectDate(results[2][0].VTs)
            results[2][0].VTe = createCorrectDate(results[2][0].VTe)
            results[2][0].GEO = JSON.parse(results[2][0].GEO);
            for(os of results[3]) {
                os.VTs = createCorrectDate(os.VTs); os.VTe = createCorrectDate(os.VTe); 
                os.TTs = createCorrectDateTime(os.TTs); os.TTe = createCorrectDateTime(os.TTe);
            }

                res.render('./forms/obiekt-form' ,{
                    temats : results[0],
                    warstwas: results[1],
                    obiekt: results[2][0],
                    navLocation: 'admin', 
                    temat: {},
                    action: 'Szczegoly',
                    link: '',
                    stany_obiektu: results[3],
                    validationErrors: []
    
                })
            })
         
    }

    exports.editObiektPage = (req, res, next) => {
        var id = req.params['obiektId'];
        var tr = TematRepository.getTemats();
        var wr = WarstwaRepository.getWarstwas();
        var or = ObiektRepository.getCurrentObiektWithId(id);
        
        Promise.all([tr, wr, or])
        .then(results => {
            results[2][0].VTs = createCorrectDate(results[2][0].VTs)
            results[2][0].VTe = createCorrectDate(results[2][0].VTe)
            results[2][0].GEO = JSON.parse(results[2][0].GEO);
                res.render('./forms/obiekt-form' ,{
                    temats : results[0],
                    warstwas: results[1],
                    obiekt: results[2][0],
                    navLocation: 'admin', 
                    temat: {},
                    action: 'Edytuj',
                    link: '/obiekt/update',
                    stany_obiektu: [],
                    validationErrors: []
    
                })
            })
    }

    exports.updateObiekt = (req, res, next) => {
        var data = {...req.body};
        data['GEO'] = prepareGeo(data);
        ObiektRepository.updateObiekt(data)
            .then(results => {
                res.redirect('/admin');
            })
            .catch(err => {
                var tr = TematRepository.getTemats();
                var wr = WarstwaRepository.getWarstwas();
                var or = ObiektRepository.getCurrentObiektWithId(data.Id_obiektu);
                Promise.all([tr, wr, or])
                    .then(results =>{
                        results[2][0].VTs = createCorrectDate(results[2][0].VTs)
                        results[2][0].VTe = createCorrectDate(results[2][0].VTe)
                        results[2][0].GEO = JSON.parse(results[2][0].GEO);
                        
                            res.render('./forms/obiekt-form' ,{
                                temats : results[0],
                                warstwas: results[1],
                                obiekt: data,
                                navLocation: 'admin', 
                                temat: {},
                                action: 'Edytuj',
                                link: '/obiekt/update',
                                stany_obiektu: [],
                                validationErrors: err.details
                            })
                    })
            })

    }

    

    exports.deleteObiekt = (req, res, next) => {
        var obiekt_id = req.params['obiektId'];
        ObiektRepository.deleteObiekt(obiekt_id)
            .then(results => {
                res.redirect('/admin');
            })
    }

    exports.reviveObiekt = (req,res,next) => {
        var obiekt_id = req.params['obiektId'];
        ObiektRepository.reviveObiekt(obiekt_id)
            .then(results => {
                res.redirect('/admin');
            })
    }

    function createCorrectDateTime(input_date){
      
        if(input_date.getFullYear() == 9999)
            return "Stan Aktualny"      
        return new Date(input_date).toISOString().replace('T', ' ').substring(0, 19);
    }


    function createCorrectDate(input_date) {
        if(input_date){
            
            let day = input_date.getDate();
            if(day < 10) day = "0"+day;
            let month = input_date.getMonth() + 1;
            if(month < 10) month = "0"+month;
            let year = input_date.getFullYear();
            return year+"-"+month +"-"+day;
            
        }
    }

    function prepareGeo(data){
        var GEOtemp = new Array();
        console.log(data.GEO.length);
        console.log(typeof data.GEO);
        
        if(typeof data.GEO != 'string'){
            data.GEO.forEach(element => {
                GEOtemp.push(element);
            })
        }
        else  GEOtemp.push(data)
        return JSON.stringify(GEOtemp);
    }