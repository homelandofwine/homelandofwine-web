import re, sys, urllib.request, urllib.error

BASE = "http://localhost:3000"
PAIRS = [
    ("/", "/ka"),
    ("/blog", "/ka/blog"),
    ("/about", "/ka/about"),
    ("/contact", "/ka/contact"),
    ("/ambassador", "/ka/ambassador"),
    ("/n-line-print", "/ka/n-line-print"),
    ("/privacy", "/ka/privacy"),
    ("/blog/category/producers", "/ka/blog/category/producers"),
    ("/blog/a-periphrasis-of-rose-wine", "/ka/blog/vardisperi-ghvinis-periprazi"),
]

def fetch(path):
    with urllib.request.urlopen(BASE + path) as r:
        return r.read().decode()

def status(path):
    try:
        with urllib.request.urlopen(BASE + path) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code

def alternates(html):
    out = {}
    for m in re.finditer(r'<link[^>]+rel="alternate"[^>]*>', html, re.I):
        tag = m.group(0)
        lang = re.search(r'hreflang="([^"]+)"', tag, re.I)
        href = re.search(r'href="([^"]+)"', tag, re.I)
        if lang and href:
            out[lang.group(1)] = href.group(1)
    return out

def canonical(html):
    m = re.search(r'<link[^>]+rel="canonical"[^>]*href="([^"]+)"', html, re.I)
    return m.group(1) if m else None

def path_of(url):
    if "://" in url:
        rest = url.split("://", 1)[-1]
        return "/" + rest.split("/", 1)[1] if "/" in rest else "/"
    return url

def eq(url, path):
    return url is not None and path_of(url).rstrip("/") == path.rstrip("/") or (
        path == "/" and url is not None and path_of(url) == "/"
    )

fails = 0
for en_path, ka_path in PAIRS:
    en_html, ka_html = fetch(en_path), fetch(ka_path)
    a_en, a_ka = alternates(en_html), alternates(ka_html)
    checks = [
        ("en page: hreflang en → self", eq(a_en.get("en"), en_path)),
        ("en page: hreflang ka → ka path", eq(a_en.get("ka"), ka_path)),
        ("en page: x-default → en", eq(a_en.get("x-default"), en_path)),
        ("ka page: hreflang en → en path", eq(a_ka.get("en"), en_path)),
        ("ka page: hreflang ka → self", eq(a_ka.get("ka"), ka_path)),
        ("ka page: x-default → en", eq(a_ka.get("x-default"), en_path)),
        ("canonical self (en)", eq(canonical(en_html), en_path)),
        ("canonical self (ka)", eq(canonical(ka_html), ka_path)),
    ]
    bad = [name for name, ok in checks if not ok]
    if bad:
        fails += 1
        print(f"FAIL {en_path} <-> {ka_path}")
        for b in bad:
            print(f"   - {b}")
        print(f"   en: {a_en} canonical={canonical(en_html)}")
        print(f"   ka: {a_ka} canonical={canonical(ka_html)}")
    else:
        print(f"ok   {en_path} <-> {ka_path}")

print("\n-- one-locale edge cases --")
edge_fails = 0

ka_only = "/ka/blog/food-travel"
h = fetch(ka_only)
a = alternates(h)
for name, ok in [
    (f"{ka_only} is 200", status(ka_only) == 200),
    ("ka-only: hreflang ka → self", eq(a.get("ka"), ka_only)),
    ("ka-only: NO en hreflang", "en" not in a),
    ("ka-only: NO x-default", "x-default" not in a),
    ("/blog/food-travel is 404", status("/blog/food-travel") == 404),
]:
    print(("ok   " if ok else "FAIL ") + name)
    edge_fails += 0 if ok else 1

en_only, en_only_ka = "/blog/tazo-tamazashvili", "/ka/blog/tazo-tamazashvili"
h_en, h_ka = fetch(en_only), fetch(en_only_ka)
a_en, a_ka = alternates(h_en), alternates(h_ka)
for name, ok in [
    ("en-only: en page hreflang en → self", eq(a_en.get("en"), en_only)),
    ("en-only: en page has NO ka hreflang", "ka" not in a_en),
    ("en-only: en canonical self", eq(canonical(h_en), en_only)),
    (f"en-only: {en_only_ka} is 200", status(en_only_ka) == 200),
    ("en-only: ka fallback canonical → en page", eq(canonical(h_ka), en_only)),
    ("en-only: ka fallback has NO hreflang", not a_ka),
]:
    print(("ok   " if ok else "FAIL ") + name)
    edge_fails += 0 if ok else 1

listing = fetch("/blog")
ok = "/blog/undefined" not in listing
print(("ok   " if ok else "FAIL ") + "en listing has no /blog/undefined links")
edge_fails += 0 if ok else 1

total_fails = fails + edge_fails
print(f"\n{len(PAIRS) - fails}/{len(PAIRS)} pairs symmetric, {edge_fails} edge failures")
sys.exit(1 if total_fails else 0)
