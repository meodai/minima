'use strict';
var gulp					= require('gulp');
var sass					= require('gulp-sass');
var jade					= require('gulp-jade');
var jadeGlobbing			= require('gulp-jade-globbing');
var uglify					= require('gulp-uglify');
var minifyCss				= require('gulp-minify-css');
var minifyHTML				= require('gulp-minify-html');
var autoprefixer			= require('gulp-autoprefixer');
var eslint					= require('gulp-eslint');
var concat					= require('gulp-concat');
var browserSync				= require('browser-sync').create();
var data 					= require('gulp-data');
var yaml 					= require('yamljs');
var fs 						= require('fs');

gulp.task('watch', function(gulpCallback) {
	browserSync.init({
		server: './build/',
		open: true
	}, function callback() {
		gulp.watch('build/*.html', browserSync.reload);
		gulp.watch('build/*.css', browserSync.reload);
		gulp.watch('build/*.js', browserSync.reload);
		gulp.watch('src/modules/**/*.jade', browserSync.reload);
		gulp.watch('src/content/*.yml', browserSync.reload);

		gulp.watch('src/modules/**/*.scss', ['sass']);
		gulp.watch('src/reset/*.scss', ['sass']);

		gulp.watch('src/modules/**/*.jade', ['pages']);
		gulp.watch('src/pages/*.jade', ['pages']);

		gulp.watch('src/js/*.js',['scripts']);
		gulp.watch('src/js/*.js',['eslint']);

		gulpCallback();
	});
});

gulp.task('sass', function() {
		return gulp.src(['src/reset/reset.scss',
						 'src/reset/variables.scss',
						 'src/reset/mixins.scss',
						 'src/reset/grid.scss',
						 'src/reset/general.scss',
						 'src/modules/**/*.scss'])
		.pipe(concat('minima-all.scss'))
		.pipe(sass())
		.pipe(autoprefixer({
				cascade: false
		 }))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('build/'))
		.pipe(browserSync.stream());
});

gulp.task('pages', function(){
		var opts = {
				conditionals: true,
				spare:true
		};
		gulp.src('src/pages/*.jade')
		.pipe(jadeGlobbing())
		.pipe(data(function(file) {
			var files = fs.readdirSync('./src/content/');
			var jadeData = {};
			var i = 0;
			while(file = files[i++]) {
				var fileName = file.split('.')[0];
				jadeData[fileName] = yaml.load('./src/content/' + file);
			}
			return jadeData;
		}))
		.pipe(jade())
		.pipe(minifyHTML(opts))
		.pipe(gulp.dest('build/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
		return gulp.src(['src/js/plugin.js',
						 'src/js/main.js'])
		.pipe(concat('minima-all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/'))
		.pipe(browserSync.stream());
});

gulp.task('eslint', function() {
		return gulp.src('src/js/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('default', ['watch']);
