// Controls file watching & live reload
'use strict'
module.exports = function(gulp, config, plugins){

	// Watches files for changes
	gulp.task('watch', function(){
		
		// Library files
		gulp.watch(config.src + '/style/**/*.scss', ['chiselstyle'])
		gulp.watch(config.src + '/script/**/*.js', ['chiselscript'])

		// Test files
		gulp.watch(config.src + '/test/**/*.pug', ['chiseltestpug'])
		gulp.watch(config.src + '/test/**/*.js', ['chiseltestscript'])

		// Reload browser
		gulp.watch(config.dist + '/**/*.html', plugins.browserSync.reload)
		gulp.watch(config.dist + '/**/*.js', plugins.browserSync.reload)

	})



	// Watch and browser sync tasks
	gulp.task('default', ['sync', 'watch'])
	gulp.task('php', ['phpserver', 'watch']);



}