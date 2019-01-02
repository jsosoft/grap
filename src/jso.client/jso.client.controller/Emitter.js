/**
* Emitter
* Particle emitter controller.  Handles the interaction between emitter and emitted object
*/
(function()
{
	JSO.Client.Controller.Emitter = JSO.Client.Controller.extend({
		_emitted: false,
		constructor: JSO.Client.Controller.Emitter,
		construct: function(model, parent){
			this._super(model, parent);
			this._emitted = false
			this.currentParticleId = 0;
		},
		initialize: function(){
			this._super();
			this.particleLoopBuffer = [];
			if (this.model.cached === true || this.model.cached === 1 || this.model.cached === 'true') this.fillParticleCache();
			
			//Set up emit asynchronous call
			if(this.model.delay > 0){
				var timer = new JSO.Client.Timer(this, this.emit, 1/this.model.delay);
				this.timers.push(timer);
			}
		},
		fillParticleCache: function () {
			//Copy the particle set into the buffer up to the max possible number of particles
			var m = this.model.totalCount;
			while (m--) {
				//Particles can be composed of multiple models, the particle set contains all of the models in one "particle"
				this.particleLoopBuffer.push(this.getParticleSet());
			}

		},
		getParticleSet: function () {
			var particleSet = [];
			var i = this.model.childIds.length;
			while (i--) {
				var childData = this.model.childIds[i];
				if (childData.rootTypename == 'actor' || childData.rootTypename == 'particle') {
					var p = this.model.emitNumber;
					while (p--) {
						var particle = JSO.Client.Controller.Factory.create(JSO.Client.Model.Factory.create(childData.id, childData.rootTypename), this);
						particleSet.push(particle);
					}
				}
			}

			return particleSet;
		},
		emit: function(){
			this._emitted = true;
			var emitter = this.model;
			//If the emitter has exceeded its max emissions, just leave
			if(emitter.totalCounter >= emitter.totalCount && emitter.totalCount != 0) return;
			
			//If the current number of particles is over the max, outta here
			if (emitter.particleCounter >= emitter.maxCount && emitter.maxCount > 0) return;
			
			var particleSet = [];
			if ((this.model.cached === true || this.model.cached === 1 || this.model.cached === 'true') && this.particleLoopBuffer.length > 0) {
				particleSet = this.particleLoopBuffer.pop();
			} else {
				particleSet = this.getParticleSet();
			}
			
			JSO.Client.Globals.gameController.executionQueues.push(new JSO.Client.ExecutionQueue(this.emitParticle, this, particleSet, null, null, 60));
			this.model.particleCounter++;
			this.model.totalCounter++;

			if (this.model.cached) {
				this.currentParticleId++;
				if (this.currentParticleId > this.particleLoopBuffer.length) this.currentParticleId = 0;
			}
		},
		emitParticle: function (particle) {
			if (!particle || particle === undefined || particle === null) return;
					
			if (particle.events) particle.events['destroy'] = this.destroyChild;
			else particle.events = {}; particle.events.destroy = this.destroyChild;
			particle.eventContext = this;
			
			particle.firstView.inView = true;

			for (var name in particle.model.attributes) {
				var attr = particle.model.attributes[name].first();

				if (attr.framework.toLowerCase() == 'expression') {
					particle.model[name] = particle.model[name];
					attr.remove();
					//if (attr.name == 'velocity') console.log('after', attr.auditChain());
				}
			}

			if (!this.firstChild) this.firstChild = particle;
			else this.firstChild.last().insertAfter(particle);
			particle.show();
		},
		emitComplete: function(){
			this._isEmitting = false;
		},
		show: function(){
			//Do nothing.  Display is performed on particle spawn, pass to the next controller
			if(this.next) this.next.show();
		},
		destroy: function(){
			this.particleLoopBuffer = [];
			this._super();
		},
		destroyChild: function (child) {
			this.model.particleCounter--;
			this._super(child);
		},
		addChild: function(event, child){
			if(child.metatype == 'controller'){
				var rootTypename = JSO.Client.Globals.DAL.cache.types[child.typename].rootTypename;
				
				if((rootTypename != 'actor' && rootTypename != 'particle') || this._emitted) {
					this._super(event, child);
				}
			} else this._super(event, child);
		},
		loadChild: function(child){
			if(child.metatype == 'model'){
				var rootTypename = JSO.Client.Globals.DAL.cache.types[child.typename].rootTypename;
				
				if((rootTypename != 'actor' && rootTypename != 'particle') || this._emitted){
					this._super(child);
				}
			} else this._super(child);
		}
	});
})();
