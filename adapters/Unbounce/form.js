/**
 * GTM dataLayer Adapter for Unbounce form interactions.
 * Version: 1.0.1
 * GitHub: https://github.com/derekcavaliero/gtm-adapters/
 * Copyright (c) 2023 McKenna DeBandi <@mck-deb>
 * Credits:
 * References:
 * https://dumbdata.co/listeners/unbounce-form-event-listener/
 */

dataLayer = window.dataLayer || [];
window.ub.hooks.afterFormSubmit.push(function() {

    var platform = 'unbounce',
        object = 'form',
        namespace = platform,
        action = 'submit';

    /**
     * Default configuration should result in the following dataLayer event:
     * - unbounce.form_submit
     */
    var payload = {
        event: namespace + '.' + object + '_' + action,

        event_context: {
            platform: platform,
            object: object,
            form_id: window.ub.page.id + ' - ' + window.ub.page.variantId,
            form_name: window.ub.page.name
        },

        user_context: {}
    };

    dataLayer.push(payload);

});