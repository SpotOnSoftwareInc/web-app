
    !function(a,b){a("Keen","https://d26b395fwzu5fz.cloudfront.net/3.4.0/keen.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},c[a].ready=function(b){c["_"+a].ready=c["_"+a].ready||[],c["_"+a].ready.push(b)},d=["addEvent","setGlobalProperties","trackExternalLink","on"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#thumb')
                    .attr('src', e.target.result)
                    .width(300)
                    .height(200);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
//                function chooseFile() {
//                    $("#fileInput").click();
//                }



    $(function() {
        $( "#processTabs" ).tabs({ show: { effect: "fade", duration: 400 } });
        $( ".tab-linker" ).click(function() {
            $( "#processTabs" ).tabs("option", "active", $(this).attr('rel') - 1);
            return false;
        });
    });
    jQuery(document).ready(function($) {
        'use strict';
        var template = document.getElementById('form-builder-template');
        $(template).formBuilder();
    });


