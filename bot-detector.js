
function BotDetector(callback) {
	var self = this;
	self.isBot = false;
	self.tests = {};

	self.tests.scroll = function() {
		var e = function() {
			self.tests.scroll = true;
			self.update()
			self.unbindEvent(window, 'scroll', e)
			self.unbindEvent(document, 'scroll', e)
		};
		self.bindEvent(window, 'scroll', e);
		self.bindEvent(document, 'scroll', e);
	};
	self.tests.mouse = function() {
		var e = function() {
			self.tests.mouse = true;
			self.update();
			self.unbindEvent(window, 'mousemove', e);
		}
		self.bindEvent(window, 'mousemove', e);
	};
	self.tests.keyup = function() {
		var e = function() {
			self.tests.keyup = true;
			self.update();
			self.unbindEvent(window, 'keyup', e);
		}
		self.bindEvent(window, 'keyup', e);
	};

	self.cases = {};
	self.callback = callback;
}
BotDetector.prototype.update = function() {
	var self = this;
	var count = 0;
	var tests = 0;
	for(var i in self.tests) {
		if (self.tests.hasOwnProperty(i)) {
			self.cases[i] = self.tests[i] === true;
			if (self.cases[i] === true) {
				count++;
			}
		}
		tests++;
	}
	self.isBot = count ==  0;
	if (count === tests) {
		self.__fired = true;
		self.callback(self);	
	}	
	setTimeout(function() {
		if (self.__fired) {
			return;
		}
		self.callback(self);
	}, 1000);
}
BotDetector.prototype.executedTests() {
	return 0;
};
BotDetector.prototype.bindEvent = function(e, type, handler) {
	if (e.addEventListener) {
		e.addEventListener(type, handler, false);
	}
	else if(e.attachEvent) {
		e.attachEvent("on" + type, handler);
	}
};

BotDetector.prototype.unbindEvent = function(e, type, handle) {
	if (e.removeEventListener) {
		e.removeEventListener(type, handle, false);
	}
	else {
		var evtName = "on" + type;
		if (e.detachEvent) {
			if (typeof e[evtName] === 'undefined') {
				e[type] = null
			}
			e.detachEvent(evtName)
		}
	}
};

BotDetector.prototype.watch = function(callback) {
	// Callback override 
	if (callback) {
		this.callback = callback;
	}
	this.__fired = false;
	for(var i in this.tests) {
		if (this.tests.hasOwnProperty(i)) {
			this.tests[i].call();
		}
		this.update();
	}
};
