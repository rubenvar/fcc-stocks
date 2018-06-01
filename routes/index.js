const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/',
  catchErrors(appController.getSymbols),
  catchErrors(appController.getApiData),
  appController.renderMain
);

router.post('/add-stock', catchErrors(appController.addStock));

module.exports = router;