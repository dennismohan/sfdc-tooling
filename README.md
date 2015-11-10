# GRUNT-SFDC-SAVE
This project is to make a better system for doing salesforce deveploment.
### Libraries
- NodeJS
- [JSForce](https://jsforce.github.io/)

### NodeJS Libraries
- Commander

### Grunt Libraries
- Watch
- Exec

### Building our own services
If we will want to write our own JSForce we will need to use two APIs:

- [SOAP API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_login.htm)
- [REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/#StartTopic=Content/quickstart.htm)
- [Tooling API](https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/)

### Create Pages JSON:
Request type: POST
URL: https://xx.salesforce.com/services/data/vxx/tooling/sobjects/ApexPage/

{
      "Name": "TestPage",
      "MasterLabel": "TestPage",
      "Markup": "<apex:page><p>Hello World</p></apex:page>"
}

Return:{ "id": 0010010123, "success": true, "errors": []}
Status: 201 Created

### Create Class JSON:
Request type: POST
URL: https://xx.salesforce.com/services/data/vxx/tooling/sobjects/ApexPage/

{
      "Name": "TestPage",
      "Body": "public class TestClass { public static final Integer x = 1; }"
}

Return:{ "id": 0010010123, "success": true, "errors": []}
Status: 201 Created
### Update Pages JSON:
Request type: PATCH
URL: https://xx.salesforce.com/services/data/vxx/tooling/sobjects/ApexPage/Id
{
      "Name": "TestPage",
      "MasterLabel": "TestPage",
      "Markup": "<apex:page><p>Hello World</p></apex:page>"
}

### Technical Issues:
- How to create files when grunt-watch is running?