/***********************************************
*  Model
*  Base class for MVC model objects - models application logic
*  layer/CRUD operations
***********************************************/
(function()
{
	var Model = namespace('JSO.Client.Model');

	JSO.Client.Model = JSO.Client.Base.extend({
		constructor: JSO.Client.Model,
		construct: function(id, typename, metatype){			
			this._super(id, typename, JSO.Client.Globals.MODEL);
		},
		initialize: function(){
			this._super();
		},
		show: function(){
			if(this.framework && this.bindings[this.framework]) this.bindings[this.framework].show(this);
			if(this.next) this.next.show();
		},
		update: function(){
			if(this.next) this.next.update();
		},
		destroy: function(){
			this.parent = null;
			this._super();
		}
	});

	/**************
	* Factory
	* Class factory for creating model instances by submitted typename id
	*/
	factory = function(){

		if (arguments.callee._singleton)
			return arguments.callee._singleton;

		arguments.callee._singleton = this;
	};

	factory.prototype = {
		create: function(id, typename){
			switch (typename){
				case 'event':
					return new JSO.Client.Model.Event(id, typename);
					break;
				case 'action':
					return new JSO.Client.Model.Action(id, typename);
					break;
				case 'fn':
					return new JSO.Client.Model.Fn(id, typename);
					break;
				case 'game':
					return new JSO.Client.Model.Game(id, typename);
					break;
				case 'window':
					return new JSO.Client.Model.Window(id, typename);
					break;
				case 'level':
					return new JSO.Client.Model.Level(id, typename);
					break;
				case 'camera':
					return new JSO.Client.Model.Camera(id, typename);
					break;
				case 'object':
					return new JSO.Client.Model.Object(id, typename);
					break;
				case 'actor':
					return new JSO.Client.Model.Actor(id, typename);
					break;
				case 'player':
					return new JSO.Client.Model.Player(id, typename);
					break;
				case 'image':
					return new JSO.Client.Model.Image(id, typename);
					break;
				case 'animation':
					return new JSO.Client.Model.Animation(id, typename);
					break;
				case 'tween':
					return new JSO.Client.Model.Tween(id, typename);
					break;
				case 'emitter':
					return new JSO.Client.Model.Emitter(id, typename);
					break;
				case 'particle':
					return new JSO.Client.Model.Particle(id, typename);
					break;
				default:
					return new JSO.Client.Model(id, typename);
			};
		},
		hasType: function(typename){
			return (JSO.Client.Model.Factory.typesArray.indexOf(typename) != -1);
		}
	};
	factory.prototype.types = 'base,event,action,fn,game,window,level,camera,object,actor,player,image,animation,tween,emitter,particle';
	factory.prototype.typesArray = factory.prototype.types.split(',');
	JSO.Client.Model.Factory = new factory();
})();