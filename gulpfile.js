'use strict';

var gulp					= require('gulp');
var $ = require('gulp-load-plugins')({
	scope: ['devDependencies']
});
var fs 						= require('fs');
var browserSync				= require('browser-sync').create();
var yaml 					= require('yamljs');
var pngquant 				= require('imagemin-pngquant');

gulp.task('watch', function(gulpCallback) {
	browserSync.init({
		server: './build/',
		open: true
	}, function callback() {
		gulp.watch('build/*.html', browserSync.reload);
		gulp.watch('build/*.css', browserSync.reload);
		gulp.watch('build/*.js', browserSync.reload);
		gulp.watch('src/modules/**/*.jade', browserSync.reload);
		gulp.watch('src/modules/**/*.scss', browserSync.reload);
		gulp.watch('src/content/*.yml', browserSync.reload);

		gulp.watch('src/modules/**/*.scss', ['sass']);
		gulp.watch('src/styles/*.scss', ['sass']);

		gulp.watch('src/content/texts/*.yml', ['pages']);
		gulp.watch('src/modules/**/*.jade', ['pages']);
		gulp.watch('src/pages/*.jade', ['pages']);

		gulp.watch('src/js/*.js',['scripts']);
		gulp.watch('src/js/*.js',['eslint']);

		gulp.watch('src/content/images/*',['images']);

		gulpCallback();
	});
});

gulp.task('sass', function() {
		return gulp.src(['src/styles/main.scss'])
		.pipe($.cssGlobbing({
        	extensions: ['.scss']
      	}))
		.pipe($.sass({
			// includePaths: ['./src/content/data/']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({
				cascade: false
		 }))
		//.pipe($.minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('pages', function(){
		var opts = {
				conditionals: true,
				spare:true
		};
		gulp.src('src/pages/*.jade')
		.pipe($.jadeGlobbing())
		.pipe($.data(function(file) {
			var files = fs.readdirSync('./src/content/data/');
			var jadeData = {};
			var i = 0;
			while(file = files[i++]) {
				var fileName = file.split('.')[0];
				jadeData[fileName] = yaml.load('./src/content/data/' + file);
			}
			return jadeData;
		}))
		.pipe($.jade())
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
		return gulp.src(['src/js/plugin.js',
						 'src/js/main.js'])
		.pipe($.concat('minima-all.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.stream());
});

gulp.task('eslint', function() {
		return gulp.src('src/js/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failOnError());
});

gulp.task('images', function () {
    return gulp.src('src/content/images/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./build/minima-img/images/'));
});

gulp.task('default', ['images', 'sass', 'pages', 'scripts', 'watch']);
//gulp.task('deploy-prod', [])
