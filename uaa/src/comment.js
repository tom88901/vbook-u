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

// Load base configuration to obtain BASE_URL and BASE_COOKIE.  Without
// loading config.js, BASE_URL is undefined in this script.
load('config.js');

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

    // Try to retrieve the novel ID from the comment list container.  The
    // comments are loaded dynamically via an endpoint such as
    // /comments?novelId=<id>&offset=0.  If we can find the data-id
    // attribute, we'll fetch the full list from that endpoint.
    let novelId = doc.select('#comment_list').attr('data-id') || doc.select('#content_list').attr('data-id');
    if (novelId) {
        // Build the comments API URL and fetch it.
        let apiUrl = BASE_URL + '/comments?novelId=' + novelId + '&offset=0';
        let resp = fetch(apiUrl);
        if (resp.ok) {
            let html = resp.html();
            // Parse the returned HTML/fragment for comment boxes
            html.select('.comment_box').forEach(box => {
                let avatar = box.select('.avatar').attr('src');
                let nickname = box.select('.nick_name').text();
                let score = '';
                let scoreSpan = box.select('.score_box span');
                if (!scoreSpan.isEmpty()) {
                    score = scoreSpan.first().text();
                }
                let time = box.select('.time').text();
                let likes = box.select('.awesome span').text();
                if (!likes) likes = '0';
                let content = box.select('.content').text();
                comments.push({
                    name: nickname,
                    cover: avatar,
                    description: content,
                    detail: `评分: ${score} · ${time} · 点赞: ${likes}`,
                    link: ''
                });
            });
        }
    }

    // Fallback: if no comments were retrieved via API, try to parse
    // whatever comments exist in the original HTML.  This covers cases
    // where the comments may already be present (e.g. when the page
    // embeds a few comments by default).
    if (comments.length === 0) {
        doc.select('#comment_list .comment_box').forEach(box => {
            let avatar = box.select('.avatar').attr('src');
            let nickname = box.select('.nick_name').text();
            let score = '';
            let scoreSpan = box.select('.score_box span');
            if (!scoreSpan.isEmpty()) {
                score = scoreSpan.first().text();
            }
            let time = box.select('.time').text();
            let likes = box.select('.awesome span').text();
            if (!likes) likes = '0';
            let content = box.select('.content').text();
            comments.push({
                name: nickname,
                cover: avatar,
                description: content,
                detail: `评分: ${score} · ${time} · 点赞: ${likes}`,
                link: ''
            });
        });
    }

    return Response.success(comments);
}