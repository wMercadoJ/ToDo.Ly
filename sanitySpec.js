//Sanity Test Cases
var frisby = require('frisby');

frisby.globalSetup({
	request:{ 
			headers: {
				'Authorization' : 'Basic V2FsdGVyLk1lcmNhZG9AamFsYXNvZnQuY29tOlBAc3N3MHJk' 
			},
	} 
});

// Create a Bunch of Projects 
var idProjects = []
for(var i = 0; i < 10; i++){
	var now = new Date();
	var project = {
		"Content": "Project Sanity " + now.getTime(),
		"Icon":14
	};
	frisby.create('Given an account use API request to Create a bunch of Projects')
		.post('https://todo.ly/api/projects.json', project, {json: true})
		.expectStatus(200)
		.expectJSON(project)
		.afterJSON(function(responseData){
			idProjects.push(responseData.Id);			
		})
	.toss();
}

// Create Nested Projects 
var project = {
	"Content": "Project Rool lvl",
	"Icon":3
};
frisby.create('Given an account use API request to Create Nested Projects')
	.post('https://todo.ly/api/projects.json', project, {json: true})
	.expectStatus(200)
	.expectJSON(project)
	.afterJSON(function(rootLevel){
		project = {
			"Content": "Project Nested1",
			"Icon":5,
			"ParentId": rootLevel.Id				
		};
		frisby.create('Create First Nested Project')
			.post('https://todo.ly/api/projects.json', project, {json: true})
			.expectStatus(200)
			.expectJSON(project)
			.afterJSON(function(nestedLevel1){					
				project = {
					"Content": "Project Nested2" ,
					"Icon":7,
					"ParentId": nestedLevel1.Id
				};
				frisby.create('Create Second Nested Project')
					.post('https://todo.ly/api/projects.json', project, {json: true})
					.expectStatus(200)
					.expectJSON(project)						
				.toss();					
			})
		.toss();			
	})
.toss();

	
// Get all projects
frisby.create('Given an account use API request to Get all the Projects created')
	.get('https://todo.ly/api/projects.json')	
	.expectStatus(200)
	.afterJSON(function(json){
		expect(json.length).toBeGreaterThan(0);
	})	
.toss();

//Create-Update-Delete operations in for a Project
frisby.create('Given an account use API request to Create a Project')
	.post('https://todo.ly/api/projects.json', {
		'Content' : 'FrisbyProj112',
		'Icon' : 3		
	},  {json: true})	
	.expectStatus(200)	
	.expectJSONTypes( {
      Id: Number
    })
	.afterJSON(function (json) {
		console.log(json.id);
        var result = json.Id;		
		
		// Update a Project
		var updateProyect = {
		'Content': 'UpdateTest'
		};
		frisby.create('Given an account use API request to Update a Project')
			.put('https://todo.ly/api/projects/'+result+'.json', updateProyect, {json:true})	
			.expectStatus(200)	
			.afterJSON(function (json){
				// Delete a Project
				frisby.create('Given an account use API request to Delete a Project')
					.delete('https://todo.ly/api/projects/'+result+'.json')	
					.expectStatus(200)						
				.toss();
			})
		.toss();
	})
.toss();

// Get all Items marked as Done in Next tab
frisby.create('Given an account use API request to Get all Items of marked as Done in Next tab')
	.get('https://todo.ly/api/filters/-5/doneitems.json')	
	.expectStatus(200)
	.afterJSON(function(json){
		expect(json.length).toBeGreaterThan(0);
	})
.toss();


