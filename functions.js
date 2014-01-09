/**
	Bare-bones functionality. Attempts to plot the IMDb data dump into a Google Earth application,
	with flight paths that are visually animated over time. 
**/

var ge; // the google earth instance
//the collection of all studios in this visualisation 
var studios = {
		"Animal Logic": {lat: -33.889832, lon: 151.223348},
		"Anthem Visual Effects": {lat: 47.7055348, lon: -116.9058931},
		"Asylum": {lat: 34.0115585, lon: -118.4922867},
		"Asylum VFX": {lat: 34.0115585, lon: -118.4922867},
		"Bain VFX": {lat: 51.5064316, lon: -0.12719},
		"BarXseven": {lat: 45.5214958, lon: -73.5740433},
		"Baseblack": {lat: 51.5168649, lon: -0.1400965},
		"Big Red Pixel": {lat: 51.513151, lon: -0.137651},
		"Blue Sky/VIFX": {lat: 33.979123, lon: -118.4205674},
		"Bluff Hampton Company, The": {lat: 51.458125, lon: -0.188138},
		"Boss": {lat: 33.9852791, lon: -118.4524231},
		"Boss Film": {lat: 33.9852791, lon: -118.4524231},
		"Boss Film Corporation": {lat: 33.9852791, lon: -118.4524231},
		"Boss Film Studios": {lat: 33.9852791, lon: -118.4524231},
		"CFC": {lat: 43.7422485, lon: -79.3824997},
		"CafeFX": {lat: 34.9531288, lon: -120.4346619},
		"Cafe FX": {lat: 34.9531288, lon: -120.4346619},
		"Canada": {lat: 49.3111687, lon: -123.0406113},
		"Centropolis Effects": {lat: 34.0362244, lon: -118.3540115},
		"Cinesite": {lat: 51.515166, lon: -0.134884},
		"Cinesite (Europe)": {lat: 51.515166, lon: -0.134884},
		"Cinesite Digital Imaging": {lat: 51.515166, lon: -0.134884},
		"Cinesite Digital Studios": {lat: 51.515166, lon: -0.134884},
		"CIS Hollywood": {lat: 34.0921021, lon: -118.335968},
		"CIS Vancouver": {lat: 49.269001, lon: -123.106163},
		"Comen VFX": {lat: 34.0185394, lon: -118.479744},
		"Digital Domain": {lat: 33.9961815, lon: -118.4759521},
		"DreamWorks Animation": {lat: 34.1575368, lon: -118.2841361},
		"Double Negative": {lat: 51.512572, lon: -0.131229},
		"ESC Entertainment": {lat: 37.7867125, lon: -122.3082295},
		"Flash Film Works": {lat: 34.0847397, lon: -118.3334351},
		"Framestore": {lat: 51.515212, lon: -0.136698},
		"Framestore CFC": {lat: 51.515212, lon: -0.136698},
		"Fuel International": {lat: -33.892441, lon: 151.185486},
		"Fuel VFX": {lat: -33.892441, lon: 151.185486},
		"Giant Killer Robots": {lat: 37.7804298, lon: -122.3930206},
		"Hydraulx": {lat: 33.9762611, lon: -118.4217758},
		"Ilm": {lat: 37.8003159, lon: -122.4499893},
		"Image Engine": {lat: 49.2667503, lon: -123.105278},
		"Industrial Light & Magic (ILM)": {lat: 37.8003159, lon: -122.4499893},
		"Intelligent Creatures": {lat: 43.6567192, lon: -79.3585281},
		"Jim Henson's Creature Shop": {lat: 51.507377, lon: -0.213939},
		"Lipsync Post": {lat: 51.513439, lon: -0.134292},
		"Luma Pictures": {lat: 34.0143465, lon: -118.496494},
		"Lola Visual Effects": {lat: 34.046478, lon: -118.470741},
		"Manex Visual Effects (MVFX)": {lat: 37.7668304, lon: -122.2453003},
		"Mechnology": {lat: 34.1836575, lon: -118.3214718},
		"Mechnology Visual Effects Studio": {lat: 34.1836575, lon: -118.3214718},
		"Men From Mars": {lat: 51.509642, lon: -0.30667},
		"Meteor Studios": {lat: 45.4841194, lon: -73.5620575},
		"Method Studios": {lat: 34.0203211, lon: -118.4935382},
		"Moving Picture Company (MPC)": {lat: 51.513665, lon: -0.134383},
		"MPC": {lat: 51.513665, lon: -0.134383},
		"Pacific Title and Art Studio": {lat: 34.1671439, lon: -118.3493594},
		"Pixel Magic": {lat: 34.1525688, lon: -118.3627853},
		"Pixomondo": {lat: 34.0179672, lon: -118.4872208},
		"Prime Focus": {lat: 34.104126, lon: -118.326248},
		"Rising Sun Pictures": {lat: -34.925678, lon: 138.606033},
		"Rhythm & Hues": {lat: 33.919295, lon: -118.3906252},
		"Rhythm and Hues": {lat: 33.919295, lon: -118.3906252},
		"Soho VFX": {lat: 43.6388588, lon: -79.4204483},
		"Sony Pictures Imageworks (SPI)": {lat: 34.0153389, lon: -118.4071503},
		"SPI": {lat: 34.0153389, lon: -118.4071503},
		"Synthespian Studios": {lat: 34.1171112, lon: -118.3510056},
		"TheLab": {lat: 40.7518342, lon: -74.0060674},
		"Tippett Studio": {lat: 37.8565254, lon: -122.2889862},
		"Trixter Film": {lat: 48.150315, lon: 11.578163},
		"WETA": {lat: -41.3052101,lon: 174.8235474},
		"Weta Digital": {lat: -41.3052101,lon: 174.8235474},
		"Weta Workshop": {lat: -41.3052101,lon: 174.8235474},
		"Zoic Studios": {lat: 34.0244904, lon: -118.3777008}
};


