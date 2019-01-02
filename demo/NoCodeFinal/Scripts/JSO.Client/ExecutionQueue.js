(function () {
	JSO.Client.ExecutionQueue = function (process, context, items, callback, nextQueue, fps) {
		this.uid = JSO.Client.Globals.uniqueId();
		this.queue = [];
		this.nextQueue = nextQueue;
		this.items = items;
		this.process = process;
		this.context = context;
		this.callback = callback;
		this.fps = fps;
		this.complete = false;
		this.lastExec = Date.now();

		this.doNext = function () {
			if (this.fps && Date.now() - this.lastExec < 1000 / this.fps) return;
			if (this.items) {
				var nextItem = this.items.shift();
				if (nextItem) this.process.apply(this.context, [nextItem]);
				if (!this.items.length) {
					if (this.callback) this.callback.apply(this.context, []);
					this.complete = true;
				}
			} else {
				this.process.apply(this.context, []);
				this.complete = true;
			}

			if (this.complete && this.nextQueue != undefined) {
				this.nextQueue.doNext.apply(this.nextQueue, []);
				this.nextQueue = undefined;
			}
		}
	}
})();