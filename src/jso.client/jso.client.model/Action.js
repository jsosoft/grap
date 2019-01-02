/**
*  Action
*  Models application actions
*/
(function()
{
	JSO.Client.Model.Action = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Action,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'action');
		}
	});
})();