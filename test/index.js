const Shred = require('../index');
const test  = require('tape');
const tmp   = require('tmp');

test('index: shredPath param must default to /usr/bin/shred', function (t) {
  t.plan(1);
  var shred = Shred({ files   : tmp.fileSync().name });
  t.equals(shred._shredPath, '/usr/bin/shred');
});

test('index: shredPath param must allow overrides', function (t) {
  t.plan(1);

  // NB: I'm using /bin/echo as a placeholder here because this test will make
  // a call to `child_process.spawn()`, and an error will be thrown if
  // `shredPath` does not point to a command on the $PATH.
  var shred = Shred({ shredPath: '/bin/echo'});
  t.equals(shred._shredPath, '/bin/echo');
});

test('index: must emit "data" when receiving from stdout', function (t) {
  t.plan(3);

  // NB: due to the behavior of `shred` on the shell, data will rarely be
  // written to stdout. Here, we're just passing the --version flag because
  // it will write to stdout.
  var shred = Shred({ version: true });

  shred
    .on('data', function(data) { t.ok(data); })
    .on('close', function(code) { t.equals(code, 0); })
    .on('end'  , function(success) { t.equals(success, true); });
});

test('index: must emit "error" when receiving from stderr', function (t) {
  t.plan(3);
  var shred = Shred({ shredPath: '/tmp/not/real' });
  shred
    .on('error', function(err) { t.ok(err); })
    .on('close', function(code) { t.notEquals(0); })
    .on('end'  , function(success) { t.equals(success, false); });
});
