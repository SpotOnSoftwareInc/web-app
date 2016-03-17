var auth = require('../../../lib/auth');
var Keen = require("keen-js");


exports.get = function (req, res) {
    console.log('Get function dashboard');
    var keenClient = new Keen({
        projectId: "56d8ada66f31a21ff3cdf3fe", // String (required always)
        writeKey: "3fbb21b09ead3c8385954e5f55014437e0ec8e7f1d63a39fe2ea98f8f857b68fc48d364d51e466e0700ad5b4bde78d173bc9780d8ab04a9400f2b7a7d63803911525ea41af7e835de8b9771a8d9c92efda4f36d52073c32736d6e43fa7b094fb", // String (required for sending)
        readKey: "98ce462342fedd3711bdf057a830e24e76bf6b5251cefc7b015bccfb21e674fd7487ee2883a49acd70cf4691bfa1c66adc3e0fd886459645233f0aa10ce59317ae9104b16443383728475d96863438074baac8dafa53aef7b39887c6d4805e47"      // String (required for querying)
    });

    var database = req.db;
    var employeeDB = database.get('employees'),
        businessDB = database.get('businesses'),
        bid = req.user[0].business;
    console.log("also find business owner ID lol");

    //employeeDB.find( { business: bid , password: { $ne: '' } })
    employeeDB.find( { business: bid  })
        .on('success', function(employees) {
            console.log(req.user[0]);

            //var startDateObject = new Date();
            //var startTime = startDateObject.getTime();

            //var endDateObject = new Date();
            //var endTime = endDateObject.getTime();
            //var timeSpent =  endTime - startTime;



            businessDB.findById(bid)
                .on('success', function(business) {

                    var newBusiness = {
                        businessID: bid,
                        billingPlan: business.billingPlan,
                        companyName: business.companyName,
                        walkins: business.walkins
                    };
// This sends the above data to Keen and records it as an event.
                    keenClient.addEvent("newBusiness", newBusiness);

                });

// This builds a query that when executed will get the average time spent in the last hour from the "time_spent" collection.

            //timeFrame how long you want to track the data

                res.render('business/dashboard', {
                            emps: employees,
                            emailz: req.user[0].email,
                            phone: req.user[0].phone,
                            logo: '../' + business.logo,
                            message: req.flash("permission")
                        });
                    }
                )

        };

//exports.getLogo

exports.post = function (req, res) {
    console.log("Post Function for dashboard page ");

    var bid = req.user[0].business;
    var myFunction = req.body.callingFunc;


    if(myFunction == 'saveForm'){
        console.log('SAVE DATA FROM FORM');
        console.log(req.body.saveData);
        res.redirect('../'+ bid +'/dashboard#Manage-Theme');
    }

    if(myFunction == 'removeEmployee'){
        var employeeDB = req.db.get('employees');
        var eid = req.body.empID.toString();

        //Remove that employee
        console.log("REMOVING EMPLOYEE");
        employeeDB.remove({_id: eid});
        res.redirect('../'+ bid +'/dashboard');

    }
    // Re-render all the remaining emps


};
