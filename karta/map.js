var places = {};

places.dinner = {
  label: 'W',
  position: { lat: 60.37122, lng: 18.15273 },
  title: 'Forsmarks Wärdshus',
  getInfo: function () { return '<u>' + this.title + '</u>' +
    '<br><b>lör. 17.30</b> - middag och fest' +
    '<br><b>sön. 02.00</b> - buss tillbaka till ' + getLink('notvallen') + ' via ' + getLink('hotel')
  }
};

places.church = {
  label: 'K',
  position: { lat: 60.3722, lng: 18.1601 },
  title: 'Forsmarks kyrka',
  getInfo: function () { return '<u>' + this.title + '</u>' +
      '<br><b>lör. 16.00</b> - <a href="/fest/">vigsel</a>'
  }
};

places.hotel = {
  label: 'S',
  position: { lat: 60.341045, lng: 18.4394803 },
  title: 'Strandhotellet',
  getInfo: function () { return '<u>' + this.title + '</u>' +
    '<br><b>lör. 15.15</b> - buss mot kyrkan ' + getLink('church')
  }
};

places.notvallen = {
  label: 'N',
  position: { lat: 60.23107, lng: 18.40467 },
  title: 'Notvallen',
  getInfo: function () { return '<u>' + this.title + '</u>' +
    '<br><b>lör. 14.45</b> - buss mot kyrkan ' + getLink('church') + ' via ' + getLink('hotel') +
    '<br><b>sön. ca 12</b> - <a href="/veta/">brunch</a>';
  }
};

function getLink(infoObjectName) {
  return '<a onclick="places.' + infoObjectName + '.displayInfo();">(' +
    places[infoObjectName].label + ')</a>';
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
  /*map.set('styles',
    [
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]
  );*/


  var infoWindow = new google.maps.InfoWindow({});

  var displayInfo = function (infoWindowObject, infoObject) {
    infoWindowObject.close();
    infoWindowObject.setPosition(infoObject.position);
    infoWindowObject.setContent(infoObject.getInfo());
    infoWindowObject.open(map);
  };

  var markerOnClickHandler = function (infoWindowObject, infoObject) {
    return function () {
      displayInfo(infoWindowObject, infoObject);
    }
  };

  var addMarker = function (infoObject) {
    infoObject.marker = new google.maps.Marker({
      position: infoObject.position,
      map: map,
      label: infoObject.label,
      title: infoObject.title
    });
    //infoObject.marker.addListener('click', markerOnClickHandler(infoWindow, infoObject));
    infoObject.displayInfo = markerOnClickHandler(infoWindow, infoObject);
    infoObject.marker.addListener('click', infoObject.displayInfo);
  };

  addMarker(places.dinner);
  addMarker(places.church);
  places.church.marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
  addMarker(places.hotel);
  addMarker(places.notvallen);

}
