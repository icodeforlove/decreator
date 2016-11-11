import decreator from '../dist/index';

const decorator = decreator((target, key, descriptor, options) => {
	const {
		value
	} = options;

	const func = target[key];

	Object.defineProperty(target, key, {
		value: function () {
			return func.apply(this, arguments) + '-' + (value || 'decorated');
		}
	});

	return target;
});

const uppercase = decreator((target, key) => {
	const func = target[key];

	Object.defineProperty(target, key, {
		value: function () {
			const value = func.apply(this, arguments);

			return typeof value === 'string' ? value.toUpperCase() : value;
		}
	});
    return target;
});

class InstanceDecorator {
	constructor() {
		this.scope = 'scope';
	}

	property = 'normal';

	@decorator
	static methodProperty = () => 'normal'

	@decorator
	static methodDecorated () {
		return 'normal';
	}

	get getter () {
		return 'normal';
	}

	static get getter () {
		return 'normal';
	}

	@decorator
	methodDecorated () {
		return 'normal';
	}

	@decorator
	methodDecoratedHasScope () {
		return this.scope;
	}
}

class InstanceDecoratorArgs {
	property = 'normal';

	@decorator({value: 'decorated-with-args'})
	static methodProperty = () => 'normal'

	@decorator({value: 'decorated-with-args'})
	static methodDecorated () {
		return 'normal';
	}

	get getter () {
		return 'normal';
	}

	static get getter () {
		return 'normal';
	}

	@decorator({value: 'decorated-with-args'})
	methodDecorated () {
		return 'normal';
	}
}

class InstanceDecoratorMultiple {
	property = 'normal';

	@uppercase
	@decorator({value: 'decorated-with-args'})
	static methodProperty = () => 'normal'


	@uppercase
	@decorator({value: 'decorated-with-args'})
	static methodDecorated () {
		return 'normal';
	}

	get getter () {
		return 'normal';
	}

	static get getter () {
		return 'normal';
	}

	@uppercase
	@decorator({value: 'decorated-with-args'})
	methodDecorated () {
		return 'normal';
	}
}

describe('Class Methods', () => {
	it('can use class decorators', () => {
		const instanceDecorator = new InstanceDecorator();

		expect(InstanceDecorator.methodDecorated()).toBe('normal-decorated');
		expect(InstanceDecorator.getter).toBe('normal');
		expect(InstanceDecorator.methodProperty()).toBe('normal-decorated');
		expect(instanceDecorator.methodDecorated()).toBe('normal-decorated');
		expect(instanceDecorator.getter).toBe('normal');
		expect(instanceDecorator.property).toBe('normal');
		expect(instanceDecorator.methodDecoratedHasScope()).toBe('scope-decorated');
	});

	it('can use class decorators with args', () => {
		const instanceDecoratorArgs = new InstanceDecoratorArgs();

		expect(InstanceDecoratorArgs.methodDecorated()).toBe('normal-decorated-with-args');
		expect(InstanceDecoratorArgs.getter).toBe('normal');
		expect(InstanceDecoratorArgs.methodProperty()).toBe('normal-decorated-with-args');
		expect(instanceDecoratorArgs.methodDecorated()).toBe('normal-decorated-with-args');
		expect(instanceDecoratorArgs.getter).toBe('normal');
		expect(instanceDecoratorArgs.property).toBe('normal');
	});

	it('can use multiple decorators', () => {
		const instanceDecoratorMultiple = new InstanceDecoratorMultiple();

		expect(InstanceDecoratorMultiple.methodDecorated()).toBe('NORMAL-DECORATED-WITH-ARGS');
		expect(InstanceDecoratorMultiple.getter).toBe('normal');
		expect(InstanceDecoratorMultiple.methodProperty()).toBe('NORMAL-DECORATED-WITH-ARGS');
		expect(instanceDecoratorMultiple.methodDecorated()).toBe('NORMAL-DECORATED-WITH-ARGS');
		expect(instanceDecoratorMultiple.getter).toBe('normal');
		expect(instanceDecoratorMultiple.property).toBe('normal');
	});
});