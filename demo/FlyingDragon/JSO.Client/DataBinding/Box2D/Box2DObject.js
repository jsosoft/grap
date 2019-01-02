/**
*  External binding class to any Box2D object class
*/
(function () {
	JSO.Client.DataBinding.Box2DObject = JSO.Client.DataBinding.FrameworkClass.extend({
		typename: 'Box2DObject',
		framework: 'Box2D',
		_renderGarbage: [],
		constructor: JSO.Client.DataBinding.Box2DObject,
		construct: function (boundModel) {
			//Define box2d body
			boundModel.bodyDef = new Box2D.Dynamics.b2BodyDef;
			boundModel.fixDef = new Box2D.Dynamics.b2FixtureDef;

			//fixDef.isSensor = true;
			boundModel.bodyDef.type = boundModel.bodyType;
			boundModel.bodyDef.bullet = false;
			//Assign box2d world from game boundModel
			boundModel.world = JSO.Client.Globals.gameController.model.el;

			//Fixtures are not exposed in the framework (possibly in the future) so these have to be manually written on creation
			boundModel.fixDef.density = (boundModel.density) ? boundModel.density : .3;
			boundModel.fixDef.friction = (boundModel.friction) ? boundModel.friction : 0;
			boundModel.fixDef.restitution = (boundModel.restitution) ? boundModel.restitution : .3;

			var scaleX = boundModel.scale.x / boundModel.attributes.scale.scaleFactor;
			var scaleY = boundModel.scale.y / boundModel.attributes.scale.scaleFactor;
			
			switch (boundModel.content.toLowerCase()) {
				case 'rect':
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
					boundModel.fixDef.shape.SetAsBox(scaleX, scaleY);
					break;
				case 'circle':
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
					boundModel.fixDef.shape.m_radius = scaleX / 2;
					break;
				case 'ellipse':
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
					break;
				case 'line':
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
					boundModel.fixDef.shape.SetAsBox(scaleX, scaleY);
					break;
				case 'path':
					//not implemented
					break;
				case 'polygon':
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
					boundModel.fixDef.shape.SetAsBox(scaleX, scaleY);
					break;
				case 'regularPolygon':
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
					boundModel.fixDef.shape.SetAsBox(scaleX, scaleY);
					break;
				default:
					boundModel.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
					boundModel.fixDef.shape.SetAsBox(scaleX, scaleY);
			}
			
			boundModel.world.Step();
			boundModel.el = boundModel.world.CreateBody(boundModel.bodyDef);
			
			for (var name in boundModel.attributes) {
				var attr = boundModel.attributes[name].first();
				attr.boundModel = boundModel;
				//Bind the framework getter/setter
				if (attr.getmap != '' || attr.setmap != '') {
					attr.insertBefore(new JSO.Client.DataBinding.Box2DBinding(boundModel, boundModel.metatype, boundModel.typename, attr.name, attr.dt, attr.arrayLength, attr.getmap, attr.setmap, attr.scaleFactor));
					attr.framework = boundModel.framework;
				}
			}

			this._super(boundModel);
		},
		show: function () {
			//"Showing" a body in the physics engine right now is making the object collidable
			if (this.boundModel.el) {
				this.boundModel.world.Step();
				this.boundModel.fixDef = this.boundModel.el.CreateFixture(this.boundModel.fixDef);
				if (this.boundModel.collidable) {
					var filter = this.boundModel.fixDef.GetFilterData();

					//Every class type has a collision category that is maintain in globals
					if (!JSO.Client.Globals.collisionBits[this.boundModel.typename]) {
						JSO.Client.Globals.collisionBits[this.boundModel.typename] = JSO.Client.Globals.uniqueBit();
					}

					filter.categoryBits = JSO.Client.Globals.collisionBits[this.boundModel.typename];

					//If collisions are specified, go through the list and build mask for box2d
					if (this.boundModel.collisionlist.length > 0) {
						this.boundModel.maskBits = 0;
						for (var i = 0; i < this.boundModel.collisionlist.length; i++) {
							//Ensure that there is a category present in the global bit list for each collidable type
							if (!JSO.Client.Globals.collisionBits[this.boundModel.collisionlist[i]] && this.boundModel.collisionlist[i] != '') {
								JSO.Client.Globals.collisionBits[this.boundModel.collisionlist[i]] = JSO.Client.Globals.uniqueBit();
							}
							var bit = JSO.Client.Globals.collisionBits[this.boundModel.collisionlist[i]];
							//Add type's bit to mask
							this.boundModel.maskBits = this.boundModel.maskBits | bit;
						}
						//Set collision mask in box2D
						filter.maskBits = this.boundModel.maskBits;
					}
					this.boundModel.fixDef.SetFilterData(filter);
				}
			}
		},
		hide: function () {
			//Clear the collision filter
			if (this.boundModel.fixDef && !this.boundModel._isDestroyed && this.boundModel.visible) {
				if (this.boundModel.fixDef) {
					var filter = this.boundModel.fixDef.GetFilterData();
					filter.maskBits = 0;
					this.boundModel.fixDef.SetFilterData(filter);
				}
			}
		},
		destroy: function () {
			this.hide(this.boundModel);
			this.boundModel.world = nothing;
			JSO.Client.Globals.gameController.model.bindings.box2d._renderGarbage.push(this.boundModel);
			this._super();
		}
	});
})();