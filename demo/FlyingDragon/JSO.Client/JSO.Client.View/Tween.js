/**
*  Tween
*  Handles animation tweening
*/
(function()
{
	JSO.Client.View.Tween = JSO.Client.View.extend({
		constructor: JSO.Client.View.Tween,
		construct: function(id, typename){
			this._super(id, typename || 'tween');
		},
		update: function(model){
			if(model == undefined || this.parent == undefined) return;
			/*//Assign the tween model's attributes to the parent view
			var i = model.attributes.length;
			while(i--){
				var attr = model.attributes[i];
				if(model[attr.name] != undefined){
					attr.value = this.parent[attr.name] + attr.increment + attr.retainIncr;				
					if(isNumeric(attr.value)){ this.parent[attr.name] = attr.value; }
				}
			}*/
			this._super(model);
		}
	});
})();