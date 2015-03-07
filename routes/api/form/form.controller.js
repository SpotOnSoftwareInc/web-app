/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /users              ->  index
 * POST    /users              ->  create
 * GET     /users/:id          ->  show
 * PUT     /users/:id          ->  update
 * DELETE  /users/:id          ->  destroy
 */

'use strict';

var _ = require('underscore');

// Request a form
exports.show = function (req, res, next) {
    // grab our db object from the request

    var db = req.db;
    var forms = db.get('forms');

    var business = forms.id(req.mobileToken.business);

    forms.find({'_id': req.params.id, 'business': business}, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.sendStatus(404);
        }// res.send is deprecated
        return res.json(doc);
    });
};

// Create a form
exports.createForm = function (req, res, next) {

    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    // query to create entry in collection
    forms.insert(req.body, function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(201, doc);
    });
};

// Create a formResponse
exports.createResponse = function (req, res, next) {

    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    if (!req.mobileToken.business) {
        return res.status(500).send('The mobileToken not set!');
    }

    var businessId = req.mobileToken.business;

    forms.find({business: forms.id(businessId)}, function (err, results) {
        if (err) {
            return next(err);
        }

        var form = results[0];

        var formList = [];
        _.each(form.fields, function (value) {
            formList.push(value.label);
        });

        var responseList = [];
        _.each(req.body.answers, function (value) {
            responseList.push(value.label);
        });

        var unionList = _.union(_.difference(formList, responseList), _.difference(responseList, formList));
        if (unionList.length > 0) {
            return res.status(400).send('Malformed Requests, fields from formResponse is different from the actual form.');
        } else {
            var formResponses = db.get('formResponses');
            var formResponse = {
                answers: []
            };

            _.each(form.fields, function (field, index) {
                formResponse.answers.push({
                    label: field.label,
                    response: req.body.answers[index].response
                });
            });
            formResponses.insert(formResponse, function (err, data) {
                if (err) {
                    return next(err);
                }
                return res.json(200, data);
            });
        }
    });
};