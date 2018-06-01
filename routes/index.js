const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(appController.getApiData), appController.renderMain);

module.exports = router;