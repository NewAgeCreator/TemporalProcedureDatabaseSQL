const db = require('../config/mysql2/db');
const OpisSchema = require('../data_model/Opis')

exports.insertOpis = (data) => {
    const validation = OpisSchema.validate(data, {abortEarly: false});
    if(validation.error) { return Promise.reject(validation.error); }

    let sql = 'CALL opis_call(null , null, ?,?,?,?, "DODAJ")';
    return db.promise().query(sql, [data.Nazwa_skrocona, data.Opis, data.Imie_autora, data.Nazwisko_autora])
        .then(results => {
            return results[0];
        })
}

exports.updateOpis = (data) => {
    const validation = OpisSchema.validate(data, {abortEarly: false});
    if(validation.error) { return Promise.reject(validation.error); }
    
    let sql = 'CALL opis_call(? , null, ?,?,?,?, "EDYTUJ")';
    return db.promise().query(sql ,[data.Id_opisu, data.Nazwa_skrocona, data.Opis, data.Imie_autora, data.Nazwisko_autora])
        .then(results => {
            return results[0];
        })
}

exports.deleteOpis = (id) =>{
    var sql = 'CALL opis_call(?, null, null, null, null, null, "ZAKONCZ")';
    return db.promise().query(sql, id)
        .then(results => {
            return results[0];
        })
}

exports.reviveOpis = (id) =>{
    var sql = 'CALL opis_call(?, null, null, null, null, null, "WZNOW")';
     return db.promise().query(sql, id)
        .then(results => {
            return results[0];
        })

}

exports.getOpisById = (id) =>{
    var sql = 'SELECT * FROM Opis WHERE Id_stanu = (SELECT MAX(Id_stanu) FROM Opis WHERE Id_opisu = ?)'

    return db.promise().query(sql, id)
        .then(results => {
            return results[0];
        })
}

exports.getOpisesById = (id) => {
    var sql = 'SELECT * FROM Opis WHERE Id_opisu = (SELECT Id_opisu FROM Opis WHERE id_stanu = ? ORDER BY Id_stanu LIMIT 1) ORDER BY Id_stanu DESC';

    return db.promise().query(sql, id)
        .then(results => {
            
            return results[0];
    })
}

exports.getAllCurrencyOpises = () => {
    let sql = 'SELECT Id_stanu, Id_opisu, Nazwa_skrocona, Opis, Imie_autora, Nazwisko_autora, Rodzaj_stanu, Id_stan_poprzedni, VTs, VTe, TTs, TTe FROM Opis o1 WHERE Id_stanu = (SELECT MAX(Id_stanu) FROM Opis o2 WHERE o1.Id_opisu = o2.Id_opisu) ORDER BY Id_opisu ASC';

    return db.promise().query(sql)
        .then(results => {
            return results[0];
        })
}

exports.getOpisyObiektu = (id) =>{
    var sql = `SELECT Nazwa_skrocona, Id_opisu, Opis, Rodzaj_stanu FROM Opis WHERE Id_stanu IN (SELECT Id_stan_opisu FROM Obiekt_opisowy WHERE Id_stan_obiektu IN (SELECT Id_stanu FROM Obiekt WHERE Id_obiektu = ?) and Rodzaj_stanu = 'A')`;

    return db.promise().query(sql, id)
        .then(results => {return results[0]})
}

