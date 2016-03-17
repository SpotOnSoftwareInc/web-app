
var keenClient = new Keen({
    projectId: "56d8ada66f31a21ff3cdf3fe", // String (required always)
    writeKey: "3fbb21b09ead3c8385954e5f55014437e0ec8e7f1d63a39fe2ea98f8f857b68fc48d364d51e466e0700ad5b4bde78d173bc9780d8ab04a9400f2b7a7d63803911525ea41af7e835de8b9771a8d9c92efda4f36d52073c32736d6e43fa7b094fb", // String (required for sending)
    readKey: "98ce462342fedd3711bdf057a830e24e76bf6b5251cefc7b015bccfb21e674fd7487ee2883a49acd70cf4691bfa1c66adc3e0fd886459645233f0aa10ce59317ae9104b16443383728475d96863438074baac8dafa53aef7b39887c6d4805e47"      // String (required for querying)
})

var startDateObject = new Date();
var startTime = startDateObject.getTime();



window.onbeforeunload = function (event) {
    var endDateObject = new Date();
    var endTime = endDateObject.getTime();
    var timeSpent =  endTime - startTime;

    var timeSpentOnPage = {
        timeSpent: timeSpent,
        user: {
            id: "39",
            name: "Ellie Day"
        },
        page_title: "Home"
    }
// This sends the above data to Keen and records it as an event.
    keenClient.addEvent("tiga_spent", timeSpentOnPage);


}

// This builds a query that when executed will get the average time spent in the last hour from the "time_spent" collection.
var metric = new Keen.Query("tiga_spent", {
    analysisType: "average",
    targetProperty: "tigaSpent",
    timeframe: "this_1_hours"
});
// This executes the query and charts a simple metric using Keen's charting library.
keenClient.draw(metric, document.getElementById("time-spent-chart"), {
    chartType: "metric",
    label: "Average Time Spent"
});

/**
 * Created by sean on 3/8/2016.
 */
window.onload = function() {

    document.getElementById('register-form-fname').value = localStorage.getItem('fname');
    document.getElementById('register-form-lname').value = localStorage.getItem('lname');
    document.getElementById('register-form-companyName').value = localStorage.getItem('companyName');
    document.getElementById('register-form-email').value = localStorage.getItem('email');
    $("#ui-id-2").click();
};
