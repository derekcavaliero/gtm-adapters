/**
 * GTM dataLayer Adapter for Typeform embedded form interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 McKenna DeBandi
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

    if (!message.origin.match(/^https:\/\/[a-z0-9\.\-]{2,}?\.typeform\.com$/))
        return;

    // Used in the generation of the dataLayer event name. 
    var action,
        messageType = message.data.type;

    var subscribeTo = {
        'form-ready': 'loaded',
        // 'form-theme': 'theme_loaded',
        // 'form-height-changed': 'height_changed',
        'form-screen-changed': 'screen_changed',
        'form-submit': 'submit'
    };

    if (!subscribeTo.hasOwnProperty(messageType)) 
        return;

    action = subscribeTo[messageType];

    var platform = 'typeform',
        namespace = platform,
        object = 'form';

    var eventPayload = {
        
        /**
         * Should result in the following dataLayer events:
         * 
         * - typeform.form_submit
         */
        event: namespace + '.' + object + '_' + action,

        event_context: {
            platform: platform,
            object: object,
            form_response_id: message.data.responseId,
            form_id: message.data.formId
        },

        user_context: {}

    };

    if (action)
        window.dataLayer.push(eventPayload);

});