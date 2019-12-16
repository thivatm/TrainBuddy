//initialize google map
function initMap() {
    //pass long and lat of the place
    var myLatLng = { lat: 7.2906, lng: 80.6337 };
    var map = new google.maps.Map(document.getElementById("map"), {
      center: myLatLng,
      zoom: 15,
      mapTypeControl: false
    });
  
    var autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("searchforPlaces")
    );
  
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);
  
    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
  
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
  
    autocomplete.addListener("place_changed", function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      capturedMoment.long = place ? place.geometry.location.lng() : "";
      capturedMoment.lat = place ? place.geometry.location.lat() : "";
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var locationInfo = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            placelng: capturedMoment.long,
            placelat: capturedMoment.lat
          };
          setDistance(getDistanceValue(locationInfo));
        });
      }
  
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
  
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });
  }
  
  //Function for to give stars as reviews
  $(document).ready(function() {
    /* 1. Visualizing things on Hover - See next part for action on click */
    $("#stars li")
      .on("mouseover", function() {
        var onStar = parseInt($(this).data("value"), 10); // The star currently mouse on
  
        // Now highlight all the stars that's not after the current hovered star
        $(this)
          .parent()
          .children("li.star")
          .each(function(e) {
            if (e < onStar) {
              $(this).addClass("hover");
            } else {
              $(this).removeClass("hover");
            }
          });
      })
      .on("mouseout", function() {
        $(this)
          .parent()
          .children("li.star")
          .each(function(e) {
            $(this).removeClass("hover");
          });
      });
  
    /* 2. Action to perform on click */
    $("#stars li").on("click", function() {
      var onStar = parseInt($(this).data("value"), 10); // The star currently selected
      var stars = $(this)
        .parent()
        .children("li.star");
  
      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass("selected");
      }
  
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass("selected");
      }
  
      // JUST RESPONSE (Not needed)
      var ratingValue = parseInt(
        $("#stars li.selected")
          .last()
          .data("value"),
        10
      );
    });
  });
  
  $(document).ready(function() {
    initMap();
  });
  
  //set distance from current location
  function setDistance(dKM) {
    document.getElementById("distance").innerHTML = dKM + "KM from here";
  }
  
  //get place distance from current location
  var getDistanceValue = function(locationInfo) {
    var rad = function(x) {
      return (x * Math.PI) / 180;
    };
  
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(locationInfo.lat - locationInfo.placelat);
    var dLong = rad(locationInfo.lng - locationInfo.placelng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(locationInfo.placelat)) *
        Math.cos(rad(locationInfo.lat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    var dinKm = d * 0.001;
  
    return Math.round(dinKm); // returns the distance in Kilometer
  };
  