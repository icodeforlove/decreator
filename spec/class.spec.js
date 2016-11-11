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


@decorator
class ClassDecorator {
	property = 'normal';
	static methodProperty = () => 'normal'

	static methodDecorated () {
		return 'normal';
	}

	get getter () {
		return 'normal';
	}

	static get getter () {
		return 'normal';
	}

	methodDecorated () {
		return 'normal';
	}
}

@decorator({value: 'decorated-with-args'})
class ClassDecoratorArgs {
	property = 'normal';
	static methodProperty = () => 'normal'

	static methodDecorated () {
		return 'normal';
	}

	get getter () {
		return 'normal';
	}

	static get getter () {
		return 'normal';
	}

	methodDecorated () {
		return 'normal';
	}
}

@uppercase
@decorator({value: 'decorated-with-args'})
class ClassDecoratorMultiple {
	property = 'normal';
	static methodProperty = () => 'normal'

	static methodDecorated () {
		return 'normal';
	}

	get getter () {
		return 'normal';
	}

	static get getter () {
		return 'normal';
	}

	methodDecorated () {
		return 'normal';
	}
}

describe('Class Methods', () => {
	it('can use class decorators', () => {
		const classDecorator = new ClassDecorator();

		expect(ClassDecorator.methodDecorated()).toBe('normal-decorated');
		expect(ClassDecorator.getter).toBe('normal');
		expect(ClassDecorator.methodProperty()).toBe('normal-decorated');
		expect(classDecorator.methodDecorated()).toBe('normal-decorated');
		expect(classDecorator.getter).toBe('normal');
		expect(classDecorator.property).toBe('normal');
	});

	it('can use class decorators with args', () => {
		const classDecoratorArgs = new ClassDecoratorArgs();

		expect(ClassDecoratorArgs.methodDecorated()).toBe('normal-decorated-with-args');
		expect(ClassDecoratorArgs.getter).toBe('normal');
		expect(ClassDecoratorArgs.methodProperty()).toBe('normal-decorated-with-args');
		expect(classDecoratorArgs.methodDecorated()).toBe('normal-decorated-with-args');
		expect(classDecoratorArgs.getter).toBe('normal');
		expect(classDecoratorArgs.property).toBe('normal');
	});

	it('can use multiple decorators', () => {
		const classDecoratorMultiple = new ClassDecoratorMultiple();

		expect(ClassDecoratorMultiple.methodDecorated()).toBe('NORMAL-DECORATED-WITH-ARGS');
		expect(ClassDecoratorMultiple.getter).toBe('normal');
		expect(ClassDecoratorMultiple.methodProperty()).toBe('NORMAL-DECORATED-WITH-ARGS');
		expect(classDecoratorMultiple.methodDecorated()).toBe('NORMAL-DECORATED-WITH-ARGS');
		expect(classDecoratorMultiple.getter).toBe('normal');
		expect(classDecoratorMultiple.property).toBe('normal');
	});
});