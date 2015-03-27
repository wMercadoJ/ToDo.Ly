//Smoke TestCases
var frisby = require('frisby');

frisby.globalSetup({
	request:{ 
			headers: {
				'Authorization' : 'Basic V2FsdGVyLk1lcmNhZG9AamFsYXNvZnQuY29tOlBAc3N3MHJk' 
			},
	} 
});

// The goal of these tests are that we can perform the request using the API for todo.ly
// We don't validate the content of the returns and we only validate that the URI for API exists

frisby.create('Given an account use API request to get the Filters')
	.get('https://todo.ly/api/filters.json')	
	.expectStatus(200)
.toss();

frisby.create('Given an account use API request to get the Recycle Bin Filter')
	.get('https://todo.ly/api/filters/-3.json')	
	.expectStatus(200)
.toss();

frisby.create('Given an account use API request to get the Info account')
	.get('https://todo.ly/api/user.json')	
	.expectStatus(200)
.toss();

frisby.create('Given an account use API request to get the Projects')
	.get('https://todo.ly/api/projects.json')	
	.inspectJSON()
	.expectStatus(200)
.toss();

frisby.create('Given an account use API request to get the Items')
	.get('https://todo.ly/api/items.json')	
	.expectStatus(200)
.toss();

