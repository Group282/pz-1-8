const gulp = require('gulp')
const del = require('del')
const terser = require('gulp-terser-js')
const cleanCSS = require('gulp-clean-css')
const concatCss = require('gulp-concat-css');
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));

const src = {
  scss: 'app/scss/**/*.scss',
  js: 'app/js/**/*.jm?s',
  fonts: 'app/fonts/**/*',
  img: 'app/img/**/*',
  libs: 'app/libs/**/*',
  css: 'app/css/**/*.css',
  html: 'app/*.html',
}
const dest = {
  js: 'build-app/js',
  fonts: 'build-app/fonts',
  img: 'build-app/img',
  libs: 'build-app/libs',
  scss: 'app/css',
  css: 'build-app/css/',
  html: 'build-app',
}

function watch() {
  browserSync.init({
    server: ['./app', './build-app'],
  })

  gulp.watch(src.scss, scss)
  gulp.watch(src.css, css)
  gulp.watch(src.fonts, fonts)
  gulp.watch(src.img, img)
  gulp.watch(src.js, js)
  gulp.watch(src.libs, libs)
  gulp.watch(src.html, html)
}
function html() {
  return gulp
    .src(src.html)
    .pipe(gulp.dest(dest.html))
    .pipe(reload({ stream: true }))
}
function scss() {
  return gulp
    .src(src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest.scss))
    .pipe(reload({ stream: true }))
}
function css() {
  return gulp
    .src(src.css)
    .pipe(autoprefixer(['last 15 versions', '>.1%']))
    .pipe(concatCss("/bundle.css"))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest(dest.css))
    .pipe(reload({ stream: true }))
}
function fonts() {
  return gulp
    .src(src.fonts)
    .pipe(gulp.dest(dest.fonts))
    .pipe(reload({ stream: true }))
}
function img() {
  return gulp
    .src(src.img)
    .pipe(gulp.dest(dest.img))
    .pipe(reload({ stream: true }))
}
function js() {
  return gulp
    .src(src.js)
    .pipe(babel())
    .pipe(
      terser({
        mangle: {
          toplevel: true,
        },
        safari10: true,
      }),
    )
    .pipe(gulp.dest(dest.js))
    .pipe(reload({ stream: true }))
}
function libs() {
  return gulp
    .src(src.libs)
    .pipe(gulp.dest(dest.libs))
    .pipe(reload({ stream: true }))
}
function clean() {
  return del([`build-app`])
}

const build = gulp.series(
    gulp.parallel(clean, scss), 
    gulp.parallel(css, js, libs, img, fonts, html ))

gulp.task('serve', gulp.series(build, watch));
gulp.task('build', build);
