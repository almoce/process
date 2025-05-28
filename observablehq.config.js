import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItAbbr from 'markdown-it-abbr'
// See https://observablehq.com/framework/config for documentation.
// 
const isDevMode = process.env.npm_lifecycle_event === 'dev'


const sidebarTitle = `<span style="display: flex; align-items: center; font-weight: 500; gap: 0.5rem; margin-left: -0.5rem; color: var(--theme-foreground);">
    <svg width="31.8017578px" height="20.3251953px" viewBox="0 0 31.8017578 20.3251953" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="v_v-copy" fill="currentColor" fill-rule="nonzero">
                <polygon id="Path" points="3.69140625 0 7.3828125 8.01269531 11.0595703 0 14.765625 0 7.35351562 15.2490234 0 0"></polygon>
                <polygon id="Path" points="7.41210938 17.2490234 24.375 17.2490234 24.375 20.3251953 7.41210938 20.3251953"></polygon>
                <polygon id="Path" points="20.7275391 0 24.4189453 8.01269531 28.0957031 0 31.8017578 0 24.3896484 15.2490234 17.0361328 0"></polygon>
            </g>
        </g>
    </svg>
    Process
  </span>`


const footerElement = ({path}) => `<div style="text-align:right">Copyright © ${new Date().getFullYear()} <a href="https://wenceye.com" target="_blank" style="color: var(--theme-foreground-faint)">Wence Ye</a></div>`



const pages = [
  // isDevMode && {
  //     name: 'Folder',
  //     path: '/folder/',
  //     open: false,
  //     pages: [
  //       {
  //         name: 'test page', path: '/folder/test'
  //       }
  //     ] 
  // },
    // {
    //   name: 'Projects',
    //   pages: [
    //     {
    //       name: 'Fight for Kindness 2025', path: '/projects/fight-for-kindness-2025/index'
    //     }
    //   ]
    // },
    {
        name: "Learning",
        // open: false,
        pages: [
          {name: 'Intro SVG with d3', path: '/learning/intro-svg'}
        ]
    },
    // {
    //   name: 'Portugues Names', path: '/portugues-name/index'
    // },
    // {
    //     name: "Weather report", path: '/weather-report'
    // },
   
    // {
    //   name: "Examples",
    //   pages: [
    //     {name: "Markdown", path: '/examples/example-markdowm'},
    //     {name: "Dashboard", path: "/examples/example-dashboard"},
    //     {name: "Report", path: "/examples/example-report"}
    //   ]
    // },
    
    
  ]


export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: 'TIL - Process',
  home: sidebarTitle,
  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages,

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="favicon_b.png" type="image/png" sizes="32x32"><meta name="color-scheme" />',

  // The path to the source root.
  root: "src",
  style: 'style.css',
  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // theme: ["light", "dark"],
  // style: './src/style.csss',
  globalStylesheets: ['https://fonts.googleapis.com/css2?family=Ancizar+Sans:ital,wght@0,100..1000;1,100..1000'],
  // header: "this is header", // what to show in the header (HTML)
  // footer: "Built with Observable with ♥︎.", // what to show in the footer (HTML)
  footer: footerElement, // what to show in the footer (HTML)
  sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  markdownIt: (md) => md.use(MarkdownItFootnote).use(MarkdownItAbbr)
  // linkify: true, // convert URLs in Markdown to links
  // typographer: true, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
