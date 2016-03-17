var auth = require('../../../lib/auth');
var Keen = require("keen-js");


exports.get = function (req, res) {
    console.log('Get function dashboard');
    var keenClient = new Keen({
        projectId: "56d9241090e4bd6b6a39c7f0", // String (required always)
        writeKey: "80eeef9d584cd35dc2c70785b0b55d3bb55255b1e0f9734a5351f5c9bbc0c609041fd912891e4a0198ec9624a995c3997ef8475b16c8883481b44ff74e6505f8aedb056c910af2732eef1d53435ca42b17c265ddfd06dbb1193b9ac9345434d3", // String (required for sending)
        readKey: "07272285601cf3434496fb641854e9c377b292c3c71a6b8d47a6dd0130d20bae5d72653b454acdf92748e661c3d20956385b423fed6fc7f890e8816148fbe45b1012330967027675d998d3653d1f890ac796036dddbc48e4dc553a8f491ca70c"      // String (required for querying)
    });

    var database = req.db;
    var employeeDB = database.get('employees'),
        businessDB = database.get('businesses'),
        bid = req.user[0].business;
    console.log("also find business owner ID lol");

    //employeeDB.find( { business: bid , password: { $ne: '' } })
    employeeDB.find({business: bid})
        .on('success', function (employees) {
                console.log(req.user[0]);

                //var startDateObject = new Date();
                //var startTime = startDateObject.getTime();

                //var endDateObject = new Date();
                //var endTime = endDateObject.getTime();
                //var timeSpent =  endTime - startTime;


                businessDB.findById(bid)
                    .on('success', function (business) {

                        console.log(business);
                        var newBusiness = {
                            businessID: business._id,
                            billingPlan: business.billingPlan,
                            companyName: business.companyName,
                            walkins: business.walkins
                        };
// This sends the above data to Keen and records it as an event.
                        keenClient.addEvent("newBusiness", newBusiness);

                        res.render('business/dashboard', {
                            emps: employees,
                            emailz: req.user[0].email,
                            phone: req.user[0].phone,
                            logo: '../' + business.logo,
                            message: req.flash("permission")
                        });

                    });

// This builds a query that when executed will get the average time spent in the last hour from the "time_spent" collection.

                //timeFrame how long you want to track the data


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
