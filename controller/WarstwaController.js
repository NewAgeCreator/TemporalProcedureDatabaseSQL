const WarstwaRepository = require('../Repository/WarstwaRepository');
const TematRepository = require('../Repository/TematRepository');
const TematWarstwaRepository = require('../Repository/TematWarstwaRepository');

exports.addWarstwaPage = (req, res, next) => {
    TematRepository.getTemats()
        .then(temats => {
            res.render('./forms/warstwa-form' , {
                temats: temats,
                navLocation: 'admin',
                action: 'Dodaj',
                link: '/warstwa/insert',
                warstwa: {},
                validationErrors: []
            })
        })
}

exports.detailsWarstwa = (req, res, next) => {
    var id_warstwy = req.params['warstwaId'];
    var tematPromise = TematRepository.getTemats();
    var warstwaByIdPromise = WarstwaRepository.getWarstwaById(id_warstwy);

    Promise.all([tematPromise, warstwaByIdPromise])
        .then(results => {
            res.render('./forms/warstwa-form' , {
                temats: results[0],
                navLocation: 'admin',
                action: 'Szczegoly',
                link: '',
                warstwa: results[1][0],
                validationErrors: [] 
            })
        })
}

exports.editWarstwaPage = (req, res, next) => {
    var id_warstwy = req.params['warstwaId'];
    var tematPromise = TematRepository.getTemats();
    var warstwaByIdPromise = WarstwaRepository.getWarstwaById(id_warstwy);
    Promise.all([tematPromise, warstwaByIdPromise])
        .then(results => {
            res.render('./forms/warstwa-form' , {
                temats: results[0],
                navLocation: 'admin',
                action: 'Edytuj',
                link: '/warstwa/update',
                warstwa: results[1][0],
                validationErrors: [] 
            })
        })
}


exports.insertWarstwa = (req,res,next) => {
    const data = {...req.body};
    WarstwaRepository.createWarstwa(data)
        .then(results => {
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err)
            var tematPromise = TematRepository.getTemats();
            var warstwaByIdPromise = WarstwaRepository.getWarstwaById(data.Id);
           
            Promise.all([tematPromise, warstwaByIdPromise])
            .then(results => {
                res.render('./forms/warstwa-form' , {
                    temats: results[0],
                    navLocation: 'admin',
                    action: 'Dodaj',
                    link: '/warstwa/insert',
                    warstwa: data,
                    validationErrors: err.details
                })
            })
        })
}

exports.updateWarstwa = (req, res, next) =>{
    const data= {...req.body};
    WarstwaRepository.updateWarstwa(data.Id, data)
        .then(results => {
            res.redirect('/admin');
        })   
        .catch(err => {
            console.log(err);
            var tematPromise = TematRepository.getTemats();
           
            Promise.all([tematPromise])
            .then(results => {
                res.render('./forms/warstwa-form' , {
                    temats: results[0],
                    navLocation: 'admin',
                    action: 'Edytuj',
                    link: '/warstwa/update',
                    warstwa: data,
                    validationErrors: err.details
                })
            })
        })
}

exports.deleteWarstwa = (req, res, next) => {
    var warstwa_id = req.params['warstwaId'];
    WarstwaRepository.deleteWarstwa(warstwa_id)
        .then(results=> {
            res.redirect('/admin')
        })
}