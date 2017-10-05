const Coerce = require('./');

let test1 = new Coerce();

let value1 = { id: '100', name: 'foo', list: [1, 2, 3, 4] };
let patrn1 = { id: Number, name: String, list: [String] };
let asert1 = res => {
	assert(res.id, 100);
	assert(res.name, 'foo');
	// assert(res.list[0], '1');
	// assert(res.list[1], '2');
	// assert(res.list[2], '3');
	// assert(res.list[3], '4');
}

let onerr = err => {
	console.error(err)
	process.exit(1);
}

test1.cast(patrn1, value1).then(asert1).catch(onerr);
test1.cast(patrn1, value1, (err, res) => {
	try {
		asert1(res);
	} catch(err) {
		onerr(err);
	}
});

let test2 = new Coerce()

test2.addRule(
    (value, pattern) => value === 100 && pattern == String, // return true if rule applies
    (value, pattern) => '200' // return value of this rule
);

test2.cast(String, 100).then(res => {
    assert(res, '200');
}).catch(onerr);

function assert(left, right) {
	if (left !== right)
		throw new Error(`Value mismatch! ${left} != ${right}`);
}