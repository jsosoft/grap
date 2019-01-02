/**
* Animation
* UI animation controller.  
*/
(function()
{
	JSO.Client.View.Animation = JSO.Client.View.extend({
		constructor: JSO.Client.View.Animation,
		construct: function(id, typename){
			this._super(id, typename || 'animation');
		},
		initialize: function(model){
			if(this.parent.el.getImage()) {
				this.parent.el.setImage(JSO.Client.Globals.DAL.images[this.imagename].image);
				this.parent.el.attrs.width = this.parent.width;
				this.parent.el.attrs.height = this.parent.height;
				this.parent.el.setCrop(this.model.scale.x, this.model.scale.y);
				this.parent.el.attrs.crop.x = 0;
				this.parent.el.attrs.crop.y = 0;
			}
			this._super(model);
		},
		update: function(model){
			if(model == undefined || this.parent == undefined) return;
			if(this.parent.el == undefined || !this.parent.visible) return;
			
			this.parent.el.attrs.crop.x = model.animstep * model.scale.x;
			this.parent.el.attrs.crop.y = model.currentrow * model.scale.y;
			
			if(isNumeric(model.rotationmod)){ this.parent.el.setRotationDeg(model.rotationmod); }
			
			this._super(model);
		}
	});
})();