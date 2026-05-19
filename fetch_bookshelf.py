#!/usr/bin/env python3
"""Fetch WeChat Reading (微信读书) bookshelf and save as JSON."""

import json
import os
import sys
import time
import urllib.request
import urllib.error


SHELF_URL = "https://i.weread.qq.com/shelf/sync"
BOOKS_URL = "https://i.weread.qq.com/user/notebooks"


def get_headers(cookie: str) -> dict:
    return {
        "Cookie": cookie,
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Referer": "https://weread.qq.com/",
        "Accept": "application/json, text/plain, */*",
    }


def fetch(url: str, headers: dict) -> dict:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {body[:300]}") from e


def fetch_bookshelf(cookie: str) -> dict:
    headers = get_headers(cookie)

    print("正在获取书架数据…")
    shelf = fetch(SHELF_URL, headers)
    time.sleep(0.5)

    books = shelf.get("books", [])
    archives = shelf.get("archive", [])

    result = {
        "synckey": shelf.get("synckey"),
        "books": books,
        "archive": archives,
        "total": len(books),
    }
    return result


def main():
    cookie = os.environ.get("WEREAD_COOKIE", "").strip()
    if not cookie:
        print("错误：请设置环境变量 WEREAD_COOKIE", file=sys.stderr)
        print("", file=sys.stderr)
        print("获取方法：", file=sys.stderr)
        print("  1. 浏览器打开 https://weread.qq.com 并登录", file=sys.stderr)
        print("  2. 按 F12 打开开发者工具 → Network", file=sys.stderr)
        print("  3. 刷新页面，找到任意 weread.qq.com 请求", file=sys.stderr)
        print("  4. 复制请求头中的 Cookie 值", file=sys.stderr)
        print("  5. export WEREAD_COOKIE='<粘贴的值>'", file=sys.stderr)
        sys.exit(1)

    data = fetch_bookshelf(cookie)

    output_file = "bookshelf.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"书架共 {data['total']} 本书，已保存到 {output_file}")

    # Print book list
    for i, book_entry in enumerate(data["books"], 1):
        book = book_entry.get("book", book_entry)
        title = book.get("title", "未知标题")
        author = book.get("author", "未知作者")
        print(f"  {i:3d}. {title} — {author}")


if __name__ == "__main__":
    main()
