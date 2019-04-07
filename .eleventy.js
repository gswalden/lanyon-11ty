const { readFileSync } = require('fs');
const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');

function format(date, str) {
  return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(str);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('dateToString', (date) => {
    return format(date, 'dd LLL yyyy'); // 09 Oct 1986
  });
  eleventyConfig.addFilter('htmlDateString', (date) => {
    return format(date, 'yyyy-LL-dd'); // 1986-10-09
  });
  eleventyConfig.addFilter('dateToFolders', (date) => {
    return format(date, 'yyyy/LL/dd'); // 1986/10/09
  });
  eleventyConfig.addFilter('latest', (posts, num = 3, skip = '') => {
    const latest = [];
    for (const post of posts) {
      if (post.url != skip) {
        const len = latest.unshift(post);
        if (len === num) break;
      }
    }
    return latest;
  });

  for (const f of ['css', 'public']) {
    eleventyConfig.addPassthroughCopy(f);
  }

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = readFileSync('_site/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });
};
