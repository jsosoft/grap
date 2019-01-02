/**
*  Event
*  Models application events
*/
(function()
{
	JSO.Client.Model.Event = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Event,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'event');
		},
		destroy: function(){
			this.eventOf = {};
			var eventname = this.eventname.toLowerCase();
			
			if (KEY_EVENTS.match(eventname)){
				delete JSO.Client.Globals.gameController.Event.keyEvents[eventname + this.keyname];
			} else if (COLLIDE_EVENTS.match(eventname)){ 
				delete JSO.Client.Globals.gameController.Event.collideEvents['begincontact' + this.uidString];
			} else if (MOBILE_EVENTS.match(eventname)){ 
				delete JSO.Client.Globals.gameController.Event.mobileEvents[eventname];
			}
		
			this._super();
		}
	});
})();