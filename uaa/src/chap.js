load("config.js");
function execute(url) {

let body={
  method: "POST", // GET, POST, PUT, DELETE, PATCH
  headers: {
    "User-Agent": UserAgent.android()
  }
    }
if(BASE_COOKIE!=""){
    body={
  method: "POST", // GET, POST, PUT, DELETE, PATCH
  headers: {
    "cookie": BASE_COOKIE,
    "User-Agent": UserAgent.android()
  }
}
}
    let response = fetch(url,body);

    if (response.ok) {
        let doc = response.html(); // Xử lý trang HTML
        let content = "";
console.log(doc)
        // Lấy các phần tử có class 'line' và nối thành nội dung
        doc.select(".line").forEach(e => {
            // Join each line with HTML line breaks so that the reading view
            // preserves paragraph separation instead of concatenating all
            // sentences with spaces.  Using <br> twice provides a blank
            // line between paragraphs, similar to the original layout.
            content += e.text() + "<br><br>";
        });

        return Response.success(content);
    }
    return null;
}