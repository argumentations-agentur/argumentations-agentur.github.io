// .eleventy.js (ESM)
import htmlmin from 'html-minifier-terser';
import markdownIt from 'markdown-it';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import { DateTime } from "luxon";
import createArgdownPlugin from "@argdown/markdown-it-plugin";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Markdown-Plugins (CommonJS über createRequire)
//const markdownItFootnote = require("markdown-it-footnote");
//const markdownItContainer = require("markdown-it-container");
//const markdownItTaskLists = require("markdown-it-task-lists");
//const markdownItEmoji = require("markdown-it-emoji");

// Argdown-Plugin
const argdownConfig = { logLevel: "verbose" };
const markdownItArgdown = await createArgdownPlugin(argdownConfig);

// Markdown-It-Instanz mit allen Plugins
const mdiInstance = markdownIt
  ({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
    })
.use(markdownItArgdown);
  //.use(markdownItFootnote)       // Plugin direkt verwenden
  //.use(markdownItTaskLists)      // Plugin direkt verwenden
  //.use(markdownItEmoji)          // Plugin direkt verwenden
  //.use(markdownItContainer, "info", {
   // render: (tokens, idx) => `<div class="callout info">${tokens[idx].content}</div>`
  //})
  //.use(markdownItContainer, "warning", {
    //render: (tokens, idx) => `<div class="callout warning">${tokens[idx].content}</div>`
  //});

// Umweltvariablen für Eleventy 3.x
const isPages = process.env.ELEVENTY_ENV === 'pages';
const isProdDeployment = Boolean(
  process.env.ELEVENTY_RUN_MODE &&
  process.env.ELEVENTY_RUN_MODE === 'build'
);
const outDir = isPages ? 'docs' : '_site';

// EINZIGER export default
export default async function(eleventyConfig) {
  // PLUGINS
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Markdown-Library
  eleventyConfig.setLibrary("md", mdiInstance);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  // Filter to render markdown from string
  eleventyConfig.addFilter('markdown', function(value) {
    return mdiInstance.render(value);
  });

  // Rebuild on CSS changes
  eleventyConfig.addWatchTarget('./src/_includes/css/');

  // Copy .nojekyll and CNAME (für gh-pages)
  eleventyConfig.addPassthroughCopy("./src/.nojekyll");
  eleventyConfig.addPassthroughCopy("./src/CNAME");

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Collections
  eleventyConfig.addCollection('sections', async (collection) => {
    return collection.getFilteredByGlob('./src/sections/*.md');
  });

  // Static files
  eleventyConfig.addPassthroughCopy({ './src/static/': '/' });
  eleventyConfig.addPassthroughCopy("./src/posts/**/*.jpg");

      // Ignore directories like node_modules, dist, etc.
    //eleventyConfig.addWatchTarget("src/");

  // TRANSFORM -- Minify HTML Output (nur im Build-Modus)
  if (isProdDeployment) {
    eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
      if (outputPath && outputPath.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });
        return minified;
      }
      return content;
    });
  }

  return {
    dir: {
      input: 'src',
      output: '_site',
      data: './_data',
      includes: './_includes',
      layouts: './_layouts'
    },
    templateFormats: ['md', 'njk', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    pathPrefix: isPages ? "/" : "/"
  };
}