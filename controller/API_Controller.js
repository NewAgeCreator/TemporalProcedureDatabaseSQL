const ObiektRepository = require('../Repository/ObiektRepository');
const WarstwaRepository = require('../Repository/WarstwaRepository');
const TematWarstwaRepository = require('../Repository/TematWarstwaRepository');
const Obiekt_opisowyRepository = require('../Repository/Obiekt_opisowyRepozytorium');
const OpisRepository = require('../Repository/OpisRepository')

exports.ObiektyTematuAPI = (req,res,next) => {
    var temat_id = req.params['tematId'];
    ObiektRepository.getAllObiektsFromTemat(temat_id)
        .then(obiekts => {
            res.status(200).json(obiekts);
        })
}


exports.getWarstwyNotInTematAPI = (req, res, next) => {
    var temat_id = req.params['tematId'];
    TematWarstwaRepository.getWarstwyNotInTematAPI(temat_id)
        .then(results => {
            console.log("API : " , results);
            res.status(200).json(results);
        })
}


exports.getOpisyNotInObiektAPI = (req, res, next) => {
    console.log("REVICED id =" , id)
    var id = req.params["obiektId"]
    Obiekt_opisowyRepository.getOpisyNotInObiekt(id)
        .then(results => {
            console.log("API getOpisyNotInObiekt :", results)
            res.status(200).json(results);
        })
}

exports.getOpisyFromObiektAPI = (req, res, next) => {
    var obiektId = req.params["obiektId"];
    OpisRepository.getOpisyObiektu(obiektId)
        .then(results => {
            console.log("API Opisy obiektu : " , results);
            res.status(200).json(results);
        })
}