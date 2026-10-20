"use strict";

// Dữ liệu sản phẩm mẫu. Có thể thay tên và giá theo yêu cầu của giảng viên.
const products = [
  { name: "Laptop học tập", price: "12.500.000đ", description: "Phù hợp học tập và làm việc." },
  { name: "Chuột không dây", price: "250.000đ", description: "Thiết kế gọn nhẹ, dễ sử dụng." },
  { name: "Bàn phím cơ", price: "790.000đ", description: "Gõ phím thoải mái." },
  { name: "Tai nghe", price: "450.000đ", description: "Âm thanh rõ, tiện lợi." },
  { name: "Màn hình máy tính", price: "2.900.000đ", description: "Màn hình phục vụ học tập." }
];

function renderProducts(list, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.replaceChildren();

  if (list.length === 0) {
    const message = document.createElement("p");
    message.className = "message error";
    message.textContent = "Không tìm thấy sản phẩm phù hợp.";
    target.appendChild(message);
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = product.price;
    card.append(title, description, price);
    target.appendChild(card);
  });
}

function setupProductSearch() {
  const input = document.getElementById("productSearch");
  const grid = document.getElementById("productList");
  if (!input || !grid) return;
  renderProducts(products, "productList");
  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLocaleLowerCase("vi");
    const result = products.filter((product) =>
      product.name.toLocaleLowerCase("vi").includes(keyword)
    );
    renderProducts(result, "productList");
  });
}

// Form đăng ký: kiểm tra dữ liệu ở trình duyệt.
function setupRegisterForm() {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");
  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";
    message.className = "message";

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const agreed = document.getElementById("agree").checked;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (name.length === 0) {
      showFormMessage("Vui lòng nhập họ và tên.", false); return;
    }
    if (!emailPattern.test(email)) {
      showFormMessage("Email chưa hợp lệ. Vui lòng kiểm tra lại.", false); return;
    }
    if (!passwordPattern.test(password)) {
      showFormMessage("Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.", false); return;
    }
    if (!agreed) {
      showFormMessage("Bạn cần đồng ý với điều khoản.", false); return;
    }

    // Không lưu mật khẩu dạng rõ vào LocalStorage.
    // Bài thực hành chỉ lưu tên/email; hệ thống thật cần backend và băm mật khẩu an toàn.
    const userData = { name, email, registeredAt: new Date().toISOString() };
    try {
      localStorage.setItem("baitap24_registered_user", JSON.stringify(userData));
      showFormMessage("Đăng ký thành công! Dữ liệu tên và email đã được lưu trên trình duyệt.", true);
      form.reset();
    } catch (error) {
      showFormMessage("Không thể lưu dữ liệu. Trình duyệt có thể đang chặn LocalStorage.", false);
    }
  });

  function showFormMessage(text, success) {
    message.textContent = text;
    message.className = success ? "message success" : "message error";
  }
}

// Đồng hồ 10 phút. Chỉ tạo một interval và dọn interval khi kết thúc/reset.
function setupCountdown() {
  const timer = document.getElementById("timer");
  const startButton = document.getElementById("startTimer");
  const pauseButton = document.getElementById("pauseTimer");
  const resetButton = document.getElementById("resetTimer");
  if (!timer || !startButton || !pauseButton || !resetButton) return;

  const initialSeconds = 10 * 60;
  let remainingSeconds = initialSeconds;
  let intervalId = null;
  let hasAlerted = false;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }
  function updateDisplay() {
    timer.textContent = formatTime(remainingSeconds);
    timer.classList.toggle("warning", remainingSeconds > 0 && remainingSeconds < 60);
  }
  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  function tick() {
    if (remainingSeconds > 0) remainingSeconds -= 1;
    updateDisplay();
    if (remainingSeconds === 0) {
      stopInterval();
      startButton.disabled = false;
      pauseButton.disabled = true;
      if (!hasAlerted) {
        hasAlerted = true;
        window.alert("Đã hết thời gian đếm ngược!");
      }
    }
  }

  startButton.addEventListener("click", () => {
    if (intervalId !== null || remainingSeconds === 0) return;
    hasAlerted = false;
    intervalId = window.setInterval(tick, 1000);
    startButton.disabled = true;
    pauseButton.disabled = false;
  });
  pauseButton.addEventListener("click", () => {
    stopInterval();
    startButton.disabled = remainingSeconds === 0;
    pauseButton.disabled = true;
  });
  resetButton.addEventListener("click", () => {
    stopInterval();
    remainingSeconds = initialSeconds;
    hasAlerted = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    updateDisplay();
  });

  // Dọn interval khi rời trang để tránh timer chạy ngoài ý muốn.
  window.addEventListener("pagehide", stopInterval);
  pauseButton.disabled = true;
  updateDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  setupProductSearch();
  setupRegisterForm();
  setupCountdown();
});
