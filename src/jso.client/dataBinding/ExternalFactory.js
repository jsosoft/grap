/**************
* Factory
* Class factory for creating controller instances by submitted typename id
*/
(function(){
	factory = function(){

		if (arguments.callee._singleton)
			return arguments.callee._singleton;

		arguments.callee._singleton = this;
	};

	factory.prototype = {
		create: function(typename, framework, boundModel){
			switch(framework.toLowerCase()){
				case 'box2d':
					switch (typename.toLowerCase()){
						case 'world':
							return new JSO.Client.DataBinding.Box2DWorld(boundModel);
							break;
						default:
							return new JSO.Client.DataBinding.Box2DObject(boundModel);
					};
					break;
				case 'kineticjs':
					switch (typename.toLowerCase()){
						case 'stage':
							return new JSO.Client.DataBinding.KineticJSStage(boundModel);
							break;
						default:
							return new JSO.Client.DataBinding.KineticJSObject(boundModel);
					};
					break;
				default:
					return;
			}
		}
	};
	JSO.Client.DataBinding.External = {};
	JSO.Client.DataBinding.External.Factory = new factory();
})();