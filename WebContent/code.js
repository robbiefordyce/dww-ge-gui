/**
Initial tester code for developing the Google Earth skeletal browser application.
Written in javascript. 
**/

var ge;
var startLat = -41.306424; //THE WETA CAVE Coordinates 
var startLong = 174.824357;
var minHeight = 600000;

google.load("earth", "1", {"other_params" : "sensor=false"});

function init() {
	google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
	ge = instance;
	setVisibilities();
	setAltitudeLimits(minHeight);
//	addLogoOverlay("https://sites.google.com/site/robbieskml/kmltester/royalsociety.png", 0.1, 0.25, 0.1836, 0.2);
//	addLogoOverlay("https://sites.google.com/site/robbieskml/kmltester/victoria.png", 0.1, 0.1, 0.1836, 0.2);
	//set up the title
	addTitleOverlay("https://sites.google.com/site/robbieskml/kmltester/IntroBar.png");
	google.earth.addEventListener(ge.getWindow(), 'mousedown', continueFn);
	google.earth.addEventListener(ge.getWindow(), 'mouseup', setView);
	google.earth.addEventListener(ge, 'frameend', spinGlobe);
	//recolour the globe
	skinGlobe(); //makes surface blue and adds geometry lines  
	addKmlFromUrl("https://sites.google.com/site/robbieskml/kmltester/earth-hover-lite.kml"); //adds world map
	//SET the placemarks of the studios
	setVFXStudio('WETA_DIGITAL', -41.305281, 174.823495, minHeight);
	setVFXStudio('ANIMAL_LOGIC_FILM', -33.892968, 151.228577, minHeight);
	setVFXStudio('DOUBLE_NEGATIVE_VFX', 51.52120300000001, 0.143079, minHeight);
	setVFXStudio('BAKED_FX', 34.026646, -118.390028, minHeight);
	setVFXStudio('INTELLIGENT_CREATURES', 43.656842, -79.35882700000001, minHeight);
	
	var lineStyle = createKMLLineStyle('lineStyle', '11ffffff', 3);
	
	createPath('WETA_DIGITAL', 'BAKED_FX', '2000-01-01', '2002-12-12', minHeight, lineStyle);
	createPath('WETA_DIGITAL', 'ANIMAL_LOGIC_FILM', '2000-01-01', '2002-12-12', minHeight, lineStyle);
	createPath('ANIMAL_LOGIC_FILM', 'DOUBLE_NEGATIVE_VFX', '2004-01-01', '2006-12-12', minHeight, lineStyle);
	createPath('DOUBLE_NEGATIVE_VFX', 'BAKED_FX', '2008-01-01', '2010-12-12', minHeight, lineStyle);
	createPath('BAKED_FX', 'INTELLIGENT_CREATURES', '2012-01-01', '2014-12-12', minHeight, lineStyle);
	createPath('INTELLIGENT_CREATURES', 'WETA_DIGITAL', '2016-01-01', '2018-12-12', minHeight, lineStyle);
}

function failureCB(errorCode) {}

/**
 * This method is used to input the KML into the 3D Viewer.
 * @param kmlUrl - the URL on the internet where the KML/KMZ file is stored 
 */
function addKmlFromUrl(kmlUrl) {
	  var link = ge.createLink('');
	  link.setHref(kmlUrl);
	  var networkLink = ge.createNetworkLink('');
	  networkLink.setLink(link);
	  networkLink.setFlyToView(false);
	  ge.getFeatures().appendChild(networkLink);
}

function setVisibilities(){
	ge.getWindow().setVisibility(true);
	ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
	ge.getTime().getControl().setVisibility(ge.VISIBILITY_AUTO);
	ge.getOptions().setAtmosphereVisibility(true);
	ge.getOptions().setOverviewMapVisibility(false);
	ge.getNavigationControl().setStreetViewEnabled(false);
	ge.getOptions().setAutoGroundLevelViewEnabled(false);
	ge.getOptions().setFadeInOutEnabled(true);
}

/**
 * Initially sets the view in the 3D Viewer based upon starting lat/lon coordinates. 
 */
function setView(){
	var lookAt = ge.createLookAt('');
	lookAt.setLatitude(startLat); 
	lookAt.setLongitude(startLong);
	lookAt.setRange(minHeight*2);
	ge.getView().setAbstractView(lookAt);
	google.earth.removeEventListener(ge.getWindow(), 'mouseup', setView);
}

/**
 * Prevents zooming in too close to the earth's surface. Note that the maximum zoom in distance is variable. 
 */
function setAltitudeLimits(lowerLimit){
	google.earth.addEventListener(ge.getView(), 'viewchange', function(){
		var camera = ge.getView().copyAsCamera(ge.ALTITUDE_ABSOLUTE);
		if(camera.getAltitude() < lowerLimit){
			//ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT); //Jagged Buffer
			ge.getOptions().setFlyToSpeed(4.5); //fluid buffer
			camera.setAltitude(lowerLimit+100); //+10/+100 provides extra vertical distance to move around 
												//immediately after hitting the buffer 
			ge.getView().setAbstractView(camera);
		}
	});
}

