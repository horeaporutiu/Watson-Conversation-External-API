var request = require("request");
var http = require("http");
var translationUsername= "your translation service username"
var translationPassword= "your translation service password"
var conversationUserame = "your converstaion service username";
var conversationPassword = "your converstaion service password";
var conversationWorkspace = "your converstaion service workspace-id"
var transUrl = "https://gateway.watsonplatform.net/language-translator/api/v2/translate";
var watson = require("watson-developer-cloud");

http.createServer(function(req,response) {

  var conversation = watson.conversation({
    username:6bbe8c03-6b75-407e-ad47-2124f3610a98,
    password: tAXQ5KfiuoSI,
    version: "v1",
    version_date: "2017-05-26"
  });
  
  // Replace with the context obtained from the initial request
  var context = {};
  
  conversation.message({
    workspace_id: 67ed946a-7ad7-4ff9-8d48-c335f56317bc,
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