google.load("earth", "1", {"other_params" : "sensor=false"});
google.setOnLoadCallback(init);

function init() {
	google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
	ge = instance;
	ge.getWindow().setVisibility(true);
	populateMigrations(people);
}

function failureCB(errorCode) {}

/**
 * Manages the data-to-visualisation pipeline. 
 * 
 * @param dataSet - the collection of data
 */
function populateMigrations(dataSet){
	//SET UP THE VARIOUS VFX STUDIOS 
	for(var property in dataSet){
		if(!dataSet.hasOwnProperty(property)) continue; //not a valid property in prototype chain 
		var entry = dataSet[property];
		//iterate through company and releaseDate arrays to plot a path (NB: both [].length are equal)
		if(entry.company.length != entry.release.length) throw new Error(); //shouldn't occur 
		for(var i=0; i<entry.company.length; i++){ 
			var studio = entry.company[i];
			if(!studios.hasOwnProperty(studio)){ //if the studio hasn't been set yet
				studios[studio] = new Object(); //create the studio with default location 
				studios[studio].lat = 90; //TODO - default values
				studios[studio].lon = 0; // TODO - default values  
			}
			if(!ge.getElementById(studio)) setVFXStudio(studio, studios[studio].lat, studios[studio].lon, 0);
		} 
	}
	//CREATE POLYGONS
//	for(var entry in studios){
//		if(!studios.hasOwnProperty(entry)) continue;
//		var studio = studios[entry];
//		console.log(entry);
//		createCirclePolygon(entry, studio.lat, studio.lon, 3);
//	}
	//CREATE LINE STYLE
	var style = createKMLLineStyle("lineStyle", 'ffffffff', 3);
	//PLOT PATHS BETWEEN THE STUDIOS WHERE 'PATH=PERSON MIGRATION'
	for(var property in dataSet){
		if(!dataSet.hasOwnProperty(property)) continue;
		var entry = dataSet[property];
		for(var i=0; i<entry.company.length-1; i++){
			if(entry.company[i] == entry.company[i+1]){
				//do something here
				continue;
			}
			createPath(entry.company[i], entry.company[i+1], getInterpolatedYear(entry, i), getInterpolatedYear(entry, i+1), 3.0, 0, style);
		}
	}
	console.log(studios);
	console.log(people);
}

/**
 * 	If this year entry is succeeded by another year entry that is the same, 
 *	we need to interpolate time over that year 
 *	else, no interpolation needed, just work across this year 
 *
 * @param entry - the person's info
 * @param index - the position of the year that we're looking at in the person's release array
 */
