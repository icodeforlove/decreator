'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tryToWrapProperty(wrapFunction, target, key, options) {
	var descriptor = (0, _getOwnPropertyDescriptor2.default)(target, key);

	if (descriptor && descriptor.configurable && !descriptor.get && !descriptor.set) {
		wrapFunction(target, key, descriptor, options);
	}
}

function wrapClass(wrapFunction, target, options) {
	var classMethods = (0, _getOwnPropertyNames2.default)(target).filter(function (name) {
		return !name.match(/^(length|name|prototype)$/);
	});

	classMethods.forEach(function (key) {
		tryToWrapProperty(wrapFunction, target, key, options);
	});

	var instanceMethods = (0, _getOwnPropertyNames2.default)(target.prototype).filter(function (name) {
		return !name.match(/^(constructor)$/);
	});

	instanceMethods.forEach(function (key) {
		tryToWrapProperty(wrapFunction, target.prototype, key, options);
	});
}

function isDescoratorArgs(args) {
	var target = args[0],
	    key = args[1],
	    descriptor = args[2];

	return target && key && ((typeof descriptor === 'undefined' ? 'undefined' : (0, _typeof3.default)(descriptor)) === 'object' && (typeof descriptor.value === 'function' || typeof descriptor.initializer === 'function') && typeof descriptor.writable === 'boolean' && typeof descriptor.enumerable === 'boolean' && typeof descriptor.configurable === 'boolean' || target === descriptor);
}

exports.default = function (wrapFunction) {
	return function () {
		var _arguments = arguments;

		if (typeof arguments[0] === 'function' && arguments[0].prototype && arguments.length === 1) {
			// class decorator (no args)
			var target = arguments[0],
			    options = {};

			wrapClass(wrapFunction, target, options);

			return target;
		} else if (isDescoratorArgs(arguments)) {
			// method decorator (no args)
			var _target = arguments[0],
			    key = arguments[1],
			    _options = {};

			tryToWrapProperty(wrapFunction, _target, key, _options);

			return _target;
		} else {
			var _ret = function () {
				var options = _arguments[0] || {};

				return {
					v: function v(target, key) {
						if (key) {
							// method decorator (args)
							tryToWrapProperty(wrapFunction, target, key, options);
						} else {
							// class decorator (no args)
							wrapClass(wrapFunction, target, options);
						}

						return target;
					}
				};
			}();

			if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
		}
	};
};

module.exports = exports['default'];