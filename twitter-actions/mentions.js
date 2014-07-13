/**
 * Name: Mentions.js
 * Description: This prototype retrieves mentions, parses for the "register keyword" and adds the user to the "new members" list if they are not already present
 * TODO: Add to list step
 * Notes: Twitter API keys removed for security reasons.
**/

var Twit = require('twit');
var async = require('async');
var auth = require('./auth.json');

var T = new Twit(auth);

async.parallel({
    mentioners: function(callback){
      T.get('statuses/mentions_timeline', { count: 200 }, function(err, mentions, response) {
        callback(err, mentions)
      });
    },
    listMembers: function(callback){
      T.get('lists/members', { list_id: 144638216}, function(err, members, response) {
         callback(err, members.users);
      });
    }
}, function(err, results) {

  if (!err) {
    console.log('[debug] Number of mentions to process: ' + results.mentioners.length)
  
    results.mentioners.forEach(function(mention) {
              
        //is this a registration, very simple test!
        if (mention.text.indexOf('register') !== -1){
          
          var result = false;
          
          //find if requested member is already in list
          results.listMembers.some(function(member){
              return result = (member.screen_name == mention.user.screen_name);
          });
        
          //if not, add them.
          if (result == false) {
            console.log('[action] add ' + mention.user.screen_name + ' too list');
          } else {
            console.log('[action] do nothing, ' + mention.user.screen_name + ' is in list already');  
          }
        } else {
          console.log('[action] discard mention by ' + mention.user.screen_name + ', not a registration');
        }
    });
  }
});