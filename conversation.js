var request = require("request");
var http = require("http");
var translationUsername= "your translation service username"
var translationPassword= "your translation service password"
var conversationUserame = "your converstaion service username";
var conversationPassword = "your converstaion service password";
var conversationWorkspace = "your converstaion service workspace-id"
var transUrl = https://gateway.watsonplatform.net/assistant/api/v2/assistants/52e52856-6f8d-481c-adef-5048afb92484/sessions;
var watson = require("watson-developer-cloud");

http.createServer(function(req,response) {

  var conversation = watson.conversation({
    username: conversationUserame,
    password: conversationPassword,
    version: "v1",
    version_date: "2017-05-26"
  });
  
  // Replace with the context obtained from the initial request
  var context = {};
  
  conversation.message({
    workspace_id: conversationWorkspace,
    input: {"text": "translate this phrase."},
    context: context
  },  function(err, response) {
    if (err)
      console.log("error:", err);
    else {
      console.log(response)
      if(response.intents.length > 0 && response.intents[0].intent === "translate"){
        translate(response.input.text).then(function(translatedResopnse){
          response.output.text = translatedResopnse
          console.log(JSON.stringify(response,null,2))        
        });
      }
    }

  });

}).listen(8081);

function translate(userInput) {

  return new Promise((resolve, reject) => {

    var data = {};
    
    data.source = "en";
    data.target = "es";
    data.text = userInput;
    
    request.post({
        headers: {"content-type":"application/json"},
        url : transUrl,
        json : data,
        auth: {
          user: translationUsername,
          pass: translationPassword
        }
    }, function (error, response, body){
        if (error) {
            console.log(error);
            resolve(error);
        } else {
            console.log(body);
            resolve(body.translations[0].translation);
        }
    });

  });        

}
