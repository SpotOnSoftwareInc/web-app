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


    !function(a,b){a("Keen","https://d26b395fwzu5fz.cloudfront.net/3.4.0/keen.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},c[a].ready=function(b){c["_"+a].ready=c["_"+a].ready||[],c["_"+a].ready.push(b)},d=["addEvent","setGlobalProperties","trackExternalLink","on"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
