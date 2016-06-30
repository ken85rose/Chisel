// Git functions
'use strict'
module.exports = function(gulp, config, plugins){


	gulp.task('gitinit', function(){
		return gulp.src('')
			.pipe(shell('git remote add origin ' + require('./package.json').repository.url, {
				verbose: true,
			}))
			.pipe(shell('git add -A', {
				verbose: true,
			}))
			.pipe(shell('git commit -m "Initial commit"', {
				verbose: true,
			}))
			.pipe(shell('git push -u origin master', {
				verbose: true,
			}))
	})



	gulp.task('commit', function(){
		var msg = process.argv[process.argv.length - 1]
		return gulp.src('')
			.pipe(shell('git add -A', {
				verbose: true,
			}))
			.pipe(shell('git commit -m "' + msg + '"', {
				verbose: true,
			}))
	})


	// Pushers
	gulp.task('gitpush', function(){
		// Increment version and push
		return gulp.src('')
			.pipe(shell('git push -u origin master', {
				verbose: true,
			}))
	})
	gulp.task('gitpushrelease', function(){
		// Increment version and push
		return gulp.src('')
			.pipe(shell('git tag v' + require('./package.json').version, {
				verbose: true,
			}))
			.pipe(shell('git push -u origin master --tags', {
				verbose: true,
			}))

	})
	gulp.task('gitpushmajorrelease', function(){
		return gulp.src('')
			.pipe(shell('git tag v' + require('./package.json').version, {
				verbose: true,
			}))
			.pipe(shell('git push -u origin master --tags', {
				verbose: true,
			}))

	})

	// Bump version and commit before a push
	gulp.task('bumppatch', function(){
		return gulp.src('./package.json')
			.pipe(bump())
			.pipe(gulp.dest('./'))
			.pipe(shell('git add -A', {
				verbose: true,
			}))
			.pipe(shell('git commit -m "Version bump"', {
				verbose: true,
			}))
	})
	gulp.task('bumpminor', function(){
		return gulp.src('./package.json')
			.pipe(bump({type:'minor'}))
			.pipe(gulp.dest('./'))
			.pipe(shell('git add -A', {
				verbose: true,
			}))
			.pipe(shell('git commit -m "Version bump"', {
				verbose: true,
			}))
	})
	gulp.task('bumprelease', function(){
		return gulp.src('./package.json')
			.pipe(bump({type:'major'}))
			.pipe(gulp.dest('./'))
			.pipe(shell('git add -A', {
				verbose: true,
			}))
			.pipe(shell('git commit -m "Version bump"', {
				verbose: true,
			}))
	})

	// Bring it all together
	gulp.task('push', function(){
		return runSequence('bumppatch', ['gitpush'])
	})
	gulp.task('pushrelease', function(){
		return runSequence('bumpminor', ['gitpushrelease'])
	})
	gulp.task('pushmajorrelease', function(){
		return runSequence('bumprelease', ['gitpushmajorrelease'])
	})



}