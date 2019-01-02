/**
*  HTMLElement
*  Handles HTML display
*/
(function()
{
	JSO.Client.View.HTMLElement = JSO.Client.View.extend({
		constructor: JSO.Client.View.HTMLElement,
		construct: function(id, typename){
			this._super(id, typename || 'htmlElement');
		},
		initialize: function(){
			
			this._super();
		},
		getElement: function(){
		}
	});
})();