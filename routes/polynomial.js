const express = require('express');
const router = express.Router();
const polynomialController = require('../controllers/polynomialController');

router.get('/', polynomialController.showForm);
router.post('/variables', polynomialController.detectVariables);
router.post('/solve', polynomialController.solveExpression);

module.exports = router;
