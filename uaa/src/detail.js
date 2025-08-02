function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Vùng chứa chung
        let book = doc.select(".main_box .content_box .left_box");

        // Lấy phần "Thông tin" chi tiết
        let detail = "";
        book.select(".info_box div").forEach(e => {
            detail += e.text() + "<br>";
        });
        
        // Lấy riêng phần "Giới thiệu" và làm sạch nó
        let descriptionElement = book.select(".brief_box").clone();
        descriptionElement.select("a").remove(); // Xóa thẻ a chứa chữ "开始阅读"

        return Response.success({
            name: book.select(".info_box h1").text(),
            cover: book.select(".cover").attr('src'),
            author: book.select(".info_box div a").first().text(),
            description: descriptionElement.text().replace(/\r?\n/g,"<br>"),
            detail: detail,
            host: "https://www.uaa.com"
        });
    }
    return null;
}
