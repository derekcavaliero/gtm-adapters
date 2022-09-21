/**
 * GTM dataLayer Adapter for HubSpot embedded meeting interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

  /**
   * HubSpot meetings can be embedded via custom hostnames (e.g. meet.domain.com).
   * You will need to add your custom domains into this array if your website(s) function in this way.
   */
  var allowedOrigins = [
    'https://meetings.hubspot.com'
  ];

  if (allowedOrigins.indexOf(message.origin) === -1) 
    return;

  // Used in the generation of the dataLayer event name. 
  var action,
      iframe,
      meetingId;
  
  if (message.data.meetingBookSucceeded) {
      
    action = 'booked';

    iframe = document.querySelector('iframe[src^="' + message.origin + '"]');
    meetingId = iframe.src.split('?')[0].replace(message.origin + '/', '');

  } else {
    return;
  }

  var platform = 'hubspot',
      namespace = platform,
      object = 'meeting';

  var eventPayload = {
      
    /**
     * Should result in the following dataLayer events:
     * 
     * - hubspot.meeting_booked
     */
    event: namespace + '.' + object + '_' + action,

    event_context: {
      platform: platform,
      object: object,
      meeting_id: meetingId,
      meeting_url: iframe.src.split('?')[0]
    },

    user_context: {}

  };

  if (action)
    window.dataLayer.push(eventPayload);

});