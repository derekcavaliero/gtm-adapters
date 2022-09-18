/**
 * GTM dataLayer Adapter for HubSpot embedded video interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
window.addEventListener('message', function(message) {

    var allowedOrigins = [
        'https://play.hubspotvideo.com'
    ];

    if (allowedOrigins.indexOf(message.origin) === -1) 
        return;

    var videoStatus,
        messageType = message.data.type; 

    var subscribeTo = {
        TRACKED_PLAY: 'start',
        PLAYER_PLAY: 'play',
        PLAYER_PAUSE: 'pause',
        PLAYER_ENDED: 'complete',
    };

    if (!subscribeTo.hasOwnProperty(messageType)) 
        return;

    videoStatus = subscribeTo[messageType];

    var videoPlayer = document.getElementById('hs_player_' + message.data.embedId),
        videoUrl = videoPlayer.src.split('?')[0],
        videoTitle = message.data.videoTitle;

    var platform = 'hubspot',
        namespace = platform,
        object = 'video';
    
    var eventPayload = {

        /**
         * Pushing the video event data to GTM in the same format it uses for its native "YouTube" trigger allows 
         * for using the same YouTube trigger without having to create custom dataLayer event triggers for everything.
         **/

        'event': 'gtm.video',
        'gtm.element': player,
        'gtm.elementUrl': videoUrl,
        'gtm.elementId': videoPlayer.id,
        'gtm.videoStatus': videoStatus,
        'gtm.videoProvider': platform,
        'gtm.videoDuration': undefined, 
        'gtm.videoTitle': videoTitle,
        'gtm.videoUrl': playerSrc,

        'event_context': {
            platform: platform,
            object: object,
            video_url: videoUrl,
            video_title: videoTitle,
            video_action: videoStatus,
            video_player_id: videoPlayer.id
        },

        'user_context': {}

    };

    window.dataLayer.push(eventPayload);

});