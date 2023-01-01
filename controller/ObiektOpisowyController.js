const Obiekt_opisowyRepository = require('../Repository/Obiekt_opisowyRepozytorium');
const TematRepository = require('../Repository/TematRepository');
const ObiektRepository = require('../Repository/ObiektRepository');

exports.addObiektOpisowyPage = (req, res, next) =>{ 
var tr = TematRepository.getTemats();
var or = ObiektRepository.getAllCurrentObiekts();

    Promise.all([tr, or])
    .then(results => {
        res.render('forms/oo-form',{
            temats: results[0],
            obieks: results[1],
            obiekt_opisowy: [],
            navLocation: 'admin',
            validationErrors: []
        })
    })    
    
}

exports.obiektOpisowyDetails = (req, res, next) => {
    var opisId = req.params["opisId"];
    var obiektId = req.params["obiektId"];
    var tr = TematRepository.getTemats();
    var oor = Obiekt_opisowyRepository.getAllObiekOpisowyWithIds(opisId, obiektId);
    var or = ObiektRepository.getAllCurrentObiekts();
    Promise.all([tr, oor, or])
        .then(results => {
            res.render('forms/oo-form', {
                temats: results[0],
                obiekt_opisowy: results[1],
                obieks: results[2],
                navLocation: 'admin',
                validationErrors: []
            })
        })
}


exports.insertObiektOpisowy = (req, res, next) => {
    const data = {...req.body};
    var opisId = data.Id_opisu;
    var obiektId = data.Id_obiektu;
    Obiekt_opisowyRepository.createObiektOpisowy(opisId, obiektId)
        .then(results =>{ 
            res.redirect('/admin');
         })
}

exports.deleteObiektOpisowy = (req, res, next) => {
    var opisId = req.params["opisId"];
    var obiektId = req.params["obiektId"];
    Obiekt_opisowyRepository.deleteObiektOpisowy(opisId, obiektId)
        .then(results =>{
           
                res.redirect('/admin');
           
         })
}