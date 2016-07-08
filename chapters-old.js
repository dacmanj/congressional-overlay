	var cm_map;
	var cm_mapMarkers = [];
	var cm_mapHTMLS = [];

	// Create a base icon for all of our markers that specifies the
	// shadow, icon dimensions, etc.

	// Change these parameters to customize map
	var param_useSidebar = false;
//	var param_ssKey = '0Aixf7_dzGKoEdFFjbDFjeG1TeTd6ZXBPbWdmNXl4LUE';
  var param_ssKey = '0Aixf7_dzGKoEdGhGTFB3NEJZN2h6ak1leUQyUjR6V3c';
	var param_wsId = 'od6';
	var param_titleColumn = "name";
	var param_descriptionColumn = "website";
	var param_latColumn = "latitude";
	var param_lngColumn = "longitude";
	var param_rankColumn = "rank";
	var param_iconType = "green";
	var param_iconOverType = "orange";
	var infowindow = null;

function loadChapters() {

	infowindow = new google.maps.InfoWindow({ content: "holding..." });

  // Retrieve the JSON feed.
  var script = document.createElement('script');

  script.setAttribute('src', 'https://spreadsheets.google.com/feeds/list'
                         + '/' + param_ssKey + '/' + param_wsId + '/public/values' +
                        '?alt=json-in-script&callback=cm_loadMapJSON');
  script.setAttribute('id', 'jsonScript');
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);

  }
  
  /** 
 * Called when JSON is loaded. Creates sidebar if param_sideBar is true.
 * Sorts rows if param_rankColumn is valid column. Iterates through worksheet rows, 
 * creating marker and sidebar entries for each row.
 * @param {JSON} json Worksheet feed
 */       
 var JSONG;
function cm_loadMapJSON(json) {
  var usingRank = false;
  JSONG=json;
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

  if(json.feed.entry[0]["gsx$" + param_rankColumn]) {
    usingRank = true;
    json.feed.entry.sort(cm_sortRows);
  }

  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];
    if(entry["gsx$" + param_latColumn]) {
      var lat = parseFloat(entry["gsx$" + param_latColumn].$t);
      var lng = parseFloat(entry["gsx$" + param_lngColumn].$t);
      var point = new google.maps.LatLng(lat,lng);
      var html = "<div style='font-size:12px'>";
	  var name = entry["gsx$"+param_descriptionColumn].$t;
      html += "<strong>" + entry["gsx$"+param_titleColumn].$t 
              + "</strong>";
      var label = entry["gsx$"+param_titleColumn].$t;
      var rank = 0;
      if(usingRank && entry["gsx$" + param_rankColumn]) {
        rank = parseInt(entry["gsx$"+param_rankColumn].$t);
      }
      if(entry["gsx$" + param_descriptionColumn]) {
        html += "<br/>" + entry["gsx$"+param_descriptionColumn].$t;
      }
      html += "</div>";

      // create the marker
/*      var marker = cm_createMarker(point,label,html,rank);
      map.addOverlay(marker);
      cm_mapMarkers.push(marker);
      cm_mapHTMLS.push(html);

*/
		var marker = new google.maps.Marker({
			  position: point,
			  map: map,
			  title: name,
			  icon: 'http://labs.google.com/ridefinder/images/mm_20_purple.png',
			  shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
		  });
		  marker.html = html;
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
