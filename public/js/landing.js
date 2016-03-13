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