/**
 * Customises the skinning of the Earth in this plugin. The look and feel wants to reflect the blue-print
 * theme carried throughout the Digital Workshops of the World site. 
 */
function skinGlobe(){
	var skin = ge.createGroundOverlay('');
	//specify the image path, set it to the skin
	skin.getColor().setR(61);
	skin.getColor().setG(87);
	skin.getColor().setB(167);
	//set the overlay
	var bounds = ge.createLatLonBox('');
	bounds.setBox(90, -90, 180, -180, 0);
	skin.setLatLonBox(bounds);
	ge.getFeatures().appendChild(skin);
	skinGrid();
}

/**
 * Adds grid lines to the globe. 
 */
function skinGrid(){
	var gridLines = ge.createPlacemark('');
	gridLines.setGeometry(ge.createMultiGeometry(''));
	gridLines.setStyleSelector(ge.createStyle(''));
	var grid = gridLines.getGeometry().getGeometries();
	//set the line style
	var lineStyle = gridLines.getStyleSelector().getLineStyle();
	lineStyle.setWidth(0.5);
	lineStyle.getColor().set('22ffffff');
	//now draw lines from left to right of the globe
	for(var lat = -90; lat < 90; lat += 10){
		var line = ge.createLineString('');
		for(var lon = -180; lon <= 180; lon++){
			line.getCoordinates().pushLatLngAlt(lat, lon, 0);
		}
		grid.appendChild(line);
	}
	//now draw lines from top to bottom
	for(var lon = -180; lon < 180; lon += 10){
		var line = ge.createLineString('');
		for(var lat = -80; lat <= 80; lat++){ //prevents all the latitude lines converging at the top 
			line.getCoordinates().pushLatLngAlt(lat, lon, 0);
		}
		grid.appendChild(line);
	}
	ge.getFeatures().appendChild(gridLines);
}

/**
 * Creates a custom dialog to introduce the application.
 */
function addTitleOverlay(imgUrl){
	var introOverlay = ge.createScreenOverlay('introOverlay');
	var image = ge.createIcon('');
	image.setHref(imgUrl);
	introOverlay.setIcon(image);
	introOverlay.getOverlayXY().set(0.5, ge.UNITS_FRACTION, 0.5, ge.UNITS_FRACTION);
	introOverlay.getScreenXY().set(0.5, ge.UNITS_FRACTION, 0.5, ge.UNITS_FRACTION);
	introOverlay.getSize().set(0.5, ge.UNITS_FRACTION, 0.5, ge.UNITS_FRACTION);
	ge.getFeatures().appendChild(introOverlay);
}

/**
 * Function that manages the transition from the title sequence into the application. 
 */
function continueFn(){
	google.earth.removeEventListener(ge, 'frameend', spinGlobe);
	ge.getFeatures().removeChild(ge.getElementById('introOverlay'));
	google.earth.removeEventListener(ge.getWindow(), 'mousedown', continueFn);
}

/**
 * Spins the globe about its axis. Function performed on start up.  
 */
function spinGlobe(){
	var camera = ge.getView().copyAsCamera(ge.ALTITUDE_ABSOLUTE);
	camera.setLongitude(camera.getLongitude()+25);
	ge.getView().setAbstractView(camera);
}

/**
 * Places the Royal Society logo and Victoria logo onto the screen.
 * @param posX and posY - fractions across the screen i.e.(values from 0.0 to 1.0)
 * @param sizeX and sizeY - fractions of original (i.e. 1.0 for unscaled res)
 */
function addLogoOverlay(pathUrl, posX, posY, sizeX, sizeY){
	var overlay = ge.createScreenOverlay('');
	var icon = ge.createIcon('');
	//link to images
	icon.setHref(pathUrl);
	overlay.setIcon(icon);
	//position logo
	overlay.getOverlayXY().setXUnits(ge.UNITS_FRACTION);
	overlay.getOverlayXY().setYUnits(ge.UNITS_FRACTION);
	overlay.getOverlayXY().setX(posX);
	overlay.getOverlayXY().setY(posY);
	//resize logo
	overlay.getSize().setXUnits(ge.UNITS_FRACTION);
	overlay.getSize().setYUnits(ge.UNITS_FRACTION);
	overlay.getSize().setX(sizeX);
	overlay.getSize().setY(sizeY);
	//set alpha
	overlay.setOpacity(0.4);
	//add to screen
	ge.getFeatures().appendChild(overlay);
}

/**
 * Creates a VFX Studio placemark on the Earth. 
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
 * currently the Google Plugin API does not support the corresponding JavaScript function. 
 */
function createPath(studioName1, studioName2, timeStart, timeEnd, verticalOffset, style){
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
	if(style != null) KML += "<styleUrl>#lineStyle</styleUrl>";
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
		var alt = (-1*Math.pow(countShift, 2)+Math.pow(maxCount/2.0, 2))*height+verticalOffset; //adjust multiplier for height
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

    
google.setOnLoadCallback(init);