/**
 * GTM dataLayer Adapter for HubSpot embedded chat interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

  var allowedOrigins = [
    'https://app.hubspot.com'
  ];

  if (allowedOrigins.indexOf(message.origin) === -1) 
    return;

  var message = (typeof message.data === 'object') ? message.data : JSON.parse(message.data);

  // Used in the generation of the dataLayer event name. 
  var action;

  switch (message.type) {

    case 'open-change':
      action = message.data ? 'window_open' : 'window_close';
    break;

    case 'external-api-event':

      var eventType = message.data.eventType;

      var subscribeTo = {
        conversationStarted: 'start',
        conversationClosed: 'complete',
        contactAssociated: 'email_submitted',
        inputStaging: 'message_sent',
        unreadConversationCountChanged: 'message_'
      };

      if (!subscribeTo.hasOwnProperty(eventType)) 
        return;

      action = subscribeTo[eventType];

      if ('unreadConversationCountChanged' == eventType) {
        action += (message.data.payload.unreadCount > 0) ? 'received' : 'read';
      }

    break;
      
  }

  if (!action)
    return;

  var platform = 'hubspot',
      namespace = platform,
      object = 'chat';

  var eventPayload = {
      
    /**
     * Should result in the following dataLayer events:
     * 
     * - hubspot.chat_start
     * - hubspot.chat_complete
     * - hubspot.chat_email_submitted
     * - hubspot.chat_message_sent
     * - hubspot.chat_message_received
     * - hubspot.chat_message_read
     */
    event: namespace + '.' + object + '_' + action,

    event_context: {
      platform: platform,
      object: object,
      chat_id: message.uuid
    },

    user_context: {}

  };

  if (action)
    window.dataLayer.push(eventPayload);

});