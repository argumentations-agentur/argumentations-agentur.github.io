const htmlmin = require("html-minifier");
const markdownIt = require('markdown-it');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");

const mdi = require("markdown-it");
const argdownConfig = {logLevel: "verbose"};
const createArgdownPlugin = require("@argdown/markdown-it-plugin").default;
const markdownItArgdown = createArgdownPlugin(argdownConfig);
const mdiInstance = mdi({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}).use(markdownItArgdown);



module.exports = function (eleventyConfig) {
  // PLUGINS
  eleventyConfig.addPlugin(pluginRss);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });
  // shortcode to render markdown from string => {{ STRING | markdown | safe }}
  eleventyConfig.addFilter('markdown', function(value) {
    let markdown = require('markdown-it')({
      html: true
    });
    return markdown.render(value);
  });

  // rebuild on CSS changes
  eleventyConfig.addWatchTarget('./src/_includes/css/');

  // Copy .nojekyll to route of /_site (since we are publishing from branch that is pushed via npm gh-pages thing (see deploy-script in package.json))
  eleventyConfig.addPassthroughCopy("./src/.nojekyll");


  // Markdown
  eleventyConfig.setLibrary( 'md', mdiInstance )
  /*eleventyConfig.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    })
  )*/


  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  //create collections
  eleventyConfig.addCollection('sections', async (collection) => {
    return collection.getFilteredByGlob('./src/sections/*.md');
  });

  // STATIC FILES
  eleventyConfig.addPassthroughCopy({ './src/static/': '/' });
  // all figures/pictures
  eleventyConfig.addPassthroughCopy("./src/posts/**/*.jpg");

  // TRANSFORM -- Minify HTML Output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });


  return {
    dir: {
      input: 'src',
      output: '_site',
      data: './_data',
      includes: './_includes',
      layouts: './_layouts'
    },
    templateFormats: [
      'md',
      'njk',
      '11ty.js'
    ],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    pathPrefix: "/website-test/"
  };
};