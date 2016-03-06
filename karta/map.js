function getScheduleForPlace(key) {
  var allInfo = [];
  if (places[key].url) {
    allInfo.push('<a href="' + places[key].url + '">' + places[key].title + '</a>');
  } else {
    allInfo.push('<u>' + places[key].title + '</u>');
  }

  for (var i = 0, length = schedule.length; i < length; i++) {
    var ev = schedule[i];
    var info = '';
    if (ev.place == key) {
      info += 'kl. ' + ev.time + ' - ' + ev.mapText;
      if (ev.to) {
        info += ' ' + getLinkToPlace(ev.to);
      }
      if (ev.via) {
        info += ' via ' + getLinkToPlace(ev.via);
      }
      allInfo.push(info);
    }
  }

  return allInfo.join('<br>');
}

function getLinkToPlace(key) {
  return '<a onclick="places.' + key + '.displayInfo();">(<b>' +
    places[key].label + '</b>)</a>';
}

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: { lat: 60.32, lng: 18.30 },
    zoom: 9,
  });

  var styles = [{"featureType":"all","elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"administrative","elementType":"all","stylers":[{"color":"#2e2525"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#161414"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"color":"#cabcae"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"weight":"0.01"},{"saturation":"2"},{"lightness":"44"},{"gamma":"1.50"},{"visibility":"off"},{"hue":"#a400ff"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#2d2a2a"},{"weight":"0.58"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"2.68"},{"color":"#171515"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#c9baba"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"road","elementType":"all","stylers":[{"gamma":"1.50"},{"lightness":"-42"},{"weight":"0.58"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#353131"},{"lightness":"13"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]}];
  map.set('styles', styles);

  var infoWindow = new google.maps.InfoWindow({});

  var displayInfo = function (place) {
    infoWindow.close();
    infoWindow.setPosition({ lat: place.latitude, lng: place.longitude });
    infoWindow.setContent(getScheduleForPlace(place.key));
    infoWindow.open(map);
    if (!document.location.hash || document.location.hash != '#' + place.key) {
      document.location.hash = '#' + place.key;
    }
  };

  var markerOnClickHandler = function (place) {
    return function () {
      displayInfo(place);
    }
  };

  var addMarker = function (place) {
    place.marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      map: map,
      label: place.label,
      title: place.title
    });
    place.displayInfo = markerOnClickHandler(place);
    place.marker.addListener('click', place.displayInfo);
  };

  for (var i = 0, length = placeKeys.length; i < length; i++) {
    addMarker(places[placeKeys[i]]);
  }
  places['kyrkan'].marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);

  if (document.location.hash) {
    var key = document.location.hash.replace('#', '');
    places[key].displayInfo();
  }
}
