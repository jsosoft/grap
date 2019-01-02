/**
* Fn
* Application function controller.
*/
(function()
{
	JSO.Client.Controller.Fn = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Fn,
		construct: function(model, parent){
			this._super(model, parent);
		},
		initialize: function(){
			this._super();
			//Assign target to the function
			var fnMdl = this.model;
			this.model.target = this.find(fnMdl.targetMetatype, fnMdl.targetTypename, fnMdl.targetName, fnMdl.targetId);
		},
		execute: function(){
			if(this.model.delay > 0){
				var timer = new JSO.Client.Timer(this.model, this.model.execute, null, this.model.delay, this.destroyTimer, this);
				this.timers.push(timer);
			} else {
				this.model.execute(arguments);
			}

			var child = this.firstChild;
			while(child){
				if(child.typeChainString.indexOf('action') > -1 || child.typeChainString.indexOf('fn') > -1) child.execute(arguments);
				child = child.next;
			};
		}
	});
})();
