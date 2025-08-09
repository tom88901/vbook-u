function execute(url) {
  let response = fetch(url);
  if (!response.ok) return null;

  let doc = response.html();
  let book = doc.select(".main_box .content_box .left_box");

  // gom detail như cũ
  let detail = "";
  book.select(".info_box div").forEach(e => detail += e.text() + "<br>");

  // ✅ LẤY TAG TỪ <ul class="tag_box">...</ul>
  const tags = [];
  // mỗi tag nằm trong li > a
  doc.select("ul.tag_box li a").forEach(a => {
    const t = a.text().trim();
    if (t) tags.push(t);
  });

  return Response.success({
    name: book.select(".info_box h1").text(),
    cover: book.select(".cover").attr("src"),
    author: book.select(".info_box div").get(2).text().replace("作者：", ""),
    description: doc.select(".brief_box").text().replace(/\r?\n/g, "<br>").replace("开始阅读",""),
    detail: detail,
    tags: tags,                 // ← thêm field tags
    host: "https://www.uaa.com"
  });
}
