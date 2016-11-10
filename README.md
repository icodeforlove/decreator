# decreator [![Build Status](https://travis-ci.org/icodeforlove/decreator.png?branch=master)](https://travis-ci.org/icodeforlove/decreator)

### why?

creating flexible decorators are complicated if you want them to act as wrappers, and work cross class/methodtype. **decreator** makes this very simple to do.

## install

```
npm install --save decreator
```

## usage

you can define a universal decorator like this

```javascript
import decreator from 'decreator';

const readonly = decreator((target, key, descriptor, options) => {
    if (options.verbose) {
        console.log(`@readonly ${key}`);
    }

    Object.defineProperty(target, key, {
        value: target[key],
        writable: false
    });

    return target;
});

class Example {
    @readonly
    method () {
    }
}

// or 
@readonly({verbose: true})
class Example {
    method () {
    }
}


```

## decorators with args

the decreator implimentation requires args to be in object form so

`@readonly({verbose: true})` vs `@readonly(true)`

## shortcomings

ignores class properties, this was done because at the moment the spec is up in the air, and currently doesnt support decorators in all scenarios.