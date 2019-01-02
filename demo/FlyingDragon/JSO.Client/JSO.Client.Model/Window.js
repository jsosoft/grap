/**
*  Window
*  Models floating window display
*/
(function()
{
	JSO.Client.Model.Window = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Window,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'window');
		}
	});
})();