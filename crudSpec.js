//CRUD tests 
var frisby = require('frisby');

frisby.globalSetup({
	request:{ 
			headers: {
				'Authorization' : 'Basic V2FsdGVyLk1lcmNhZG9AamFsYXNvZnQuY29tOlBAc3N3MHJk' 
			},
	} 
});

var now = new Date();

//Create Operation using API 
var item = {
	"Content": "Item Created by API "+ now.getTime(),
	"ProjectId": 3402184
};

frisby.create('Given an account use API request to Create a Item into Project')
	.post('https://todo.ly/api/items.json', item, {json: true})
	.expectJSON(item)
	.expectJSONTypes({
		Id: Number,
		Content:String,
		ProjectId: Number
	})
.toss();

//Retrieve Operation using API 
var project = {
	"Id": 3402184,
	"Content": "Work",
	"Icon": 10
};

frisby.create('Given an account use API request to get Project info')
	.get('https://todo.ly/api/projects/3402184.json')	
	.expectJSON(project)
	.expectJSONTypes({
		Id: Number,
		Content:String,
		Icon: Number
	})
.toss();

// Update Operation using API
now = new Date();
var user = {
	"FullName": "User Test "+ now.getTime()
};
frisby.create('Given an account use API request to update User info')
	.post('https://todo.ly/api/user/537867.json',user, {json: true})	
	.expectJSON(user)
	.expectJSONTypes({
		Id: Number,
		FullName:String
	})
.toss();

//Delete Operation using API
var now = new Date();
var project = {
	"Content": "Delete Proj " + now.getTime()
};

return frisby.create('Given an account use API request to delete a Project')
	.post('https://todo.ly/api/projects.json', project, {json: true})
	.inspectJSON()
	.expectJSON(project)
	.afterJSON(function(responseData){		
		frisby.create('Delete project with ID:' + responseData.Id)
			.delete('https://todo.ly/api/projects/' + responseData.Id + '.json')
			.expectJSON({
				Deleted: true
			})				
		.toss();
	})
.toss();

//Create in Inbox filter 

var now = new Date();
var item = {
	"Content": "Create Inbox "+ now.getTime(),
	"ProjectId": 0
};	
frisby.create('Given an account use API request to create an Item in Inbox Container')
	.post('https://todo.ly/api/items.json', item, {json: true})		
	.expectJSON({
		Content: "Create Inbox "+ now.getTime(),
		ProjectId: null		
	})
.toss();

