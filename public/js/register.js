/**
 * Created by sean on 3/8/2016.
 */
window.onload = function() {

    document.getElementById('register-form-fname').value = localStorage.getItem('fname');
    document.getElementById('register-form-lname').value = localStorage.getItem('lname');
    document.getElementById('register-form-companyName').value = localStorage.getItem('companyName');
    document.getElementById('register-form-email').value = localStorage.getItem('email');

    if( localStorage.getItem('fname') ) {
        $("#ui-id-2").click();
    }
    else {
        $("#ui-id-1").click();
    }

    localStorage.clear();
};
