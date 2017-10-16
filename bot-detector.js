function BotDetector(args) {
	var self = this;
	self.isBot = false;
	self.tests = {};

	var selectedTests = args.tests || [];
	if (selectedTests.length == 0 || selectedTests.indexOf(BotDetector.Tests.SCROLL) != -1) {
		self.tests[BotDetector.Tests.SCROLL] = function() {
			var e = function() {
				self.tests[BotDetector.Tests.SCROLL] = true;
				self.update()
				self.unbindEvent(window, 'scroll', e)
				self.unbindEvent(document, 'scroll', e)
			};
			self.bindEvent(window, 'scroll', e);
			self.bindEvent(document, 'scroll', e);
		};
	}
	if (selectedTests.length == 0 || selectedTests.indexOf(BotDetector.Tests.MOUSE) != -1) {
		self.tests[BotDetector.Tests.MOUSE] = function() {
			var e = function() {
				self.tests[BotDetector.Tests.MOUSE] = true;
				self.update();
				self.unbindEvent(window, 'mousemove', e);
			}
			self.bindEvent(window, 'mousemove', e);
		};
	}
	if (selectedTests.length == 0 || selectedTests.indexOf(BotDetector.Tests.KEYUP) != -1) {
		self.tests[BotDetector.Tests.KEYUP] = function() {
			var e = function() {
				self.tests[BotDetector.Tests.KEYUP] = true;
				self.update();
				self.unbindEvent(window, 'keyup', e);
			}
			self.bindEvent(window, 'keyup', e);
		};	
	}	

	self.cases = {};
	self.timeout = args.timeout || 1000;
	self.callback = args.callback || null;
	self.detected = false;
}

BotDetector.Tests = {
	KEYUP: 'keyup',
	MOUSE: 'mouse',
	SCROLL: 'scroll',
	GESTURE: 'gesture',
	GYROSCOPE: 'gyroscope'
};
BotDetector.prototype.update = function(notify) {
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
	self.allMatched = count == tests;
	if (notify !== false) {
		self.callback(self);
	}
}

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

BotDetector.prototype.monitor = function() {
	var self = this;
	for(var i in this.tests) {
		if (this.tests.hasOwnProperty(i)) {
			this.tests[i].call();
		}
	}	
	this.update(false);
	setTimeout(function() {
		self.update(true);
	}, self.timeout);
};
