function shimport(src) {
    try {
        new Function('import("' + src + '")')();
    } catch (e) {
        var s = document.createElement("script");
        s.src = "https://unpkg.com/shimport";
        s.dataset.main = src;
        document.head.appendChild(s);
    }
}
