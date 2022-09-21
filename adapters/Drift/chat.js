/**
 * GTM dataLayer Adapter for Drift embedded chat interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 * https://devdocs.drift.com/docs/drift-events
 */

dataLayer = window.dataLayer || [];
(function() {

  function track(action, data) {

    var platform = 'drift',
        namespace = platform,
        object = 'chat';

    var eventPayload = {

      /**
       * Should result in the following dataLayer events:
       * 
       * - drift.chat_
       */
      event: namespace + '.' + object + '_' + action,

      event_context: {
        object: object,
        platform: platform,
      },
      
      user_context: {}

    };

    if (typeof data === 'object') {
      
      for (var prop in data) { 
        
        if (!data.hasOwnProperty(prop))
          return;

        eventPayload.event_context[object + '_' + camelToSnakeCase(prop)] = data[prop];

      }

    }

    window.dataLayer.push(eventPayload);

  }

  function attachListeners(api, payload) {

    api.on('campaign:click', function(data) { track('campaign_click', data); });
    api.on('campaign:dismiss', function(data) { track('campaign_close', data); });
    api.on('campaign:open', function(data) { track('campaign_open', data); });
    api.on('campaign:submit', function(data) { track('campaign_submit', data); });
    api.on('chatClose', function() { track('close', {}); });
    api.on('chatOpen', function() { track('open', {}); });
    api.on('conversation:buttonClicked', function(data) { track('button_click', data); });
    api.on('conversation:firstInteraction', function(data) { track('first_interaction', data); });
    api.on('conversation:playbookClicked', function(data) { track('playbook_click', data); });
    api.on('conversation:playbookDismissed', function(data) { track('playbook_closed', data); });
    api.on('conversation:playbookFired', function(data) { track('playbook_fired', data); });
    api.on('conversation:selected', function(data) { track('conversation_selected', data); });
    api.on('emailCapture', function(data) { track('email_capture', data); });
    api.on('message', function(data) { track('message_received', data); });
    api.on('message:sent', function(data) { track('message_sent', data); });
    api.on('phoneCapture', function(data) { track('phone_capture', data); });
    api.on('scheduling:requestMeeting', function(data) { track('meeting_request', data); });
    api.on('scheduling:meetingBooked', function(data) { track('meeting_booked', data); });
    api.on('startConversation', function(data) { track('conversation_start', data); });
    api.on('welcomeMessage:close', function() { track('welcome_close', {}); });
    api.on('welcomeMessage:open', function() { track('welcome_open', {}); });

  }

  function camelToSnakeCase(str) { 
    return str.replace(/[A-Z]/g, function(letter) { 
      return '_' + letter.toLowerCase(); 
    });
  }

  function apiGlobalExists() {
      return typeof drift !== 'undefined';
  }

  if (apiGlobalExists()) {
    drift.on('ready',attachListeners);
  } else {

    var poller = setInterval(function() {
      if (apiGlobalExists()) {
        drift.on('ready',attachListeners);
        clearInterval(poller);
      }
    }, 1000);

    setTimeout(function() {
      clearInterval(poller);
    }, 10000);

  }

})();