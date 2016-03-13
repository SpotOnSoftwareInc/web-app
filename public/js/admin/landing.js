jQuery(document).ready(function($){
    swiperSlider = new Swiper('.swiper-parent',{
        paginationClickable: false,
        slidesPerView: 1,
        grabCursor: true,
        onSwiperCreated: function(swiper){
            $('[data-caption-animate]').each(function(){
                var $toAnimateElement = $(this);
                var toAnimateDelay = $(this).attr('data-caption-delay');
                var toAnimateDelayTime = 0;
                if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ) + 750; } else { toAnimateDelayTime = 750; }
                if( !$toAnimateElement.hasClass('animated') ) {
                    $toAnimateElement.addClass('not-animated');
                    var elementAnimation = $toAnimateElement.attr('data-caption-animate');
                    setTimeout(function() {
                        $toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
                    }, toAnimateDelayTime);
                }
            });
            SEMICOLON.slider.swiperSliderMenu();
        },
        onSlideChangeStart: function(swiper){
            $('#slide-number-current').html(swiper.activeIndex + 1);
            $('[data-caption-animate]').each(function(){
                var $toAnimateElement = $(this);
                var elementAnimation = $toAnimateElement.attr('data-caption-animate');
                $toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated');
            });
            SEMICOLON.slider.swiperSliderMenu();
        },
        onSlideChangeEnd: function(swiper){
            $('#slider').find('.swiper-slide').each(function(){
                if($(this).find('video').length > 0) { $(this).find('video').get(0).pause(); }
            });
            $('#slider').find('.swiper-slide:not(".swiper-slide-active")').each(function(){
                if($(this).find('video').length > 0) {
                    if($(this).find('video').get(0).currentTime != 0 ) $(this).find('video').get(0).currentTime = 0;
                }
            });
            if( $('#slider').find('.swiper-slide.swiper-slide-active').find('video').length > 0 ) { $('#slider').find('.swiper-slide.swiper-slide-active').find('video').get(0).play(); }

            $('#slider .swiper-slide.swiper-slide-active [data-caption-animate]').each(function(){
                var $toAnimateElement = $(this);
                var toAnimateDelay = $(this).attr('data-caption-delay');
                var toAnimateDelayTime = 0;
                if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ) + 300; } else { toAnimateDelayTime = 300; }
                if( !$toAnimateElement.hasClass('animated') ) {
                    $toAnimateElement.addClass('not-animated');
                    var elementAnimation = $toAnimateElement.attr('data-caption-animate');
                    setTimeout(function() {
                        $toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
                    }, toAnimateDelayTime);
                }
            });
        }
    });

    $('#slider-arrow-left').on('click', function(e){
        e.preventDefault();
        swiperSlider.swipePrev();
    });

    $('#slider-arrow-right').on('click', function(e){
        e.preventDefault();
        swiperSlider.swipeNext();
    });

    $('#slide-number-current').html(swiperSlider.activeIndex + 1);
    $('#slide-number-total').html(swiperSlider.slides.length);
});

// reporting
jQuery(window).load( function(){
    var lineChartData = {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
            {
                fillColor : "rgba(255,51,255,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                data : [65,59,90,81,56,55,40]
            },
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                data : [28,48,40,19,96,27,100]
            }
        ]
    };

    var globalGraphSettings = {animation : Modernizr.canvas};

    function showLineChart(){
        var ctx = document.getElementById("lineChartCanvas").getContext("2d");
        new Chart(ctx).Line(lineChartData,globalGraphSettings);
    }

    $('#lineChart').appear( function(){ $(this).css({ opacity: 1 });
        setTimeout(showLineChart,300); },{accX: 0, accY: -155},'easeInCubic');
});

/**
 * Created by sean on 3/8/2016.
 */
// Check browser support
//$("#landing-register").click(function(){
//   testJS();
//});
window.onload = function() {
    if (localStorage) {
        document.getElementById('landing-form').addEventListener('submit', function () {
            var name = document.getElementById("landing-name").value;
            var companyName = document.getElementById("landing-companyName").value;
            var email = document.getElementById("landing-email").value;
            console.log(name);
            var nameArr = name.split(' ');
            var fname = nameArr[0];
            var lname = nameArr[1];
                console.log(fname);
                console.log(lname);
                console.log(companyName);
                console.log(email);
            // Store
            localStorage.setItem("fname", fname);
            localStorage.setItem("lname", lname);
            localStorage.setItem("companyName", companyName);
            localStorage.setItem("email", email);
        });
    }
}
//
//function testJS() {
//    var b = document.getElementById('name').value,
//        url = 'http://localhost:4000/register.html?name=' + encodeURIComponent(b);
//
//    document.location.href = url;
//}

//localStorage.setItem("fname", fname);
//localStorage.setItem("lname", lname);
//localStorage.setItem("companyName", companyName);
//localStorage.setItem("email", email);


        // Retrieve
