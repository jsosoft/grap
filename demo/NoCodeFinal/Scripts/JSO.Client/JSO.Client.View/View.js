/***********************************************
*  View
*  Base class for MVC view objects - handles app presentation
***********************************************/
(function()
{
	var View = namespace("JSO.Client.View");

	JSO.Client.View = JSO.Client.Base.extend({
		constructor: JSO.Client.View,
		construct: function(id, typename){
			this._super(id, typename, JSO.Client.Globals.VIEW);
			this.eventsInitialized = false;
			this.listen = true;
		},
		initialize: function(model){
			this.model = model;
			this._super();
		},
		//Update view based on the submitted model
		update: function(model){
			this.model = model;
			if(this.next) this.next.update();
			//if (this.children.atKey('update')) { this.children.atKey('update').raise(); }
		},
		
		DISPLAY_CANVAS: 1,
		DISPLAY_HTML: 2
	});

	/**************
	* Factory
	* Class factory for creating view instances by submitted typename id
	*/

	factory = function() {
		if (arguments.callee._singleton)
			return arguments.callee._singleton;

		arguments.callee._singleton = this;
	};

	factory.prototype = {
		create: function(id, typename) {
			switch (typename){
				case 'htmlElement':
					return new JSO.Client.View.HTMLElement(id, typename);
					break;
				case 'canvasElement':
					return new JSO.Client.View.CanvasElement(id, typename);
					break;
				case 'windowView':
					return new JSO.Client.View.Window(id, typename);
					break;
				case 'gameWindow':
					return new JSO.Client.View.GameWindow(id, typename);
					break;
				case 'levelView':
					return new JSO.Client.View.Level(id, typename);
					break;
				case 'animationView':
					return new JSO.Client.View.Animation(id, typename);
					break;
				case 'tweenView':
					return new JSO.Client.View.Tween(id, typename);
					break;
				case 'layerView':
					return new JSO.Client.View.Layer(id, typename);
					break;
				default:
					return new JSO.Client.View(id, typename);
			};
		},
		hasType: function(typename){
			return (JSO.Client.View.Factory.typesArray.indexOf(typename) != -1);
		}
	};
	factory.prototype.types = 'base,htmlElement,canvasElement,windowView,gameWindow,levelView,animationView,tweenView,layerView';
	factory.prototype.typesArray = factory.prototype.types.split(',');
	JSO.Client.View.Factory = new factory();
})();