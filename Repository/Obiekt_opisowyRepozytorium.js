const db = require('../config/mysql2/db');

exports.getAllCurrencyObiektOpisowy= () => {
    var sql = 'SELECT oo.Id_stanu, ob.Nazwa,op.Nazwa_skrocona, op.Opis, ob.Id_stanu as stan_obiektu, ob.Id_obiektu, op.Id_stanu as stan_opisu, op.Id_opisu FROM Obiekt_opisowy oo, Opis op, Obiekt ob WHERE op.Id_stanu = oo.Id_stan_opisu and ob.Id_stanu = oo.Id_stan_obiektu and oo.Rodzaj_stanu = "A"';

    return db.promise().query(sql)
        .then(results => {
            return results[0];
        })
}

exports.createObiektOpisowy = (OpisId, ObiektId) => {
    var sql = 'CALL opis_call(?,?, null,null,null,null,"PRZYPISZ")';

    return db.promise().query(sql, [OpisId, ObiektId])
        .then(results => { return results[0]})
}

exports.deleteObiektOpisowy = (OpisId, ObiektId) => {
    var sql = 'CALL opis_call(?,?, null,null,null,null,"ODEPNIJ")';

    return db.promise().query(sql, [OpisId, ObiektId])
        .then(results => { return results[0]})
}

exports.getOpisyNotInObiekt = (ObiektId) =>{

    var sql = `SELECT Nazwa_skrocona, Id_opisu, Opis FROM Opis o1 WHERE Id_stanu  IN (SELECT Id_stan_opisu FROM Obiekt_opisowy WHERE Id_stan_obiektu NOT IN (SELECT Id_stanu FROM Obiekt WHERE Id_obiektu = ?) AND Rodzaj_stanu = 'A') and Rodzaj_stanu = 'A'
    OR 
    Id_stanu NOT IN (SELECT Id_stan_opisu FROM Obiekt_opisowy WHERE Rodzaj_stanu = 'A' ) 
    and Id_stanu = (SELECT MAX(Id_stanu) FROM Opis o2 WHERE o1.Id_opisu = o2.Id_opisu)`;
    
    return db.promise().query(sql, ObiektId)
        .then(results => {
            return results[0];
        })
    // var sql = `SELECT obop.Id_stanu, obop.Id_stan_opisu, obop.Id_stan_obiektu FROM Obiekt_opisowy obop WHERE 
    //             obop.Id_stan_obiektu <> (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = ?)
    //             AND obop.Id_stan_opisu = (SELECT MAX(Id_stanu) FROM Opis WHERE Id_opisu = 3)`
}


exports.getAllObiekOpisowyWithIds = (opisId , obiektId) =>{
    var sql = `SELECT obop.Id_stanu,obop.Id_stan_opisu,
    obop.Id_stan_obiektu, ob.Nazwa,
    op.Nazwa_skrocona, ob.Id_obiektu,
    obop.TTs, obop.TTe,
    op.Id_opisu, op.Opis, obop.Rodzaj_stanu
    FROM Obiekt_opisowy obop, Opis op, Obiekt ob WHERE obop.Id_stan_obiektu = ob.Id_stanu and obop.Id_stan_opisu = op.Id_stanu AND obop.Id_stan_obiektu IN (SELECT Id_stanu FROM Obiekt WHERE Id_obiektu = ?) AND obop.Id_stan_opisu IN (SELECT Id_stanu FROM Opis WHERE Id_opisu = ?)
    ORDER BY obop.Id_stanu DESC`

    return db.promise().query(sql, [obiektId, opisId])
        .then(results => {
            return results[0];
        })

}