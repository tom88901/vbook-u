/*
 * comment.js
 *
 * This script extracts the list of comments from a novel detail page on uaa.com.
 * When executed, it downloads the given URL, locates the comment list container
 * (identified by #comment_list) and iterates through each comment box.  For
 * each comment, it collects the avatar URL, nickname, score (rating), the
 * relative time of the comment, the number of likes, and the comment text.
 *
 * The result is returned as an array of objects.  Each object has the keys:
 *  - avatar: URL of the commenter’s avatar image.
 *  - nickname: truncated nickname of the commenter.
 *  - score: string representing the rating (e.g. "10.00").
 *  - time: relative time string (e.g. "3天前").
 *  - likes: number of likes/upvotes as a string.
 *  - content: the text of the comment.
 *
 * vBookApp will render this array in a list view when the user selects the
 * “Bình luận” suggestion from the detail screen.
 */

function execute(url) {
    // Fetch the HTML page for the novel introduction.  The URL passed in
    // typically comes from the detail suggestion and points to the same
    // /novel/intro?id=... page that contains the comments.
    let response = fetch(url);
    if (!response.ok) {
        return null;
    }

    let doc = response.html();
    let comments = [];

    // Each comment is wrapped in a div with class "comment_box" inside
    // the comment list container.  Iterate over them and extract fields.
    doc.select("#comment_list .comment_box").forEach(box => {
        // Avatar image URL
        let avatar = box.select(".avatar").attr("src");

        // Nickname (may be truncated)
        let nickname = box.select(".nick_name").text();

        // Score / rating.  On uaa.com this appears as a numeric value
        // alongside a star icon (e.g. "10.00").  Grab the first span
        // inside .score_box to obtain it.
        let score = "";
        let scoreSpan = box.select(".score_box span");
        if (!scoreSpan.isEmpty()) {
            score = scoreSpan.first().text();
        }

        // Relative time, e.g. "3天前" (3 days ago)
        let time = box.select(".time").text();

        // Likes / upvote count.  The number sits in a span inside .awesome.
        let likes = box.select(".awesome span").text();
        if (!likes) {
            likes = "0";
        }

        // Comment text.  Use .text() to get plain text without HTML tags.
        let content = box.select(".content").text();

        // Construct an item in the format expected by vBookApp.  Each item
        // includes a name (nickname), cover (avatar), description (comment
        // content), and detail line summarising rating, time and likes.  This
        // mirrors the structure used in search/toc results, which the app
        // renders as a list of entries.
        // Compose a comment entry.  Besides the standard name, cover,
        // description and detail fields, vBookApp expects a link field.
        // Since comments are not linkable to a separate page, provide
        // an empty string for the link.  Including the link key
        // prevents the UI from discarding the object.
        comments.push({
            name: nickname,
            cover: avatar,
            description: content,
            detail: `评分: ${score} · ${time} · 点赞: ${likes}`,
            link: ""
        });
    });

    return Response.success(comments);
}