/**
 * GTM dataLayer Adapter for ChiliPiper embedded meeting interactions.
 * Version: 1.0.1
 * https://github.com/derekcavaliero/gtm-adapters/
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 * https://help.chilipiper.com/hc/en-us/articles/1500011381522-Javascript-Messaging-in-Browser
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

  if (!message.origin.match(/^https:\/\/[a-z0-9\.\-]{2,}?\.chilipiper\.com$/)) 
    return;

  var action,
      messageType = message.data.action,
      meetingType;

  var subscribeTo = {
    'booking-confirmed': 'confirmed',
    'booked': 'booked',
    'rescheduled': 'rescheduled',
    'availability-loaded': 'availability_loaded',
    'no-free-slots': 'availability_empty',
    'phone-selected': 'type_selected',
    'meeting-selected': 'type_selected',
    'closed': 'window_closed'
  };

  if (['phone-selected', 'meeting-selected'].indexOf(messageType) > -1)
    meetingType = messageType.replace('-selected', '');

  if (!subscribeTo.hasOwnProperty(messageType)) 
    return;
  
  action = subscribeTo[messageType];

  var platform = 'chilipiper',
      namespace = platform,
      object = 'meeting';

  var eventPayload = {
      
    /**
     * Default configuration should result in the following events:
     * - chilipiper.meeting_confirmed
     * - chilipiper.meeting_booked
     * - chilipiper.meeting_rescheduled
     * - chilipiper.meeting_availability_loaded
     * - chilipiper.meeting_availability_empty
     * - chilipiper.meeting_type_selected
     * - chilipiper.meeting_window_closed
     */

    event: namespace + '.' + object + '_' + action,

    event_context: {
      platform: platform,
      object: object,
      meeting_type: meetingType,
      meeting_route_id: message.data.routeId,
      meeting_event_id: message.data.eventId,
      meeting_assignee_id: message.data.assigneeId,
      meeting_slot: message.data.slot
    },

    user_context: {}
      
  };

  window.dataLayer.push(eventPayload);

});