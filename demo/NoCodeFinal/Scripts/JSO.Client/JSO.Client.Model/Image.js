/**
* Image
* UI animation image controller.  
*/
(function()
{
	JSO.Client.Model.Image = JSO.Client.Model.Object.extend({
		constructor: JSO.Client.Model.Image,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'image');
		}
	});
})();