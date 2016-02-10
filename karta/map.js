function getScheduleForPlace(place) {
  var allInfo = [];
  if (places[place].url) {
    allInfo.push('<a href="' + places[place].url + '">' + places[place].title + '</a>');
  } else {
    allInfo.push('<u>' + places[place].title + '</u>');
  }

  for (var i = 0, length = schedule.length; i < length; i++) {
    var ev = schedule[i];
    var info = '';
    if (ev.place == place) {
      info += ev.time + ' - ' + ev.mapText;
      if (ev.to) {
        info += ' ' + getLink(ev.to);
      }
      if (ev.via) {
        info += ' via ' + getLink(ev.via);
      }
      allInfo.push(info);
    }
  }

  return allInfo.join('<br>');
}

function getLink(infoObjectName) {
  return '<a onclick="places.' + infoObjectName + '.displayInfo();">(<b>' +
    places[infoObjectName].label + '</b>)</a>';
}

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: { lat: 60.32, lng: 18.30 },
    //disableDefaultUI: true,
    //mapTypeId: google.maps.MapTypeId.SATELLITE,
    zoom: 9,
    //zoomControl: true
  });

  var styles = [{"featureType":"all","elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"administrative","elementType":"all","stylers":[{"color":"#2e2525"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#161414"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"color":"#cabcae"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"weight":"0.01"},{"saturation":"2"},{"lightness":"44"},{"gamma":"1.50"},{"visibility":"off"},{"hue":"#a400ff"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#2d2a2a"},{"weight":"0.58"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"2.68"},{"color":"#171515"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#c9baba"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"road","elementType":"all","stylers":[{"gamma":"1.50"},{"lightness":"-42"},{"weight":"0.58"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#353131"},{"lightness":"13"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]}];
  map.set('styles', styles);

  var infoWindow = new google.maps.InfoWindow({});

  var displayInfo = function (infoObject) {
    infoWindow.close();
    infoWindow.setPosition({ lat: infoObject.latitude, lng: infoObject.longitude });
    infoWindow.setContent(getScheduleForPlace(infoObject.name));
    infoWindow.open(map);
    if (!document.location.hash || document.location.hash != '#' + infoObject.name) {
      document.location.hash = '#' + infoObject.name;
    }
  };

  var markerOnClickHandler = function (infoObject) {
    return function () {
      displayInfo(infoObject);
    }
  };

  var addMarker = function (infoObject) {
    infoObject.marker = new google.maps.Marker({
      position: { lat: infoObject.latitude, lng: infoObject.longitude },
      map: map,
      label: infoObject.label,
      title: infoObject.title
    });
    infoObject.displayInfo = markerOnClickHandler(infoObject);
    infoObject.marker.addListener('click', infoObject.displayInfo);
  };

  for (var i = 0, length = placeNames.length; i < length; i++) {
    addMarker(places[placeNames[i]]);
  }
  places['kyrka'].marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);

  if (document.location.hash) {
    var name = document.location.hash.replace('#', '');
    places[name].displayInfo();
  }
}
