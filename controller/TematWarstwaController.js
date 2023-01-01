const TematWarstwaRepository = require('../Repository/TematWarstwaRepository');
const TematRepository = require('../Repository/TematRepository');
const WarstwaRepository = require('../Repository/WarstwaRepository');

exports.addTematWarstwaPage = (req, res, next) => {

    var twr = TematWarstwaRepository.getAll();
    var tr = TematRepository.getTemats();
    var wr = WarstwaRepository.getWarstwas();

    Promise.all([twr , tr , wr])
        .then(results => {
            res.render('forms/wt-form',{
                temats: results[1],
                navLocation: 'admin',
                validationErrors: []
            })
        });
}

exports.insertWT = (req, res, next) => {
    const data = {...req.body};
    TematWarstwaRepository.insertWT(data.Temat_id, data.Warstwa_id)
        .then(results => {
                res.redirect('/admin')
        })
    
}

exports.deleteTematWarstwa = (req, res, next) =>{
    const id = req.params["wtId"];
    TematWarstwaRepository.deleteTematWarstwa(id)
        .then(results => {
            res.redirect('/admin');
        })
}