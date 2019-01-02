/**
* Emitter
* UI particle emitter
*/
(function()
{
	JSO.Client.Model.Emitter = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Emitter,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'emitter');
			this.particleCounter = 0;
			this.totalCounter = 0;
		}
	});
})();