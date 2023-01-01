const express = require('express');
const router = express.Router();

const mainController = require('../controller/mainController')
const API_Controller = require('../controller/API_Controller')
const TematController = require('../controller/TematController')
const WarstwaController = require('../controller/WarstwaController')
const WarstwaWTemacieController = require('../controller/TematWarstwaController');
const ObiektController = require('../controller/ObiektController');
const OpisController = require('../controller/OpisController');
const Obiekt_opisowyController = require('../controller/ObiektOpisowyController');

router.get('/', mainController.showTematList);
router.get('/about', mainController.showAboutPage);
router.get('/map/:tematId', mainController.showMapPage);
router.get('/admin', mainController.showAdminPage);
// router.get('/mapa')

//forms temat
router.get('/temat/add' , TematController.addTematPage);
router.get('/temat/details/:tematId', TematController.detailsTemat);
router.get('/temat/edit/:tematId', TematController.editTematPage);
router.post('/temat/insert', TematController.insertTemat );
router.post('/temat/update', TematController.updateTemat)
router.get('/temat/delete/:tematId', TematController.deleteTemat)

//forms warstwa 
router.get('/warstwa/add' , WarstwaController.addWarstwaPage);
router.get('/warstwa/details/:warstwaId', WarstwaController.detailsWarstwa);
router.get('/warstwa/edit/:warstwaId', WarstwaController.editWarstwaPage);
router.post('/warstwa/insert', WarstwaController.insertWarstwa);
router.post('/warstwa/update', WarstwaController.updateWarstwa);
router.get('/warstwa/delete/:warstwaId', WarstwaController.deleteWarstwa);


//forms warstwa w temacie 
router.get('/warstwawtemacie/add', WarstwaWTemacieController.addTematWarstwaPage)
router.post('/warstwawtemacie/insert' , WarstwaWTemacieController.insertWT)
router.get('/warstwawtemacie/delete/:wtId', WarstwaWTemacieController.deleteTematWarstwa)

//forms obiekt
router.get('/obiekt/add' , ObiektController.addObiektPage);
router.post('/obiekt/insert' , ObiektController.insertObiekt);
router.get('/obiekt/details/:obiektId' , ObiektController.detailsObiekt);
router.get('/obiekt/edit/:obiektId', ObiektController.editObiektPage);
router.post('/obiekt/update', ObiektController.updateObiekt);
router.get('/obiekt/delete/:obiektId', ObiektController.deleteObiekt);
router.get('/obiekt/revive/:obiektId', ObiektController.reviveObiekt);

//forms opis
router.get('/opis/add', OpisController.addOpisPage);
router.post('/opis/insert', OpisController.insertOpis);
router.get('/opis/details/:opisId' , OpisController.detailsOpis);
router.get('/opis/edit/:opisId', OpisController.editOpisPage);
router.post('/opis/update', OpisController.updateOpis);
router.get('/opis/delete/:opisId', OpisController.deleteOpis);
router.get('/opis/revive/:opisId', OpisController.reviveOpis);

//form obiekt_opisowy

router.get('/obiekt_opisowy/add', Obiekt_opisowyController.addObiektOpisowyPage);
router.post('/obiekt_opisowy/insert', Obiekt_opisowyController.insertObiektOpisowy);
router.get('/obiekt_opisowy/delete/:opisId/:obiektId', Obiekt_opisowyController.deleteObiektOpisowy);
router.get('/obiekt_opisowy/details/:opisId/:obiektId', Obiekt_opisowyController.obiektOpisowyDetails)

//API
router.get('/getObiektyFromTemat/:tematId', API_Controller.ObiektyTematuAPI);
router.get('/getOpisyFromObiekt/:obiektId', API_Controller.getOpisyFromObiektAPI)
router.get('/getWarstwyNotInTemat/:tematId', API_Controller.getWarstwyNotInTematAPI);
router.get('/getOpisyNotInObiekt/:obiektId', API_Controller.getOpisyNotInObiektAPI)


module.exports = router;