// Natively supported datatypes
let datatypes = [Number, Object, Array, String, Boolean, Date];

function Coerce() {
	let cases = [];

	function cast(pattern, promisedValue) {
		return Promise.resolve(promisedValue).then(value => {
			// check special cases first before casting plain objects
			for (let instance of cases) {
				if (instance.condition(pattern, value)) {
					return instance.creator(pattern, value);
				}
			}
			
			if (pattern == undefined) {
				// no pattern specified
				// just return the value given
				return value;
			} else if (datatypes.includes(pattern)) {
				if (value == undefined) {
					return;
				} else if (value instanceof pattern) {
					// No need to perform casting
					return value;
				} else if (pattern == Date) {
					// calling Date returns a Number, use keyword new to return a Date object
					return new pattern(value);
				} else {
					// cast value to Number, Object, Array, Boolean, String, Date
					return pattern(value);
				}
			} else if (pattern instanceof Array) {
				if (value instanceof Array) {
					// recursively cast array elements
					return Promise.all(value.map((data) => cast(pattern[0], data))); 
				} else {
					if (value == undefined) {
						return [];
					} else {
						return cast(pattern[0], value).then(value => [value]);
					}
				}
			} else if (pattern.constructor == Object) {
				if (value == undefined) {
					return;
				} else if (value.constructor == Object) {
					let keys = [], promises = [];
					for (let key in pattern) {
						// recursively cast object values
						// keep undefined for casting
						keys.push(key);
						promises.push(cast(pattern[key], value[key]));
					}

					return Promise.all(promises).then(values => {
						let result = {};
						for (let index in keys) {
							// ignore undefined on output
							if (values[index] != undefined) {
								result[keys[index]] = values[index];
							}
						}
						return result;
					});
				} else {
					// type error
					// fail silently
					return;
				}
			} else {
				// what is this?
				return value;
			}
		});
	}

	this.cast = function(pattern, promisedValue, callback) {
		if (callback && typeof callback == 'function') {
			cast(pattern, promisedValue).then(result => {
				callback(null, result);
			}).catch(error => {
				callback(error);
			});
		} else {
			return cast(pattern, promisedValue);
		}
	}

	// Adds a user defined case
	this.addRule = function(condition, creator) {
		cases.unshift({ condition, creator });
	}

	// Set a getter for cases
	Object.assign(this, {
		get cases() {
			return cases;
		}
	})
}

module.exports = Coerce;