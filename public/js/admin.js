/**
 * Created by sean on 3/17/2016.
 */
//var Keen = require("keen-js");
////
//var client = new Keen({
//    projectId: "56d8ada66f31a21ff3cdf3fe", // String (required always)
//    writeKey: "3fbb21b09ead3c8385954e5f55014437e0ec8e7f1d63a39fe2ea98f8f857b68fc48d364d51e466e0700ad5b4bde78d173bc9780d8ab04a9400f2b7a7d63803911525ea41af7e835de8b9771a8d9c92efda4f36d52073c32736d6e43fa7b094fb", // String (required for sending)
//    readKey: "98ce462342fedd3711bdf057a830e24e76bf6b5251cefc7b015bccfb21e674fd7487ee2883a49acd70cf4691bfa1c66adc3e0fd886459645233f0aa10ce59317ae9104b16443383728475d96863438074baac8dafa53aef7b39887c6d4805e47"      // String (required for querying)
//});


//var metric = new Keen.Query("newBusiness", {
//    analysisType: "count",
//    timeframe: "this_1_month"
//});
//
//client.draw(metric, document.getElementById("newBusiness-count-chart"), {
//    chartType: "metric",
//    label: "Count of Businesses"
//});

//Keen.ready(function(){
//
//
//    var metric = new Keen.Query("newBusiness", {
//        analysisType: "count",
//        timeframe: "this_1_month"
//    });
//
//    client.draw(metric, document.getElementById("newBusiness-count-chart"), {
//        chartType: "metric",
//        label: "Count of Businesses"
//    });
//    // ----------------------------------------
//    // Pageviews Area Chart
//    // ----------------------------------------
//    //var pageviews_timeline = new Keen.Query("count", {
//    //    eventCollection: "pageviews",
//    //    interval: "hourly",
//    //    groupBy: "user.device_info.browser.family",
//    //    timeframe: {
//    //        start: "2014-05-04T00:00:00.000Z",
//    //        end: "2014-05-05T00:00:00.000Z"
//    //    }
//    //});
//    //client.draw(pageviews_timeline, document.getElementById("chart-01"), {
//    //    chartType: "areachart",
//    //    title: false,
//    //    height: 250,
//    //    width: "auto",
//    //    chartOptions: {
//    //        chartArea: {
//    //            height: "85%",
//    //            left: "5%",
//    //            top: "5%",
//    //            width: "80%"
//    //        },
//    //        isStacked: true
//    //    }
//    //});
//    //
//    //
//    //// ----------------------------------------
//    //// Pageviews Pie Chart
//    //// ----------------------------------------
//    //var pageviews_static = new Keen.Query("count", {
//    //    eventCollection: "pageviews",
//    //    groupBy: "user.device_info.browser.family",
//    //    timeframe: {
//    //        start: "2014-05-01T00:00:00.000Z",
//    //        end: "2014-05-05T00:00:00.000Z"
//    //    }
//    //});
//    //client.draw(pageviews_static, document.getElementById("chart-02"), {
//    //    chartType: "piechart",
//    //    title: false,
//    //    height: 250,
//    //    width: "auto",
//    //    chartOptions: {
//    //        chartArea: {
//    //            height: "85%",
//    //            left: "5%",
//    //            top: "5%",
//    //            width: "100%"
//    //        },
//    //        pieHole: .4
//    //    }
//    //});
//    //
//    //
//    //// ----------------------------------------
//    //// Impressions timeline
//    //// ----------------------------------------
//    //var impressions_timeline = new Keen.Query("count", {
//    //    eventCollection: "impressions",
//    //    groupBy: "ad.advertiser",
//    //    interval: "hourly",
//    //    timeframe: {
//    //        start: "2014-05-04T00:00:00.000Z",
//    //        end: "2014-05-05T00:00:00.000Z"
//    //    }
//    //});
//    //client.draw(impressions_timeline, document.getElementById("chart-03"), {
//    //    chartType: "columnchart",
//    //    title: false,
//    //    height: 250,
//    //    width: "auto",
//    //    chartOptions: {
//    //        chartArea: {
//    //            height: "75%",
//    //            left: "10%",
//    //            top: "5%",
//    //            width: "60%"
//    //        },
//    //        bar: {
//    //            groupWidth: "85%"
//    //        },
//    //        isStacked: true
//    //    }
//    //});
//    //
//    //
//    //// ----------------------------------------
//    //// Impressions timeline (device)
//    //// ----------------------------------------
//    //var impressions_timeline_by_device = new Keen.Query("count", {
//    //    eventCollection: "impressions",
//    //    groupBy: "user.device_info.device.family",
//    //    interval: "hourly",
//    //    timeframe: {
//    //        start: "2014-05-04T00:00:00.000Z",
//    //        end: "2014-05-05T00:00:00.000Z"
//    //    }
//    //});
//    //client.draw(impressions_timeline_by_device, document.getElementById("chart-04"), {
//    //    chartType: "columnchart",
//    //    title: false,
//    //    height: 250,
//    //    width: "auto",
//    //    chartOptions: {
//    //        chartArea: {
//    //            height: "75%",
//    //            left: "10%",
//    //            top: "5%",
//    //            width: "60%"
//    //        },
//    //        bar: {
//    //            groupWidth: "85%"
//    //        },
//    //        isStacked: true
//    //    }
//    //});
//    //
//    //
//    //// ----------------------------------------
//    //// Impressions timeline (country)
//    //// ----------------------------------------
//    //var impressions_timeline_by_country = new Keen.Query("count", {
//    //    eventCollection: "impressions",
//    //    groupBy: "user.geo_info.country",
//    //    interval: "hourly",
//    //    timeframe: {
//    //        start: "2014-05-04T00:00:00.000Z",
//    //        end: "2014-05-05T00:00:00.000Z"
//    //    }
//    //});
//    //client.draw(impressions_timeline_by_country, document.getElementById("chart-05"), {
//    //    chartType: "columnchart",
//    //    title: false,
//    //    height: 250,
//    //    width: "auto",
//    //    chartOptions: {
//    //        chartArea: {
//    //            height: "75%",
//    //            left: "10%",
//    //            top: "5%",
//    //            width: "60%"
//    //        },
//    //        bar: {
//    //            groupWidth: "85%"
//    //        },
//    //        isStacked: true
//    //    }
//    //});
//
//
//});
