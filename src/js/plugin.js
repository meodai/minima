'use strict';

var imgPath  = "minima-img/images/";
var iconPath = "minima-img/icons/";

/**
 *  Plug-in Boilerplate
 */

var PluginName = function(options) {

	var defaults = {
		test		: ''
	};

	if (arguments[0] && typeof arguments[0] === 'object') {
		this.options = _extendDefaults(defaults, arguments[0]);
	}

	this.test			= this.options.test;
	this.currentLoop	= 0;

};

function _extendDefaults(source, properties) {
	var property;
	for (property in properties) {
		if (properties.hasOwnProperty(property)) {
			source[property] = properties[property];
		}
	}
	return source;
}

PluginName.prototype = {

	_sayHello: function() {
		console.log(this.test);
	},

	_loop: function() {
		var self = this;
		this.requestId = requestAnimationFrame(function() {
			self._loop();
			self._sayHello();
			self.currentLoop++;
			if (self.currentLoop >= 3) {
				self.stop();
			}
		});
	},

	init: function() {
		this._loop();
	},

	stop: function() {
		window.cancelAnimationFrame(this.requestId);
	}

};


/**
 * Snazzy Maps
 */

google.maps.event.addDomListener(window, 'load', init);
var map;
function init() {
	var mapOptions = {
		center: new google.maps.LatLng(45.900999,6.144725),
		zoom: 15,
		zoomControl: false,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
		},
		disableDoubleClickZoom: true,
		mapTypeControl: false,
		scaleControl: false,
		scrollwheel: true,
		panControl: false,
		streetViewControl: false,
		draggable : true,
		overviewMapControl: false,
		disableDefaultUI: true,
		overviewMapControlOptions: {
		opened: false,
	},
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	styles:
			[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":10}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":10}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":10},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":10}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":10}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":8}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":8},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":8}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":8}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":10}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":7}]}],
	};
	var mapElement = document.querySelector('.snazzy-map');
	map = new google.maps.Map(mapElement, mapOptions);
	var locations = [];
	var i;
	for (i = 0; i < locations.length; i++) {
		if (locations[i][1] =='undefined'){ description ='';} else { description = locations[i][1];}
		if (locations[i][2] =='undefined'){ telephone ='';} else { telephone = locations[i][2];}
		if (locations[i][3] =='undefined'){ email ='';} else { email = locations[i][3];}
		if (locations[i][4] =='undefined'){ web ='';} else { web = locations[i][4];}
		if (locations[i][7] =='undefined'){ markericon ='';} else { markericon = locations[i][7];}
		marker = new google.maps.Marker({
			icon: markericon,
			position: new google.maps.LatLng(locations[i][5], locations[i][6]),
			map: map,
			title: locations[i][0],
			desc: description,
			tel: telephone,
			email: email,
			web: web
		});
		link = '';
	}

/**
 * Display coordinates data on mousemove
 */

	google.maps.event.addListener(map, 'mousemove', function (event) {
		displayCoordinates(event.latLng);
	});

	function displayCoordinates(pnt) {
		var lat = pnt.lat().toFixed(5);
		var lng = pnt.lng().toFixed(5);
		document.querySelectorAll('.fixed-elements-infos-data-content')[1].innerHTML = lat;
		document.querySelectorAll('.fixed-elements-infos-data-content')[3].innerHTML = lng;
	}
	setMarkers(map);
}


var places = [
	['Le Parc', 45.899620, 6.129725],
	["L'Esplanade", 45.901300, 6.132222],
	['Le Banc', 45.903244, 6.135044],
	['La Rive Gauche', 45.904430, 6.14119],
	['MIFA', 45.904222, 6.145750],
	['La Plage', 45.904770, 6.150614],
	['Quelque Part', 45.907420, 6.143070],
	['Le Cinema Pathé', 45.907450, 6.130475],
	['Le Bonlieu', 45.902430, 6.128005],
	['La Banque Savoyarde', 45.900970, 6.127040],
	['La Rive Droite', 45.897870, 6.132690],
	['Le Beau Batiment', 45.89538, 6.130370],
	['Le Milton', 45.896580, 6.123890],
	['Le Campanile', 45.899780, 6.119380],
	["L'Eglise", 45.904022, 6.125010],
	["Pierre Lamy", 45.903933, 6.117245]
];

function setMarkers(map) {

	var image = {
		url: 'minima-img/images/pin.png',
		size: new google.maps.Size(32, 32),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(16, 16)
	};

	for (var i = 0; i < places.length; i++) {
		var place = places[i];
		var marker = new google.maps.Marker({
			position: {lat: place[1], lng: place[2]},
			map: map,
			icon: image,
			zIndex: 101
		});
	}
}


/**
 * Galerie Update
 */

var moment = document.querySelectorAll('.galerie-list-image');
var switchSide = true;
var bigger = 0;

for(var i in moment){
	var thisMoment  = moment[i];
	if(i%5 === 0){
		thisMoment.classList.add('t-col-8');
		bigger++;
	}
	if(i%5 === 0 && i > 0 && i%10 !== 0){
		thisMoment.style.float = 'right';
	}
	if(i%10 === 3){ // regExp would be great
		thisMoment.style.marginLeft= '33.3333333'+'%';
	}
	if(i%10 === 9){
		thisMoment.style.marginRight= '33.3333333'+'%';
	}
}
