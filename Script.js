function showWish() {
    document.getElementById("wishSection").classList.remove("hidden");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

document.getElementById("wishBtn").addEventListener("click", showWish);
