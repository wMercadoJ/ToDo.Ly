var frisby = require('frisby');

frisby.globalSetup({
	request:{ 
			headers: {
				'Authorization' : 'Basic V2FsdGVyLk1lcmNhZG9AamFsYXNvZnQuY29tOlBAc3N3MHJk' 
			},
	} 
});

//Second Workflow in a Function. This function is called for the First Workflow
var secondWorkflow = function(projectId){
	var now = new Date();
	frisby.create('Given an account use API request to Get Items of a Project')
		.get('https://todo.ly/api/projects/'+ projectId +'/items.json')		
		.afterJSON(function(itemsProject){
			for(var i=0; i<itemsProject.length; i++){
				var now = new Date();
				if(i % 2 == 0){
					var item = {
							"Content": "Item WF2 Updated "+ now.getTime(),
						};	
					frisby.create('Given an account use API request to Update a Item into Project')
						.post('https://todo.ly/api/items/'+ itemsProject[i].Id +'.json', item, {json: true})
						.expectJSON(item)
					.toss();
				}else{
					frisby.create('Given an account use API request to Delete a Item into Project')
						.delete('https://todo.ly/api/items/'+ itemsProject[i].Id +'.json')						
					.toss();
				}
			}
		})
	.toss();
};

//First Workflow 
var firstWorkflow = function(){
	//WF1
	var newProjectId;
	var now = new Date();
	var project = {
		"Content": "Project WF1 " + now.getTime()
	};

	frisby.create('Given an account use API request to Create a Project')
		.post('https://todo.ly/api/projects.json', project, {json: true})
		.expectStatus(200)
		.expectJSON(project)
		.afterJSON(function(responseData){
			newProjectId = responseData.Id;			
			var updateProjectInfo = {
				"Icon": 12
			};
			frisby.create('Given an account use API request to Update a Project')
				.post('https://todo.ly/api/projects/' + newProjectId + '.json', updateProjectInfo, {json: true})
				.expectJSON(updateProjectInfo)
				.afterJSON(function(data){
					var numberItems = 0;
					for(var i=0; i<10; i++){
						now = new Date();
						var item = {
							"Content": "Item WF1 by API "+ now.getTime(),
							"ProjectId": newProjectId
						};					
						frisby.create('Given an account use API request to Create Items in a Project')
							.post('https://todo.ly/api/items.json', item, {json: true})
							.expectJSON(item)
							.expectJSONTypes({
								Id: Number,
								Content:String,
								ProjectId: Number
							})
							.afterJSON(function(dataItem){								
								numberItems++;												
								if(numberItems == 10){	
									// Used  to call to Second Workflow
									secondWorkflow(newProjectId);
								}	
							})
						.toss();
						
					}
									
				})
			.toss();
		})
	.toss();
	
};


// Third Workflow
var thirdWorkflow = function(){
	var now = new Date();
	var project = {
		"Content": "Project WF3 " + now.getTime(),
		"Icon":9
	};

	frisby.create('Given an account use API request to Create a Project')
		.post('https://todo.ly/api/projects.json', project, {json: true})
		.expectStatus(200)
		.expectJSON(project)
		.afterJSON(function(responseData){
			newProjectId = responseData.Id;	
			now = new Date();
			for (var i=0; i<3;i++){
				
				if(i==1){
					now.setDate(now.getDate() + 1);	
				}else if ( i==2){
					now.setDate(now.getDate() + 2);	
				}
				var item = {
					"Content": "Item WF3 by API "+ now.getTime(),
					"ProjectId": newProjectId,
					"DueDateTime": "/Date("+now.getTime()+")/"
				};	
				frisby.create('Given an account use API request to Create a Item into Project for Today and Next tabs')
					.post('https://todo.ly/api/items.json', item, {json: true})				
					.expectJSONTypes({
						Id: Number,
						Content:String,
						ProjectId: Number
					})	
				.toss();
			}
		})
	.toss();	
};

// Fourth Workflow
var fourthWorkflow = function(){
	var now = new Date();
	now.setDate(now.getDate() + 3);	
	var item = {
		"Content": "Item WF4 by API "+ now.getTime(),
		"ProjectId": -1,
		"DueDateTime": "/Date("+now.getTime()+")/"
	};	
	frisby.create('Given an account use API request to Create an Item in Next tab')
		.post('https://todo.ly/api/items.json', item, {json: true})		
		.inspectJSON()
		.afterJSON(function(responseData){
			var itemID = responseData.Id;
			frisby.create('Given an account use API request to Get all Items in Next tab')
				.get('https://todo.ly/api/filters/-5/items.json')		
				.expectJSON('?', {
					Id: itemID
					})
				.afterJSON(function(data){
					for(var i = 0 ; i< data.length;i++){
						if (data[i].Id == itemID){
							var itemUpdated = {
								"Checked": true
							};
							frisby.create('Given an account use API request to Mark as Checked all Items of Next tab')
							.post('https://todo.ly/api/items/'+ data[i].Id +'.json', itemUpdated, {json: true})
							.expectJSON(itemUpdated)
						.toss();
						}
					}
				})
			.toss();
		})
	.toss();
};

// Fifth Workflow
var fifthWorkflow = function(){
	var now = new Date();
	var project = {
		"Content": "Project WF5 " + now.getTime(),
		"Icon":14
	};

	frisby.create('Given an account use API request to Create a Project')
		.post('https://todo.ly/api/projects.json', project, {json: true})
		.expectStatus(200)
		.expectJSON(project)
		.afterJSON(function(responseData){
			newProjectId = responseData.Id;	
			now = new Date();		
			var item = {
				"Content": "Item WF5 by API "+ now.getTime(),
				"ProjectId": newProjectId,
				"DueDateTime": "/Date("+now.getTime()+")/"
			};	
			frisby.create('Given an account use API request to Create an Item with a Due date into a Project')
				.post('https://todo.ly/api/items.json', item, {json: true})					
				.afterJSON(function(data){				
					frisby.create('Given an account use API request to Delete the Previos item Created')
						.delete('https://todo.ly/api/items/'+ data.Id +'.json')
						.afterJSON(function(deletedItem){
							var itemID = deletedItem.Id;
							frisby.create('Given an account use API request to Verify the Item previously Deleted')
								.get('https://todo.ly/api/filters/-3/items.json')
								.expectJSON('?', {
									Id: itemID
								})
							.toss()
						})
					.toss();
				})	
			.toss();
			
		})
	.toss();	
};

// Used to call to Workflows
firstWorkflow();
thirdWorkflow();
fourthWorkflow();
fifthWorkflow();
