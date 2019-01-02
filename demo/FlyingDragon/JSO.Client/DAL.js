/**
* Data Access Layer (DAL)
* Handles all data access - hides data access from MVC/Business layer
*/

(function()
{
	//Just cause it's easier: enum of xml node types primarily to distinguish text from element easily
	var XML_NODE_TYPE = {
		ELEMENT: 1,
		ATTRIBUTE: 2,
		TEXT: 3,
		CDATA_SECTION: 4,
		ENTITY_REF: 5,
		ENTITY: 6,
		PROC_INSTR: 7,
		COMMENT: 8,
		DOCUMENT: 9,
		DOC_TYPE: 10,
		DOC_FRAG: 11,
		NOTATION: 12
	};

	//Old GRAP connection:
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET", baseURL + "data/gameData.xml", false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;

	/**
	* DAL
	* Data access layer class
	*/
	var DAL = namespace('JSO.Client.DAL');
	JSO.Client.DAL = JSO.Client.Class.extend({
		constructor: JSO.Client.DAL,
		construct: function () {
			this.DATA_CONNECTION = 'http://localhost';
			//Store refs to key nodes so they aren't being constantly searched for
			this.resources = xmlDoc.getElementsByTagName('resources')[0];
			this.settings = xmlDoc.getElementsByTagName('settings')[0];

			//Initialize globals
			this.loadResources();
			this.loadSettings();
		},

		/**
		* loadSettings
		* Loads all global application settings as defined in the xml source
		*/
		loadSettings: function () {
			var i = this.settings.childNodes.length;
			window.SETTINGS = {};

			while (i--) {
				var nod = this.settings.childNodes[i];
				if (nod.nodeType == XML_NODE_TYPE.ELEMENT || nod.nodeType == XML_NODE_TYPE.ATTRIBUTE || nod.nodeType == XML_NODE_TYPE.ENTITY) {
					window[nod.tagName] = isNumeric(nod.textContent) ? parseFloat(nod.textContent) : nod.textContent;
					window.SETTINGS[nod.tagName] = window[nod.tagName];
					if (nod.attributes['values']) {
						window[nod.tagName + '.values'] = nod.attributes['values'].value;
					}
				}
			}

			//Maintain a list of all defined, qualified attributes for quick lookup
			var meta = this.resources = xmlDoc.getElementsByTagName('meta')[0];
			var mdls = xmlDoc.getElementsByTagName('model');

			var m = mdls.length;
			while (m--) {
				var nod = mdls[m];
				this.getXMLNode('typename', nod.attributes['typename'].value, meta)
				var a = nod.childNodes.length;
				while (a--) {
					var attrNod = nod.childNodes[a];
					if (this.isValidXMLNode(attrNod)) {
						if (attrNod.attributes['typename']) {
							window.ATTRIBUTE_NAMES += (window.ATTRIBUTE_NAMES == undefined ? '' : ',') + nod.attributes['typename'].value + '.' + attrNod.attributes['typename'].value
						}
					}
				}
			}
			var vws = xmlDoc.getElementsByTagName('model');

			var v = vws.length;
			while (v--) {
				var nod = vws[v];
				this.getXMLNode('typename', nod.attributes['typename'].value, meta)
				var a = nod.childNodes.length;
				while (a--) {
					var attrNod = nod.childNodes[a];
					if (this.isValidXMLNode(attrNod)) {
						if (attrNod.attributes['typename']) {
							window.ATTRIBUTE_NAMES += (window.ATTRIBUTE_NAMES == undefined ? '' : ',') + nod.attributes['typename'].value + '.' + attrNod.attributes['typename'].value
						}
					}
				}
			}
		},

		/**
		* loadResources
		* Loads all application resource files (images, animations, etc.).  Resources are all loaded on startup and cached
		*/
		loadResources: function () {
			this.images = {};

			var i = this.resources.childNodes.length;
			while (i--) {
				var nod = this.resources.childNodes[i];
				if (this.isValidXMLNode(nod)) {
					switch (nod.tagName) {
						//Load images
						case 'image':
							var imgObj = {
								typename: nod.attributes['typename'].value,
								image: new Image()
							}
							imgObj.image.src = baseURL + nod.attributes['src'].value;
							var a = nod.attributes.length;
							while (a--) {
								var attrName = nod.attributes[a].nodeName;
								var attrVal = nod.attributes[a].nodeValue;
								imgObj.image[attrName] = attrVal;
							}
							this.images[nod.attributes['typename'].value] = imgObj;
							break;
						default:
					}
				}
			}
		},
		loadCache: function () {
			this.cache = {};
			this.cache.types = {};
			this.loadTypeCacheRecurse(this.getXMLNode('id', 1, xmlDoc.getElementsByTagName('data')[0]));
		},
		//Load xml typename data into indexed arrays for fast runtime lookups
		loadTypeCacheRecurse: function (nod) {
			var meta = this.getXMLNode('typename', nod.tagName, xmlDoc.getElementsByTagName('meta')[0]);
			this.cache.types[nod.tagName] = {
				rootTypename: nod.tagName,
				metatype: meta.tagName
			}
			this.loadTypes(this.getXMLNode('typename', nod.tagName, xmlDoc.getElementsByTagName('meta')[0]), nod.tagName, nod.tagName);
			var i = nod.childNodes.length;
			while (i--) {
				var child = nod.childNodes[i];
				if (this.isValidXMLNode(child)) this.loadTypeCacheRecurse(child);
			}
		},
		//Load inheritance and base typenames so the application can quickly access it without XML lookups
		loadTypes: function (nod, typename, dataTypename) {
			//Get to the bottom first and load type chain up
			if (nod.attributes['inheritsFrom']) {
				var nextNode = this.getXMLNode('typename', nod.attributes['inheritsFrom'].value, xmlDoc.getElementsByTagName('meta')[0]);
				if (this.isValidXMLNode(nextNode)) this.loadTypes(nextNode, nod.attributes['inheritsFrom'].value, dataTypename);
			}

			//Track the root physical model/view
			if ((nod.tagName == 'model' && JSO.Client.Model.Factory.hasType(typename)) || (nod.tagName == 'view' && JSO.Client.View.Factory.hasType(typename))) {
				this.cache.types[dataTypename] = {
					rootTypename: nod.attributes['typename'].value,
					metatype: nod.tagName
				}
			}
		},
		//Returns whether the submitted XML node is a valid data node (for this application)
		isValidXMLNode: function (nod) {
			if (nod.nodeType == XML_NODE_TYPE.ELEMENT ||
				nod.nodeType == XML_NODE_TYPE.ATTRIBUTE ||
				nod.nodeType == XML_NODE_TYPE.ENTITY ||
				nod.nodeType == XML_NODE_TYPE.ENTITY_REF) return true;
			return false;
		},
		//Searches XML datasource for node matching submitted criteria
		getXMLNode: function (name, value, node) {
			var i = node.childNodes.length;
			while (i--) {
				var nod = node.childNodes[i];
				if (this.isValidXMLNode(nod)) {
					if (name.toLowerCase() == 'tagname') {
						if (nod.tagName == value) return nod;
					} else {
						if (nod.attributes[name]) {
							if (nod.attributes[name].value == value) return nod;
						}
					}
					var child = this.getXMLNode(name, value, nod);
					if (child != undefined) return child;
				}
			}
			return;
		},
		//Executes the submitted RESTful method and returns JSON output for controller services
		RESTControllerMethod: function (methodType, method, params) {
			params = params || 0;

			switch (methodType) {
				case 'GET':
					var ajaxReq = $.ajax({
						url: JSO.Client.Globals.DAL.DATA_CONNECTION + '/WebControllerService.svc/json/Get/' + method + '/' + params,
						type: 'GET',
						contentType: 'text/json',
						dataType: 'json',
						cache: true,
						async: true,
						success: function (html) {
							eval(html);
						},
						error: function (xhr) {
							eval(xhr.responseText);
						}
					});
					break;
				case 'POST':
					break;
				default:
					break;
			};
		},
		//Executes the submitted RESTful method and returns JSON output for controller services
		RESTModelMethod: function (methodType, method, params) {
			params = params || 0;

			switch (methodType) {
				case 'GET':
					return JSO.Client.Globals.DAL.DATA_CONNECTION + '/WebModelService.svc/json/Get/' + method + '/' + params;
				case 'POST':
					break;
				case 'PUT':
					break;
				case 'DELETE':
					break;
				default:
					break;
			}
		}
	});
	
	//Global data access layer reference
	JSO.Client.Globals.DAL = new JSO.Client.DAL();
})();
