//Negative Test Cases 
var frisby = require('frisby');

frisby.globalSetup({
	request:{ 
			headers: {
				'Authorization' : 'Basic V2FsdGVyLk1lcmNhZG9AamFsYXNvZnQuY29tOlBAc3N3MHJk' 
			},
	} 
});

//Create a Project with empty name using API
var project = {
	"Content": ""
};

frisby.create('Given an account use API request to Create a Project with an Empty Name')
	.post('https://todo.ly/api/projects.json', project, {json: true})
	.expectStatus(200)
	.expectJSON('', {
		ErrorMessage: "Too Short Project Name",
		ErrorCode: 305
	})
.toss();

//Create User with invalid email using API
var user = {
	"Email": "xxx",
	"FullName": "Joe Blow",
	"Password": "P@ssw0rd"
};
frisby.create('Given an account use API request to Create a user with Invalid Email')
	.post('https://todo.ly/api/user.json', user, {json: true})
	.expectStatus(200)
	.expectJSON('', {
		ErrorMessage: "Invalid Email Address",
		ErrorCode: 307
	})
.toss();

//Delete a non-existent Project using API
frisby.create('Given an account use API request to Delete a non-existent Project')
	.delete('https://todo.ly/api/projects/1512.json')
	.expectJSON('', {
		ErrorMessage: "Invalid Id",
		ErrorCode: 301
	})
.toss();

//Get Info of a non-existent Item using API
frisby.create('Given an account use API request to Get Info of a non-existent Item')
	.get('https://todo.ly/api/filters/-8/items.json')
	.expectJSON('', [])
.toss();


//Create an Account with an existint Email account in Todo.ly
var userExistent = {
	"Email": "Walter.Mercado@jalasoft.com",
	"FullName": "Walter",
	"Password": "P@ssw0rd"
};
frisby.create('Given an account use API request to Create an Account with a existing Email Account')
	.post('https://todo.ly/api/user.json', userExistent, {json: true})
	.expectStatus(200)
	.expectJSON('', {
		ErrorMessage: "Account with this email address already exists",
		ErrorCode: 201
	})
.toss();