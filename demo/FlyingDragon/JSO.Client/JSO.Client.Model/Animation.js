/**
* Animation
* UI animation controller.  
*/
(function()
{
	JSO.Client.Model.Animation = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Animation,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'animation');
			this.animstep = 0;
			this.currentrow = 0;
			this.direction = 1;
		},
		initialize: function(){
			this.stepcount = this.imagewidth / this.scale.x;
			if(this.rowmap && this.rowmap.length > 0 ){
				this.rowcount = (this.rowmap instanceof Array && this.rowmap.length > 0  ? this.rowmap.length : 1);
			} else {
				this.rowcount = this.imageheight / this.scale.y;
			}
			this.rowthresh = 360 / this.rowcount;
			this.rotationmod = 0;
			
			this._super();
		},
		animate: function(){
			this.animstep += this.direction; 

			if((this.animstep >= this.stepcount && this.direction > 0) || (this.animstep <= 0 && this.direction < 0)){
				switch(this.cycle){
					case 'continuous':
						//Attribute on target is updated, so reset time and let tween continue
						this.animstep = 0;
						break;
					case 'reverse':
						this.animstep = this.direction > 0 ? this.stepcount - 1 : 0;
						this.direction = -this.direction;
						break;
					default:
				}
			}
		
			this.prevrotationmod = this.rotationmod;
			var parentRot = this.parent.rotation;
			var rowmap = this.rowmap;
			var rowthresh = this.rowthresh;
			var rowIndex = Math.round( parentRot / rowthresh ) - 1;
			rowIndex = !rowmap.length ? 0 : rowIndex > rowmap.length ? 0: rowIndex < 0 ? rowmap.length - 1: rowIndex;
			this.currentrow = (rowmap instanceof Array && rowmap.length > 0 ? rowmap[rowIndex] : 0);
			this.rotationmod = (parentRot - (Math.round( parentRot / this.rowthresh )) * rowthresh);
		}
	});
})();