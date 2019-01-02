/**
*  Window
*  Handles any window display
*/
(function()
{
	JSO.Client.View.Window = JSO.Client.View.extend({
		constructor: JSO.Client.View.Window,
		construct: function(id, typename){
			this._super(id, typename || 'window');
		}
	});
})();