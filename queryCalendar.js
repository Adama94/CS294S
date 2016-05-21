const Tp = require('thingpedia');
const Q = require('q');

module.exports = new Tp.ChannelClass({
    Name: "GoogleCalendarChannel",
    Extends: Tp.SimpleAction,

    // constructor
    _init: function(engine, device, params) {
        this.parent();
        this.device = device;
        this.timeout = null;
        this.params = params;
        this.engine = engine;
        this.key = 'AIzaSyCrq9daxcTJUW8MRGf3v-4wXiwnPqJ_9uI'
        // These are parameters of the thing itself (like the name we want)
    },

    function getScore(keywords, eventTokens) {
        var keywordUnion = new Set(keywords.concat(eventTokens));      
        var keywordIntersection = keywords.filter(function(value) {
          return eventTokens.indexOf(value) != -1;
        });

        console.log(keywords);
        console.log(eventTokens);

        var sim = keywordIntersection.length / keywordUnion.size;
        return sim;
    },

    function getTime (eventName, events) {
        var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours  ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselve"];
        keywords = keywords = eventName.split(" ")  
        keywords = keywords.filter(function(value) {
          return stopWords.indexOf(value) == -1;
        });

        events.sort(function(a, b) {
            if (a.start.date === b.start.date) {
              return a.start.dateTime - b.start.dateTime;
            } else {
              return a.start.date - b.start.date;
            }
          });

          var bestScore = 0;
          var bestEvent;

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i].summary.toLowerCase();
              var eventTokens = event.split(' ');              
              var score = getScore(keywords, eventTokens);
              if (score > bestScore) {
                bestScore = score;
                bestEvent = event;
              }            
            }
          }

          if (bestScore == 0) {
            return bestEvent.end;
          } else {
            return null;
          }
    },

    _doInvoke: function(contact, action, relative, eventName) {
        var auth = 'Bearer ' + this.device.accessToken;
        var self = this;        

        setTimeout(function(){
            self.engine.assistant.sendReply("The timer worked!");
        }, 10000);

        var date = new Date();
        var startString = date.toISOString();
        date.setDate(date.getDate() + 3);
        var endString = date.toISOString();
        
        var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=' + encodeURIComponent(startString) + '&timeMax=' + encodeURIComponent(endString);
        Tp.Helpers.Http.get(url, {auth: auth, accept: 'application/json' })
            .then(function(response) {
                var parsedResponse = JSON.parse(response);                
                var events = parsedResponse.items;

                var time = getTime(eventName, events);                
                console.log("The final result is " + time);
            }); 
    },

    // We want the doOpen and doClose if we need to do any set up/tear down
});