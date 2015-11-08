var fs  = require('fs');
var jsforce = require('jsforce');
var filePath = process.argv.slice(2)[0];
var filePathArray = filePath.split("\\");
var file = filePathArray[filePathArray.length - 1];

var fileArray = file.split('.');
var fileName = fileArray[0];
var fileExt = fileArray[1];

var APEX_CLASS_EXT = 'cls';
var APEX_PAGE_EXT = 'page';

console.log('fileName: ' + fileName);
console.log('fileExt: ' + fileExt);

var sfdcCreds = 
{
	username: 'anthonywong555@gmail.com',
	password: 'whatsup1412'
};

var conn = new jsforce.Connection(sfdcCreds);

conn.login(sfdcCreds.username, sfdcCreds.password, loginCallback);

function loginCallback(error, userInfo)
{
	if(error)
	{
		console.log('error: ' + JSON.stringify(error));
		return;
	}
	
	console.log('userInfo' + JSON.stringify(userInfo));

	query();
}

function query()
{
	console.log('query');
	conn.query(queryBuilder(), function(error, results){
		if(error){
			console.log('There was an error when querying fields');
			console.log('error: ' + error);
			return;
		}
		console.log('results: ' + JSON.stringify(results));
		var artifactWrapper = generateArtifactWrapper(results.records[0]);
		console.log('artifactWrapper: ' + JSON.stringify(artifactWrapper));
		updateSFDC(artifactWrapper);
	});
}

function updateSFDC(artifactWrapper)
{
	console.log('updateSFDC');
	console.log('artifactWrapper.artifact: ' + JSON.stringify(artifactWrapper.artifact,null,'  '))

	conn.metadata.read(artifactWrapper.type + 'Member', fileName , function(err, metadata) {
		if (err) 
		{ 
			console.error(err);
			return;
		}
		console.log('metadata: ' + JSON.stringify(metadata));
	});	
	conn.tooling.sobject(artifactWrapper.type).update(artifactWrapper.artifact, callback);
	function callback(error, result)
	{
		console.log('error: ' + JSON.stringify(error));
		console.log('results: ' + JSON.stringify(result));
	}
}

function queryBuilder()
{
	var queryBuilder = 'SELECT Id ';

	switch(fileExt) 
	{
    	case APEX_CLASS_EXT:
        	queryBuilder += ', Body, ApiVersion FROM ApexClass WHERE Name = \'' + fileName + '\' LIMIT 1'
        	break;
    	case APEX_PAGE_EXT:
        	queryBuilder += ', ControllerType FROM ApexPage WHERE Name = \'' + fileName + '\' LIMIT 1';
        	break;
    	default:
        	console.log('Invalid type: ' + fileExt);
        	return;
	}

	console.log('queryBuilder: ' + queryBuilder);
	return queryBuilder;
}

function generateArtifactWrapper(fields)
{
	var artifactWrapper = {};
	artifactWrapper.artifact = {};

	populateArtifactType(fields);

	return artifactWrapper;

	function populateArtifactType(fields)
	{
		switch(fileExt)
		{
			case APEX_CLASS_EXT:
				artifactWrapper.type = 'ApexClass';
				artifactWrapper.artifact.Id = fields.Id;
				artifactWrapper.artifact.Name = fileName;
				artifactWrapper.artifact.ApiVersion = fields.ApiVersion;
				artifactWrapper.artifact.IsValid = false;
				artifactWrapper.artifact.Body = readFile();
        		break;
    		case APEX_PAGE_EXT:
    			artifactWrapper.type = 'ApexPage';
    			artifactWrapper.artifact.Id = fields.Id;
				artifactWrapper.artifact.ControllerType = 1;
				artifactWrapper.artifact.Markup = readFile();
        		break;
    		default:
        		console.log('Invalid type: ' + fileExt);
        		return;
		}
	}
}

function readFile()
{
	var file = fs.readFileSync(filePath, 'utf8');
	return file;
}
