load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    const PROXY_URL = 'https://gemini-proxy-lxrpghuld-tomtees-projects.vercel.app/api/translate'; 

    try {
        let response = fetch(PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: key })
        });

        if (response.ok) {
            let translatedKey = response.json().translation;
            return searchOnSite(translatedKey, page);
        } else {
            return searchOnSite(key, page);
        }
    } catch (e) {
        return searchOnSite(key, page);
    }
}

// Hàm tìm kiếm trên uaa.com
function searchOnSite(key, page) {
    // FIX: Thay đổi cách xây dựng URL để giống với website gốc
    let url = BASE_URL + '/novel/list?searchType=2&keyword=' + encodeURIComponent(key) + '&sort=2&page=' + page + '&size=40';
    
    console.log("Search URL:", url); // Debug log
    
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
        
        console.log("Found", data.length, "results"); // Debug log
        
        let next = (parseInt(page) + 1).toString();
        return Response.success(data, next);
    }
    return null;
}
