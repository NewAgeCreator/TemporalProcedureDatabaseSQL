const db = require('../config/mysql2/db');
const TematSchema = require('../data_model/Temat');
const TematWarstwaRepository = require('../Repository/TematWarstwaRepository');

exports.getTemats = () => {
    return db.promise().query('SELECT * FROM Temat')
        .then( (results) => {
            return results[0];
        });
}

exports.getTematById = (tematId) => {
    var query = `SELECT w.id, w.nazwa
    FROM Warstwa w, Warstwa_w_temacie wt, Temat t 
    WHERE w.Id = wt.Warstwa_id and
     wt.Temat_id = t.Id and
      t.id = ?` ;

    return db.promise().query(query, tematId)
        .then ( (results) => { 
            return results[0];
        });
}




exports.createTemat = (data) => {
    
    const validation = TematSchema.validate(data , {abortEarly: false});
    if(validation.error){   return Promise.reject(validation.error)};
    var sql = `INSERT INTO Temat(Nazwa, Opis, Data_utworzenia, Imie_autora, Nazwisko_autora) VALUES (?,?,?,?,?)`;
    return db.promise().query(sql, [data.Nazwa, data.Opis, data.data_utworzenia, data.Imie_autora, data.Nazwisko_autora]);
}

exports.updateTemat = (id, data) => {
    
    const validation = TematSchema.validate(data , {abortEarly: false});
    if(validation.error){   return Promise.reject(validation.error)};

    var sql = `UPDATE Temat SET Nazwa = ?,  Opis = ? , Data_utworzenia = ?, Imie_autora = ? , Nazwisko_autora = ? WHERE id=?`;
    return db.promise().query(sql, [data.Nazwa, data.Opis, data.data_utworzenia, data.Imie_autora, data.Nazwisko_autora, id])
      
}

exports.deleteTemat = (id) => {
    return TematWarstwaRepository.deleteAllWRInTemat(id)
        .then(results => {
            var sql = 'DELETE FROM Temat WHERE id = ?';
            return db.promise().query(sql , id)
        })
   
}

