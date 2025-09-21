#!/bin/bash
# This script fetches required files from the GitHub repository tom88901/vbook-u
# using the GitHub connector API and writes them to the current directory.

set -e

# Base API endpoint
API_BASE="http://localhost:8674/call_api?name=/connector_76869538009648d5b282a4bb21c3d157/fetch&params="

# List of source files to fetch from GitHub
FILES=(
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/config.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/home.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/search.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/toc.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/genre.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/chap.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/cate.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/gener.js"
  "https://github.com/tom88901/vbook-u/blob/main/uaa/src/updates.js"
)

# Directory to save the fetched files
DEST_DIR="$(dirname "$0")"

for url in "${FILES[@]}"; do
  # extract filename from URL
  filename=$(basename "$url")
  # encode the URL for the API
  encoded_url=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$url")
  # construct API call
  api_call="${API_BASE}{\"url\":\"$url\"}"
  echo "Fetching $url..."
  # use curl to call the API and save the result
  content=$(curl -s "$api_call")
  # Extract the code lines from the HTML response.  The API returns a page with
  # code lines in <pre> tags.  Remove HTML tags to get the raw code.
  # Use sed to strip HTML tags.
  raw=$(echo "$content" | sed -n 's/<[^>]*>//g;/^function/,$p')
  # If no function found, just drop other lines after the first <pre>
  if [ -z "$raw" ]; then
    raw=$(echo "$content" | sed -e 's/<[^>]*>//g')
  fi
  echo "$raw" > "$DEST_DIR/$filename"
done