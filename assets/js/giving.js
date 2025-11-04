/* Copy Account Functionality */
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const account = btn.dataset.account;
    navigator.clipboard.writeText(account);
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy Account"), 1500);
  });
});

/* Tabs */
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});
