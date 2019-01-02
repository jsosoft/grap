/***********************************************
*  Base
*  Base class for all MVC objects - abstracts meta-data access 
***********************************************/
(function(){
	var Base = namespace('JSO.Client.Base');

	JSO.Client.Base = JSO.Client.DataBinding.XMLDataClass.extend({
		constructor: JSO.Client.Base,
		construct: function(id, typename, metatype){
			this.id = id;
			this.metatype = metatype || JSO.Client.Globals.MODEL;
			this.typename = typename;
			this.initialized = false;
			//Internal event handles
			this._isDestroyed = false;
			if(this.metatype != JSO.Client.Globals.CONTROLLER && id) this._super(id, typename);
		},
		destroy: function(){
			this.parent = null;
			this._super();
		},
		//Initialize pass occurs after data loading and data binding
		initialize: function(){
			this.initialized = true;
			if(this.next) this.next.initialize();
		},
		saveObject: function() { JSO.Client.Globals.DAL.saveObject(this, false); },
		deleteObject: function() { JSO.Client.Globals.DAL.deleteObject(this); }
	});
})();