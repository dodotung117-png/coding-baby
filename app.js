const state = {
  devices: [
    {
      id: "D-001",
      name: "妈妈手环",
      phone: "138****1001",
      online: true,
      battery: 76,
      heartRate: 72,
      steps: 5234,
      lastSeen: "刚刚",
    },
    {
      id: "D-002",
      name: "爸爸胸牌",
      phone: "139****2108",
      online: false,
      battery: 18,
      heartRate: 0,
      steps: 2043,
      lastSeen: "15分钟前",
    },
  ],
  alerts: [
    {
      id: 1,
      level: "sos",
      title: "SOS 一键求助",
      detail: "妈妈手环触发求助，位置：人民公园东门",
      time: "09:42",
    },
    {
      id: 2,
      level: "warning",
      title: "低电量提醒",
      detail: "爸爸胸牌电量低于 20%，请尽快充电",
      time: "08:30",
    },
  ],
  fence: {
    location: "北京市朝阳区酒仙桥社区",
    radius: 1000,
  },
  contacts: [
    { name: "大女儿", phone: "136****0001" },
    { name: "社区医生", phone: "010-8***-1200" },
  ],
};

const els = {
  deviceSearch: document.querySelector("#deviceSearch"),
  deviceList: document.querySelector("#deviceList"),
  deviceCount: document.querySelector("#deviceCount"),
  alertList: document.querySelector("#alertList"),
  addAlertBtn: document.querySelector("#addAlertBtn"),
  fenceLocation: document.querySelector("#fenceLocation"),
  radiusRange: document.querySelector("#radiusRange"),
  radiusText: document.querySelector("#radiusText"),
  contactForm: document.querySelector("#contactForm"),
  contactName: document.querySelector("#contactName"),
  contactPhone: document.querySelector("#contactPhone"),
  contactList: document.querySelector("#contactList"),
};

function renderDevices(keyword = "") {
  const q = keyword.trim().toLowerCase();
  const filtered = state.devices.filter((d) => {
    return d.name.toLowerCase().includes(q) || d.phone.includes(q);
  });

  els.deviceCount.textContent = `共 ${filtered.length} 台`;
  els.deviceList.innerHTML = filtered
    .map((d) => {
      const statusClass = d.online ? "state-online" : "state-offline";
      const statusText = d.online ? "在线" : "离线";
      return `
        <li>
          <div><strong>${d.name}</strong>（${d.id}）</div>
          <div class="meta">手机号：${d.phone}</div>
          <div class="meta">状态：<span class="${statusClass}">${statusText}</span> · 电量：${d.battery}% · 心率：${d.heartRate || "--"} bpm · 步数：${d.steps}</div>
          <div class="meta">最近上报：${d.lastSeen}</div>
        </li>
      `;
    })
    .join("");
}

function renderAlerts() {
  els.alertList.innerHTML = state.alerts
    .map((a) => {
      const className = a.level === "sos" ? "alert-sos" : "alert-warning";
      return `
        <li class="${className}">
          <div><strong>${a.title}</strong> <span class="meta">${a.time}</span></div>
          <div class="meta">${a.detail}</div>
        </li>
      `;
    })
    .join("");
}

function renderFence() {
  els.fenceLocation.textContent = state.fence.location;
  els.radiusRange.value = String(state.fence.radius);
  els.radiusText.textContent = state.fence.radius;
}

function renderContacts() {
  els.contactList.innerHTML = state.contacts
    .map((c) => `<li><strong>${c.name}</strong><div class="meta">${c.phone}</div></li>`)
    .join("");
}

function bindEvents() {
  els.deviceSearch.addEventListener("input", (event) => {
    renderDevices(event.target.value);
  });

  els.radiusRange.addEventListener("input", (event) => {
    state.fence.radius = Number(event.target.value);
    els.radiusText.textContent = String(state.fence.radius);
  });

  els.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.contactName.value.trim();
    const phone = els.contactPhone.value.trim();
    if (!name || !phone) {
      return;
    }

    state.contacts.unshift({ name, phone });
    els.contactForm.reset();
    renderContacts();
  });

  els.addAlertBtn.addEventListener("click", () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    state.alerts.unshift({
      id: Date.now(),
      level: "warning",
      title: "离开围栏提醒",
      detail: "检测到爸爸胸牌离开安全半径，请及时确认。",
      time: `${hh}:${mm}`,
    });
    renderAlerts();
  });
}

function init() {
  renderDevices();
  renderAlerts();
  renderFence();
  renderContacts();
  bindEvents();
}

init();
