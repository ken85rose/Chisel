// Preprocesses JS for development and production
'use strict'
module.exports = function(gulp, config, plugins){


	// Distribution files
	gulp.task('chiselscriptmin', function(){
		var obj = JSON.parse(fs.readFileSync('./package.json'))

		return gulp.src(config.src + '/' + config.script + '/**/*.js')
			.pipe(concat('chisel.js'))
			.pipe(wrapJs("/*! " + obj.title + " v" + obj.version + " | " + obj.license + " License | " + obj.author.url + " */!function(w,d,u){'use strict';w.c={};%= body %}(window,document)"))
			.pipe(uglify({preserveComments:'some'}))
			.pipe(rename('chisel.min.js'))
			.pipe(gulp.dest(config.dist))
			.pipe(notify('Library scripts processed'))
	})
	gulp.task('chiselscriptdev', function(){
		var obj = JSON.parse(fs.readFileSync('./package.json'))

		return gulp.src(config.src + '/' + config.script + '/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(concat('chisel.js'))
			.pipe(wrapJs("/*! " + obj.title + " v" + obj.version + " | " + obj.license + " License | " + obj.author.url + " */!function(w,d,u){'use strict';w.c={};%= body %}(window,document)"))
			.pipe(sourcemaps.write('/'))
			.pipe(gulp.dest(config.dist))
			.pipe(notify('Library scripts processed'))
	})
	gulp.task('chiselscript', ['chiselscriptmin', 'chiselscriptdev'])

	gulp.task('chiselstyle', function(){
		var obj = JSON.parse(fs.readFileSync('./package.json'))

		var full = gulp.src(config.src + '/' + config.style + '/chisel.scss')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer({
				browsers: config.browsers
			}))
			.pipe(sourcemaps.write('/'))
			.pipe(gulp.dest(config.dist))

		var min = gulp.src(config.src + '/' + config.style + '/chisel.scss')
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(autoprefixer({
				browsers: config.browsers
			}))
			.pipe(csso())
			.pipe(rename('chisel.min.css'))
			.pipe(gulp.dest(config.dist))

		return merge(full, min)
			.pipe(notify('Library styles processed'))

	})


	// Testing files
	gulp.task('chiseltestpug', function(){
		return gulp.src(config.src + '/test/**/*.pug')
			.pipe(pug())
			.pipe(gulp.dest('test'))
			.pipe(notify('Test HTML processed'))
	})
	gulp.task('chiseltestscript', function(){
		return gulp.src(config.src + '/test/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('test'))
			.pipe(notify('Test scripts processed'))
	})


	gulp.task('build', ['chiselscript', 'chiselstyle'])
	gulp.task('test', ['chiseltestpug', 'chiseltestscript'])






}