const TematRepository = require('../Repository/TematRepository');


exports.addTematPage = (req, res, next) => {
    TematRepository.getTemats()
        .then(temats => {
            res.render('./forms/temat-form' , {
                temats:  temats,
                navLocation: 'admin',
                action: 'Dodaj',
                link: '/temat/insert',
                temat: {},
                validationErrors: []
            })
        })
}

exports.detailsTemat = (req, res, next) => {
    var id_tematu = req.params['tematId'];
    TematRepository.getTemats()
        .then(temats => {
            var tematToDisplay;
            temats.forEach(t => { if(t.Id == id_tematu)  tematToDisplay = t })
                
            res.render('./forms/temat-form' , {
                temats: temats,
                navLocation: 'admin',
                action: 'Szczegoly',
                link: '',
                temat: tematToDisplay,
                validationErrors: []
                
            })
        })    
}

exports.editTematPage = (req, res, next) => {
    var id_tematu = req.params['tematId'];
    TematRepository.getTemats()
        .then(temats => {
            var tematToDisplay;
            temats.forEach(t => { if(t.Id == id_tematu)  tematToDisplay = t})

            res.render('./forms/temat-form' , {
                temats: temats,
                navLocation: 'admin',
                action: 'Edytuj',
                link: '/temat/update',
                temat: tematToDisplay,
                validationErrors: []
            });
        })
}


exports.insertTemat = (req, res, next) => {
    const data = {...req.body};
    TematRepository.createTemat(data)
        .then(results => {
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err)
            TematRepository.getTemats()
            .then(temats => {
                res.render('./forms/temat-form' , {
                    temats:temats,
                    navLocation: 'admin',
                    action: 'Dodaj',
                    link: '/temat/insert',
                    temat: data,
                    validationErrors: err.details
                })
            })
        })
}

exports.updateTemat = (req, res, next) => {
    const data = {...req.body};
    TematRepository.updateTemat(data.Id, data)
        .then(results => {
            res.redirect('/admin');
        }) 
        .catch(err => {
            console.log(err);
            TematRepository.getTemats()
                .then(temats => {
                    res.render('./forms/temat-form' , {
                        temats: temats,
                        navLocation: 'admin',
                        action: 'Edytuj',
                        link: '/temat/update',
                        temat: tematToDisplay,
                        validationErrors: err.details
                });
            });
        })
}

exports.deleteTemat = (req, res, next) => {
    var temat_id = req.params['tematId'];
    TematRepository.deleteTemat(temat_id)
        .then(results => {
            res.redirect('/admin');
        })
}
