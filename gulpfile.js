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
		gulp.watch('src/content/data/*.yml', browserSync.reload);
		gulp.watch('src/content/images/*.yml', browserSync.reload);
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
		includePaths: ['./src/content/data/']
	}).on('error', $.sass.logError))
	.pipe($.autoprefixer({
			cascade: false
	 }))
	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('css-min', function() {
	return gulp.src(['build/main.css'])
	.pipe($.minifyCss({compatibility: 'ie8'}))
	.pipe(gulp.dest('./prod/'));
});

gulp.task('pages', function(){
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

gulp.task('pages-min', function(){
	gulp.src('build/*.html')
	.pipe($.minifyHtml({
		conditionals: true,
		spare:true
	}))
	.pipe(gulp.dest('./prod/'));
});

gulp.task('scripts', function() {
	return gulp.src(['src/js/plugin.js',
					 'src/js/main.js'])
	.pipe($.concat('minima-all.js'))
	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream());
});

gulp.task('scripts-min', function() {
	return gulp.src(['build/minima-all.js'])
	.pipe($.uglify())
	.pipe(gulp.dest('./prod/'));
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
	.pipe(gulp.dest('./build/minima-img/images/'))
	.pipe(gulp.dest('./prod/minima-img/images/'));
});

gulp.task('deploy', ['css-min', 'pages-min', 'scripts-min']);
gulp.task('default', ['images', 'sass', 'pages', 'scripts', 'deploy', 'watch']);
