/**
 * GTM dataLayer Adapter for HubSpot embedded form interactions.
 * Version: 1.0.1
 * GitHub: https://github.com/derekcavaliero/gtm-adapters/
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 * https://legacydocs.hubspot.com/global-form-events
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

    if ('hsFormCallback' != message.data.type) return;

    var callback = message.data.eventName;
    
    var subscribeTo = {
        onFormReady: 'loaded',
        onFormFailedValidation: 'failed_validation',

        // See this community post for an important note on an unresolved bug for the following 2 callbacks.
        // https://community.hubspot.com/t5/HubSpot-Ideas/Issues-with-HubSpot-onFormSubmit-onFormSubmitted-Callbacks/idc-p/675058#M119504
        onFormSubmit: 'submit',
        onFormSubmitted: 'submitted'
    };

    if (!subscribeTo.hasOwnProperty(callback)) return;

    var action = subscribeTo[callback];

    var platform = 'hubspot',
        object = 'form',
        namespace = platform;

    var formGuid = message.data.id;

    var eventPayload = {

        /**
         * Default configuration should result in the following dataLayer events:
         * - hubspot.form_loaded
         * - hubspot.form_failed_validation
         * - hubspot.form_submit
         * - hubspot.form_submitted
         */
        event: namespace + '.' + object + '_' + action,

        event_context: {
            platform: platform,
            object: object,
            form_id: formGuid
        },

        user_context: {}
    };

    window.dataLayer.push(eventPayload);

});