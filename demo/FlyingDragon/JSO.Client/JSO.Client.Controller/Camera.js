/**
* Camera
* Camera controller.  A camera is a special class of a regular canvas object - it has all of the attributes and events
*/
(function()
{
	JSO.Client.Controller.Camera = JSO.Client.Controller.Actor.extend({
		constructor: JSO.Client.Controller.Camera,
		construct: function(model, parent){
			this._super(model, parent);
			JSO.Client.Globals.gameController.cameras.push(this);
		}
	});
})();
