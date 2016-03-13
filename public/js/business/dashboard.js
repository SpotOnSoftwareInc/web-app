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


jQuery(document).ready(function($) {
    'use strict';
    var template = document.getElementById('form-builder-template'),
        formContainer = document.getElementById('rendered-form'),
        renderBtn = document.getElementById('render-form-button');
    $(template).formBuilder();

    $(renderBtn).click(function(e) {
        e.preventDefault();
        $(template).formRender({
            container: $(formContainer)
        });
    });

});


    !function(a,b){a("Keen","https://d26b395fwzu5fz.cloudfront.net/3.4.0/keen.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},c[a].ready=function(b){c["_"+a].ready=c["_"+a].ready||[],c["_"+a].ready.push(b)},d=["addEvent","setGlobalProperties","trackExternalLink","on"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);


    stLight.options({
        publisher: "ee8fc1cb-2a3e-4afc-9a71-a24d14fb9f86",
        doNotHash: false,
        doNotCopy: false,
        hashAddressBar: false
    });