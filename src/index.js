function tryToWrapProperty(wrapFunction, target, key, options) {
	const descriptor = Object.getOwnPropertyDescriptor(target, key);

	if (descriptor && descriptor.configurable && !descriptor.get && !descriptor.set) {
		wrapFunction(target, key, descriptor, options);
	}
}

function wrapClass (wrapFunction, target, options) {
	const classMethods = Object.getOwnPropertyNames(target)
		.filter(name => !name.match(/^(length|name|prototype)$/));

	classMethods.forEach(key => {
		tryToWrapProperty(wrapFunction, target, key, options);
	});

	const instanceMethods = Object.getOwnPropertyNames(target.prototype)
		.filter(name => !name.match(/^(constructor)$/));

	instanceMethods.forEach(key => {
		tryToWrapProperty(wrapFunction, target.prototype, key, options);
	});
}

function isDescoratorArgs(args) {
	const target = args[0],
		  key = args[1],
		  descriptor = args[2];

	return (
		target &&
		key &&
		((
			typeof descriptor === 'object' &&
			(typeof descriptor.value === 'function' || typeof descriptor.initializer === 'function') &&
			typeof descriptor.writable === 'boolean' &&
			typeof descriptor.enumerable === 'boolean' &&
			typeof descriptor.configurable === 'boolean'
		) || target === descriptor)
	);
}

export default wrapFunction => {
	return function () {
		if (typeof arguments[0] === 'function' && arguments[0].prototype && arguments.length === 1) {
			// class decorator (no args)
			const target = arguments[0],
				  options = {};

			wrapClass(wrapFunction, target, options);

			return target;
		} else if (isDescoratorArgs(arguments)) {
			// method decorator (no args)
			const target = arguments[0],
				  key = arguments[1],
				  options = {};

			tryToWrapProperty(wrapFunction, target, key, options);

			return target;
		} else {
			const options = arguments[0] || {};

			return (target, key) => {
				if (key) {
					// method decorator (args)
					tryToWrapProperty(wrapFunction, target, key, options);
				} else {
					// class decorator (no args)
					wrapClass(wrapFunction, target, options);
				}

				return target;
			};
		}
	};
};