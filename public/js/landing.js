/**
 * Created by sean on 3/8/2016.
 */
// Check browser support
window.onload = function () {

    if (localStorage) {

        document.getElementById('landing-form').addEventListener('submit', function () {

            var name = document.getElementById("landing-name").value,
                companyName = document.getElementById("landing-companyName").value,
                email = document.getElementById("landing-email").value,
                nameArr = name.split(' '),
                fname = nameArr[0],
                lname = nameArr[1];

            // Store
            localStorage.setItem("fname", fname);
            localStorage.setItem("lname", lname);
            localStorage.setItem("companyName", companyName);
            localStorage.setItem("email", email);

        });
    }
};

