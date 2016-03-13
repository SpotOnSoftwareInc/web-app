
    !function(a,b){a("Keen","https://d26b395fwzu5fz.cloudfront.net/3.4.0/keen.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},c[a].ready=function(b){c["_"+a].ready=c["_"+a].ready||[],c["_"+a].ready.push(b)},d=["addEvent","setGlobalProperties","trackExternalLink","on"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);




        jQuery("#quick-contact-form").validate({
            submitHandler: function(form) {
                jQuery(form).find('.form-process').fadeIn();
                jQuery(form).ajaxSubmit({
                    target: '#quick-contact-form-result',
                    success: function() {
                        jQuery(form).find('.form-process').fadeOut();
                        jQuery(form).find('.sm-form-control').val('');
                        jQuery('#quick-contact-form-result').attr('data-notify-msg', jQuery('#quick-contact-form-result').html()).html('');
                        SEMICOLON.widget.notifications(jQuery('#quick-contact-form-result'));
                    }
                });
            }
        });
