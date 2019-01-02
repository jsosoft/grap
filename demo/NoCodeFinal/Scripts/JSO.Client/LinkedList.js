/**
*  Linked list for application objects
*/
(function () {
	JSO.Client.LinkedList = JSO.Client.Class.extend({
		constructor: JSO.Client.LinkedList,
		construct: function () {
			this.events = {};
			if (!this.prev) this.prev = undefined;
			if (!this.next) this.next = undefined;
		},
		last: function () {
			if (this.next) return this.next.last();
			else return this;
		},
		first: function () {
			if (this.prev) return this.prev.first();
			else return this;
		},
		find: function (typename) {
			if (this.typename == typename) return this;
			else if (this.next) return this.next.find(typename);
		},
		insertBefore: function (item) {
			if (this.prev) {
				this.prev.next = item;
				item.prev = this.prev;
				item.next = this;
				this.prev = item;
			} else {
				item.next = this;
				this.prev = item;
			}
			if (this.events.insert) this.events.insert(this);
			return item;
		},
		insertAfter: function (item) {
			if (this.next) {
				this.next.prev = item;
				item.prev = this;
				item.next = this.next;
				this.next = item;
			} else {
				item.prev = this;
				this.next = item;
			}
			if (this.events.insert) this.events.insert(this);
			return item;
		},
		remove: function () {
			if (this.events.remove) this.events.remove(this);
			if (this.next && this.prev) {
				this.next.prev = this.prev;
				this.prev.next = this.next;
			}
			if (this.next && !this.prev) {
				this.next.prev = undefined;
			}
			if (this.prev && !this.next) {
				this.prev.next = undefined;
			}
			this.next = undefined;
			this.prev = undefined;
		},
		destroy: function () {
			//Release references
			if (this.events.destroy && !this._isDestroyed) {
				this._isDestroyed = true;
				if (this.eventContext) this.events.destroy.apply(this.eventContext, [this]);
				this.events.destroy = undefined;
			}
			this.remove();
		}
	});
})();