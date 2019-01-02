/**
* Action
* Application action controller.  
*/
(function()
{
	JSO.Client.Controller.Action = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Action,
		construct: function(model, parent){
			this._super(model, parent);
		},
		execute: function(){
			var child = this.firstChild;
			while(child){ child.execute(); child = child.next; }
		}
	});

})();
