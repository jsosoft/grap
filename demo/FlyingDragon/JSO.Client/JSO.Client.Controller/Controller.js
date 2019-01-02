/**
*  Controller
*  MVC controller objects - handles core application flow
*  and control functionality
*/
(function()
{
	var Controller = namespace("JSO.Client.Controller");

	JSO.Client.Controller = JSO.Client.LinkedList.extend({
		constructor: JSO.Client.Controller,
		construct: function(model, parent){
			this._super();
			this.metatype = JSO.Client.Globals.CONTROLLER
			this.parent = parent;
			this.parentView = undefined;
			this.initialized = false;
			this._isDestroyed = false;
		
			//Timers execute control functionality either at an fps or after a delay
			this.timers =  new EventArray('push', this.addChild, this);
			
			//If a model was submitted, push it to the collection (and load down the tree)
			if(model) this.addChild(null, model);
		},
		//Binds items being loaded into collections onto this controller
		addChild: function(event, child){
			switch(child.metatype){
				case 'model':
					this.id = child.id;
					this.name = child.name;
					this.typename = child.typename;
					this.model = child;
					//Assign the parent model up the chain to the new model owned by this controller
					if(this.parent != undefined){
						child.parent = this.parent.model;
					}
					
					//Listen for the model destroy so the controller can self-destruct
					child.events.destroy = this.destroyModel.bind(this);
					child.eventContext = this;
					
					//If an id is supplied, autoload the controller's children
					if(isNumeric(this.id) && this.id != -1){
						for(var i=0; i < child.childIds.length; i++){
							var childNode = child.childIds[i];
							this.loadChild(childNode);
						}
					}
					break;
				case 'view':
					if(!this.firstView) this.firstView = child;
					else this.firstView.last().insertAfter(child);
					
					//Assign the parent view up the chain to the new view owned by the model owned by this controller
					if(this.parent != undefined){
						child.parent = this.parent.firstView;
					}
					
					//Bind view to application
					child.model = this.model;
					
					this.parentView = child;
					for(var i=0; i < child.childIds.length; i++){
						var childNode = child.childIds[i];
						this.loadChild(childNode);
					}
					break;
				case 'controller':
					if(this.parentView) child.parentView = this.parentView;
					//this.bind();
					if(!this.firstChild) this.firstChild = child;
					else this.firstChild.last().insertAfter(child);
					
					child.parent = this;
					break;
				case 'timer':
					child.start();
					break;
				default:
			}
		},
		loadChild: function(child){
			if(child == undefined) return;
			switch(child.metatype){
				case 'view':
					//The object is a view, so retrieve view from data and add to controller views list
					var view = JSO.Client.View.Factory.create(child.id, child.rootTypename);
					this.addChild(undefined, view);
					break;
				default:
					//The object is a model, so load a controller for it (controller will automatically load the model and it's children)
					var controller = JSO.Client.Controller.Factory.create(JSO.Client.Model.Factory.create(child.id, child.rootTypename), this);
					this.addChild(undefined, controller);
					break;
			}
		},
		initialize: function(){
			//Initialize controller's model
			this.model.initialize();
			//Initialize all views attached to this controller
			if(this.firstView) this.firstView.initialize();
			this.initialized = true;
		},
		update: function(time, timer){
			if(!this._isDestroyed && !this.model._isDestroyed){
				if(!this.initialized) this.initialize();
				
				//Main update loop, cycle all models and views
				if(this.model && this.model.visible) this.model.update();
				if(this.firstView && this.firstView.visible) this.firstView.update(this.model);
			}
			if(this.firstChild) this.firstChild.update(time, timer);
			//Render chain
			if(this.next) this.next.update(time,timer);
		},
		show: function(){
			//Show all dependent objects on this controller
			if(this.model) this.model.show();
			if(this.firstView) this.firstView.show();
			if(this.firstChild) this.firstChild.show();
			if(this.next) this.next.show();
		},
		hide: function(){
			if(this.model) this.model.hide();
			if(this.firstView) this.firstView.hide();
			if(this.firstChild) this.firstChild.hide();
		},
		destroyChain: function(){
			if(this.next) this.next.destroyChain();
			this.model.destroy();
		},
		destroy: function() {
			this.model.hide();
			if(this.firstView) this.firstView.hide();
			
			var i = this.timers.length
			while(i--){
				this.timers[i].destroy();
			}
			this.timers.length = 0;
			var queue = new JSO.Client.ExecutionQueue(this._super.bind(this), this, undefined, undefined, undefined, GAME_REFRESH_FPS/10);
			if(this.firstView) queue = new JSO.Client.ExecutionQueue(this.firstView.destroy, this.firstView, undefined, undefined, queue, GAME_REFRESH_FPS/10);
			if(this.firstChild) queue = new JSO.Client.ExecutionQueue(this.firstChild.destroyChain, this.firstChild, undefined, undefined, queue, GAME_REFRESH_FPS/10);
			JSO.Client.Globals.gameController.executionQueues.push(queue);
		},
		destroyChild: function(child){
			if(child.uid == this.firstChild.first().uid && child.next) this.firstChild = child.next;
		},
		destroyModel: function(mdl){
			this.destroy();
		},
		destroyTimer: function(timer){
			timer.destroy();
		},
		isMatch: function(obj, metatype, typename, name, id, uid){
			return (((metatype) ? obj.metatype == metatype : true) && 
				((typename) ? obj.typename == typename : true) && 
				((name) ? obj.name == name : true) &&
				((id) ? obj.id == id : true) &&
				((uid) ? obj.uid == uid : true));
		},
		matchNode: function(metatype, typename, name, id, uid){
			var found = null;
			
			//Check if this controller is it
			if(metatype == JSO.Client.Globals.CONTROLLER || metatype == ''){
				if(this.isMatch(this, JSO.Client.Globals.CONTROLLER, typename, name, id, uid)) found = this;
				if(this.isMatch(this, JSO.Client.Globals.MODEL, typename, name, id, uid)) found = this;
				if(this.isMatch(this, JSO.Client.Globals.VIEW, typename, name, id, uid)) found = this;
			}
			
			//Check the models
			if(this.model && (metatype == JSO.Client.Globals.MODEL || metatype == '') && found == null){
				if(this.isMatch(this.model, (metatype ? JSO.Client.Globals.MODEL : undefined), typename, name, id, uid) && found == null) found = this.model; 
			}
			
			//Check the views
			if(this.firstView && (metatype == JSO.Client.Globals.VIEW || metatype == '') && found == null){
				var view = this.firstView;
				while(view){ 
					if(this.isMatch(view, (metatype ? JSO.Client.Globals.VIEW : undefined), typename, name, id, uid) && found == null) found = view; 
					view = view.next;
				}
			}
			return found;
		},
		findUp: function(metatype, typename, name, id, uid, searched){
			if(searched[this.uid]) return searched;
			
			searched.found = this.matchNode(metatype, typename, name, id, uid);
			if(searched.found != null) return searched;
			
			searched = this.findDown(metatype, typename, name, id, uid, searched);
			if(searched.found != null) return searched;
			
			searched.nodes[this.uid] = this.uid;
			if(this.parent){
				searched = this.parent.findUp(metatype, typename, name, id, uid, searched);
				if(searched.found != null) return searched;
			}
			return searched;
		},
		findDown: function(metatype, typename, name, id, uid, searched){
			if(searched.nodes[this.uid]) return searched;

			searched.found = this.matchNode(metatype, typename, name, id, uid);
			if(searched.found != null) return searched;
			
			var child = this.firstChild;
			while(child){
				if(searched.nodes[child.uid]===undefined){
					searched = child.findDown(metatype, typename, name, id, uid, searched);
					if(searched.found != null) return searched;
				}
				var child = child.next;
			}
			searched.nodes[this.uid] = this.uid;
			return searched;
		},
		find: function(metatype, typename, name, id, uid, searched){
			if(searched == undefined){
				var searched = {
					nodes: {},
					found: null
				}
			}

			searched = this.findDown(metatype, typename, name, id, uid, searched);
			if(searched.found != null) return searched.found;
			searched = this.findUp(metatype, typename, name, id, uid, searched);
			return searched.found;
		}
	});

	/**************
	* Factory
	* Class factory for creating controller instances by submitted typename id
	*/
	factory = function(){

		if (arguments.callee._singleton)
			return arguments.callee._singleton;

		arguments.callee._singleton = this;
	};

	factory.prototype = {
		create: function(model, parent){
			var controller = {};
			
			switch (model.rootTypename){
				case 'event':
					controller = new JSO.Client.Controller.Event(model, parent);
					break;
				case 'action':
					controller = new JSO.Client.Controller.Action(model, parent);
					break;
				case 'fn':
					controller = new JSO.Client.Controller.Fn(model, parent);
					break;
				case 'game':
					controller = new JSO.Client.Controller.Game(model, parent);
					break;
				case 'image':
					controller = new JSO.Client.Controller.Image(model, parent);
					break;
				case 'object':
					controller = new JSO.Client.Controller.Object(model, parent);
					break;
				case 'camera':
					controller = new JSO.Client.Controller.Camera(model, parent);
					break;
				case 'actor':
					controller = new JSO.Client.Controller.Actor(model, parent);
					break;
				case 'emitter':
					controller = new JSO.Client.Controller.Emitter(model, parent);
					break;
				case 'particle':
					controller = new JSO.Client.Controller.Particle(model, parent);
					break;
				case 'animation':
					controller = new JSO.Client.Controller.Animation(model, parent);
					break;
				case 'tween':
					controller = new JSO.Client.Controller.Tween(model, parent);
					break;
				default:
					controller = new JSO.Client.Controller(model, parent);
			};
			
			return controller;
		},
		hasType: function(typename){
			return (JSO.Client.Controller.Factory.typesArray.indexOf(typename) != -1);
		}
	};
	factory.prototype.types = 'base,event,action,fn,game,image,object,camera,actor,emitter,particle,animation,tween';
	factory.prototype.typesArray = factory.prototype.types.split(',');
	JSO.Client.Controller.Factory = new factory();
})();
