import request from "request";
import fs from "fs";
import { load } from "cheerio";

const categoryList = new Set();

function getData(p, year) {
  let page = p;

  request(page, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = load(html);

      const postTitle = $(".post-title").find("a").text();
      const postDate = $(".post-meta").find(".date").text();
      const nextPage = $(".btn-default").attr("href");
      $(".category-list a").each((i, el) => {
        categoryList.add($(el).text().trim());
      });

      const paragraph = $(".post-content");
      const textContent = paragraph
        .contents()
        .map((i, el) => {
          const item = $(el);
          if (item.is("p, ul")) {
            return item.text() + "\n\n";
          }
        })
        .get()
        .join("")
        .trim();

      createDcoument(postTitle, textContent);
      // console.log(textContent);

      // console.log(postTitle, postDate);
      // console.log(categoryList);
      if (year !== postDate) {
        getData(nextPage, year);
      }
      return;
    }
  });
}
getData(
  "https://www.allaboutestates.ca/fiduciary-investing-series-powers-attorney-investment-portfolios/",
  "January 2, 2020"
);

const createDcoument = (title, data) => {
  // create file using path
  let path = ""; // add file path
  fs.writeFile(`${path}/${title}.txt`, data, function (err) {
    if (err) {
      throw err;
    }
    console.log("File created successfully!");
  });
};
