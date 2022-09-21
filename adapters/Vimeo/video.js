/**
 * GTM dataLayer Adapter for Vimeo embedded video interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 * https://developer.vimeo.com/player/sdk/reference
 */

 dataLayer = window.dataLayer || [];
(function(window, document) {

  var platform = 'vimeo',
      object = 'video';

  /**
   * Thresholds where progress events will be emitted to the dataLayer
   */
  var thresholds = [
    0.10,
    0.25,
    0.50,
    0.75,
    0.90
  ];

  loadApiScript('https://player.vimeo.com/api/player.js', function() {

    window.addEventListener('message', function(message) {

      if ('https://player.vimeo.com' !== message.origin)
        return;

      if ('vimeoPlayerLoaded' == message.data.eventName)
        init(message.data.playerId);

    });

    var iframes = document.querySelectorAll('iframe[src^="https://player.vimeo.com/video/"]');

    if (!iframes) 
      return;

    for (var i = 0; i < iframes.length; i++) {
      init(iframes[i]);
    }

  });

  function init(element) {

    var player = new Vimeo.Player(element);

    player.getDuration().then(function(duration) {
        
      player._duration = duration;
      
      for (var j = 0; j < thresholds.length; j++) {
      
        var threshold = thresholds[j];
        var time = parseInt(threshold * duration);

        player.addCuePoint(time, {
          percent: threshold*100
        });

      }
        
    });

    player.getVideoTitle().then(function(title) { 
      player._title = title; 
    });

    player.getVideoUrl()
      .then(function(url) { 
        player._url = url; 
      })
      .catch(function (err) {
        player._url = '(restricted by privacy settings)';
      });

    player.on('play', function(data) {
      if (data.seconds == 0)
        push(player, 'start', data);
    });

    player.on('cuepoint', function(data) {
      push(player, 'progress', data);
    });

    player.on('ended', function(data) {
      push(player, 'complete', data);
    });

  }

  function push(player, status, event) {

    var payload = {

      'event': 'gtm.video',
      'gtm.element': player.element,
      'gtm.elementUrl': player.element.src,
      'gtm.elementId': player.element.id,
      'gtm.videoStatus': status,
      'gtm.videoProvider': platform,
      'gtm.videoDuration': player._duration,
      'gtm.videoTitle': player._title,
      'gtm.videoUrl': player._url,
      'gtm.videoVisible': true,

      'event_context': {
          platform: platform,
          object: object,
          video_status: status,
          video_provider: platform,
          video_duration: player._duration,
          video_title: player._title,
          video_url: player._url,
          video_player_id: player.element.id
      },

      'user_context': {}

    };

    if (status == 'progress') {
      payload['gtm.videoPercent'] = event.data.percent;
      payload['gtm.videoElapsedTime'] = event.time;
    }

    if (status == 'start') {
      payload['gtm.videoCurrentTime'] = 0;
      payload['gtm.videoElapsedTime'] = 0;
    }

    if (status == 'complete') {
      payload['gtm.videoCurrentTime'] = player._duration;
      payload['gtm.videoElapsedTime'] = player._duration;
    }

    window.dataLayer.push(payload);

  }

  function loadApiScript(src, callback) {
      
    var s,
        r,
        t;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;

    s.onload = s.onreadystatechange = function() {
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true;
        callback();
      }
    };
    
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }
    
})(window, document);