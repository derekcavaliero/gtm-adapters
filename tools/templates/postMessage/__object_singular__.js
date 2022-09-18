/**
 * GTM dataLayer Adapter for __platform__(noCase) embedded __object_singular__ interactions.
 * Version: 1.0.0
 * Github: __repository_home__
 * Copyright (c) 2022 __author__(noCase)
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

    /**
     * Most messages emit from content embedded via `<iframe>` elements.
     * However, the current window can also emit a message via the postMessage API to itself. Therefore, you may need to include your own 1st party origins in this array to ensure that messages are claimed. 
     * For highly variable origins - consider switching this to a regex match instead.
     */
    var allowedOrigins = [];

    if (allowedOrigins.indexOf(message.origin) === -1) 
        return;

    // Used in the generation of the dataLayer event name. 
    var action;

    /**
     * `message.data.event` is an assumed value and may not exist. 
     * This may need set to a different property in the `message.data` object.
     */
    var messageType = message.data.event; 

    /**
     * Message : Action mapping
     * 
     * The resulting action will be prefixed with the singular object name (e.g. `__object_singular__(lowerCase)_`)
     * 
     * This object determines the following:
     * - Which messages are being transformed into dataLayer events.
     * - What the resulting action
     * 
     * If you wish to "unsubscribe" or ignore particular message types, simply omit them 
     * or comment out the key: value pair.
     */
    var subscribeTo = {};

    if (!subscribeTo.hasOwnProperty(messageType)) 
        return;

    action = subscribeTo[messageType];

    var platform = '__platform__(lowerCase)',
        namespace = platform,
        object = '__object_singular__(lowerCase)';

    var eventPayload = {
        
        /**
         * Should result in the following dataLayer events:
         * 
         * - __platform__(lowerCase).__object_singular__(lowerCase)_
         */
        event: namespace + '.' + object + '_' + action,

        event_context: {
            platform: platform,
            object: object
        },

        user_context: {}

    };

    if (action)
        window.dataLayer.push(eventPayload);

});