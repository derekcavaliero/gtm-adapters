/**
 * GTM dataLayer Adapter for HTML5 embedded audio/video interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
(function() {

  var platform = 'html5',
      namespace = platform;

  var progressMarkers = [
    10, 
    25,
    50,
    75,
    90
  ];

  function getFilename(src) {
    var path = src.split('/');
    return path[path.length-1];
  }

  function setPlayerProps(player, force) {

    var force = typeof force !== 'undefined' ? force : false;

    if (player.hasOwnProperty('gtmAdapater') && !force)
      return;

    player.gtmAdapter = {
      file: getFilename(player.currentSrc),
      start: false,
      progress: progressMarkers,
      complete: false
    };

  }

  function checkProgress(player) {

    if (player.gtmAdapter && !player.gtmAdapter.progress)
      return false;

    var currentPercent = Math.floor((player.currentTime / player.duration) * 100);

    var surpassedMarkers = player.gtmAdapter.progress.filter(function(marker, index, markers) {
      
      var surpassed = marker <= currentPercent;
      
      if (surpassed)
        markers.splice(index, 1); 

      return surpassed;

    });

    return (surpassedMarkers.length) ? surpassedMarkers[surpassedMarkers.length-1] : false;

  }

  function track(status, player, calculated) {

    if (!player.gtmAdapter)
      return;

    if (['start', 'complete'].indexOf(status) > -1) {
      if (!player.gtmAdapter[status]) {
        player.gtmAdapter[status] = true;
      } else { 
        return; 
      }
    }

    var object = player.nodeName.toLowerCase();
    var action = status;

    var eventPayload = {
      'gtm.element': player,
      'gtm.elementUrl': player.currentSrc,
      'gtm.elementId': player.id,
    };

    if (object == 'video') {

      Object.assign(eventPayload, {

        'event': 'gtm.video',
        
        'gtm.videoStatus': status,
        'gtm.videoProvider': platform,
        'gtm.videoDuration': player.duration, 
        'gtm.videoPercent': calculated.percent, 
        'gtm.videoTitle': player.gtmAdapter.file,
        'gtm.videoUrl': player.currentSrc,

        'event_context': {
          video_url: player.currentSrc,
          video_title: player.gtmAdapter.file,
          video_provider: platform,
          video_duration: player.duration,
          video_percent: calculated.percent, 
          video_status: status,
          video_player_id: player.id
        },

        'user_context': {}

      });
    
    } else if (object == 'audio') {

      Object.assign(eventPayload, {

        'event': namespace + '.' + object + '_' + action,

        'event_context': {
          audio_url: player.currentSrc,
          audio_title: player.gtmAdapter.file,
          audio_provider: platform,
          audio_duration: player.duration,
          audio_percent: calculated.percent, 
          audio_status: status,
          audio_player_id: player.id
        },

        'user_context': {}

      });

    }

    eventPayload.event_context.platform = platform;
    eventPayload.event_context.object = object;

    window.dataLayer.push(eventPayload);

    if ('complete' == status) 
      setPlayerProps(player, true);

  }

  document.addEventListener('loadedmetadata', function(e) {
    setPlayerProps(e.target);
  }, true);

  document.addEventListener('play', function(e) {
    
    track('start', e.target, {
      percent: 0
    });

  }, true);

  document.addEventListener('timeupdate', function(e) {

    var player = e.target;

    var percent = checkProgress(player);

    if (percent)
      track('progress', player, {
        percent: percent
      });

  }, true);

  document.addEventListener('ended', function(e) {
    
    track('complete', e.target, {
      percent: 100
    });

  }, true);

  document.querySelectorAll('video, audio').forEach(function(player) {
    setPlayerProps(player);
  });

})();