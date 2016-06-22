// Live browser reload (client code only)
'use strict'
module.exports = function(gulp, config, plugins){
	gulp.task('sync', function(){
		plugins.browserSync.init({
			notify: false,
			port: 8080,
			server: {
				baseDir: './',
				index: 'test/index.html',
			}
		})
	})
}