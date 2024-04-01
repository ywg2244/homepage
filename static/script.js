(function () {
  console.log(
    "%cCopyright © 2024 ywg.cool",
    "background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;"
  );
  console.log("%c   /\\_/\\", "color: #8B4513; font-size: 20px;");
  console.log("%c  ( o.o )", "color: #8B4513; font-size: 20px;");
  console.log(" %c  > ^ <", "color: #8B4513; font-size: 20px;");
  console.log("  %c /  ~ \\", "color: #8B4513; font-size: 20px;");
  console.log("  %c/______\\", "color: #8B4513; font-size: 20px;");

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  function handlePress(event) {
    this.classList.add("pressed");
  }

  function handleRelease(event) {
    this.classList.remove("pressed");
  }

  function handleCancel(event) {
    this.classList.remove("pressed");
  }

  var buttons = document.querySelectorAll(".projectItem");
  buttons.forEach(function (button) {
    button.addEventListener("mousedown", handlePress);
    button.addEventListener("mouseup", handleRelease);
    button.addEventListener("mouseleave", handleCancel);
    button.addEventListener("touchstart", handlePress);
    button.addEventListener("touchend", handleRelease);
    button.addEventListener("touchcancel", handleCancel);
  });

  function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
      element.classList.toggle(className);
    });
  }

  function wx(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
      tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
  }

  var tc = document.getElementsByClassName("tc");
  var tc_main = document.getElementsByClassName("tc-main");
  tc[0].addEventListener("click", function (event) {
    wx();
  });
  tc_main[0].addEventListener("click", function (event) {
    event.stopPropagation();
  });

  function left() {
    toggleClass(".left-main", "left-main-open");
    toggleClass(".left", "left-open");
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) == 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var html = document.querySelector("html");
    var themeState = getCookie("themeState") || "Light";
    var svgItems = document.getElementsByTagName("svg");
    var tanChiShe = document.getElementById("tanChiShe");

    function changeTheme(theme) {
      tanChiShe.src = "/static/svg/snake-" + theme + ".svg";
      //切换贪吃蛇
      html.dataset.theme = theme;
      //设置css变量主题
      //不可调换位置,必须在设置css变量后,获取当前css变量的svgcolor
      var svgcolor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--svgcolor");
      //获取当前主题svg颜色值
      for (var i = 0; i < svgItems.length; i++) {
        var paths = svgItems[i].getElementsByTagName("path");
        for (var j = 0; j < paths.length; j++) {
          paths[j].setAttribute("fill", svgcolor);
        }
      }
      setCookie("themeState", theme, 365);
      themeState = theme;
    }

    var Checkbox = document.getElementById("myonoffswitch");
    Checkbox.addEventListener("change", function () {
      if (themeState == "Dark") {
        changeTheme("Light");
      } else if (themeState == "Light") {
        changeTheme("Dark");
      } else {
        changeTheme("Dark");
      }
    });

    if (themeState == "Dark") {
      Checkbox.checked = false;
    }

    changeTheme(themeState);

    var pageLoading = document.querySelector("#ywg-loading");
    setTimeout(function () {
      pageLoading.style.opacity = "0";
    }, 100);

    var fpsElement = document.createElement("div");
    fpsElement.id = "fps";
    fpsElement.style.zIndex = "10000";
    fpsElement.style.position = "fixed";
    fpsElement.style.left = "0";
    document.body.insertBefore(fpsElement, document.body.firstChild);

    var showFPS = (function () {
      var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };

      var fps = 0,
        last = Date.now(),
        offset,
        step,
        appendFps;

      step = function () {
        offset = Date.now() - last;
        fps += 1;

        if (offset >= 1000) {
          last += offset;
          appendFps(fps);
          fps = 0;
        }

        requestAnimationFrame(step);
      };

      appendFps = function (fpsValue) {
        fpsElement.textContent = "FPS: " + fpsValue;
      };

      step();
    })();
  });
})();

// 请求博客最新记录
(async function () {
  //
  const res = await window.fetch("/api/index.json", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const {
    pageProps: { articles },
  } = await res.json();
  if (articles.length !== 0) {
    const dom = document.getElementById("article");
    let domStr = [];
    articles.forEach((val, index) => {
      let str = `
          <a class="projectItem b" target="_blank" href="https://blog.ywg.cool/post/${
            val.id
          }">
            <div class="projectItemLeft">
            <h1>${val.title}</h1>
              <div class="tag">
                <div class="tag-title">标签: </div>
                <div class="tags">
                  ${val.tags
                    .map(
                      (tag) =>
                        `<span data-url="https://blog.ywg.cool/category/${tag}">${tag}</span>`
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <div class="projectItemRight">
              <img src="/static/img/i${index + 1}.png" alt="" />
            </div>
          </a>
      `;
      domStr.push(str);
    });
    dom.innerHTML = domStr.join("");
  }
})();