function getInterpolatedYear(entry, index){
	var year = entry.release[index]; 
	//find the startIndex (i.e. when the sequence of 'same years' begin) 
	var startIndex;
	for(var i = 0; i<entry.release.length; i++){
		if(entry.release[i] == year){
			startIndex = i;
			break;
		}
	}
	//find the endIndex (i.e. when the sequence of 'same years' end)
	var endIndex = startIndex;
	while(endIndex + 1 < entry.release.length && year == entry.release[endIndex+1]){
		endIndex++;
	}
	var maxCount = endIndex-startIndex+1; //+1 to be inclusive at both ends
	var count = index-startIndex+1;
	return interpolateTimeBetween(year, (parseInt(year)+1).toString(), count, maxCount);
}

/**
 * Sets a VFX Studio placemark on the Earth. 
 * @param name - the string name of this studio
 * @param latitude - the latitude of the placemark
 * @param longitude - the longitude of the placemark 
 */
function setVFXStudio(name, latitude, longitude, verticalOffset){
	//create the placemark
	var studio = ge.createPlacemark(name);
	studio.setName(name);
	//set the placemark's location
	var point = ge.createPoint('');
	point.setLatitude(latitude);
	point.setLongitude(longitude);
	point.setAltitude(verticalOffset);
	point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
	studio.setGeometry(point);
	//define the studio icon (an icon must sit inside a style, which in turn is inside the placemark)
	var icon = ge.createIcon('');
	var style = ge.createStyle('');
	icon.setHref("http://www.clker.com/cliparts/8/1/2/f/12081853371627177650shuttermonkey_Movie_Clapperboard.svg.med.png");
	style.getIconStyle().setIcon(icon);
	style.getIconStyle().setScale(4.0);
	studio.setStyleSelector(style);
	//add studio to the earth
	ge.getFeatures().appendChild(studio);
}

/**
 * Creates a path between two specified studios over a given time. The line used to draw this path will
 * disappear when the endTime is reached. Note: the efficient use of gx:Track must be coded in KML as
 * currently the Google Earth Plugin API does not support the corresponding JavaScript function. 
 */
function createPath(studioName1, studioName2, timeStart, timeEnd, rise, verticalOffset, style){
	//first need to access the placemarks in the application 
	var studio1 = ge.getElementById(studioName1);
	var studio2 = ge.getElementById(studioName2);
	var s1lat = studio1.getGeometry().getLatitude();
	var s1lon = studio1.getGeometry().getLongitude();
	var s2lat = studio2.getGeometry().getLatitude();
	var s2lon = studio2.getGeometry().getLongitude();
	//now to create a line string between the two studios 
	var KML = 	"<?xml version=\"1.0\" encoding=\"UTF-8\"?> " +
				"<kml xmlns=\"http://www.opengis.net/kml/2.2\" " +
				"xmlns:gx=\"http://www.google.com/kml/ext/2.2\"> ";
	KML += "<Folder> /n";
	if(style != null) KML += style;
	KML += "<Placemark>";
	if(style != null) KML += "<styleUrl>#lineStyle</styleUrl>"; //TODO do not explicitly use #lineStyle 
//	KML += "<name>"+studioName1+"/to/"+studioName2+"</name>\n";
	var diflat = findLeastLatitude(s1lat, s2lat); //s2lat-s1lat;
	var diflon = findLeastLongitude(s1lon, s2lon); //s2lon-s1lon;
	var maxCount = 50.0; //higher number => smoother curve => more work 
	var height = Math.random()*50+50; //=> a random number between 50 and 100
	var KMLTimes;
	var KMLCoords;
	for(var count=0; count <= maxCount; count++){
		var lat = s1lat + diflat*count/maxCount;
		var lon = s1lon + diflon*count/maxCount;
		var countShift = count - maxCount/2.0; //center relative to 0 for parabolic calculation 
		var alt = (-1*Math.pow(countShift*rise, 2)+Math.pow(maxCount/2.0*rise, 2))*height+verticalOffset; //adjust multiplier for height
		KMLTimes  += "<when>" + interpolateTimeBetween(timeStart, timeEnd, count, maxCount) + "</when>\n"; 
		KMLCoords += "<gx:coord>" + lon +" " + lat + " " + alt + "</gx:coord>\n";
	}
	//populate the gx:Track KML string
	KML += "<gx:Track>"+"<altitudeMode>absolute</altitudeMode>"+KMLTimes+KMLCoords+"</gx:Track>";
	KML += "</Placemark> \n</Folder> \n</kml>";
	//add this line to the earth
	ge.getFeatures().appendChild(ge.parseKml(KML));
}

