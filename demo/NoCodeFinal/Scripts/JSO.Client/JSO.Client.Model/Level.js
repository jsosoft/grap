/**
*  Level
*  Models game level interaction
*/
(function()
{
	JSO.Client.Model.Level = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Level,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'level');
		}
	});
})();