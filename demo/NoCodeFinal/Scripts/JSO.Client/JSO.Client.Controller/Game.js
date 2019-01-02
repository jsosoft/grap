/**
* Game
* Primary game controller.  A shortcut is also created to directly off the root namespace
*/
(function()
{
	var Game = namespace("JSO.Client.Game");

	JSO.Client.Controller.Game = JSO.Client.Game = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Game,
		construct: function(){
			JSO.Client.Globals.gameController = this;
			JSO.Client.Globals.DAL.loadCache();
			this.cameras = new Array();
			this.executionQueues = [];
			//Game controller is root controller so it loads itself
			this._super(JSO.Client.Model.Factory.create(1, 'game'));
		},
		//Main update loop.  Updates controller and child tree
		update: function(time, timer){
			if (this.running){
				window.GAME_LOOP_TIME = time;
				var i = this.executionQueues.length;
				while(i--){
					this.executionQueues[i].doNext();
					if(this.executionQueues[i].complete) this.executionQueues.splice(i,1);
				}
				this._super(time, timer);
				if(DEBUG)if(timer)console.log(timer.frameTime, timer.fpsFrame, timer.fpsAvg);
				if(!PHYSICS_REFRESH_FPS) this.model.step(time, timer);
				if(!RENDER_REFRESH_FPS) this.firstView.render(time, timer);
			}
		},
		//Initiates game loop
		start: function(){
			if (this.running) { return; }
			var self = this;
			this.running = true;
			this.show();
			this.initialize();
			
			var timer = new JSO.Client.Timer(this, this.update, GAME_REFRESH_FPS);
			this.timers.push(timer);
			if(PHYSICS_REFRESH_FPS) {
				this.model.step();
				var timer = new JSO.Client.Timer(this.model, this.model.step, PHYSICS_REFRESH_FPS);
				this.timers.push(timer);
			}
			if(RENDER_REFRESH_FPS){
				this.firstView.render();
				var timer = new JSO.Client.Timer(this.firstView, this.firstView.render, RENDER_REFRESH_FPS);
				this.timers.push(timer);
			}
		},
		Event: {
			keyEvents:{},
			collideEvents:[],
			mobileEvents:{},
			listeners: {},
			
			/*Global Event Handlers
			These are necessary because some events can only be set once and must be set universally.
			These handlers route the event raised (globally) to the specific event class handler
			*/
			keyEvent_bind: function(ctrl){
			},
			keyEvent_handler: function(e){
				if (KEY_EVENTS.match(e.type)){
					var code = (e.keyCode) ? e.keyCode : e.which;
					var key = code == 32 ? 'space' : String.fromCharCode(code).toLowerCase();
					if(JSO.Client.Globals.gameController.Event.keyEvents[e.type + key]) { JSO.Client.Globals.gameController.Event.keyEvents[e.type + key].raise(e); }
				}
			},
			mobileEvent_bind: function(ctrl){
			},
			mobileEvent_handler: function(e){
				if (MOBILE_EVENTS.match(e.type)){
					if(JSO.Client.Globals.gameController.Event.mobileEvents[e.type]) { JSO.Client.Globals.gameController.Event.mobileEvents[e.type].raise(e); }
				}
			},
			box2DCollide_bind: function(ctrl){
				//Ensure global contact listener is up and running
				if(this.listeners['begincontact'] == undefined){
					this.listeners['begincontact'] = this.addContactListener('begincontact');
				}

				JSO.Client.Globals.gameController.Event.collideEvents['begincontact' + ctrl.model.uidString] = ctrl;
				ctrl.parent.model.el.SetUserData(ctrl.model.uidString);
			},	
			box2DCollide_handler: function (evtName, uidA, uidB, contact, impulse) {
				if (JSO.Client.Globals.gameController.model.listen == 0) return;

				var evtA = JSO.Client.Globals.gameController.Event.collideEvents[evtName + uidA];
				var evtB = JSO.Client.Globals.gameController.Event.collideEvents[evtName + uidB];

				if (evtA && evtB && evtA.parent.model.el && evtB.parent.model.el) {
					//console.log('check1', evtA.parent.model.typename, evtA.model.targettypes, evtB.parent.model.typename);
					if (evtA.model.targettypes.indexOf(evtB.parent.model.typename) > -1) {
						if (evtA.model.raiseOnce === true || evtA.model.raiseOnce == 'true' || evtA.model.raiseOnce == 1) delete JSO.Client.Globals.gameController.Event.collideEvents[evtName + uidA];
						//console.log('raise', evtA.parent.model.typename, evtName);
						evtA.raise(contact, evtName);
						if (evtA.model.raiseOnce == false || evtA.model.raiseOnce == 'false' || evtA.model.raiseOnce == 0) {
							JSO.Client.Globals.gameController.Event.collideEvents['begincontact' + evtA.model.uidString] = evtA;
							evtA.parent.model.el.SetUserData(evtA.model.uidString);
						}
					}
					//console.log('check2', evtB.parent.model.typename, evtB.model.targettypes, evtA.parent.model.typename);
					if(evtB.model.targettypes.indexOf(evtA.parent.model.typename) > -1){
						if (evtB.model.raiseOnce === true || evtB.model.raiseOnce == 'true' || evtB.model.raiseOnce == 1) delete JSO.Client.Globals.gameController.Event.collideEvents[evtName + uidB];
						//console.log('raise', evtB.parent.model.typename, evtName);
						evtB.raise(contact, evtName);
						if (evtB.model.raiseOnce == false || evtB.model.raiseOnce == 'false' || evtB.model.raiseOnce == 0) {
							JSO.Client.Globals.gameController.Event.collideEvents['begincontact' + evtB.model.uidString] = evtB;
							evtB.parent.model.el.SetUserData(evtB.model.uidString);
						}
					}
				}
			},
			/**************   
			* Adds listener to box2d world for implemented events (if any)
			*/
			addContactListener: function(evtName) {
				var listener = new Box2D.Dynamics.b2ContactListener;
				
				switch(evtName.toLowerCase()){
					case 'begincontact':
						listener.BeginContact = function(contact) {
							JSO.Client.Globals.gameController.Event.box2DCollide_handler('begincontact', contact.GetFixtureA().GetBody().GetUserData(),
								   contact.GetFixtureB().GetBody().GetUserData(), contact);
						}
						break;
					case 'endcontact':
						listener.BeginContact = function(contact) {
							JSO.Client.Globals.gameController.Event.box2DCollide_handler('endcontact', contact.GetFixtureA().GetBody().GetUserData(),
								   contact.GetFixtureB().GetBody().GetUserData(), contact);
						}
						break;
					case 'postsolve':
						listener.BeginContact = function(contact) {
							JSO.Client.Globals.gameController.Event.box2DCollide_handler('postsolve', contact.GetFixtureA().GetBody().GetUserData(),
								 contact.GetFixtureB().GetBody().GetUserData(), contact,
								 impulse.normalImpulses[0]);
						}
						break;
				}

				JSO.Client.Globals.gameController.model.el.SetContactListener(listener);
				return evtName;
			}
		}
	});
})();
