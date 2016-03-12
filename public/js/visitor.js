/**
 * Created by Darmadoo on 2/16/16.
 */

function init(){
    document.getElementById('searchForm').style.marginRight = "15px";
    _bindSearch();
}

function updateTime(){
    var t_str = getTime();
    document.getElementById('time_span').innerHTML = t_str;
    document.getElementById('time_span').style.marginTop = "0px";
}

function getTime(){
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    var what = false;
    if (seconds < 10){
        seconds = "0" + seconds
    }
    if (minutes < 10){
        minutes = "0" + minutes
    }
    if(hours > 12){
        hours -= 12;
        what = true;
    }
    var t_str = hours + ":" + minutes + ":" + seconds + " ";
    if(what){
        t_str += "PM";
    } else {
        t_str += "AM";
    }

    return t_str;
}

setInterval(updateTime, 1000);

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
    var id = this.closest('ul').id;
    var res = id.split("-");
    var str = res[0] + "_dropdown";
    $('#' + str).text(group);
});

$(".button-green").click(function() {
    var id = this.id;
    var res = id.split("-");
    var str = res[0] + "-status";
    $(this).fadeOut(onceDone(res));
    var time = getTime();
    $("#" + str).text(time);
});

function onceDone(str){
    $("#" + str[0] + "-button").remove();
    var one = '<button class="button button-3d button-mini button-rounded button-red"';
    var two = ' id="' + str[0] + '-button">Check Out</button>';
    var inner = one + two;
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

var count = 1;
var flag = false;

$(document).ready(init());


