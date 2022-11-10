/**
 * GTM dataLayer Adapter for Vidyard embedded video interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

(function(window, document) {

  var platform = 'vidyard',
      namespace = platform,
      object = 'video';

  /**
   * Thresholds where progress events will be emitted to the dataLayer
   */
   var progressMarkers = [
    10, 
    25,
    50,
    75,
    90
  ];

  function push(action, player, metrics) {

    var metrics = typeof metrics !== "undefined" ? metrics : {
      percent: undefined,
      elapsedTime: undefined
    };

    var videoUrlObject = new URL(player.iframe.src);
    var videoUrl = videoUrlObject.origin + '/' + player.uuid;

    var _payload = {
      'event': 'gtm.video',
      
      'gtm.element': player.iframe,
      'gtm.elementUrl': videoUrl,
      //'gtm.elementId': player.element.id,

      'gtm.videoStatus': action,
      'gtm.videoProvider': platform,
      'gtm.videoPercent': metrics.percent,
      'gtm.videoDuration': player.metadata.length_in_seconds,
      'gtm.videoElapsedTime': metrics.elapsedTime,
      'gtm.videoTitle': player.metadata.name,
      'gtm.videoUrl': videoUrl,
      'gtm.videoVisible': true,

      'event_context': {
        platform: platform,
        object: object,
        video_status: action,
        video_provider: platform,
        video_duration: player.metadata.length_in_seconds,
        video_title: player.metadata.name,
        video_url: videoUrl,
        // video_player_id: player.element.id,
        video_elapsed_time: metrics.elapsedTime,
        video_percent: metrics.percent
      },

      'user_context': {}
    };
    
    window.dataLayer.push(_payload);

  }

  function setupListeners(players) {
    
    players.forEach(function(player) {

      player.gtmAdapter = true;

      player.on('play', function (eventTime) {

        action = 'play';

        if (eventTime == 0)
          action = 'start';

        push(action, this, {
          elapsedTime: eventTime
        });

      });

      player.on('pause', function() {
        push('pause', this);
      });

      player.on('videoComplete', function(videoIndex) {
        push('complete', this, {
          elapsedTime: this.metadata.length_in_seconds
        });
      });

    });

  };

  function init() {

    if (window.vidyardEmbed && window.vidyardEmbed.players)
      setupListeners(window.vidyardEmbed.players);

    window.onVidyardAPI = function(vidyardEmbed) {

      setupListeners(vidyardEmbed.players);

      vidyardEmbed.api.progressEvents(function(result) {
        
        push('progress', result.player, {
          percent: result.event
        });

      }, progressMarkers);

    };

  }

  init();

})(window, document);