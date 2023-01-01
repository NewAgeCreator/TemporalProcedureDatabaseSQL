const db = require('../config/mysql2/db');
const ObiektSchema = require('../data_model/Obiekt')

exports.insertObiekt = (data) =>{
    const validation = ObiektSchema.validate(data ,  {abortEarly: false});
    if(validation.error) { return Promise.reject(validation.error) };
    console.log("data to repo" ,data)
    let sql ='CALL call_obiekt(null,?,?,?,?,?,?, "DODAJ")';
    return db.promise().query(sql , [data.Warstwa_id, data.Nazwa, data.GEO, data.Typ_wydarzenia, data.VTS, data.VTE])
        .then(results =>{
            return results[0];
        })
}

exports.updateObiekt = (data) => {
    let sql = 'CALL call_obiekt(?,?,?,?,?,?,?, "Edytuj")';

    const validation = ObiektSchema.validate(data ,  {abortEarly: false});
    if(validation.error) { return Promise.reject(validation.error) };
    console.log("data to repo" ,data)
    return db.promise().query(sql, [data.Id_obiektu, data.Warstwa_id, data.Nazwa, data.GEO, data.Typ_wydarzenia, data.VTS, data.VTE])
        .then(results => {
            return results[0];
        })
}

exports.deleteObiekt = (id) => {
    let sql = 'CALL call_obiekt(?, null, null, null, null, null, null, "ZAKONCZ")'

    return db.promise().query(sql, id)
        .then(results => {
            return results[0]
        })
}

exports.reviveObiekt = (id) => {
    let sql = 'CALL call_obiekt(?, null, null, null, null, null, null, "WZNOW")'

    return db.promise().query(sql, id)
        .then(results => {
            return results[0];
        })
}

exports.deleteAllObiektsWithWarstwaId = (id) => {
    let sql1 = 'DELETE FROM Obiekt_opisowy WHERE Id_stan_obiektu IN (SELECT Id_stanu FROM Obiekt WHERE Warstwa_id = ?);';
    let sql2 = 'UPDATE Obiekt SET Id_stan_poprzedni = null WHERE Id_obiektu IN (SELECT Id_obiektu FROM Obiekt WHERE Warstwa_id = ?);';
    let sql3 ='DELETE FROM Obiekt WHERE Id_obiektu IN (SELECT Id_obiektu FROM Obiekt WHERE Warstwa_id = ?)';
    
    var promise1 = db.promise().query(sql1, id);
    var promise2 = db.promise().query(sql2, id);

    return promise1.then( () =>{
        return promise2.then( () => {
            return db.promise().query(sql3, id)
            .then(results2 => {
                return results2[0];
            });
        })
    })
      
         
       
   
}




exports.getAllCurrentObiekts = () => {
    let sql = 'SELECT * FROM Obiekt o1 WHERE Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt o2 WHERE o1.Id_obiektu = o2.Id_obiektu);'
    return db.promise().query(sql)
        .then(results => {
            return results[0];
        })
}

exports.getObiektsWithId = (id) => {
    let sql = `SELECT * FROM Obiekt WHERE Id_obiektu = (SELECT Id_obiektu FROM Obiekt WHERE Id_stanu = ? LIMIT 1) ORDER BY Id_stanu DESC`;
    return db.promise().query(sql, id)
        .then((results) => {
            return results[0];
        });
}

exports.getCurrentObiektWithId = (id) => {
    let sql = `SELECT * FROM Obiekt WHERE Id_stanu = ?`;
    return db.promise().query(sql, id)
        .then((results) => {
            return results[0];
        });
}

exports.getAllObiektsFromTemat = (id_tematu) => {
    var sql = `SELECT Id_stanu, Id_obiektu,Nazwa ,Typ_wydarzenia, GEO, Warstwa_id, Vts, Vte, TTs, TTe, Id_stan_poprzedni, Rodzaj_stanu
    FROM Obiekt o 
    WHERE Warstwa_Id 
    IN (SELECT w.Id 
        FROM Warstwa w 
        INNER JOIN Warstwa_w_temacie wt on wt.Warstwa_id = w.Id 
        INNER JOIN Temat t on t.Id = wt.Temat_id where t.Id = ?) 
    AND  Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt o2 WHERE o.Id_obiektu = o2.Id_obiektu)`;

    return db.promise().query(sql, id_tematu)
        .then(results => {
            return results[0];
        })
} 