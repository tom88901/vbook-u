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

        // Extract tags from the tag box.  The tags on uaa.com appear
        // inside an unordered list with class `tag_box`.  Each tag is
        // either inside an <a> element within an <li>, or directly as
        // the text of the <li> itself.  We gather all non‑empty tag
        // labels into an array.
        let tags = [];
        doc.select("ul.tag_box li").forEach(li => {
            let t = "";
            let aTag = li.select("a");
            if (!aTag.isEmpty()) {
                t = aTag.first().text();
            } else {
                t = li.text();
            }
            if (t) {
                tags.push(t.trim());
            }
        });

        // Append tags into the detail string so the app can display them as plain text.
        if (tags.length > 0) {
            detail += "标签：" + tags.join(" ") + "<br>";
        }

        // Prepare an array of genre objects so that tags can be clickable in the UI.
        // Each object contains a title (label), an input (used as query parameter),
        // and the script to handle the tag – reuse cate.js which lists novels by tag.
        let tagItems = [];
        tags.forEach(t => {
            tagItems.push({
                title: t,
                input: t,
                script: "cate.js"
            });
        });

        // Build a suggestion entry to allow users to view the comment list.  The
        // suggestion contains a title shown on the UI, the input parameter
        // (here reuse the current URL so the comment script can fetch the
        // appropriate page), and the script name to execute.  When the user
        // taps this suggestion, vBookApp will run comment.js and display
        // the parsed comment list.
        let suggests = [
            {
                title: "Bình luận",
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