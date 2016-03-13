     !function(a,b){a("Keen","https://d26b395fwzu5fz.cloudfront.net/3.4.0/keen.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},c[a].ready=function(b){c["_"+a].ready=c["_"+a].ready||[],c["_"+a].ready.push(b)},d=["addEvent","setGlobalProperties","trackExternalLink","on"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);


     jQuery(window).load(function(){

         var $container = $('#portfolio');

         $container.isotope({ transitionDuration: '0.65s' });

         $('#portfolio-filter a').click(function(){
             $('#portfolio-filter li').removeClass('activeFilter');
             $(this).parent('li').addClass('activeFilter');
             var selector = $(this).attr('data-filter');
             $container.isotope({ filter: selector });
             return false;
         });

         $('#portfolio-shuffle').click(function(){
             $container.isotope('updateSortData').isotope({
                 sortBy: 'random'
             });
         });

         $(window).resize(function() {
             $container.isotope('layout');
         });

     });
