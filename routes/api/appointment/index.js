'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();
var auth = require('../../../lib/auth');

// Confirm Identity
// /api/m/appointment?fname=John&lname="Doe"&dob="05/13/1965"
router.get('/', controller.confirm);

// Retrieve Appointment Information
// /api/appointment/:id/
router.get('/:id', auth.isAuthenticated, controller.retrieve);

// Sign Disclosure Agreements
// /api/appointments/:id
router.post('/:id', auth.isAuthenticated, controller.sign);

module.exports = router;
