/**************
*  Fn
*  Models application functions
*/
(function()
{
	JSO.Client.Model.Fn = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Fn,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'fn');
			this.target = undefined;
		},
		execute: function(){
			if(this.target == undefined) return;
			//Ensure a 'param1' is set if 'targetAttr' is set
			if (this.targetAttr != undefined && this.targetAttr != "" && this.param1 == undefined) { return false; }; 
			
			//Execute
			var param1 = this.param1;

			//If a target attribute is set, parse the value based on it
			if(this.param1 != '' && this.datatype != ''){
				param1 = JSO.Client.Globals.parsers.parse(this.param1, this.datatype);
			}
			
			if(this.targetAttr){
				var setval = this.target[this.targetAttr];

				switch (this.typename.toLowerCase()){
					case 'setfn':
						setval = param1;
						break;
					case 'add':
						setval += param1;
						break;
					case 'subtract':
						setval -= param1;
						break;
					case 'multiply':
						setval *= param1;
						break;
					case 'divide':
						setval /= param1;
						break;
					case 'addv':
						setval.Add(param1);
						break;
					case 'subtractv':
						setval.Subtract(param1);
						break;
					case 'multiplyv':
						setval.Multiply(param1);
						break;
					case 'dividev':
						setval.Divide(param1);
						break;
					case 'dotv':
						b2Math.b2Dot(setval, param1);
						break;
					case 'crossv':
						b2Math.b2CrossVV(setval, param1);
						break;
					default:
				}
				this.target[this.targetAttr] = setval;
			} else {
				if(this.mapFn){
					this.target.el[this.mapFn](param1);
				} else {
					switch(this.typename.toLowerCase()){
						case 'applyimpulse':
							this.target.el.ApplyImpulse(this.force, this.target.el.GetWorldPoint(this.point));
							break;
						case 'applyforce':
							this.target.el.ApplyForce(this.force, this.target.el.GetWorldPoint(this.point));
							break;
						default:
							this.target[this.typename](param1);
					}
				}
			}
			
		},
		destroy: function(){
			this.target = null;
			this._super();
		}
	});
})();