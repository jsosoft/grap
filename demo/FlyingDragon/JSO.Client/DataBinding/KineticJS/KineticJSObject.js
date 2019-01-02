/**
*	KineticJSObject
*	External binding class to any KineticJS object class
*/
(function () {
	JSO.Client.DataBinding.KineticJSObject = JSO.Client.DataBinding.FrameworkClass.extend({
		typename: 'KineticJSObject',
		framework: 'KineticJS',
		_renderGarbage: [],
		constructor: JSO.Client.DataBinding.KineticJSObject,
		construct: function (boundModel) {
			var el = {};

			switch (boundModel.content) {
				case 'rect':
					boundModel.el = new Kinetic.Rect({});
					break;
				case 'circle':
					boundModel.el = new Kinetic.Circle({});
					break;
				case 'ellipse':
					boundModel.el = new Kinetic.Ellipse({});
					break;
				case 'line':
					boundModel.el = new Kinetic.Line({});
					break;
				case 'path':
					boundModel.el = new Kinetic.Path({});
					break;
				case 'polygon':
					boundModel.el = new Kinetic.Polygon({});
					break;
				case 'regularPolygon':
					boundModel.el = new Kinetic.RegularPolygon({});
					break;
				case 'image':
					if (JSO.Client.Globals.DAL.images[boundModel.imagename]) {
						img = JSO.Client.Globals.DAL.images[boundModel.imagename].image;
						boundModel.el = new Kinetic.Image({
							image: img,
							x: 0,
							y: 0,
							width: img.width,
							height: img.height,
							crop: {
								x: 0,
								y: 0,
								width: img.width,
								height: img.height
							}
						});
					} else {
						boundModel.el = new Kinetic.Image({
							x: 0,
							y: 0,
							width: 0,
							height: 0,
							crop: {
								x: 0,
								y: 0,
								width: 0,
								height: 0
							}
						});
					};
					break;
				case 'sprite':
					boundModel.el = new Kinetic.Sprite({});
					break;
				default:
			};
			//Add canvas element to ui
			boundModel.layer = JSO.Client.Globals.gameController.firstView.el;
			//Tag the canvas element so it can be identified in events, etc.
			boundModel.el.id = boundModel.uid;
			boundModel.layer.add(boundModel.el);
			//Start element out invisible, but loaded so it can be shown/hidden quickly
			boundModel.el.setVisible(false);

			for (var name in boundModel.attributes) {
				var attr = boundModel.attributes[name].first();
				attr.boundModel = boundModel;
				//Bind the framework getter/setter
				if (attr.getmap != '' || attr.setmap != '') {
					attr.insertBefore(new JSO.Client.DataBinding.KineticJSBinding(boundModel, boundModel.metatype, boundModel.typename, attr.name, attr.dt, attr.arrayLength, attr.getmap, attr.setmap, attr.scaleFactor));
					attr.framework = boundModel.framework;
				}
			}

			this._super(boundModel);
		},
		show: function () {
			this.boundModel.el.setVisible(true);
		},
		hide: function () {
			if (!this.boundModel._isDestroyed && this.boundModel.visible) {
				this.boundModel.el.setVisible(false);
			}
		},
		destroy: function () {
			this.hide();
			JSO.Client.Globals.gameController.firstView.bindings.kineticjs._renderGarbage.push(this.boundModel.el);
			this._super();
		}
	});
})();