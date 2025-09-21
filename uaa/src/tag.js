load('config.js');

/*
 * Tag listing script.  This script accepts a relative URL (e.g. "/novel/list?tag=群交")
 * from the novel detail page and fetches the corresponding list of novels.
 * It then parses the list entries and returns them in the same format as
 * other list scripts (updates.js, cate.js).  The `page` parameter is
 * appended to the URL intelligently depending on whether a query string
 * already exists.
 */
function execute(input, page) {
    if (!page) page = '1';
    // Construct full URL.  If the path already has a query string, append
    // page parameter with an ampersand; otherwise start a query string.
    let url = BASE_URL + input;
    if (url.indexOf('?') !== -1) {
        url += '&page=' + page;
    } else {
        url += '?page=' + page;
    }
    let response = fetch(url);
    if (response.ok) {
        let doc= response.html();
        const data = [];
        doc.select('.main_box .novel_list_box ul li').forEach(e => {
            data.push({
                name: e.select('.title').text(),
                link: e.select('.cover_box a').attr('href'),
                cover: e.select('.cover_box a img').attr('src'),
                description: e.select('.info_box a').first().text(),
                host: BASE_URL
            });
        });
        let next = (parseInt(page) + 1).toString();
        return Response.success(data, next);
    }
    return null;
}