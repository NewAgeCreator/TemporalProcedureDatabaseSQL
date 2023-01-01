const db = require('../config/mysql2/db');

exports.getWarstwyTematu = (id_tematu) => {
    sql = 'SELECT Warstwa_id, Temat_id, w.Nazwa, t.Nazwa FROM Warstwa_w_temacie wt, Temat t, Warstwa w WHERE w.Id = wt.Warstwa_id and wt.Temat_id = t.Id and t.Id = ?';

    return db.promise().query(sql , id_tematu)
        .then(results => {
            return results[0];
        })

}

exports.getTematyWarstwy = (id_warstwy) => {
    sql = 'SELECT Warstwa_id, Temat_id, w.Nazwa, t.Nazwa FROM Warstwa_w_temacie wt, Temat t, Warstwa w WHERE w.Id = wt.Warstwa_id and wt.Temat_id = t.Id and w.Id = ?';
    
    return db.promise().query(sql , id_warstwy)
        .then(results => {
            return results[0];
    })
}

exports.getAll = () => {
    var sql = 'SELECT wt.Id, Warstwa_id, Temat_id, w.Nazwa as Nazwa_warstwa, t.Nazwa as Nazwa_temat FROM Warstwa_w_temacie wt, Temat t, Warstwa w WHERE w.Id = wt.Warstwa_id and wt.Temat_id = t.Id';

    return db.promise().query(sql)
        .then(results =>{
            return results[0];
        })
}

exports.insertWT = (id_tematu, id_warstwy) => {
var sql = 'INSERT INTO Warstwa_w_temacie(Temat_id, Warstwa_id) VALUES (? , ?)';

    return db.promise().query(sql, [id_tematu , id_warstwy])
        .then(results => {
            return results[0];
        })
}

exports.deleteTematWarstwa = (id) => {
    var sql = 'DELETE FROM Warstwa_w_temacie WHERE Id = ?';

    return db.promise().query(sql , id)
        .then(results => {
            return results[0];
        })
}

exports.getWarstwyNotInTematAPI = (id) => {
    var sql = 'SELECT w.Id , w.Nazwa as Nazwa_warstwa FROM Warstwa w WHERE w.Id NOT IN ( SELECT Warstwa_id FROM Warstwa_w_temacie WHERE Temat_id = ?)';
    return db.promise().query(sql, id)
    .then(results => {
        return results[0];
    })
}

exports.deleteAllWRInTemat = (id) => {
    var sql = 'DELETE FROM Warstwa_w_temacie WHERE Temat_id = ?';
    return db.promise().query(sql, id)
}

exports.deleteAllWRInWarstwa = (id) => {
    var sql = 'DELETE FROM Warstwa_w_temacie WHERE Warstwa_id = ?';
    return db.promise().query(sql, id)
}
     
