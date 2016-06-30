// Preprocesses JS for development and production
'use strict'
module.exports = function(gulp, config, plugins){

	var onError = {
		errorHandler: function(err) {
			util.log(util.colors.red(err))
			this.emit('end')
			gulp.src('')
				.pipe(notify('ERROR!!!'))
			
		}
	}




	// Distribution files
	gulp.task('chiselscriptmin', function(){
		var info = JSON.parse(fs.readFileSync('./package.json'))

		return gulp.src(config.src + '/' + config.script + '/**/*.js')
			.pipe(plumber(onError))
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(concat('chisel.js'))
			.pipe(wrapJs("/*! " + info.title + " v" + info.version + " | " + info.license + " License | " + info.author.url + " */\n!function(w,d,u){'use strict';w.c={};%= body %}(window,document)"))
			.pipe(uglify({preserveComments:'some'}))
			.pipe(rename('chisel.min.js'))
			.pipe(gulp.dest(config.dist))
			.pipe(notify('Library scripts processed'))
	})
	gulp.task('chiselscriptdev', function(){
		var info = JSON.parse(fs.readFileSync('./package.json'))

		return gulp.src(config.src + '/' + config.script + '/**/*.js')
			.pipe(plumber(onError))
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(sourcemaps.init())
			.pipe(concat('chisel.js'))
			.pipe(wrapJs("/*! " + info.title + " v" + info.version + " | " + info.license + " License | " + info.author.url + " */\n!function(w,d,u){'use strict';w.c={};%= body %}(window,document)"))
			.pipe(sourcemaps.write('/'))
			.pipe(gulp.dest(config.dist))
			.pipe(notify('Library scripts processed'))
	})
	gulp.task('chiselscript', ['chiselscriptmin', 'chiselscriptdev'])


	gulp.task('chiselbuildstyle', function(){

		var full = gulp.src(config.src + '/' + config.style + '/chisel.scss')
			.pipe(plumber(onError))
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer())
			.pipe(sourcemaps.write('/'))
			.pipe(gulp.dest(config.dist))

		var min = gulp.src(config.src + '/' + config.style + '/chisel.scss')
			.pipe(plumber(onError))
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(autoprefixer())
			.pipe(csso())
			.pipe(rename('chisel.min.css'))
			.pipe(gulp.dest(config.dist))

		return merge(full, min)
			.pipe(plugins.browserSync.stream())
			.pipe(notify('Library styles processed'))

	})

	// Prepend info to dist files
	gulp.task('chiselcssinfo', function(){
		var info = JSON.parse(fs.readFileSync('./package.json'))
		return gulp.src(config.src + '/' + config.style + '/info.scss')
			.pipe(insert.transform(function(contents, file){
				return "/*! " + info.title + " v" + info.version + " | " + info.license + " License | " + info.author.url + " */\n"
			}))
			.pipe(gulp.dest(config.src + '/' + config.style))
	})
	gulp.task('chiselstyle', function(){
		return runSequence('chiselcssinfo', ['chiselbuildstyle'])
	})


	// Testing files
	gulp.task('chiseltestpug', function(cb){
		gulp.src(config.src + '/test/**/*.pug')
			.pipe(plumber(onError))
			.pipe(pug())
			.pipe(gulp.dest('test'))
			.on('end', cb)
			.pipe(notify('Test HTML processed'))
	})
	gulp.task('chiseltestscript', function(){
		return gulp.src(config.src + '/test/**/*.js')
			.pipe(plumber(onError))
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('test'))
			.pipe(notify('Test scripts processed'))
	})
	gulp.task('chiselteststyle', function(){
		return gulp.src(config.src + '/test/**/*.scss')
			.pipe(plumber(onError))
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('test'))
			// Inject into browser
			.pipe(plugins.browserSync.stream())
			.pipe(notify('Test scripts processed'))
	})


	gulp.task('build', [
		'chiselscript',
		'chiselstyle',
		'chiseltestpug',
		'chiseltestscript',
		'chiselteststyle'
	])






}