var request = require('request');
var http = require('http');
var translationUsername="64a3ecc4-182b-47e9-a659-c580a7b5ca02"
var translationPassword="AnnGIdp6kCU7"
var convoUser = "441baeac-7b43-4fdc-90d1-dcc475f2d64e";
var convoPass = "8Xgf2xWn4p8Q";
var transUrl = 'https://gateway.watsonplatform.net/language-translator/api/v2/translate';
var watson = require('watson-developer-cloud');

http.createServer(function(req,response) {

  var conversation = watson.conversation({
    username: convoUser,
    password: convoPass,
    version: 'v1',
    version_date: '2017-05-26'
  });
  
  // Replace with the context obtained from the initial request
  var context = {};
  
  conversation.message({
    workspace_id: 'be7a0f63-f34a-4b95-acda-f2fc61989fb1',
    input: {'text': 'translate this phrase.'},
    context: context
  },  function(err, response) {
    if (err)
      console.log('error:', err);
    else {
      console.log(response)

      if(response.intents.length > 0 && response.intents[0].intent === 'translate'){
        translate(response.input.text).then(function(translatedResopnse){
          console.log(translatedResopnse)
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
    
    data.source = 'en';
    data.target = 'es';
    data.text = userInput;
    
    request.post({
        headers: {'content-type':'application/json'},
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
