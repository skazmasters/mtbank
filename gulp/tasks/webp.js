module.exports = () => {
  $.gulp.task('webp', async function () {
    if (!$.config.buildWebp) return null;

    return $.gulp.src(`${$.config.sourcePath}/${$.config.assetsPath}/images/**/*`)
      .pipe($.webp())
      .pipe($.webp({quality: 100}))
      .pipe($.gulp.dest(`${$.config.destPath}/${$.config.assetsPath}/images`));
  });
};
