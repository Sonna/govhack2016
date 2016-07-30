function initMap() {
  var source_file = "https://sonna.github.io/govhack2016/data/cleaned/landmarks_and_places_of_interest.json";
  var locations;
  $.getJSON(source_file, function(json) {
    console.log(json);
    locations = json;

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: new google.maps.LatLng(-37.8162175,144.9640682),
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

    var marker, i;
    var image = '../images/google-droppin.png'
     for (i = 0; i < locations.length; i++) {
       marker = new google.maps.Marker({
         position: new google.maps.LatLng(locations[i].longitude, locations[i].latitude),
         map: map,
         icon: image
       });
       //Add listener
       google.maps.event.addListener(marker, "click", function (event) {
         var latitude = event.latLng.lat();
         var longitude = Number(event.latLng.lng().toFixed(12));
         console.log( latitude + ', ' + longitude );
         var todoAdded = locations.filter( function(location){
           if (location.latitude == longitude && location.longitude == latitude) {
             return location.latitude == longitude && location.longitude == latitude;
           }
         });
         console.log(todoAdded[0].tags[1]);
         var $todoEvent = $("<div class='todo-event'></div>");
         $("<div class='todo-latitude'>"+latitude+"</div>").appendTo($todoEvent);
         $("<div class='todo-longitude'>"+longitude+"</div>").appendTo($todoEvent);
         $($todoEvent).appendTo('#todo');
         radius = new google.maps.Circle({map: map,
           radius: 500,
           center: event.latLng,
           fillColor: '#777',
           fillOpacity: 0.1,
           strokeColor: 'green',
           strokeOpacity: 0.8,
           strokeWeight: 2,
           draggable: true,    // Dragable
           // editable: true      // Resizable
         });
         // Center of map
         map.panTo(new google.maps.LatLng(latitude,longitude));
       }); //end addListener
     }
   });
 }
