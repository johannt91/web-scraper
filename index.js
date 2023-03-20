import request from "request";
import { load } from "cheerio";

const categoryList = new Set;

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

        // console.log(postTitle, postDate);
      if (year !== 0) {
        getData(nextPage, year - 1);
      }
    }
    console.log(categoryList)
  });
}
getData(
  "https://www.allaboutestates.ca/fiduciary-investing-series-powers-attorney-investment-portfolios/",
  1
);
