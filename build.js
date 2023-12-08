const fs = require("fs");
const md = require("markdown-it")({
  html: true,
  typographer: true,
}).use(require("markdown-it-anchor"), {});
const puppeteer = require("puppeteer");

const readme = fs.readFileSync("./readme.md", "utf-8");
let lines = readme.split(/(\r|\n)/);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  let page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 900,
  });

  let output = [
    `
    <html>
        <head>
            <title>Awesome Illustrations</title>
            <meta name="description" content="A curated list of awesome illustrations & tools ✨.">

            <!-- Google / Search Engine Tags -->
            <meta itemprop="name" content="MrPeker/awesome-illustrations">
            <meta itemprop="description" content="A curated list of awesome illustrations & tools ✨.">
            <meta itemprop="image" content="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a">

            <!-- Facebook Meta Tags -->
            <meta property="og:url" content="https://awesome-illustrations.now.sh">
            <meta property="og:type" content="website">
            <meta property="og:title" content="MrPeker/awesome-illustrations">
            <meta property="og:description" content="A curated list of awesome illustrations & tools ✨.">
            <meta property="og:image" content="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a">

            <!-- Twitter Meta Tags -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="MrPeker/awesome-illustrations">
            <meta name="twitter:description" content="A curated list of awesome illustrations & tools ✨.">
            <meta name="twitter:image" content="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a">
            
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
            <style>
                .btn-github{color:#fff;background-color:#444;border-color:rgba(0,0,0,0.2)}.btn-github:focus,.btn-github.focus{color:#fff;background-color:#2b2b2b;border-color:rgba(0,0,0,0.2)}
                .btn-github:hover{color:#fff;background-color:#2b2b2b;border-color:rgba(0,0,0,0.2)}
                .btn-github:active,.btn-github.active,.open>.dropdown-toggle.btn-github{color:#fff;background-color:#2b2b2b;border-color:rgba(0,0,0,0.2)}.btn-github:active:hover,.btn-github.active:hover,.open>.dropdown-toggle.btn-github:hover,.btn-github:active:focus,.btn-github.active:focus,.open>.dropdown-toggle.btn-github:focus,.btn-github:active.focus,.btn-github.active.focus,.open>.dropdown-toggle.btn-github.focus{color:#fff;background-color:#191919;border-color:rgba(0,0,0,0.2)}
                .btn-github:active,.btn-github.active,.open>.dropdown-toggle.btn-github{background-image:none}
                .btn-github.disabled:hover,.btn-github[disabled]:hover,fieldset[disabled] .btn-github:hover,.btn-github.disabled:focus,.btn-github[disabled]:focus,fieldset[disabled] .btn-github:focus,.btn-github.disabled.focus,.btn-github[disabled].focus,fieldset[disabled] .btn-github.focus{background-color:#444;border-color:rgba(0,0,0,0.2)}
                .btn-github .badge{color:#444;background-color:#fff}
                img.screenshot {width: 100%}
                
                .thisone {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  grid-gap: 20px;
              }
      
              @media (max-width: 1024px) {
                  .thisone {
                      grid-template-columns: repeat(3, 1fr);
                  }
              }
      
              @media (max-width: 768px) {
                  .thisone {
                      grid-template-columns: repeat(1, 1fr);
                  }
              }
            </style>
        </head>
        <body>
        <div class="container">
        <img class="w-100 mb-3" src="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a" alt="Awesome Illustrations Cover"/>
        <div class="d-flex">
            <a href="https://github.com/MrPeker/awesome-illustrations" class="btn btn-block btn-social btn-github mb-3">
                <span class="fab fa-github mr-1"></span> Visit MrPeker/awesome-illustrations on GitHub
            </a>
            <div style="width: 10px"></div>
            <a class="github-button" href="https://github.com/MrPeker/awesome-illustrations" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-size="large" data-show-count="true" aria-label="Star MrPeker/awesome-illustrations on GitHub">Star</a>
        </div>
        <div class="thisone>
      `,
  ];

  function processLine(line, index) {
    setTimeout(() => {
      if (index === lines.length - 1) {
        browser.close();
        output.push(`</div></div>
        <script async defer src="https://buttons.github.io/buttons.js"></script></body></html>`);
        output = output.join("");
        console.log("Finished");
        fs.writeFileSync("index.html", output);
      }
    }, 500);
    return new Promise(async (resolve, reject) => {
      if (line.split(" - ").length > 1) {
        console.log({ line });

        let url = line.match(/\[.*?\]\((.*?)\)/)[1];
        let imagePath = `imgs/${Date.now()}${Math.floor(
          Math.random() * 9999
        )}.jpg`;

        try {
          await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 0,
          });
        } catch (error) {
          console.error(`Failed to navigate to ${url}: ${error.message}`);
          // Handle the error (e.g., skip this URL and continue with the next one)
        }
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 500);
        });
        await page.screenshot({
          type: "jpeg",
          quality: 100,
          path: imagePath,
        });

        let text = md.render(line);
        let image = `<div class="mb-5"><a href="${url}"><img class="screenshot" src="/${imagePath}" alt="A screenshot of ${url}"></a></div>`;

        switch (line) {
          case "- [Story Set](https://storyset.com/) - Edit and animate customizable illustrations to enhance your projects totally free.":
            output.push(`<div><h3>${text}</h3><br/>${image}</div></div>`);
            break;
          case "- [404 Illustrations](https://error404.fun) - Royalty free catchy illustrations for perfect 404 pages":
            output.push(
              `<div class="thisone"><div><h3>${text}</h3><br/>${image}</div>`
            );
            break;
          case "- [Absurd Design](https://absurd.design) - Surrealist illustrations for your next amazing thing":
            output.push(
              `<div class="thisone"><div><h3>${text}</h3><br/>${image}</div>`
            );
            break;
          case "- [Ouch! Illustrations](https://icons8.com/ouch) - Stylish illustrations for better UX":
            output.push(`<div><h3>${text}</h3><br/>${image}</div></div>`);
            break;
          case "- [Dropshipping Illustrations](https://outlane.co/graphics/dropshipping-illustrations) - Animated vector illustrations for e-commerce projects":
            output.push(
              `<div class="thisone"><div><h3>${text}</h3><br/>${image}</div>`
            );
            break;
          case "- [Storytale](https://storytale.io/) - Hundreds of illustrations for web and app projects":
            output.push(`<div><h3>${text}</h3><br/>${image}</div></div>`);
            break;

          case "- [Evie by unDraw](https://evie.undraw.co/) - MIT licensed template bundled with a minimal style guide to build websites faster.":
            output.push(
              `<div class="thisone"><div><h3>${text}</h3><br/>${image}</div>`
            );
            break;
          case "- [Neural Network-Generated Illustrations](https://ai.googleblog.com/2017/05/neural-network-generated-illustrations.html) - AI generated illustrations for Allo from Google":
            output.push(`<div><h3>${text}</h3><br/>${image}</div></div>`);
            break;
          default:
            output.push(`<div><h3>${text}</h3><br/>${image}</div>`);
            break;
        }
        resolve(true);
      } else {
        output.push(md.render(line));
        resolve(true);
      }
    });
  }

  lines.reduce((previousPromise, nextLine, index) => {
    return previousPromise.then(() => {
      return processLine(nextLine, index);
    });
  }, Promise.resolve());
})();
