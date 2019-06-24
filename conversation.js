const AssistantV1 = require("ibm-watson/assistant/v1");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const http = require("http");
const port = 3000;

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})


const assistant = new AssistantV1({
  version: '2019-02-28',
  iam_apikey: "YOUR_IAM_API_KEY",
  url: "YOUR_URL"
});

var context = {};

assistant.message({
  workspace_id: "YOUR_WORKSPACE_ID",
  input: { 'text': 'translate this phrase.' },
  context: context
},
  function (err, response) {
    if (err) {
      console.log("error:", err);
    }
    else {
      console.log(response);
      if (response.intents.length > 0 && response.intents[0].intent === "translate") {
        translate(response.input.text).then(function (translatedResopnse) {
          response.output.text = translatedResopnse
          console.log(JSON.stringify(response, null, 2))
        });
      }
    }
  });



// Translation part..

function translate(userInput) {
  const languageTranslator = new LanguageTranslatorV3({
    iam_apikey: 'TRANSLATOR_API_KEY',
    url: 'WORKSPACE ',
    version: '2019-04-02',
  });

  languageTranslator.translate(
    {
      text: userInput,
      source: 'en',
      target: 'es'
    })
    .then(translation => {
      console.log(JSON.stringify(translation, null, 2));
    })
    .catch(err => {
      console.log('error:', err);
    });
}



