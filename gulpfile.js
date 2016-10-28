var gulp = require("gulp");
var runSequence = require("run-sequence");
var builder = require("tsconfig-extended-typescript-builder");

var tsConfigPath = __dirname + "/src/browsers-binaries-standalone/tsconfig.json";

gulp.task("build", () => {
    return builder.build(tsConfigPath);
});

gulp.task("clean", () => {
    return builder.clean(tsConfigPath);
});

gulp.task("clean-build", () => {
    return runSequence("clean", "build");
});

gulp.task("test", () => {
    return require("./test");
});

gulp.task("build-test", () => {
    return runSequence("build", "test")
});