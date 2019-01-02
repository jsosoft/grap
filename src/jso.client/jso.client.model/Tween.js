/***********************************************
*  Model
*  Base class for MVC model objects - models application logic
*  layer/CRUD operations
***********************************************/
(function()
{
	/**************
	*  Tween
	*  Handles animation tweening
	*/
	JSO.Client.Model.Tween = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Tween,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'tween');
			this.time = 0;
			this.cycle = 'none';
			this.direction = 1;
			this.attributes = new Array();
		},
		update: function(){
			this._super();
			//Step tween, reverse direction or reset if required
			/*if((this.direction > 0 && this.time < this.fps) || (this.direction < 0 && this.time > -this.fps)) {
				var i = this.attributes.length;
				while(i--){
					var attr = this.attributes[i];
					attr.prevValue = attr.value;
					attr.increment = (this[attr.name] / this.fps) * this.direction;
					attr.retainIncr = (this.cycle == 'retain' ? (attr.origValue - attr.value) / this.fps : 0);
					
				} 
			} else {
				switch(this.cycle){
					case 'continuous':
						//Attribute on target is updated, so reset time and let tween continue
						this.time = 0;
						break;
					case 'reverse':
						this.direction *= -1;
						break;
					case 'retain':
						this.time = 0;
						break;
					default:
				}
			}
			
			this.time += this.direction;*/
		},
		reset: function(){
			this.time = 0;
			this.direction = 1;
		}
	});
})();