(function () {
  const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  let mx = innerWidth / 2,
    my = innerHeight / 2;

  /* name: letter-by-letter with glitch */
  const n1 = "Arunima",
    n2 = "Dwivedi";
  function build(el, t) {
    el.innerHTML = "";
    [...t].forEach((c, i) => {
      const s = document.createElement("span");
      s.textContent = c;
      s.style.opacity = 0;
      s.dataset.i = i;
      el.appendChild(s);
    });
  }
  build($(".l1"), n1);
  build($(".l2"), n2);
  function reveal() {
    $$("#name span").forEach((s, i) =>
      setTimeout(
        () => {
          s.style.opacity = 1;
          s.classList.add("glitch");
        },
        rm ? 0 : i * 90,
      ),
    );
  }
  setTimeout(
    () => {
      $("#loader").classList.add("out");
      reveal();
      bars();
    },
    rm ? 100 : 1500,
  );

  /* cursor blob */
  const blob = $(".blob");
  let bx = mx,
    by = my;
  addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  (function loop() {
    bx += (mx - bx) * 0.2;
    by += (my - by) * 0.2;
    blob.style.transform = `translate(${bx}px,${by}px)`;
    requestAnimationFrame(loop);
  })();
  $$("a,button,.card").forEach((el) => {
    el.addEventListener("mouseenter", () => blob.classList.add("big"));
    el.addEventListener("mouseleave", () => blob.classList.remove("big"));
  });

  /* particles reacting to mouse */
  const cv = $("#fx"),
    cx = cv.getContext("2d");
  let W,
    H,
    P = [];
  function size() {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
    P = Array.from({ length: Math.min(90, (W / 14) | 0) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 3 + 1,
      c: ["#c6ff3d", "#ff2e93", "#7a3cff"][(Math.random() * 3) | 0],
    }));
  }
  size();
  addEventListener("resize", size);
  function draw() {
    cx.clearRect(0, 0, W, H);
    const r = cv.getBoundingClientRect(),
      px = mx - r.left,
      py = my - r.top;
    for (const p of P) {
      const dx = p.x - px,
        dy = p.y - py,
        d = Math.hypot(dx, dy);
      if (d < 160) {
        p.vx += (dx / d) * 0.15;
        p.vy += (dy / d) * 0.15;
      }
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      cx.fillStyle = p.c;
      cx.globalAlpha = 0.8;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, 7);
      cx.fill();
    }
    cx.globalAlpha = 0.15;
    cx.strokeStyle = "#7a3cff";
    for (let i = 0; i < P.length; i++)
      for (let j = i + 1; j < P.length; j++) {
        const a = P[i],
          b = P[j];
        if (Math.hypot(a.x - b.x, a.y - b.y) < 110) {
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
        }
      }
    if (!rm) requestAnimationFrame(draw);
  }
  draw();

  /* scroll reveal + progress bars */
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15 },
  );
  $$(".rv").forEach((el) => io.observe(el));
  function bars() {
    const io2 = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.w;
          }
        }),
      { threshold: 0.5 },
    );
    $$(".bar b").forEach((b) => io2.observe(b));
  }

  /* 3D tilt */
  $$(".card").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
      if (rm) return;
      const r = c.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
    });
    c.addEventListener("mouseleave", () => (c.style.transform = ""));
  });

  /* magnetic button */
  const mag = $(".mag");
  mag.parentElement.addEventListener("mousemove", (e) => {
    if (rm) return;
    const r = mag.getBoundingClientRect(),
      dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < 160)
      mag.style.transform = `translate(${dx * 0.35}px,${dy * 0.35}px)`;
    else mag.style.transform = "";
  });
  mag.addEventListener("mouseleave", () => (mag.style.transform = ""));

  /* typed status */
  const phrases = [
    "Lost & Found, a website that reunites people with their stuff.",
    "Polishing this portfolio.",
    "Learning something new every day.",
  ];
  let pi = 0,
    ci = 0,
    del = false;
  const ty = $("#typed");
  (function type() {
    const t = phrases[pi];
    ty.textContent = t.slice(0, ci);
    if (rm) {
      ty.textContent = phrases[0];
      return;
    }
    if (!del && ci++ === t.length) {
      del = true;
      return setTimeout(type, 1800);
    }
    if (del && --ci === 0) {
      del = false;
      pi = (pi + 1) % phrases.length;
    }
    setTimeout(type, del ? 25 : 55);
  })();

  /* theme toggle */
  $("#theme").onclick = () => {
    const r = document.documentElement;
    r.dataset.theme = r.dataset.theme === "light" ? "dark" : "light";
  };

  /* confetti easter egg (logo click or any key) */
  const cc = $("#cf"),
    cg = cc.getContext("2d");
  let bits = [];
  function fit() {
    cc.width = innerWidth;
    cc.height = innerHeight;
  }
  fit();
  addEventListener("resize", fit);
  function boom() {
    if (rm) return;
    for (let i = 0; i < 140; i++)
      bits.push({
        x: innerWidth / 2,
        y: innerHeight / 3,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -14 - 2,
        s: Math.random() * 8 + 4,
        c: ["#c6ff3d", "#ff2e93", "#7a3cff", "#f3f1ea"][i % 4],
        a: Math.random() * 6,
      });
    if (bits.length === 140) spin();
  }
  function spin() {
    cg.clearRect(0, 0, cc.width, cc.height);
    bits = bits.filter((b) => b.y < innerHeight + 20);
    for (const b of bits) {
      b.vy += 0.35;
      b.x += b.vx;
      b.y += b.vy;
      b.a += 0.2;
      cg.save();
      cg.translate(b.x, b.y);
      cg.rotate(b.a);
      cg.fillStyle = b.c;
      cg.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * 0.6);
      cg.restore();
    }
    if (bits.length) requestAnimationFrame(spin);
  }
  $("#logo").onclick = boom;
  addEventListener("keydown", (e) => {
    if (e.key.length === 1 && !/input|textarea/i.test(e.target.tagName)) boom();
  });
})();
