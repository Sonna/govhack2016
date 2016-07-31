var map;
var sourceFile = "data/data.json";
var locations;
var estimatedTime = 1.5;
var zoom = 15;
var center;
var userMarkers = [];

var directionsDisplay;
var directionsService;

function initMap() {
  directionsService = new google.maps.DirectionsService();
  $.getJSON(sourceFile, function(json) {
    locations = json;

    if (typeof map != "undefined") { zoom = map.getZoom(); }
    if (typeof map != "undefined") {
      center = map.getCenter();
    } else {
      center = new google.maps.LatLng(-37.8162175,144.9640682);
    }

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoom,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          "featureType":"water",
          "elementType":"geometry.fill",
          "stylers":[{"color":"#d3d3d3"}]
        },
        {
          "featureType":"transit",
          "stylers":[
            {"color":"#808080"},
            {"visibility":"off"}
          ]
        },
        {
          "featureType":"road.highway",
          "elementType":"geometry.stroke",
          "stylers":[
            {"visibility":"on"},
            {"color":"#b3b3b3"}
          ]
        },
        {
          "featureType":"road.highway",

          "elementType":"geometry.fill",
          "stylers":[
            {"color":"#ffffff"}
          ]
        },
        {
          "featureType":"road.local",
          "elementType":"geometry.fill",
          "stylers":[
            {"visibility":"on"},
            {"color":"#ffffff"},
            {"weight":1.8}
          ]
        },
        {
          "featureType":"road.local",
          "elementType":"geometry.stroke",
          "stylers":[
            {"color":"#d7d7d7"}
          ]
        },
        {
          "featureType":"poi",
          "elementType":"geometry.fill",
          "stylers":[
            {"visibility":"on"},
            {"color":"#ebebeb"}
          ]
        },
        {
          "featureType":"administrative",
          "elementType":"geometry",
          "stylers":[
            {"color":"#a7a7a7"}
          ]
        },
        {
          "featureType":"road.arterial",
          "elementType":"geometry.fill",
          "stylers":[
            {"color":"#ffffff"}
          ]
        },
        {
          "featureType":"road.arterial",
          "elementType":"geometry.fill",
          "stylers":[
            {"color":"#ffffff"}
          ]
        },
        {
          "featureType":"landscape",
          "elementType":"geometry.fill",
          "stylers":[
            {"visibility":"on"},
            {"color":"#efefef"}
          ]
        },
        {
          "featureType":"road",
          "elementType":"labels.text.fill",
          "stylers":[
            {"color":"#696969"}
          ]
        },
        {
          "featureType":"administrative",
          "elementType":"labels.text.fill",
          "stylers":[
            {"visibility":"on"},
            {"color":"#737373"}
          ]
        },
        {
          "featureType":"poi",
          "elementType":"labels.icon",
          "stylers":[
            {"visibility":"off"}
          ]
        },
        {
          "featureType":"poi",
          "elementType":"labels",
          "stylers":[
            {"visibility":"off"}
          ]
        },
        {
          "featureType":"road.arterial",
          "elementType":"geometry.stroke",
          "stylers":[
            {"color":"#d6d6d6"}
          ]
        },
        {
          "featureType":"road",
          "elementType":"labels.icon",
          "stylers":[
            {"visibility":"off"}
          ]
        },
        {},
        {
          "featureType":"poi",
          "elementType":"geometry.fill",
          "stylers":[
            {"color":"#dadada"}
          ]
        }
      ]
    });
    setMarkers(map, locations);
  });
}

