/**
* Event
* Application event controller.  
*/
(function()
{
	JSO.Client.Controller.Event = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Event,
		construct: function(model, parent){
			this._super(model, parent);
		},
		initialize: function(){
			this._super();
			var eventname = this.model.eventname.toLowerCase();

			if(this.parentView != undefined){
				if(COLLIDE_EVENTS.match(eventname) != null){
					JSO.Client.Globals.gameController.Event.box2DCollide_bind(this);
				} else if(KEY_EVENTS.match(eventname) != null){
					//Run key events through the window
					window['on' + eventname] = JSO.Client.Globals.gameController.Event.keyEvent_handler;
					JSO.Client.Globals.gameController.Event.keyEvents[eventname + this.model.keyname] = this;
				} else if(MOUSE_EVENTS.match(eventname) != null && this.parentView.el){
					//Run mouse events through the canvas framework (kinetic)
					this.parentView.el.on(eventname, function(__event){ this.raise(__event, this); });
				} else if(MOBILE_EVENTS.match(eventname) != null){
					//Run mobile events through jgestures
					$("body").bind(eventname, JSO.Client.Globals.gameController.Event.mobileEvent_handler);
					JSO.Client.Globals.gameController.Event.mobileEvents[eventname] = this;
				} else {
					//If object has a tag, bind event
					if (this.parentView.tag){
						var tag = this.parentView.tag;
						//Ensure the event exists on the tag
						if (typeof $(tag).get(0)[eventname] == 'object' && $(tag).get(0)[eventname] === null){
							tag['on' + eventname] = function(__event){ this.raise(__event, this); };
						}
					}
				}
			}
		},
		raise: function (e, event) {
			if ((this.model.listen == false || this.model.listen == 'false' || this.model.listen == 0) ||
				JSO.Client.Globals.gameController.model.listen === 0) return;
			if (this.model.action && this.parent) {
				var child = this.parent.firstChild;
				while (child) {
					var act = child.model;
					if (act.rootTypename == 'action') {
						if (act.actionname == this.model.action) {
							child.execute();
							return;
						}
					}
					child = child.next;
				}

				if (typeof this.eventOf[this.model.action] == 'function') {
					this.parent.model[this.model.action](e, event);
				}
			} else if (typeof this.eventOf[this.model.action] == 'function') {
				this.parent.model[this.model.action](e, event);
			}
		},
		destroy: function(){
			this._super();
		}
	});
})();
