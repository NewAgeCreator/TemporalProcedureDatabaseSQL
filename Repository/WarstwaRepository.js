const db = require('../config/mysql2/db');
const WarstwaSchema = require('../data_model/Warstwa');
const TematWarstwaRepository = require('../Repository/TematWarstwaRepository');
const ObiektRepository =  require('../Repository/ObiektRepository');

exports.getWarstwas = () => {
    var sql = 'SELECT * FROM Warstwa';
    return db.promise().query(sql)
        .then(results => {
        
            return results[0]
        });
}

exports.getWarstwaById = (id) => {
    var sql = 'SELECT * FROM Warstwa WHERE id = ?';
    
    return db.promise().query(sql, id)
        .then(results => {
            return results[0];
        })
}

exports.getWarstwaByTematId = (id) => {
    var sql = 'SELECT w.Id, w.Nazwa, w.Imie_autora, w.Nazwisko_autora, w.Opis FROM Warstwa w INNER JOIN Warstwa_w_temacie wt on wt.Warstwa_id = w.Id INNER JOIN Temat t on t.Id = wt.Temat_id where t.Id = ?'
    
    return db.promise().query(sql, id)
        .then(results => {
            return results[0];
        })
}


exports.createWarstwa = (data) => {

    const validation = WarstwaSchema.validate(data , {abortEarly: false});
    if(validation.error){ return Promise.reject(validation.error) }
    var sql = `INSERT INTO Warstwa (Nazwa, Opis, Data_utworzenia, Imie_autora, Nazwisko_autora) VALUES (?,?,?,?,?)`;
    return db.promise().query(sql , [data.Nazwa, data.Opis, data.data_utworzenia, data.Imie_autora, data.Nazwisko_autora])
        .then( results => {
            return results[0];
        })
}

exports.updateWarstwa = (id, data) => {
    const validation = WarstwaSchema.validate(data , {abortEarly: false});
    if(validation.error){ return Promise.reject(validation.error) }
    console.log("data do edycji", data)
    var sql = 'UPDATE Warstwa SET Nazwa = ?, Opis = ?, Data_utworzenia = ?, Imie_autora = ?, Nazwisko_autora = ? WHERE id = ?'; 
    return db.promise().query(sql , [data.Nazwa, data.Opis, data.data_utworzenia, data.Imie_autora, data.Nazwisko_autora, id]);
}

exports.deleteWarstwa = (id) => {
    
    var twr =  TematWarstwaRepository.deleteAllWRInWarstwa(id);
    var ob = ObiektRepository.deleteAllObiektsWithWarstwaId(id);
    
    return Promise.all([twr, ob])
        .then(results =>{
            var sql = 'DELETE FROM Warstwa WHERE id = ?';
            return db.promise().query(sql , id)
                
        })
}


