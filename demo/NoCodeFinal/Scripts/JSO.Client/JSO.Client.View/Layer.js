/**
*  Level
*  Handles game-level specific display
*/
(function()
{
	JSO.Client.View.Layer = JSO.Client.View.extend({
		constructor: JSO.Client.View.Level,
		construct: function(id, typename){
			this._super(id, typename || 'layer');
		}
	});
})();