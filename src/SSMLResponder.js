require('dependency-binder')({
  'AlexaSkill': require('./AlexaSkill')
});
var AlexaSkill = binder.resolve('AlexaSkill');

var speechOutput = {
    speech: "",
    type: AlexaSkill.speechOutputType.SSML
};

module.exports = {
    promptListOfRepositoriesResponse: function(listOfRepositories, response) {
        var ssml = "<speak><s>Here are your repos:</s>";
        for (var i = 0; i < listOfRepositories.length; i++) {
            var name = listOfRepositories[i].name;
            if (listOfRepositories[i].private) {
                ssml += "<s>" + name + " which is private to you.</s>";
            } else {
                ssml += "<s>" + name + "</s>";
            }
        }
        ssml += "</speak>";
        speechOutput.speech = ssml;
        response.tell(speechOutput);
    },
    promptListOfIssuesResponse: function(listOfIssues, response) {
        var ssml = "<speak>";
        if (listOfIssues.length > 0) {
            ssml += "<s>Here are the issues that are assigned to you and open:</s>";
            for (var i = 0; i < listOfIssues.length; i++) {
                var title = listOfIssues[i].title,
                    labels = listOfIssues[i].labels;
                if (labels) {
                    ssml += "<s>" + title + " that was labeled a " + labels[0].name + ".</s>";
                } else {
                    ssml += "<s>" + title + "</s>";
                }
            }
        } else {
            ssml += "<s>There is currently no open issues assigned to you.</s>";
        }
        ssml += "</speak>";
        speechOutput.speech = ssml;
        response.tell(speechOutput);
    }
}
