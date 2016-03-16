/**
 * Created by Darmadoo on 2/16/16.
 */

function init(){
    _bindSearch();
    updateStatus();
}

function updateStatus(){
    for(var i = 0; i < $(".state").length; i++){
        var curr = $(".state")[i];
        // the current user id
        var id = (curr.id).split("-")[1];
        var button = id + "-button";

        var curState = curr.innerHTML;

        // TODO KURT - Change the Appointment Made to being checked in status
        if(curState == "waiting"){
            console.log(id);
            $("#" + button).remove();
            var zero = '<form id="formVis" method="post" action="" enctype="application/x-www-form-urlencoded">';
            var one = '<input type="hidden" name="callingFunc" value="sendToProvider">';
            var two = '<input type="hidden" name="vid" value="' + id + '">';
            var three = '<button name="visitorName" type="submit" class="button button-3d button-mini button-rounded button-green" value=' + id;
            var four = ' id="' + id + '-button">Send To Provider</button></form>';
            var inner = zero + one + two + three + four;
            $("#button-row-" + id).append(inner);
        }
        if(curState == "Appointment Made" || curState == "Checked in"){
            $("#" + button).remove();
            var zero = '<form id="formVis" method="post" action="deleteVisitor" enctype="application/x-www-form-urlencoded">';
            var one = '<button name="visitorName" type="submit" class="button button-3d button-mini button-rounded button-red" value=' + id;
            if(curState == "Checked in"){
                var two = ' id="' + id + '-button">Check Out</button></form>';
            }
            else {
                var two = ' id="' + id + '-button">Delete Appointment</button></form>';
            }
            var inner = zero  + one + two;
            $("#button-row-" + id).append(inner);

            $("#button-row-" + id).on("click", ".button-red", function() {
                console.log("THIS COMMING UPP");
                console.log(this);
                var id = this.id;
                var res = id.split("-");
                var tar = "tr-" + res[0];
                $("#" + tar).fadeOut(600, function(){
                    getTimeDiff(res[0]);
                    $("#" + tar).remove();
                });
            });
        }

    }
};

// Binding the search function
_bindSearch = function(){
    $('#search').click(function() {
            document.getElementById("search").value = "";
            $.each($("#all").find("tr"), function() {
                $(this).show();
            });
        })
        // Enable searaching inside the modal popup
        .keyup(function () {
            _this = this;
            // Show only matching TR, hide rest of them
            $.each($("#all").find("tr"), function() {
                if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1)
                    $(this).hide();
                else
                    $(this).show();
            });
        });
};

// Interval to constantly refresh the page for the time to change
setInterval(updateTime, 1000);

// Function to update the current time
function updateTime(){
    // Update the time
    document.getElementById('time_span').innerHTML = getTime();
}

// Function to get the current time
function getTime(){
    //
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var isNoon = false;

    if (seconds < 10){
        seconds = "0" + seconds
    }
    if (minutes < 10){
        minutes = "0" + minutes
    }

    if(hours > 12){
        hours -= 12;
        isNoon = true;
    }
    var t_str = hours + ":" + minutes + ":" + seconds + " ";
    if(isNoon){
        t_str += "PM";
    } else {
        t_str += "AM";
    }

    return t_str;
}

$('.name').click(function(){
    var name = $(this).text();
    $(this).html('');
    $('<input>')
        .attr({
            'type': 'text',
            'name': 'fname',
            'id': 'txt_fullname',
            'size': '15',
            'value': name
        })
        .appendTo(this);
    $('#txt_fullname').focus();
});

$(document).on('blur','#txt_fullname', function(){
    var parent = this.closest('.name');
    var name = $(this).val();
    $("#" + parent.id).text(name);
});

$(".dropdown-menu-right a").click(function() {
    var group = $(this).text();
    var temp = this.closest(".dropdown").id;
    var arr = temp.split("-");
    $('.dropdown-' + arr[1]).text(group);
});

$(".button-green").click(function() {
    var id = this.id;
    var res = id.split("-");
    var str = res[0] + "-status";
    $(this).fadeOut(onceDone(res));
    var time = getTime();
    // TODO KURT
    // Post the current time to the checkInTime variable
    $("#" + str).text(time);
});

function onceDone(str){
    console.log("#" + str[0] + "-button");
    $("#" + str[0] + "-button").remove();
    var zero = '<form id="formVis" method="post" action="deleteVisitor" enctype="application/x-www-form-urlencoded">';
    var one = '<button name="visitorName" type="submit" class="button button-3d button-mini button-rounded button-red" value=' + str[0];
    var two = ' id="' + str[0] + '-button">Check Out</button></form>';
    var inner = zero  + one + two;
    $("#button-row-" + str[0]).append(inner);

    $("#button-row-" + str[0]).on("click", ".button-red", function() {
        var id = this.id;
        var res = id.split("-");
        var tar = "tr-" + res[0];
        $("#" + tar).fadeOut(600, function(){
            getTimeDiff(res[0]);
            $("#" + tar).remove();
        });
    });
}

// Global variables for keeping track of average
var count = 1;
var flag = false;

function getTimeDiff(time){
    var countHr = $(".hr").text();
    var countMin = $(".min").text();
    var countSec = $(".sec").text();

    var temp = $("#" + time + "-status").text();
    var split = temp.split(":");
    var hr = split[0];
    var min = split[1];
    var cut = split[2].split(" ");
    var sec = cut[0];

    var currentTime = new Date();
    var curHr = currentTime.getHours();
    var curMin = currentTime.getMinutes();
    var curSec = currentTime.getSeconds();


    var secDiff;
    if(curSec - sec < 0){
        sec = 60 - sec;
        secDiff = curSec + sec;
        flag = true;
    }
    else{
        secDiff = curSec - sec;
    }

    var minDiff;
    if(flag){
        if(curMin - min < 0){
            min = 60 - min;
            minDiff = curMin + min - 1;
        }
        else{
            minDiff = curMin - min - 1;
        }
    }
    else{
        if(curMin - min < 0){
            min = 60 - min;
            minDiff = curMin + min;
        }
        else{
            minDiff = curMin - min;
        }
    }

    if(curHr > 12){
        curHr -= 12;
    }
    var hrDiff = curHr - hr;

    var finSec = getAvg(countSec, secDiff);
    var finMin = getAvg(countMin, minDiff);
    var finHr = getAvg(countHr, hrDiff);
    count++;

    $(".hr").text(finHr);
    $(".min").text(finMin);
    $(".sec").text(finSec);
}

function getAvg(old, cur){
    var total = 1 * old + cur;
    var avg = Math.floor(total/count);

    if(avg < 0){
        avg = 0;
    }
    return avg;
}

$(document).ready(init());


