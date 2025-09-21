load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    // Tạo URL tìm kiếm mới
    let url = BASE_URL + '/novel/list?searchType=1&sort=2&page=' + page + '&keyword=' + key;
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        const data = [];

        // Thay đổi bộ chọn (selector) để lấy đúng thông tin
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