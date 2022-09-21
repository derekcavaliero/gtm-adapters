/**
 * GTM dataLayer Adapter for HTML5 embedded video interactions.
 * Version: 1.0.0
 * Github: https://github.com/derekcavaliero/gtm-adapters
 * Copyright (c) 2022 Derek Cavaliero <@derekcavaliero>
 * Credits: 
 * References: 
 */

dataLayer = window.dataLayer || [];
(function() {

  var platform = 'html5',
      namespace = platform,
      object = 'video';

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

  function setVideoProps(player, force) {

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

    var eventPayload = {

      'event': 'gtm.video',
      'gtm.element': player,
      'gtm.elementUrl': player.currentSrc,
      'gtm.elementId': player.id,
      'gtm.videoStatus': status,
      'gtm.videoProvider': platform,
      'gtm.videoDuration': player.duration, 
      'gtm.videoPercent': calculated.percent, 
      'gtm.videoTitle': player.gtmAdapter.file,
      'gtm.videoUrl': player.currentSrc,

      'event_context': {
        platform: platform,
        object: object,
        video_url: player.currentSrc,
        video_title: player.gtmAdapter.file,
        video_action: status,
        video_player_id: player.id
      },

      'user_context': {}

    };

    window.dataLayer.push(eventPayload);

    if ('complete' == status) 
      setVideoProps(player, true);

  }

  document.addEventListener('loadedmetadata', function(e) {
    setVideoProps(e.target);
  }, true);

  document.addEventListener('play', function(e) {
    
    track('start', e.target, {
      percent: 0
    });

  }, true);

  document.addEventListener('timeupdate', function(e) {

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

  document.querySelectorAll('video').forEach(function(video) {
    setVideoProps(video);
  });

})();