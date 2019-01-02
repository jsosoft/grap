(function () {
	JSO.Client.Timer = function (context, process, fps, delay, callback, callbackContext) {
		this.uid = JSO.Client.Globals.uniqueId();
		this.metatype = 'timer';
		this.requestId = 0;
		this.timeoutId = 0;
		this.startTime = 0;
		this.frameTime = Date.now();
		this.lastTime = Date.now();
		this.ticks = 0;
		this.fps = fps || 60;
		this.fpsFilter = 10;
		this.fpsFrame = this.fpsFilter;
		this.fpsAvg = 0.0;
		this.process = process;
		this.context = context || this;
		this.callback = callback;
		this.delay = delay || 0;

		this.start = function (_this) {
			_this = _this || this;

			_this.frameTime = Date.now() - _this.lastTime;
			_this.fpsFrame = _this.frameTime == 0 ? 0 : 1000 / _this.frameTime;
			_this.fpsAvg += (_this.fpsFrame - _this.fpsAvg) / _this.fpsFilter;
			_this.lastTime = Date.now();
			_this.ticks++;
			this.timeoutId = setTimeout(function () {
				_this.startTime = _this.startTime == 0 ? Date.now() : _this.startTime;
				if (!_this.delay || _this.delay > 0 && Date.now() - _this.startTime > _this.delay * 1000) {
					_this.requestId = requestAnimationFrame(function () {
						if(_this.process != undefined) _this.process.apply(_this.context, [arguments[0], _this]);
						if (_this.delay) _this.destroy();
					});
				} 
				_this.start.apply(_this, arguments);
				
			}, 1000 / _this.fps );
			
		}

		this.stop = function () {
			if (this.timeoutId) window.clearTimeout(this.timeoutId);
			this.timeoutId = 0;
			if (this.requestId) window.cancelAnimationFrame(this.requestId);
			this.requestId = 0;
			this.startTime = 0;
		}

		this.destroy = function () {
			if (this.requestId || this.timeoutId) this.stop();
			this.process = undefined;
			if (this.callback) {
				this.callback(callbackContext, this);
			}
		}
	};
})();