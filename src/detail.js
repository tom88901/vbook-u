function execute(url) {
    let response = fetch(url)
    if (response.ok) {
        let doc = response.html();
        let book = doc.select(".main_box .content_box .left_box")
        let detail="";
        book.select(".info_box div").forEach( e=>{
                detail+=e.text()+"<br>"
        })
        
        // Lấy thẻ div chứa giới thiệu và loại bỏ nút "Bắt đầu đọc"
        let descriptionElement = book.select(".brief_box").clone();
        descriptionElement.select("a").remove(); // Loại bỏ thẻ a

        return Response.success({
            name: book.select(".info_box h1").text(),
            cover: book.select(".cover").attr('src'),
            author: book.select(".info_box div").get(2).text().replace("作者：", ""),
            description: descriptionElement.text().replace(/\r?\n/g,"<br>"), // Đổi từ ".brief" thành ".brief_box" và dùng element đã làm sạch
            detail: detail,
            host: "https://www.uaa.com"
        });
    }
    return null;
}
