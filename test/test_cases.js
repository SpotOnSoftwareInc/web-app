// Test Cases
// Testing is done with Jasmine (and Karma)
// Bug Reporting: On Excel, Bug, File, Line Number, Function, Result of the Bug, Possible Solutions
describe ("test cases", function(){

	// Test Case 1: Basic Registration
	// Test Variables
	var newUsername, newPassword, newEmail, newCompany;
	var newAccount_01 = { "David", "applecider@yahoo.com", "OldCompany" };

	it("new username inserted by landing page (Correct Input)", function () {
		var case_00 = true;
		var testAccount = { "Amy Jones", "applecider@yahoo.com", "NewCompany" };
		var subAccount = { "Amy", "Jones", "applecider@yahoo.com", "NewCompany" };

		// Insert elements from the account arrays into the text field
		// Note: IDs are based from the HTML page of the home page
		setFixtures($('#landing-name').val(testAccount.indexOf(0)));
		setFixtures($('#landing-email').val(testAccount.indexOf(1)));
		setFixtures($('#landing-companyName').val(testAccount.indexOf(2)));

		// Clicks the 'Register' button on the home page
		$('#landing-register').trigger("click");

		// Goes to the Registration Page and checks results if filled correctly
		expect($('#register-form-fname')).toHaveValue(subAccount.indexOf(0));
		expect($('#register-form-lname')).toHaveValue(subAccount.indexOf(1));
		expect($('#register-form-companyName')).toHaveValue(subAccount.indexOf(2));
		expect($('#register-form-email')).toHaveValue(subAccount.indexOf(3));
		// expect($('#register-form-password')).toHaveValue(subAccount.indexOf(4));
	});

	it("new username inserted by main page (Improper Email)", function () {
		var case_01 = true;
		var testAccount = { "David Mable", "asjkkahgjkkjg", "OldCompany" };
		var subAccount = { "David", "Mable", "asjkkahgjkkjg", "OldCompany" };

		// Insert elements from the account arrays into the text field
		// Note: IDs are based from the HTML page of the home page
		setFixtures($('#landing-name').val(testAccount.indexOf(0)));
		setFixtures($('#landing-email').val(testAccount.indexOf(1)));
		setFixtures($('#landing-companyName').val(testAccount.indexOf(2)));

		// Clicks the 'Register' button on the home page
		$('#landing-register').trigger("click");

		// Due to improper email, the landing page can't advance

		// Goes to the Registration Page and checks results if filled correctly
		expect($('#register-form-fname')).toHaveValue(null);
		expect($('#register-form-lname')).toHaveValue(null);
		expect($('#register-form-companyName')).toHaveValue(null);
		expect($('#register-form-email')).toHaveValue(null);
		// expect($('#register-form-password')).toHaveValue(subAccount.indexOf(4));
	});

	it("new username inserted by main page (Incomplete Name)", function () {
		var case_02 = true;
		var testAccount = { "Nathan", "nmatthew@gmail.com", "MyCompany" };
		var subAccount = { "Nathan", "", "nmatthew@gmail.com", "MyCompany" };

		// Insert elements from the account arrays into the text field
		// Note: IDs are based from the HTML page of the home page
		setFixtures($('#landing-name').val(testAccount.indexOf(0)));
		setFixtures($('#landing-email').val(testAccount.indexOf(1)));
		setFixtures($('#landing-companyName').val(testAccount.indexOf(2)));

		// Clicks the 'Register' button on the home page
		$('#landing-register').trigger("click");

		// Due to improper email, the landing page can't advance

		// Goes to the Registration Page and checks results if filled correctly
		expect($('#register-form-fname')).toHaveValue(subAccount.indexOf(0));
		expect($('#register-form-lname')).toHaveValue(subAccount.indexOf(1));
		expect($('#register-form-companyName')).toHaveValue(subAccount.indexOf(2));
		expect($('#register-form-email')).toHaveValue(subAccount.indexOf(3));
		// expect($('#register-form-password')).toHaveValue(subAccount.indexOf(4));
	});

	it("new username inserted by registration page", function () {
		var case_01 = true;

		// Insert elements from the account arrays into the text field
		setFixtures($('#register-form-fname').val(newRedirect_00.indexOf(0)));
		setFixtures($('#register-form-lname').val(newRedirect_00.indexOf(1)));
		setFixtures($('#register-form-companyName').val(newRedirect_00.indexOf(2)));
		setFixtures($('#register-form-email').val(newRedirect_00.indexOf(3)));
		setFixtures($('#register-form-password').val(newRedirect_00.indexOf(4)));

		// Clicks the 'Sign Up' button on the home page
		$('#register-form-submit').trigger("click");

		// Then test each field with a message

		expect(case_01).toBe(true);
	});

	it("used username inserted", function () {

		// Insert elements from the account arrays into the text field
		setFixtures($('#register-form-fname').val(newRedirect_00.indexOf(0)));
		setFixtures($('#register-form-lname').val(newRedirect_00.indexOf(1)));
		setFixtures($('#register-form-companyName').val(newRedirect_00.indexOf(2)));
		setFixtures($('#register-form-email').val(newRedirect_00.indexOf(3)));
		setFixtures($('#register-form-password').val(newRedirect_00.indexOf(4)));

		// Clicks the 'Sign Up' button on the home page
		$('#register-form-submit').trigger("click");

		expect(true).toBe(true);
	});

	// Test Case 2: Basic Login
	// Test Variables

	it("existing username", function () {

		// Insert elements from the account arrays into the text field
		setFixtures($('#login-form-email').val(newRedirect_00.indexOf(0)));
		setFixtures($('#login-form-password').val(newRedirect_00.indexOf(1)));

		// Clicks the 'Login' button on the home page
		$('#login-form-submit').trigger("click");

		expect(true).toBe(true);
	});

	it("non-existing username", function () {

		// Insert elements from the account arrays into the text field
		setFixtures($('#login-form-email').val(newRedirect_00.indexOf(0)));
		setFixtures($('#login-form-password').val(newRedirect_00.indexOf(1)));

		// Clicks the 'Login' button on the home page
		$('#login-form-submit').trigger("click");

		expect(true).toBe(true);
	});

	// Test Case 3: Forgotten Username/Password
	// Test Variables

	it("password from existing username", function () {
		var testAccount = { "Amy Jones", "applecider@yahoo.com", "NewCompany" };

		// Checks if the username exists
		setFixtures($('#login-form-email').val(newRedirect_00.indexOf(1)));

		$('#forgotpw-form-submit').trigger("click");
		expect($('#login-form-email')).toHaveValue(subAccount.indexOf(1));
		//expect(true).toBe(true);
	});

	it("password from non-existing username", function () {
		var testAccount = { "Amy Jones", "blahblah@yahoo.com", "NewCompany" };

		// Checks if the username exists
		setFixtures($('#login-form-email').val(newRedirect_00.indexOf(1)));

		$('#forgotpw-form-submit').trigger("click");
		expect($('#login-form-email')).toHaveValue(null);
		//expect(true).toBe(true);
	});

	/*it("existing username", function () {
		expect(true).toBe(true);
	});

	it("non-existing username", function () {
		expect(true).toBe(true);
	});*/
});

