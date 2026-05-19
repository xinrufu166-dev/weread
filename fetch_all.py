#!/usr/bin/env python3
"""Fetch all WeChat Reading (微信读书) data and save to weread_data.json."""

import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error


BASE = "https://i.weread.qq.com"

ENDPOINTS = {
    "shelf":        "/shelf/sync",
    "readinfo":     "/readdata/summary?synckey=0",
    "notebooks":    "/user/notebooks",
    "bookmarks":    None,   # per-book, fetched separately
    "reviews":      None,   # per-book, fetched separately
    "readdetail":   None,   # per-book, fetched separately
}


def headers(cookie: str) -> dict:
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


def get(url: str, cookie: str, params: dict = None) -> dict:
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=headers(cookie))
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"  HTTP {e.code} for {url}: {body[:200]}", file=sys.stderr)
        return {}


def fetch_book_detail(book_id: str, cookie: str) -> dict:
    """Fetch bookmarks, reviews, and reading detail for one book."""
    detail = {}

    bm = get(f"{BASE}/book/bookmarklist", cookie, {"bookId": book_id})
    if bm:
        detail["bookmarks"] = bm.get("updated", [])

    time.sleep(0.3)

    rv = get(f"{BASE}/review/list", cookie, {"bookId": book_id, "listType": 4, "mine": 1, "synckey": 0})
    if rv:
        detail["reviews"] = rv.get("reviews", [])

    time.sleep(0.3)

    rd = get(f"{BASE}/readdata/detail", cookie, {"bookId": book_id})
    if rd:
        detail["readdetail"] = rd

    return detail


def main():
    cookie = os.environ.get("WEREAD_COOKIE", "").strip()
    if not cookie:
        print("错误：请先设置 WEREAD_COOKIE 环境变量", file=sys.stderr)
        print("export WEREAD_COOKIE='你的cookie值'", file=sys.stderr)
        sys.exit(1)

    result = {}

    # 1. 书架
    print("📚 获取书架…")
    shelf = get(f"{BASE}/shelf/sync", cookie)
    result["shelf"] = shelf
    books = shelf.get("books", [])
    archives = shelf.get("archive", [])
    print(f"   → {len(books)} 本书，{len(archives)} 个书单/分组")
    time.sleep(0.5)

    # 2. 阅读汇总统计
    print("📊 获取阅读汇总统计…")
    summary = get(f"{BASE}/readdata/summary", cookie, {"synckey": 0})
    result["read_summary"] = summary
    time.sleep(0.5)

    # 3. 笔记本列表（含笔记内容）
    print("📝 获取笔记本…")
    notebooks = get(f"{BASE}/user/notebooks", cookie)
    result["notebooks"] = notebooks
    time.sleep(0.5)

    # 4. 每本书的详细数据（划线、书评、阅读进度）
    book_ids = []
    for b in books:
        bid = b.get("book", {}).get("bookId") or b.get("bookId")
        if bid:
            book_ids.append((bid, b.get("book", {}).get("title", bid)))

    print(f"🔖 获取 {len(book_ids)} 本书的划线/笔记/进度…")
    book_details = {}
    for i, (bid, title) in enumerate(book_ids):
        print(f"   [{i+1}/{len(book_ids)}] {title[:20]}")
        book_details[bid] = fetch_book_detail(bid, cookie)
        time.sleep(0.4)

    result["book_details"] = book_details

    # 5. 最近阅读历史
    print("🕐 获取最近阅读…")
    recent = get(f"{BASE}/shelf/friendread", cookie)
    result["recent_read"] = recent
    time.sleep(0.3)

    # 6. 用户信息
    print("👤 获取用户信息…")
    userinfo = get(f"{BASE}/user/info", cookie)
    result["user_info"] = userinfo

    # 输出
    output = "weread_data.json"
    with open(output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    total_bookmarks = sum(
        len(v.get("bookmarks", [])) for v in book_details.values()
    )
    total_reviews = sum(
        len(v.get("reviews", [])) for v in book_details.values()
    )

    print(f"\n✅ 数据已保存到 {output}")
    print(f"   书架：{len(books)} 本")
    print(f"   划线：{total_bookmarks} 条")
    print(f"   想法/评论：{total_reviews} 条")
    print(f"   笔记本：{len(notebooks.get('notebooks', []))} 个")


if __name__ == "__main__":
    main()
