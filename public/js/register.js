/**
 * Created by sean on 3/8/2016.
 */
window.onload = function() {
    //console.log(localStorage.getItem('fname'));
    //console.log(localStorage.getItem('lname'));
    //console.log(localStorage.getItem('companyName'));
    //console.log(localStorage.getItem('email'));
    //if(document.getElementById('register-form-firstname') != null){
    console.log(localStorage.getItem('fname'));
    console.log(localStorage.getItem('lname'));
    console.log(localStorage.getItem('companyName'));
    console.log(localStorage.getItem('email'));
    document.getElementById('register-form-fname').value = localStorage.getItem('fname');
    //}
    document.getElementById('register-form-lname').value = localStorage.getItem('lname');
    document.getElementById('register-form-companyName').value = localStorage.getItem('companyName');
    document.getElementById('register-form-email').value = localStorage.getItem('email');

}

//
//window.addEventListener('storage', function(e) {
//    document.querySelector('.form-control').textContent = e.key;
//    document.querySelector('.form-control').textContent = e.oldValue;
//    document.querySelector('.my-new').textContent = e.newValue;
//    document.querySelector('.my-url').textContent = e.url;
//    document.querySelector('.my-storage').textContent = e.storageArea;
//});
//window.onload = function () {
//    var url = document.location.href,
//        params = url.split('?')[1].split('&'),
//        data = {}, tmp;
//    for (var i = 0, l = params.length; i < l; i++) {
//        tmp = params[i].split('=');
//        data[tmp[0]] = tmp[1];
//    }
//    document.getElementById('register-form-fname').innerHTML = data.name;
//}
