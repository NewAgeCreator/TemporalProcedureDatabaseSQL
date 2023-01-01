const TematRepository = require('../Repository/TematRepository');
const WarstwaRepository = require('../Repository/WarstwaRepository');
const ObiektRepository = require('../Repository/ObiektRepository');
const OpisRepository = require('../Repository/OpisRepository');
const TematWarstwaRepository = require('../Repository/TematWarstwaRepository');
const Obiekt_opisowyRepository = require('../Repository/Obiekt_opisowyRepozytorium');

exports.showTematList = (req, res, next) => {
    TematRepository.getTemats()
        .then(temats => {
            temats.forEach(t => {
                t.Data_utworzenia = createCorrectDate(t.Data_utworzenia);
            })

            res.render(`index` , {
                temats: temats,
                navLocation : 'main'
            })
        })
}

exports.showAboutPage = (req, res, next) =>{
    TematRepository.getTemats()
    .then(temats => {
        temats.forEach(t => {
            t.Data_utworzenia = createCorrectDate(t.Data_utworzenia);
        })
        res.render(`about` , {
            temats: temats,
            navLocation : 'about'
        });
    })   
}

exports.showMapPage = (req, res, next) => {
    var temat_id = req.params['tematId'];

    var warstwaByIdPromise = WarstwaRepository.getWarstwaByTematId(temat_id);
    var TematsPromie = TematRepository.getTemats();

    Promise.all([warstwaByIdPromise,TematsPromie ])
    .then(data => {
        res.render(`map` , {
            warstwas: data[0],
            temats: data[1],
            currentTemat: temat_id,
            navLocation : 'map'
        });
    })  
}

exports.showAdminPage = (req, res, next) => {
    var temats = TematRepository.getTemats();
    var wartwas = WarstwaRepository.getWarstwas();
    var obiekts = ObiektRepository.getAllCurrentObiekts();
    var opises = OpisRepository.getAllCurrencyOpises();
    var tematWarstwa  = TematWarstwaRepository.getAll();
    var obiekt_opisowy = Obiekt_opisowyRepository.getAllCurrencyObiektOpisowy();

    Promise.all([temats, wartwas, obiekts, opises, tematWarstwa, obiekt_opisowy])
        .then(results => {
            for(t of results[0]){t.Data_utworzenia = createCorrectDate(t.Data_utworzenia)}
            for(w of results[1]){w.Data_utworzenia = createCorrectDate(w.Data_utworzenia)}
            for(o of results[2]){o.VTs = createCorrectDate(o.VTs); o.VTe = createCorrectDate(o.VTe); }
            for(o of results[3]){o.VTs = createCorrectDate(o.VTs); o.VTe = createCorrectDate(o.TTe); o.TTs = createCorrectDate(o.TTs); }
            console.log(results[5])
            res.render('admin' , {
                navLocation: 'admin',
                temats: results[0],
                warstwas: results[1],
                obiekts: results[2],
                opises: results[3],
                tematWarstwa: results[4],
                obiekt_opisowy: results[5]
            });       
        })
}



function createCorrectDate(input_date) {
    let day = input_date.getDate();
                if(day < 10) day = "0"+day;
                let month = input_date.getMonth() + 1;
                if(month < 10) month = "0"+month;
                let year = input_date.getFullYear();
                return day+"/"+month+"/"+year;

}