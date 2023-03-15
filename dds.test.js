const assert = require('assert');

const dds = require('./dds');

test('Address prefix length is 96 bits', () => {
  assert.equal(dds.addressBase.length, (128 - 32) / 8);
});

test('Hash string', () => {
  assert.equal(dds.hashString('Java'), 2301506);
  assert.equal(dds.hashString('Java Programming'), 1377009627);
  assert.equal(dds.hashString(''), 0);
});

test('Calculate key address', () => {
  assert.deepEqual(dds.keyToAddress('test.abc.1'), [255, 18, 0, 0, 0, 0, 0, 0, 0, 0, 221, 136, 38, 196, 233, 73]);
  assert.deepEqual(dds.keyToAddress('best.def.2'), [255, 18, 0, 0, 0, 0, 0, 0, 0, 0, 221, 136, 249, 198, 163, 255]);
  assert.deepEqual(dds.keyToAddress(''), [255, 18, 0, 0, 0, 0, 0, 0, 0, 0, 221, 136, 0, 0, 0, 0]);
});

test('Address to string', () => {
  assert.equal(dds.addressToString(dds.keyToAddress('test.abc.1')), 'FF12::DD88:26C4:E949');
  assert.equal(dds.addressToString(dds.keyToAddress('best.def.2')), 'FF12::DD88:F9C6:A3FF');
  assert.equal(dds.addressToString(dds.keyToAddress('')), 'FF12::DD88:0:0');
});

test('Single register', done => {

  dds.useEntry('test.1', (value, metadata) => {
    try {
      assert.equal(value, 1);
      done();
    } catch (e) {
      done(e);
    }
  });

  provided = dds.createEntry({
    name: 'test.1',
    getValue: async () => 1,
    getMetadata: async () => { }
  });

}
);

