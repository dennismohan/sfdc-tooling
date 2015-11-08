var fs  = require('fs');
var jsforce = require('jsforce');

var sfdcOptions = {
    /*
    
    loginUrl:'https://test.salesforce.com'
     oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com',
    clientId : '<your Salesforce OAuth2 client ID is here>',
    clientSecret : '<your Salesforce OAuth2 client secret is here>',
    redirectUri : '<callback URI is here>'

    */
  };

var sfdcCreds = { 
    username: 'anthonywong555@gmail.com',
    password: 'whatsup1412'
};

var conn = new jsforce.Connection(sfdcCreds);

conn.login(sfdcCreds.username, sfdcCreds.password, loginCallback);

var startTime = (new Date).getTime();

function loginCallback(err, userInfo){

    if(err){
        console.log('err:' + JSON.stringify(err));
        return;
    }
    
    console.log('userInfo' + JSON.stringify(userInfo));
    

    // querySave();
    getSfdcArtifactWrapper('./build/pages/accountDisplay.page', updateSfdc);

}

function querySave(){
    conn.query("SELECT Id, ApiVersion, ControllerKey, ControllerType, Description, Name, Markup FROM ApexPage WHERE Name ='accountDisplay' LIMIT 1", function(err, results){
        console.log('err: ' + err);
        console.log('results: ' + JSON.stringify(results,null, '  '));
        var record = results.records[0];
        console.log('record: ', JSON.stringify(record, null, '    '));

        conn.tooling.sobject('ApexPage').update(record, function(err, results){
            console.log('err: ' + JSON.stringify(err,null, '  '));
            console.log('results: ' + JSON.stringify(results,null, '  '));
        });
    });

}

/* fileName includes relative path */
function getSfdcArtifactWrapper(fileName, callback){

    var artifactWrapper = {};
    artifactWrapper.artifact = {};

    populateArtifactType();
    fs.readFile(fileName, 'utf8', parseFileData);

    
    function populateArtifactType(){
        //populate type based on name extension
        artifactWrapper.type = 'ApexPage';
    }

    function parseFileData(err, data){
        if(err){
            console.log('failed: ' + err);
            callback(err, null);
            return;
        }

        console.log('data: '+ data);
        artifactWrapper.artifact.Id = '06637000000XkJF';
        artifactWrapper.artifact.ControllerType = 1;
        artifactWrapper.artifact.Markup = data;
        callback(null, artifactWrapper);
    }
}

function updateSfdc(err, wrapper){
    //returns error, query a page or class to see what the json looks like
    console.log('artifact: ' + JSON.stringify(wrapper.artifact,null,'  '));
    conn.tooling.sobject(wrapper.type).update(wrapper.artifact, callback);

    function callback(err, result){
        console.log('err' + JSON.stringify(err));
        console.log('result: ' + JSON.stringify(result));
        console.log('It took this long: ' + (((new Date).getTime()) - startTime));
    }
}