function setMarkers(map, locations) {
  var marker, i;
  var image = '../images/google-droppin.png';
   for (i = 0; i < locations.length; i++) {
     marker = new google.maps.Marker({
       position: new google.maps.LatLng(locations[i].longitude, locations[i].latitude),
       map: map,
       icon: image
     });

     //Add listener
     google.maps.event.addListener(marker, "click", function (event) {
      userMarkers.push(marker);

       var latitude = event.latLng.lat();
       var longitude = Number(event.latLng.lng().toFixed(12));
       var selectedImage = new google.maps.MarkerImage("../images/google-droppin-selected.png");
       //  var selectedImage = "../images/google-droppin-selected.png";

       // Change drop pin color on selection
       console.log(marker);
       marker = new google.maps.Marker({
         position: new google.maps.LatLng(latitude, longitude),
         map: map,
         icon: selectedImage,
         zIndex: 999
       });

       console.log( latitude + ', ' + longitude );

       var todoAdded = locations.filter( function(location){
         if (location.latitude == longitude && location.longitude == latitude) {
           return location.latitude == longitude && location.longitude == latitude;
         }
       });
       console.log(todoAdded[0].tags[1]);

       var $todoEvent = $("<li class='todo-event'></li>");
       $("<div class='todo-geo'></div>").attr('data-lat', latitude).attr('data-long', longitude).appendTo($todoEvent);
       $("<div class='todo-close'>&#10005;</div>").appendTo($todoEvent);
       $("<div class='todo-name'>" + todoAdded[0].name + "</div>").appendTo($todoEvent);
       $("<div class='todo-site'>" + todoAdded[0].tags[1] + "</div>").appendTo($todoEvent);
       $($todoEvent).appendTo('#todo');
       $('.todo-time').css('display', 'block').html('EXPECTED TRANSIT TIME: '+ estimatedTime +' HOURS');
       estimatedTime += 1.5;

       $("#todo").sortable({
         connectWith: "#todo",
         helper: "clone",
         appendTo: "body"
       });

       // Center of map
       map.panTo(new google.maps.LatLng(latitude,longitude));
     }); //end addListener
   }
 }

var markers = [];

function reloadMarkers(map, locations) {
  // Loop through markers and set map to null for each
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = []; // Reset the markers array
  setMarkers(map, locations); // Call set markers to re-add markers
}

$(function() {
  $('#todo').on('click', '.todo-close',function() {
    $(this).parent().remove();
    // var index = $("#todo").children().size();
    userMarkers.splice($(this).index(), 1);
  })
})

$(function() {
  $('.map-icon.camping').on('click',function() {
    sourceFile = "data/categories/data_camping.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.caravan").on('click', function() {
    sourceFile = "data/categories/data_caravan.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.heritage").on('click', function() {
    sourceFile = "data/categories/data_heritage.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.fishing").on('click', function() {
    sourceFile = "data/categories/data_fishing.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.picnicing").on('click', function() {
    sourceFile = "data/categories/data_picnicing.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.trees").on('click', function() {
    sourceFile = "data/categories/data_trees.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.landmarks").on('click', function() {
    sourceFile = "data/categories/data_landmarks.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.huts").on('click', function() {
    sourceFile = "data/categories/data_huts.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.recreation").on('click', function() {
    sourceFile = "data/categories/data_recreation.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.leisure").on('click', function() {
    sourceFile = "data/categories/data_leisure.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.worship").on('click', function() {
    sourceFile = "data/categories/data_worship.json";
    initMap();
  })
})

$(function() {
  $(".map-icon.wildlife").on('click', function() {
    sourceFile = "data/categories/data_wildlife.json";
    initMap();
  })
})

$(function() {
  $("#routebtn").on('click', function() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var start = userMarkers[1].getPosition();
    var end = userMarkers[userMarkers.length - 1].getPosition();

    calcRoute(map, start, end);
  })
})

function groupLocations(locations) {
  // Grouped by tags
  var allTags = $.map(locations, function (data) { return data.tags; })
  var allUniqueTags = $.unique(allTags);
  console.log(allUniqueTags);

  var locationsGroupedByTags = {};
  for (var tag in allUniqueTags) {
    locationsGroupedByTags[allUniqueTags[tag]] = [];
  }
  // console.log(locationsGroupedByTags);

  for (i = 0; i < locations.length; i++) {
    var location = locations[i];

    for (var tag in allUniqueTags) {
      var currentTag = allUniqueTags[tag];
      if ($.inArray(currentTag, location.tags) > -1) {
        locationsGroupedByTags[currentTag].push(location);
      }
    }
  }

  return locationsGroupedByTags;
}

function calcRoute(map, start, end) {
  // var start = new google.maps.LatLng(37.334818, -121.884886);
  // //var end = new google.maps.LatLng(38.334818, -181.884886);
  // var end = new google.maps.LatLng(37.441883, -122.143019);
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.WALKING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
    } else {
      alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
    }
  });
}

// google.maps.event.addDomListener(window, 'load', initialize);
