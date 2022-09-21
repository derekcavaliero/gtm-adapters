/**
 * GTM dataLayer Adapter for Calendly embedded meeting interactions.
 * Version: 1.0.1
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

  var allowedOrigins = [
    'https://calendly.com'
  ];

  if (allowedOrigins.indexOf(message.origin) === -1) 
    return;

  var action,
      messageType = message.data.event.replace('calendly.', ''); 

  /**
   * Message : Action mapping
   * 
   * The resulting action will be prefixed with the singular object name (e.g. `meeting_`)
   * 
   * This object determines the following:
   * - Which messages are being transformed into dataLayer events.
   * - What the resulting action
   * 
   * If you wish to "unsubscribe" or ignore particular message types, simply omit them 
   * or comment out the key: value pair.
   */
  var subscribeTo = {
    profile_page_viewed: 'list_view',
    event_type_viewed: 'type_view',
    date_and_time_selected: 'slot_selected',
    event_scheduled: 'booked'
  };

  if (!subscribeTo.hasOwnProperty(messageType)) 
    return;

  action = subscribeTo[messageType];

  var iframe = document.querySelectorAll('iframe[src^=' + message.origin + ']');

  var meetingUrl = iframe.length == 1 ? iframe.src : undefined;
  var meetingParams = new URLSearchParams(meetingUrl);

  var platform = 'calendly',
      namespace = platform,
      object = 'meeting';

  var eventPayload = {
      
    /**
     * Should result in the following dataLayer events:
     * 
     * - calendly.meeting_list_view
     * - calendly.meeting_type_view
     * - calendly.meeting_slot_selected
     * - calendly.meeting_booked
     */
    event: namespace + '.' + object + '_' + action,

    event_context: {
      platform: platform,
      object: object,
      meeting_url: meetingUrl.split('?')[0],
      embed_type: meetingParams.get('embed_type')
    },

    user_context: {}

  };

  if (action)
    window.dataLayer.push(eventPayload);

});