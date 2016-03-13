$(document).ready(function(){
    $('#button1').click(function(){
        var nameVal = document.getElementById('text1').value;
        var phoneVal = document.getElementById('text2').value;
        var webhookURL = 'https://hooks.slack.com/services/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'
        var dd = {text: "A new customer [" + nameVal + "] with phone number: [" + phoneVal + "] just checked in!"}
        $.ajax({
            url: webhookURL,
            type: 'POST',
            data: JSON.stringify(dd),
            success: function(e){
                console.log("success", e)
            }
        });
    });
});