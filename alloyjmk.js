var fs = require('fs');
var path = require('path');

function stss(event, logger) {
	var STSSProcessor = null;
	try {
		STSSProcessor = require('stss');
	} catch (err) {
		STSSProcessor = require(path.join(process.cwd(), 'node_modules', 'stss'));
	}

	if (STSSProcessor == null) {
		throw new Error('STSS preprocessor not found');
	}

	var stssDir = path.join(event.dir.home, 'stss');
	var stssMapFile = path.join(event.dir.home, 'stss.json');

	var stssMap = {};
	if (fs.existsSync(stssMapFile)) {
		try { stssMap = JSON.parse(fs.readFileSync(stssMapFile)) || {}; }
		catch (err) {}
	}

	var somethingChanged = false;

	(function walkSync(dir) {
		fs.readdirSync(dir).forEach(function(inPathName) {
			var inPath = path.join(dir, inPathName);
			var baseOutPath = inPath.replace(stssDir, '').replace(/\.stss$/, '.tss');
			var outPath = path.join(event.dir.home, 'styles', baseOutPath);

			var stat = fs.statSync(inPath);

			if (stat.isDirectory()) {

				if ( ! fs.existsSync(outPath)) {
					fs.mkdirSync(outPath);
				}
				walkSync(inPath);

			} else if (stat.isFile()) {

				if ( ! /\.stss$/.test(inPathName)) return;
				var key = inPath.replace(event.dir.home, '');
				var mtime = Math.floor( stat.mtime.getTime() / 1000);
				if (stssMap[key] === mtime) return;

				STSSProcessor.renderSync({
					file: inPath,
					outFile: outPath,
					success: function() {
						somethingChanged = true;
						stssMap[key] = mtime;

						logger.debug('Compiled ' + inPath);
					},
					error: function(err) {
						if (err.title != null && err.line != null) {
							logger.error('STSS: ' + err.title);
							logger.error(err.line);
							logger.error(err.processed);
						} else {
							logger.error(err.message);
						}

						throw new Error('STSS compile error');
					}
				});

			}

		});
	})(stssDir);

	if (somethingChanged === true) {
		fs.writeFileSync(stssMapFile, JSON.stringify(stssMap));
	}
}

task('pre:compile', stss);
