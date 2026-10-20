const lantern = document.getElementById("lantern");
const statusText = document.getElementById("status");
const faces = document.querySelectorAll(".face");

function pauseLantern() {
  lantern.classList.add("paused");
  statusText.textContent = "Trạng thái: Đèn đã dừng";
}

function resumeLantern() {
  lantern.classList.remove("paused");
  statusText.textContent = "Trạng thái: Đèn đang quay";
}

faces.forEach((face) => {
  face.addEventListener("mouseenter", pauseLantern);
  face.addEventListener("mouseleave", resumeLantern);

  // Hỗ trợ chạm trên iPad: chạm vào mặt đèn để dừng/tiếp tục.
  face.addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (lantern.classList.contains("paused")) {
      resumeLantern();
    } else {
      pauseLantern();
    }
  }, { passive: false });
});
