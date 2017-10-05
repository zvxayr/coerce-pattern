# coerce-pattern
Coerces values into a pattern

## Installation

```sh
    npm install coerce-pattern --save
```

## API
```javascript
const Coerce = require('coerce-pattern');

let coerce = new Coerce();
```

## Usage

### With promises
```javascript
coerce.cast(
    { id: Number, name: String, list: [String] },
    { id: '100', name: 'foo', list: [1, 2, 3, 4] }
).then(res => {
    // res == { id: 100, name: 'foo', list: ['1', '2', '3', '4'] }
}).catch(onError);
```

### With callbacks
```javascript
coerce.cast(
    { id: Number, name: String, list: [String] },
    { id: '100', name: 'foo', list: [1, 2, 3, 4] },
    function(err, res) {
        // res == { id: 100, name: 'foo', list: ['1', '2', '3', '4'] }
    }
)
```

### Adding rules
```javascript
coerce.addRule(
    (pattern, value) => value === 100 && pattern == String, // return true if rule applies
    (pattern, value) => '200' // return value of this rule
);

coerce.cast(100, String).then(res => {
    // res == '200'
});
```

## License

MIT
