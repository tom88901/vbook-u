// Modified detail.js to include tag extraction from the novel detail page.

function execute(url) {
    // Fetch the detail page at the provided URL
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Locate the main book container
        let book = doc.select(".main_box .content_box .left_box");

        // Aggregate additional details from the info box
        let detail = "";
        book.select(".info_box div").forEach(e => {
            detail += e.text() + "<br>";
        });

        // Extract tags from the tag box.  Each tag is contained in an
        // anchor element (<a>) inside the list.  Capture both the
        // visible text and the link.  The visible text will be shown
        // in the detail, while the link (e.g. "/novel/list?tag=群交")
        // will be used as input to tag.js for fetching novels by tag.
        let tags = [];
        let tagItems = [];
        doc.select("ul.tag_box li a").forEach(a => {
            let t = a.text();
            if (t) {
                t = t.trim();
                tags.push(t);
                // build clickable tag item with the href as input
                let href = a.attr('href');
                tagItems.push({
                    title: t,
                    input: href,
                    script: "tag.js"
                });
            }
        });

        // Append tags into the detail string so the app can display them as plain text.
        if (tags.length > 0) {
            detail += "标签：" + tags.join(" ") + "<br>";
        }

        // Build a suggestion entry to allow users to view the comment list.  The
        // suggestion contains a title shown on the UI, the input parameter
        // (here reuse the current URL so the comment script can fetch the
        // appropriate page), and the script name to execute.  When the user
        // taps this suggestion, vBookApp will run comment.js and display
        // the parsed comment list.
        // Provide a suggestion entry for the comments section.  The title is in
        // Chinese (评论) to match the interface language and improve detection
        // by vBookApp.  The input remains the current detail URL so that
        // comment.js can fetch the same page and extract comments.  Use the
        // script filename directly.
        let suggests = [
            {
                title: "评论",
                input: url,
                script: "comment.js"
            }
        ];

        return Response.success({
            name: book.select(".info_box h1").text(),
            cover: book.select(".cover").attr('src'),
            author: book.select(".info_box div").get(2).text().replace("作者：", ""),
            // Preserve the existing description extraction and remove line breaks
            description: book.select(".brief_box").text().replace(/\r?\n/g, "<br>").replace("开始阅读", ""),
            detail: detail,
            genres: tagItems,
            // Provide the suggestion list.  vBookApp will render the clickable
            // entry under the details section.
            suggests: suggests,
            host: "https://www.uaa.com"
        });
    }
    return null;
}