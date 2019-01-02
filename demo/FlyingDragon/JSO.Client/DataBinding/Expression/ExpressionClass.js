/**
*	ExpressionClass
*	Expression data class.  Handles internal application references and functions.  Operates as a seperate binding layer from the core XML data layer
*/
(function () {
	JSO.Client.DataBinding.ExpressionClass = JSO.Client.DataBinding.FrameworkClass.extend({
		framework: 'Expression',
		constructor: JSO.Client.ExpressionClass,
		construct: function (boundModel) {
			for (var name in boundModel.attributes) {
				var attr = boundModel.attributes[name];
				if (attr.expression != null) {
					if (attr.expression.indexOf('{') >= 0 || attr.expression.indexOf('}') >= 0) {
						var fns = extractPattern(attr.expression, /{([^}]+)}/g);
						if (attr.arrayLength || attr.dt.toLowerCase() == 'b2vec2' || fns.length > 1) {
							attr.first().insertBefore(new JSO.Client.DataBinding.ArrayNode(boundModel, boundModel.metatype, boundModel.typename, attr.name, attr.dt, attr.arrayLength, fns, 'Fn'));
						} else {
							attr.first().insertBefore(new JSO.Client.DataBinding.Fn(boundModel, boundModel.metatype, boundModel.typename, attr.name, attr.dt, attr.arrayLength, fns[0]));
						}
					} else if (attr.expression.indexOf('[') >= 0 || attr.expression.indexOf(']') >= 0) {
						var exs = extractPattern(attr.expression, /\[(.*?)\]/g);
						if (attr.arrayLength || attr.dt.toLowerCase() == 'b2vec2' || exs.length > 1) {
							attr.first().insertBefore(new JSO.Client.DataBinding.ArrayNode(boundModel, boundModel.metatype, boundModel.typename, attr.name, attr.dt, attr.arrayLength, exs, 'Ref'));
						} else {
							attr.first().insertBefore(new JSO.Client.DataBinding.Ref(boundModel, boundModel.metatype, boundModel.typename, attr.name, attr.dt, attr.arrayLength, exs[0]));
						}
					}
				}
			}
			this._super();
		}
	});
})();