/**
 * Returns <Style> KML for insert into a larger KML body.
 */
function createKMLLineStyle(name, inCol, width){
	var style = "<Style id=\"" + name + "\"> \n<LineStyle>\n";
	style += "<color>" + inCol + "</color> \n";
	style += "<width>" + width + "</width> \n";
	style += "</LineStyle>\n";
	//make it so that there is no icon on the line
	style += "<IconStyle> \n<Icon> \n</Icon> \n</IconStyle> \n";
	style += "</Style> \n";
	return style;
}

function interpolateTimeBetween(timeStart, timeEnd, count, maxCount){
	var start = new Date(timeStart);
	var end = new Date(timeEnd);
	var startMillis = start.getTime();
	var endMillis = end.getTime();
	var difMillis = endMillis-startMillis;
	var dateAsMillis = startMillis+difMillis/maxCount*count;
	var returnDate = new Date(dateAsMillis);
	var year = returnDate.getFullYear().toString();
	var month = returnDate.getMonth()+1 < 10 ? "0" + (returnDate.getMonth()+1).toString() : (returnDate.getMonth()+1).toString();
	var date = returnDate.getDate() < 10 ? "0" + (returnDate.getDate()).toString() : returnDate.getDate().toString();
	return year+"-"+month+"-"+date;
}

/**
 * Returns a double that is the least difference in latitude between the two specified latitude points. 
 * @param lat1
 * @param lat2
 */
function findLeastLatitude(lat1, lat2){
	var diflat = lat2 - lat1;
	if(Math.abs(diflat) > 90){ //i.e. wrapping around the globe the other way is shorter 
		lat1 = lat2 > lat1 ? lat1+180 : lat1;
		lat2 = lat1 > lat2 ? lat2+180 : lat2;
		diflat = lat2 - lat1;
	}
	return diflat;
}

/**
 * Returns a double that is the least difference in longitude between the two specified longitude points. 
 * @param lon1
 * @param lon2
 */
function findLeastLongitude(lon1, lon2){
	var diflon = lon2 - lon1;
	if(Math.abs(diflon) > 180){
		lon1 = lon2 > lon1 ? lon1+360 : lon1;
		lon2 = lon1 > lon2 ? lon2+360 : lon2;
		diflon = lon2 - lon1;
	}
	return diflon;
}

function createCirclePolygon(studioName, centerLat, centerLng, radius) {

	  function makeCircle(centerLat, centerLng, radius) {

	    var ring = ge.createLinearRing('');
	    var steps = 50;
	    var pi2 = Math.PI * 2;
	    for (var i = 0; i < steps; i++) {
	      var lat = centerLat + radius * Math.cos(i / steps * pi2);
	      var lng = centerLng + radius * Math.sin(i / steps * pi2);
	      ring.getCoordinates().pushLatLngAlt(lat, lng, 100000);
	    }
	    return ring;
	  }
	  var polygonPlacemark = ge.createPlacemark('');
	  polygonPlacemark.setGeometry(ge.createPolygon(''));
	  var outer = ge.createLinearRing('');
	  polygonPlacemark.getGeometry().setOuterBoundary(makeCircle(centerLat, centerLng, radius));
	  polygonPlacemark.setName(studioName+"Poly");
	  polygonPlacemark.getGeometry().setExtrude(true);
	  polygonPlacemark.getGeometry().setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
	  polygonPlacemark.setStyleSelector(ge.createStyle(''));
	  polygonPlacemark.getStyleSelector().getPolyStyle().setOutline(0);
	  var polyCol = polygonPlacemark.getStyleSelector().getPolyStyle().getColor();
	  polyCol.setA(0);
	  polyCol.setR(50);
	  polyCol.setG(250);
	  polyCol.setB(200);
	  ge.getFeatures().appendChild(polygonPlacemark);
	}