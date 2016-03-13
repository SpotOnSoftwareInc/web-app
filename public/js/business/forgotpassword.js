
    $("#template-contactform").validate({
        submitHandler: function(form) {
            $('.form-process').fadeIn();
            $(form).ajaxSubmit({
                target: '#contact-form-result',
                success: function() {
                    $('.form-process').fadeOut();
                    $('#template-contactform').find('.sm-form-control').val('');
                    $('#contact-form-result').attr('data-notify-msg', $('#contact-form-result').html()).html('');
                    SEMICOLON.widget.notifications($('#contact-form-result'));
                }
            });
        }
    });



        $("#template-contactform").validate({
            submitHandler: function(form) {
                $('.form-process').fadeIn();
                $(form).ajaxSubmit({
                    target: '#contact-form-result',
                    success: function() {
                        $('.form-process').fadeOut();
                        $('#template-contactform').find('.sm-form-control').val('');
                        $('#contact-form-result').attr('data-notify-msg', $('#contact-form-result').html()).html('');
                        SEMICOLON.widget.notifications($('#contact-form-result'));
                    }
                });
            }
        });
