/**
*  External binding class to the top-level Box2D world class
*/
(function () {
	JSO.Client.DataBinding.Box2DWorld = JSO.Client.DataBinding.FrameworkClass.extend({
		typename: 'Box2DWorld',
		framework: 'Box2D',
		_renderGarbage: [],
		constructor: JSO.Client.DataBinding.ExpressionClass,
		construct: function (boundModel) {
			//Set up box2d world
			var allowSleep = true;
			this.TARGET_RATE = .1;
			this.garbageCounter = 0;
			this.dumpGarbageOn = 3000;
			boundModel.el = new Box2D.Dynamics.b2World(boundModel.gravity || new Box2D.Common.Math.b2Vec2(0, 0), allowSleep);

			this._super(boundModel);
		},
		renderFn: function (timer) {
			//Clear garbage, one object is cleared per frame
			this.garbageCounter++;
			if (this._renderGarbage.length && this.garbageCounter == this.dumpGarbageOn) {
				destroyObject(this._renderGarbage.pop());
				this.el.ClearForces();
				this.garbageCounter = 0;
			}

			//Step the Box2D world
			this.boundModel.el.Step(
				this.TARGET_RATE, 		//frame-fps
				VELOCITY_ITERATIONS,    //velocity iterations
				POSITION_ITERATIONS     //position iterations
			);

		},
		destroyObject: function (data) {
			if (data.fixDef != null) {

				//if(data.fixDef) data.el.DestroyFixture(data.fixDef);
				if (data.el != undefined) {
					this.boundModel.el.DestroyBody(data.el);
				}
				data.el = null;
				data.fixDef = null;
				this.el.ClearForces();
			}
		},
		show: function () {
			this.boundModel.renderFn = this.renderFn.bind(this);
		},
		hide: function () {
			boundModel.renderFn = undefined;
		}
	});
})();