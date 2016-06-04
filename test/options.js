const options    = require('../options');
const test       = require('tape');

// valid params 
var params = [
  'help',
  'version',
  'force',
  'remove',
  'verbose',
  'exact',
  'zero',
];

// iterate through the valid params, asserting that each is respected
params.forEach(function(param) {
  test(`options: '${param}' param`, function (t) {
    t.plan(3);
    t.notEquals(
      options({[ param ] : true }).indexOf('--' + param),
      -1,
      'must accept boolean values'
    );
    t.equals(
      options({[ param ] : 'true' }).indexOf('--' + param),
      -1,
      'must reject non-boolean values'
    );
    t.equals(
      options({}).indexOf('--' + param),
      -1,
      'must reject if undefined'
    );
  });
});

test("options: 'iterations' param", function (t) {
  t.plan(2);
  t.notEquals(
    options({ iterations: 5 }).indexOf('--iterations=5'),
    -1,
    'must set properly'
  );
  t.equals(
    options({ iterations: '; rm -rf / && echo "suks 4 u"' }).indexOf('rm'),
    -1,
    'must be invulnerable to injection'
  );
});

test("options: 'randomSource' param", function (t) {
  t.plan(2);
  t.notEquals(
    options({ randomSource: '/tmp/foo' }).indexOf('--random-source=/tmp/foo'),
    -1,
    'must set properly'
  );

  t.equals(
    options({ randomSource: '; rm -rf / && echo "suks 4 u"' }).indexOf('rm'),
    -1,
    'must be invulnerable to injection'
  );
});

test("options: 'size' param", function (t) {
  t.plan(2);
  t.notEquals(
    options({ size: 1024 }).indexOf('--size=1024'),
    -1,
    'must set properly'
  );
  t.equals(
    options({ size: '; rm -rf / && echo "suks 4 u"' }).indexOf('rm'),
    -1,
    'must be invulnerable to injection'
  );
});

// Support both a `files` and `file` param for the sake of ease-of-use
[ 'files', 'file' ].forEach(function(paramName) {
  test(`options: '${paramName}' param`, function (t) {
    t.plan(5);
    t.notEquals(
      options({ files: '/tmp/foo' }).indexOf('/tmp/foo')
      -1,
      'must accept file path as string'
    );

    var files = [ '/tmp/foo', '/tmp/bar' ];

    files.forEach(function(file) {
      t.notEquals(
        options({ files: files }).indexOf(file),
        -1,
        'must accept file path as array'
      );
    });

    t.equals(
      options({ files: '; rm -rf / && echo "suks 4 u"' }).indexOf('rm'),
      -1,
      'must be invulnerable to injection (string)'
    );
    t.equals(
      options({ files: ['rm -rf / &&', 'echo "suks 4 u"']}).indexOf('rm'),
      -1,
      'must be invulnerable to injection (array)'
    );

  });
});

test('options: invalid params', function (t) {
  t.plan(1);
  t.equals(
    options({ foo: true}).indexOf('--foo'),
    -1,
    'must reject if undefined'
  );
});
