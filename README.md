[![Travis branch](https://img.shields.io/travis/chrisallenlane/node-shred/master.svg)]()
[![npm](https://img.shields.io/npm/v/node-shred.svg)]()
[![npm](https://img.shields.io/npm/dt/node-shred.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/npm/node-shred/badge.svg)](https://snyk.io/test/npm/node-shred)


node-shred
==========

`node-shred` is a thin wrapper around the `shred` shell utility.

Usage
-----
```javascript
const Shred = require('node-shred');
var shred   = Shred({ files : [ '/tmp/foo', '/tmp/bar' ]});

shred
  .on('data', function(data) {
    // Only output from `help` and `version` should appear here. You likely
    // won't need this.
  }
  .on('end', function(success) {
    // `success` will be `true` if shredding was successful, and `false`
    // otherwise.
  })
  .on('error', function(err) {
    // `err` will contain the error message. See the note below regarding
    // `verbose`.
  });
```

Options
-------
`node-shred` exposes almost exactly the same options as `shred` itself:

| Parameter    | Type             | Description |
|--------------|------------------| ----------- |
|`force`       | Boolean          | Change permissions to allow writing if necessary|
|`iterations`  | Number           | Overwrite N times instead of the default (3)|
|`randomSource`| String           | Get random bytes from FILE|
|`size`        | String or Number | Shred this many bytes (suffixes like `K`, `M`, `G`, accepted)|
|`remove`      | Boolean          | Truncate and remove files after overwriting|
|`verbose`     | Boolean          | Show progress. (**NB: progress information will be written to `stderr` rather than `stdout`, and thus must be read from the `.on('err')` event rather than `.on(data)`**. While perhaps counterintuitive, this behavior mirrors that of `shred` itself.|
|`exact`       | Boolean          | Do not round file sizes up to the next full block; this is the default for non-regular files|
|`zero`        | Boolean          | Add a final overwrite with zeros to hide shredding|
|`files`       | Array or String  | The file or files to shred|
|`file`        | Array or String  | (Alias for `files`)|
|`help`        | Boolean          | Display `shred help` and exit|
|`version`     | Boolean          | Output version information and exit|
|`shredPath`   | String           | The path to `shred` on your system. (Defaults to `/usr/bin/shred`.) |

Notes
-----
- `shred` must be installed on your system for this wrapper to work.

- Defenses against [command-injection attacks][1] have been put in place,
  except with regards to the `shredPath` parameter, which cannot be defended.
  Regardless, it is unwise to allow users to set initialization parameter
  values.

- The unit-tests only assert that the expected options are being sent to
  `shred`. They do **not** assert that `shred` behaves as expected. While it is
  probably reasonable to assume that it does, be aware that this assumption is
  being made.

- Be certain to read `man shred`, and to understand the security implications
  of using `shred` on modern filesystems.

  [1]: https://www.owasp.org/index.php/Command_Injection
