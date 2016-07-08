  var cm_map;
  var cm_mapMarkers = [];
  var cm_mapHTMLS = [];

  // Create a base icon for all of our markers that specifies the
  // shadow, icon dimensions, etc.

  // Change these parameters to customize map
  var param_useSidebar = false;
  var param_wsId = 'od6';
  var param_titleColumn = "name";
  var param_descriptionColumn = "website";
  var param_latColumn = "latitude";
  var param_lngColumn = "longitude";
  var param_rankColumn = "rank";
  var param_iconType = "green";
  var param_iconOverType = "orange";
  var JSONGlobal;
  var infowindow = null;

function loadChapters() {
  $.ajax("./chapters.json.php").done(cm_loadMapJSON);
}

  /**
 * Called when JSON is loaded. Creates sidebar if param_sideBar is true.
 * Sorts rows if param_rankColumn is valid column. Iterates through worksheet rows,
 * creating marker and sidebar entries for each row.
 * @param {JSON} json Worksheet feed
 */
function cm_loadMapJSON(json) {
  var usingRank = false;
  json = jQuery.parseJSON(json);
  JSONGlobal = json;

  if(param_useSidebar == true) {
    var sidebarTD = document.createElement("td");
    sidebarTD.setAttribute("width","150");
    sidebarTD.setAttribute("valign","top");
    var sidebarDIV = document.createElement("div");
    sidebarDIV.id = "cm_sidebarDIV";
    sidebarDIV.style.overflow = "auto";
    sidebarDIV.style.height = "450px";
    sidebarDIV.style.fontSize = "11px";
    sidebarDIV.style.color = "#000000";
    sidebarTD.appendChild(sidebarDIV);
    document.getElementById("cm_mapTR").appendChild(sidebarTD);
  }

  if(json[0][param_rankColumn]) {
    usingRank = true;
    json.sort(cm_sortRows);
  }

  infowindow = new google.maps.InfoWindow({
    content: "holding..."
  });


  for (var i = 0; i < json.length; i++) {
    var entry = json[i];
         if(entry[param_latColumn]) {
      var lat = parseFloat(entry[param_latColumn]);
      var lng = parseFloat(entry[param_lngColumn]);
      var point = new google.maps.LatLng(lat,lng);
      var html = "<div style='font-size:12px'>";
      var name = entry[param_descriptionColumn];
      html += "<strong>" + entry[param_titleColumn]
              + "</strong>";
      var cityState = [entry.city,entry.state].join(", ");
      html += "<br>" + cityState
      var label = entry[param_titleColumn];
      var rank = 0;
      if(usingRank && entry[param_rankColumn]) {
        rank = parseInt(entry[param_rankColumn]);
      }
      if(entry[param_descriptionColumn]) {
        html += "<br/><a href='" + entry.website + "'>" + entry.website + "</a>";
      }
      html += "</div>";
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        html: html,
        title: name
      });

      cm_mapMarkers.push(marker);
      cm_mapHTMLS.push(html);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(this.html);
      infowindow.open(map,this);
    });

      if(param_useSidebar == true) {
        var markerA = document.createElement("a");
        markerA.setAttribute("href","javascript:cm_markerClicked('" + i +"')");
        markerA.style.color = "#000000";
        var sidebarText= "";
        if(usingRank) {
          sidebarText += rank + ") ";
        }
        sidebarText += label;
        markerA.appendChild(document.createTextNode(sidebarText));
        sidebarDIV.appendChild(markerA);
        sidebarDIV.appendChild(document.createElement("br"));
        sidebarDIV.appendChild(document.createElement("br"));
      }
    }

  }

}
