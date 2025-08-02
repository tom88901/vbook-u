load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    // Địa chỉ URL của máy chủ trung gian bạn sẽ tạo
    const PROXY_URL = 'https://gemini-proxy-lxrpghuld-tomtees-projects.vercel.app'; 

    // 1. Gửi từ khóa tiếng Việt đến proxy để dịch
    let-response = fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: key })
    });

    if (!response.ok) {
        // Nếu dịch lỗi, có thể thử tìm bằng tiếng Việt (khả năng cao là không ra kết quả)
        return searchOnSite(key, page);
    }

    let translatedKey = response.json().translation;

    // 2. Dùng từ khóa đã dịch để tìm kiếm trên trang web
    return searchOnSite(translatedKey, page);
}

// Hàm tìm kiếm trên uaa.com
function searchOnSite(key, page) {
    let url = BASE_URL + '/novel/list?searchType=1&sort=2&page=' + page + '&keyword=' + encodeURIComponent(key);
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select(".main_box .novel_list_box ul li").forEach(e => {
            data.push({
                name: e.select(".title").text(),
                link: e.select(".cover_box a").attr('href'),
                cover: e.select(".cover_box a img").attr('src'),
                description: e.select(".info_box a").first().text(),
                host: BASE_URL
            });
        });
        let next = (parseInt(page) + 1).toString();
        return Response.success(data, next);
    }
    return null;
}
