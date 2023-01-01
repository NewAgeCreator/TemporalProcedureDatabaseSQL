const TematRepository = require('../Repository/TematRepository');
const ObiektRepository = require('../Repository/ObiektRepository');
const OpisRepository = require('../Repository/OpisRepository');
const OpisSchema = require('../data_model/Opis');

exports.addOpisPage = (req, res, next) => {
    TematRepository.getTemats()
        .then(temats => {
            res.render('./forms/opis-form' , {
                temats: temats,
                opis: {},
                navLocation: 'admin',
                action: 'Dodaj',
                link: '/opis/insert',
                stany_opisu: [],
                validationErrors: []
            })            
        })
}


exports.insertOpis = (req, res, next) =>{
    var data = {...req.body};

    const validation = OpisSchema.validate(data, {abortEarly: false});
    if(validation.error) { return Promise.reject(validation.error); }

    OpisRepository.insertOpis(data)
        .then(results => {
            res.redirect('/admin');
        })
        .catch(err => {
            var tr = TematRepository.getTemats();
            Promise.all([tr])
                .then(results => {
                    console.log(err)
                    res.render('./forms/opis-form' , {
                        temats: results[0],
                        opis: data,
                        navLocation: 'admin',
                        action: 'Dodaj',
                        link: '/opis/insert',
                        stany_opisu: [],
                        validationErrors: err.details
                    })
                })
        })
}

exports.detailsOpis = ( req, res ,next ) =>{
    var id = req.params['opisId'];

    var tr = TematRepository.getTemats();
    var to = OpisRepository.getOpisesById(id)

    Promise.all([tr, to])
        .then(results => {
            for( os of results[1]){
                os.VTs = createCorrectDate(os.VTs); os.VTe = createCorrectDate(os.VTe); 
                os.TTs = createCorrectDateTime(os.TTs); os.TTe = createCorrectDateTime(os.TTe);
            }
            res.render('./forms/opis-form', {
                temats: results[0],
                opis: results[1][0],
                opises: results[1],
                navLocation: 'admin',
                action: 'Szczegoly',
                link: '',
                stany_opisu: results[1],
                validationErrors: []
            })
        })
}

exports.editOpisPage = (req,res,next) => {
    var id = req.params['opisId'];

    var tr = TematRepository.getTemats();
    var to = OpisRepository.getOpisById(id);
    Promise.all([tr, to])
        .then(results => {
            for( os of results[1]){
                os.VTs = createCorrectDate(os.VTs); os.VTe = createCorrectDate(os.VTe); 
                os.TTs = createCorrectDateTime(os.TTs); os.TTe = createCorrectDateTime(os.TTe);
            }
            console.log(results[1])
            res.render('./forms/opis-form', {
                temats: results[0],
                opis: results[1][0],
                opises: [],
                navLocation: 'admin',
                action: 'Edytuj',
                link: '/opis/update',
                stany_opisu: results[1],
                validationErrors: []
            })
        })
}

exports.updateOpis = (req, res, next) =>{
    var data = {...req.body};
   
    OpisRepository.updateOpis(data)
        .then(results => {
            res.redirect('/admin')
        })
        .catch(err => {
            
        var tr = TematRepository.getTemats();
        var to = OpisRepository.getOpisesById(data.Id_opisu);
        Promise.all([tr, to])
            .then(results => {
                for( os of results[1]){
                    os.VTs = createCorrectDate(os.VTs); os.VTe = createCorrectDate(os.VTe); 
                    os.TTs = createCorrectDateTime(os.TTs); os.TTe = createCorrectDateTime(os.TTe);
                }
            
                res.render('./forms/opis-form', {
                    temats: results[0],
                    opis: data,
                    opises: {},
                    navLocation: 'admin',
                    action: 'Edytuj',
                    link: '/opis/update',
                    stany_opisu: results[1],
                    validationErrors: err.details
                })
            })
        })
}

exports.deleteOpis = (req, res, next) => {
    var id = req.params['opisId'];
    OpisRepository.deleteOpis(id)
        .then(results =>{
            res.redirect('/admin');
        })
}

exports.reviveOpis = (req, res, next) => {
    var id = req.params['opisId'];
    OpisRepository.reviveOpis(id)
        .then(results =>{
            res.redirect('/admin');
        })
}


function createCorrectDateTime(input_date){
      
    if(input_date.getFullYear() == 9999)
        return "Stan Aktualny"      
    return new Date(input_date).toISOString().replace('T', ' ').substring(0, 19);
}


function createCorrectDate(input_date) {
    let day = input_date.getDate();
                if(day < 10) day = "0"+day;
                let month = input_date.getMonth()+1;
                if(month < 10) month = "0"+month;
                let year = input_date.getFullYear();
                return year+"-"+month+"-"+day;

}
