//$.getJSON( req.bod, function( data ) {
//    var items = [];
//    $.each( data, function( key, val ) {
//        items.push( "<li id='" + key + "'>" + val + "</li>" );
//    });
//
//    $( "<ul/>", {
//        "class": "my-new-list",
//        html: items.join( "" )
//    }).appendTo( "body" );
//});
// This executes the query and charts a simple metric using Keen's charting library.
var Keen = require("keen-js");

var keenClient = new Keen({
    projectId: "56d8ada66f31a21ff3cdf3fe", // String (required always)
    writeKey: "3fbb21b09ead3c8385954e5f55014437e0ec8e7f1d63a39fe2ea98f8f857b68fc48d364d51e466e0700ad5b4bde78d173bc9780d8ab04a9400f2b7a7d63803911525ea41af7e835de8b9771a8d9c92efda4f36d52073c32736d6e43fa7b094fb", // String (required for sending)
    readKey: "98ce462342fedd3711bdf057a830e24e76bf6b5251cefc7b015bccfb21e674fd7487ee2883a49acd70cf4691bfa1c66adc3e0fd886459645233f0aa10ce59317ae9104b16443383728475d96863438074baac8dafa53aef7b39887c6d4805e47"      // String (required for querying)
});


var metric = new Keen.Query("newBusiness", {
    analysisType: "count",
    timeframe: "this_1_month"
});

keenClient.draw(metric, document.getElementById("newBusiness-count-chart"), {
    chartType: "metric",
    label: "Count of Businesses"
});
