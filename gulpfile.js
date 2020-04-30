var gulp = require("gulp");
var gzip = require("gulp-gzip");

gulp.task("compress", function () {
  return gulp.src(["./dist/stif-cool-front/*.*"]).pipe(gzip()).pipe(gulp.dest("./dist/stif-cool-front"));
});
