var map;
var markers = [];
var infoWindow;


// window.onload = () => displayStores();

// 34.0522° N, 118.2437° W
// 20.5937° N, 78.9629° E


function initMap() {
  var sydeny = {
    lat:  34.0522,
    lng: -118.2437
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: sydeny,
    zoom: 8,
    mapTypeId: 'roadmap',
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });


  infoWindow = new google.maps.InfoWindow()
  clearLocations();
// SearchStores()
  
 


}




function displayStores(stores) {
  let storesHtml = ""
  stores.forEach(function (store, index) {
    var address = store["addressLines"];
    var name=store["name"]
    // console.log("store", address[0])
    var phone = store["phoneNumber"];

    storesHtml += `  <div class="store-container">
    <div class="store-container-background">
  <div class="store-info-container">
  <div class="store-address">
      <span>${name}</span>
      <span>${address[1]}s</span>

  </div>
  <div class="store-phone-number">
      ${phone}
  </div>
</div>
  <div class="store-number-container">
      <div class="store-number">
        ${index + 1}
      </div>
      </div>
  </div>

</div>`
    document.querySelector(".stores-list").innerHTML = storesHtml
  })
  
}

function showStoresMarkers(stores) {
  var storeList=document.querySelector(".stores-list-container")
  name=document.getElementById("store-name-input").value
  if(name.length!=0){
  storeList.style.display="block"
  }
  var bounds = new google.maps.LatLngBounds();

  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(      // passing lat and lng 
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]);

    var name = store["name"];
    var address = store["addressLines"][0];
    var openStatusText = store["openStatusText"]
    var phoneNumber = store["phoneNumber"]
    bounds.extend(latlng)
    createMarker(latlng, name, openStatusText, phoneNumber, address, index + 1)




  }
  map.fitBounds(bounds)
}

function createMarker(latlng, name, openStatusText, phoneNumber, address, index) {
  var html = `
    <div class="store-info-window">
    <div class="store-info-name">
    ${name}
    </div>
    <div class="store-info-status">
     ${openStatusText}
    </div>
    <div class="store-info-address">
    <i class="circle fas fa-location-arrow"></i>
      ${address}

    </div>
    <div class="store-info-phone">
    <i class="circle fas fa-phone-alt"></i>

    ${phoneNumber}
    
    </div>
    </div>`               // init a marker
  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    
    position: latlng,
    label:((index+1).toString()+ ""+ name[0]),
    opacity:0.7,
   
    map: map
  });
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  markers.push(marker)
  if (document.getElementById("store-name-input").value.length>29){
  setTimeout(()=>{

  document.getElementById("store-name-input").value=""},200)

  }
};

function SearchStores(){
  clearLocations();
 var foundStores=[];
  var storeName=document.getElementById("store-name-input").value
  if(storeName){
  for(var store of stores){
    
  var name=store["name"].toLowerCase()
  
  if(name.includes(storeName.toLowerCase())){
   
    
    foundStores.push(store)
  }
 
}
  }
  else{
    foundStores=stores
  }



displayStores(foundStores)

showStoresMarkers(foundStores)
sentOnClick()

}

function sentOnClick(){
  var storeElements=document.querySelectorAll(".store-container")
  storeElements.forEach(function(store,index){
   
    store.addEventListener("click",()=>{
      new google.maps.event.trigger(markers[index],"click")
    });
  });
}


function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}