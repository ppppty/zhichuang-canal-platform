/* ═══════════════════════════════════════════════
   运河支队日记 · 智创运河 — 交互脚本
   ═══════════════════════════════════════════════ */

const home = document.querySelector("#home");
const game = document.querySelector("#game");
const gameVideo = document.querySelector("#gameVideo");
const videoPauseBtn = document.querySelector("[data-video-pause]");
const videoPauseText = document.querySelector("[data-video-pause-text]");
const videoPauseIcon = document.querySelector("[data-video-pause-icon]");

function setGameActiveState(isActive) {
  document.body.classList.toggle("is-game-active", isActive);
}
const toast = document.querySelector("[data-toast]");

function syncVideoPauseUI() {
  if (!videoPauseBtn || !gameVideo) return;
  const isPaused = gameVideo.paused;
  videoPauseBtn.classList.toggle("is-paused", isPaused);
  videoPauseBtn.setAttribute("aria-label", isPaused ? "继续播放视频" : "暂停视频");
  if (videoPauseText) videoPauseText.textContent = isPaused ? "播放" : "暂停";
  if (videoPauseIcon) videoPauseIcon.textContent = isPaused ? "▶" : "Ⅱ";
}

/* ═══════════════════════════════════════════════
   localStorage 进度系统
   ═══════════════════════════════════════════════ */

const STORAGE_KEY = "canal_diary_progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveProgress(partial) {
  const current = loadProgress() || {};
  const merged = { ...current, ...partial, updatedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch { /* quota exceeded, silently fail */ }
}

function mergeUniqueIds(...lists) {
  return [...new Set(lists.flat().filter(Boolean))];
}

function getProgress() {
  const defaults = {
    videoTime: 0,
    choices: [],
    unlockedCharacters: ["chen-shuisheng", "sun-bolong", "zhu-daonan", "shao-jianqiu", "hu-daxun", "chen-yi", "tong-qiulong", "zhu-xiaochun", "hu-dalun"],
    unlockedEvents: ["beacon-fire", "zhouying-assembly", "first-battle-duzhuang", "cold-night-escort", "bridge-demolition"],
    stats: { archivesOpened: 0, cardsFlipped: 0, aiQuestions: 0, decisionsMade: 0 },
    firstVisit: true
  };
  const saved = loadProgress();
  const progress = saved ? { ...defaults, ...saved } : defaults;
  const allCharacterIds = Array.isArray(window.charactersData) ? window.charactersData.map((ch) => ch.id) : defaults.unlockedCharacters;
  const allEventIds = Array.isArray(window.timelineData) ? window.timelineData.map((event) => event.id) : defaults.unlockedEvents;

  return {
    ...progress,
    unlockedCharacters: mergeUniqueIds(defaults.unlockedCharacters, progress.unlockedCharacters || [], allCharacterIds),
    unlockedEvents: mergeUniqueIds(defaults.unlockedEvents, progress.unlockedEvents || [], allEventIds),
    stats: { ...defaults.stats, ...(progress.stats || {}) }
  };
}

/* ═══════════════════════════════════════════════
   行为追踪
   ═══════════════════════════════════════════════ */

function trackAction(action, value = 1) {
  const progress = getProgress();
  if (!progress.stats) progress.stats = { archivesOpened: 0, cardsFlipped: 0, aiQuestions: 0, decisionsMade: 0 };
  if (progress.stats[action] !== undefined) {
    progress.stats[action] += value;
  }
  saveProgress(progress);
}

/* ═══════════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════════ */

let toastTimer;

function showToast(message, isDemo = true) {
  toast.textContent = isDemo ? `${message}功能将在下一版 Demo 中开放` : message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

/* ═══════════════════════════════════════════════
   动态渲染 — 人物卡牌
   ═══════════════════════════════════════════════ */

function renderCharacters(filter = "all") {
  const container = document.querySelector("[data-characters-container]");
  if (!container) return;
  const progress = getProgress();

  container.innerHTML = "";

  let visible = charactersData;
  if (filter === "real") visible = charactersData.filter(ch => ch.historicalLabel.includes("真实"));
  else if (filter === "adapted") visible = charactersData.filter(ch => ch.historicalLabel.includes("剧情化"));
  else if (filter === "fictional") visible = charactersData.filter(ch => ch.historicalLabel.includes("虚构"));

  visible.forEach((ch) => {
    const isUnlocked = progress.unlockedCharacters.includes(ch.id);
    const card = document.createElement("article");
    card.className = "flip-card dossier-card" + (!isUnlocked ? " is-locked" : "");
    card.setAttribute("data-flip-card", "");
    card.setAttribute("data-character-id", ch.id);

    // 改进 3：正面精简到 4 层核心信息，记忆点移至背面
    // 改进 6：锁定角色展示剪影 + 线索提示
    const front = isUnlocked
      ? `<div class="dossier-front-meta">
           <span>${ch.recordType || ch.historicalLabel}</span>
           <b>${ch.role}</b>
         </div>
         <div class="card-front-avatar dossier-avatar">
           <img src="${ch.avatar}" alt="${ch.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';" />
           <div class="card-front-fallback" style="background:${ch.fallbackBg};">${ch.fallbackText}</div>
         </div>
         <h3>${ch.name}</h3>
         <span class="card-front-title">${ch.title}</span>
         <span class="card-front-label">${ch.historicalLabel}</span>`
      : `<div class="card-front-avatar dossier-avatar is-silhouette">
           <div class="card-front-fallback silhouette-fallback" style="display:grid;">${ch.fallbackText}</div>
         </div>
         <h3 class="silhouette-name">???</h3>
         <span class="card-front-title silhouette-hint">${ch.teaserText || "在游戏中遇到此角色后将自动解锁"}</span>`;

    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          ${front}
          ${!isUnlocked ? '<div class="card-locked-overlay"><span></span></div>' : ""}
        </div>
        <div class="flip-card-back">
          <div class="card-back-hd">
            <div>
              <h3>${isUnlocked ? ch.name : "???"}</h3>
              <span class="card-back-label">${isUnlocked ? `${ch.historicalLabel} · ${ch.faction}` : "???"}</span>
            </div>
            <span class="card-back-stamp">${isUnlocked ? ch.backChop : "?"}</span>
          </div>
          ${isUnlocked
            ? `<div class="card-back-body dossier-back-body">
                 <p class="card-memory-line"><span>记忆点</span>${ch.memoryLine}</p>
                 <div class="dossier-id-row"><span>身份</span><p>${ch.title}</p></div>
                 <div class="dossier-id-row"><span>出场</span><p>${ch.chapters}</p></div>
                 <p class="card-bio">${ch.bio}</p>
                 <p class="card-relationship"><span>与陈水生</span>${ch.relationship}</p>
                 ${ch.storyLine ? `<p class="card-story-note"><span>编审注</span>${ch.storyLine}</p>` : ""}
                 <blockquote>"${ch.quote}"</blockquote>
               </div>`
            : `<div class="card-back-body"><p class="card-locked-msg">${ch.teaserText || "在游戏中遇到此角色后将自动解锁其档案。"}</p></div>`
          }
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (!isUnlocked) {
        const msg = ch.teaserText || "此角色尚未解锁，继续体验剧情即可解锁";
        showToast(msg, false);
        return;
      }
      const allCards = container.querySelectorAll("[data-flip-card]");
      allCards.forEach((c) => { if (c !== card) c.classList.remove("is-flipped"); });
      const wasFlipped = card.classList.contains("is-flipped");
      card.classList.toggle("is-flipped");
      if (!wasFlipped) trackAction("cardsFlipped");
    });

    container.appendChild(card);
  });
}

/* ???????????????????????????????????????????????
   ???? ? ???
   ??????????????????????????????????????????????? */

function renderTimeline() {
  const scrollTrack = document.querySelector("[data-scroll-track]");
  const progressContainer = document.querySelector("[data-scroll-progress]");
  if (!scrollTrack) return;
  const progress = getProgress();

  scrollTrack.innerHTML = "";
  if (progressContainer) progressContainer.innerHTML = "";

  // 改进 2：地图 + 卡片区分离布局
  // 地图区 — 固定展示
  const mapWrap = document.createElement("div");
  mapWrap.className = "war-map-wrap";

  // 改进 1：动态计算地图节点位置
  const nodeCount = timelineData.length;
  const nodePositions = timelineData.map((_, i) => {
    // 5 个节点沿路线分布：起点左下方 → 中上方 → 中部 → 右上方 → 终点右下方
    const positions = [
      { left: 8, top: 42 },
      { left: 26, top: 18 },
      { left: 20, top: 56 },
      { left: 56, top: 30 },
      { right: 10, bottom: 10 }
    ];
    return positions[i] || { left: 10 + i * 18, top: 20 + i * 16 };
  });

  mapWrap.innerHTML = `
    <div class="war-map-route">
      <div class="war-map-heading">
        <span>运河战役路线</span>
        <strong>烽火 · 五章纪事</strong>
        <p>点击地图节点跳转对应档案。五场关键事件，一条运河，一支队伍。</p>
      </div>
      <div class="war-map-terrain" aria-hidden="true">
        <span class="terrain-river"></span>
        <span class="terrain-rail"></span>
        <span class="terrain-road terrain-road-a"></span>
        <span class="terrain-road terrain-road-b"></span>
        <span class="terrain-label terrain-label-north">鲁南山地</span>
        <span class="terrain-label terrain-label-canal">京杭运河</span>
        <span class="terrain-label terrain-label-rail">津浦线</span>
      </div>
      <div class="war-map-line" aria-hidden="true"></div>
      <div class="war-map-nodes">
        ${timelineData.map((event, i) => {
          const isUnlocked = progress.unlockedEvents.includes(event.id);
          const pos = nodePositions[i];
          const style = [];
          if (pos.left) style.push(`left:${pos.left}%`);
          if (pos.right) style.push(`right:${pos.right}%`);
          if (pos.top) style.push(`top:${pos.top}%`);
          if (pos.bottom) style.push(`bottom:${pos.bottom}%`);
          return `<button class="war-map-node ${isUnlocked ? "" : "is-locked"}" type="button"
            style="${style.join(";")}; --node-accent:${event.accent}"
            data-jump-event="${event.id}">
            <span>${event.routeIndex || String(i + 1).padStart(2, "0")}</span>
            <b>${isUnlocked ? event.mapLocation : "机密地点"}</b>
          </button>`;
        }).join("")}
      </div>
    </div>
  `;
  scrollTrack.appendChild(mapWrap);

  // 改进 2：卡片纵向滚动区
  const cardTrack = document.createElement("div");
  cardTrack.className = "archive-card-track";

  timelineData.forEach((event, i) => {
    const isUnlocked = progress.unlockedEvents.includes(event.id);
    const card = document.createElement("article");
    // 改进 5：档案卡按事件类型配色
    card.className = "scroll-card archive-card" + (isUnlocked ? "" : " is-locked");
    card.setAttribute("data-scroll-card", "");
    card.setAttribute("data-event-id", event.id);
    card.style.setProperty("--event-accent", event.accent);

    card.innerHTML = `
      <div class="scroll-card-inner" style="--event-accent:${event.accent}">
        <div class="archive-index">${event.routeIndex || String(i + 1).padStart(2, "0")}</div>
        <div class="scroll-card-top">
          <time>${event.time}</time>
          <span class="timeline-tag" style="background:${event.accent}22;border-color:${event.accent}66;color:${event.accent}">${event.tag}</span>
        </div>
        <h3>${isUnlocked ? event.title : "机密档案"}</h3>
        <span class="timeline-location">${isUnlocked ? event.coordinate || event.mapLocation : "位置加密"}</span>
        ${isUnlocked
          ? `<div class="archive-form">${event.archiveForm || "档案"}</div>
             <div class="scroll-card-content">
               <p class="timeline-oneliner" style="border-left-color:${event.accent}">${event.oneLiner}</p>
               <div class="timeline-section">
                 <h4>史实</h4>
                 <p>${event.historicalFacts}</p>
               </div>
               <div class="timeline-section">
                 <h4>剧情化改编</h4>
                 <p>${event.gameAdaptation}</p>
               </div>
               ${event.playerEcho ? `<div class="timeline-section timeline-player-echo">
                 <h4>少年手记 / 玩家选择</h4>
                 <p>${event.playerEcho.replace(/\n/g, "<br/>")}</p>
               </div>` : ""}
               ${event.sourceNote ? `<p class="timeline-source-note">${event.sourceNote}</p>` : ""}
             </div>`
          : `<p class="timeline-locked-msg">${event.unlockCondition || "继续体验剧情即可解锁此档案。"}</p>`
        }
      </div>
    `;

    cardTrack.appendChild(card);

    if (progressContainer) {
      const dot = document.createElement("div");
      dot.className = "scroll-progress-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("data-progress-dot", "");
      progressContainer.appendChild(dot);
    }
  });

  scrollTrack.appendChild(cardTrack);

  // 地图节点点击 → 滚动到对应卡片
  scrollTrack.querySelectorAll("[data-jump-event]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = scrollTrack.querySelector(`[data-event-id="${btn.dataset.jumpEvent}"]`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    });
  });

  // 进度点滚动联动
  cardTrack.addEventListener("scroll", () => {
    const cards = cardTrack.querySelectorAll("[data-scroll-card]");
    const dots = document.querySelectorAll("[data-progress-dot]");
    if (!cards.length) return;
    const activeIndex = [...cards].reduce((nearest, card, index) => {
      const distance = Math.abs(card.offsetTop - cardTrack.scrollTop);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Infinity }).index;
    dots.forEach((dot, j) => dot.classList.toggle("active", j === activeIndex));
  });

  requestAnimationFrame(() => {
    const cards = cardTrack.querySelectorAll("[data-scroll-card]");
    cards.forEach((card, j) => {
      setTimeout(() => card.classList.add("is-revealed"), j * 120);
    });
  });
}

/* ???????????????????????????????????????????????
   ?????
   ??????????????????????????????????????????????? */

function initPage() {
  const progress = getProgress();

  // 首次访问标记
  if (progress.firstVisit) {
    saveProgress({ firstVisit: false });
  }

  // 恢复视频进度
  if (progress.videoTime > 0 && gameVideo) {
    gameVideo.currentTime = progress.videoTime;
  }

  // 动态渲染
  renderCharacters();
  renderTimeline();

  // 标记所有卡片为已揭示
  setTimeout(() => {
    document.querySelectorAll("[data-flip-card]").forEach((card, i) => {
      setTimeout(() => card.classList.add("is-revealed"), i * 100);
    });
  }, 300);
}

/* ═══════════════════════════════════════════════
   分支视频引擎
   ═══════════════════════════════════════════════ */

let currentNodeId = null;
let currentVideoPath = null;
let isPlayingNode = false;
let decisionCueTimer = null;
let pendingSeekTime = null;
let isSeekingProgress = false;

/* ── 游戏路径追踪（进度条用） ── */
let gamePath = []; // [{type:'video', nodeId}, {type:'decision', dpId, label, nodeId}, ...]

function getNodeLabel(nodeId) {
  const node = gameNodes[nodeId];
  if (!node) return nodeId;
  if (node.nextDecision) {
    const dp = decisionPoints[node.nextDecision];
    return dp ? dp.title : nodeId;
  }
  if (node.ending) return "结局";
  if (node.nextNode) return "过渡";
  return nodeId;
}

function getVideoPath(nodeId) {
  const node = gameNodes[nodeId];
  if (!node || !node.video) return null;
  return VIDEO_BASE + node.video;
}

function getVideoEntries() {
  return gamePath.filter(p => p.type === "video");
}

function getCurrentVideoEntry() {
  const entries = getVideoEntries();
  return entries[entries.length - 1] || null;
}

function updateCurrentVideoEntry(partial) {
  for (let i = gamePath.length - 1; i >= 0; i--) {
    if (gamePath[i].type === "video" && gamePath[i].nodeId === currentNodeId) {
      gamePath[i] = { ...gamePath[i], ...partial };
      return;
    }
  }
}

/* ── 进度条渲染 ── */
const progressTrack = document.querySelector("[data-progress-track]");
const progressSegments = document.querySelector("[data-progress-segments]");
const progressCursor = document.querySelector("[data-progress-cursor]");

function renderProgressBar() {
  if (!progressSegments || !progressCursor) return;

  // 计算视频段数量
  const videoCount = getVideoEntries().length;
  if (videoCount === 0) {
    progressSegments.innerHTML = "";
    progressCursor.style.left = "0%";
    progressTrack.querySelectorAll(".progress-marker").forEach(m => m.remove());
    return;
  }

  // 获取每个视频段的标签
  const videoEntries = getVideoEntries();
  const currentVideoIdx = videoCount - 1;

  // 渲染视频段
  let segHTML = "";
  for (let i = 0; i < videoCount; i++) {
    let cls = "progress-seg";
    if (i < currentVideoIdx) cls += " is-played";
    else if (i === currentVideoIdx) cls += " is-current";
    segHTML += `<div class="${cls}" data-seg-index="${i}"></div>`;
  }
  progressSegments.innerHTML = segHTML;

  const bar = document.querySelector(".game-progress-bar");
  if (bar) bar.style.setProperty("--segment-count", String(videoCount));

  // 渲染决策点标记（在段边界处）
  progressTrack.querySelectorAll(".progress-marker").forEach(m => m.remove());

  let decisionIdx = 0;
  let segIdx = 0;
  const decisionEntries = [];
  for (let i = 0; i < gamePath.length; i++) {
    if (gamePath[i].type === "video") {
      segIdx++;
    } else if (gamePath[i].type === "decision") {
      decisionEntries.push({ entry: gamePath[i], segAfter: segIdx, index: decisionIdx });
      decisionIdx++;
    }
  }

  decisionEntries.forEach(d => {
    const position = ((d.segAfter) / videoCount) * 100;
    const marker = document.createElement("div");
    marker.className = "progress-marker is-reached";
    marker.setAttribute("aria-label", `回到${d.entry.label}`);
    marker.setAttribute("data-decision-index", d.index);
    marker.style.left = Math.min(position, 98) + "%";
    marker.addEventListener("click", (e) => {
      e.stopPropagation();
      replayFromDecision(d.index);
    });
    progressTrack.appendChild(marker);
  });

  // 标记最后一个决策点为 active（如果当前有活跃的决策面板）
  if (isDecisionPanelActive()) {
    const markers = progressTrack.querySelectorAll(".progress-marker");
    const lastMarker = markers[markers.length - 1];
    if (lastMarker) lastMarker.classList.add("is-active");
  }

  const currentEntry = videoEntries[currentVideoIdx];
  const currentDuration = currentEntry && currentEntry.duration ? currentEntry.duration : gameVideo.duration;
  const innerPct = currentDuration && Number.isFinite(currentDuration)
    ? Math.max(0, Math.min(1, gameVideo.currentTime / currentDuration))
    : 0;
  const cursorPos = videoCount > 0 ? ((currentVideoIdx + innerPct) / videoCount) * 100 : 0;
  progressCursor.style.left = cursorPos + "%";

}

function escapeAttr(s) {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/* ── 跳转到指定视频段（点击段区域） ── */
function seekProgressFromPointer(clientX) {
  const videoEntries = getVideoEntries();
  const videoCount = videoEntries.length;
  if (!videoCount || !progressSegments) return;
  const rect = progressSegments.getBoundingClientRect();
  if (!rect.width) return;
  const globalPct = Math.max(0, Math.min(0.9999, (clientX - rect.left) / rect.width));
  const segIdx = Math.min(Math.floor(globalPct * videoCount), videoCount - 1);
  const innerPct = Math.max(0, Math.min(1, globalPct * videoCount - segIdx));
  jumpToSegment(segIdx, innerPct);
}

function jumpToSegment(segIdx, innerPct = 0) {
  const videoEntries = getVideoEntries();
  if (segIdx < 0 || segIdx >= videoEntries.length) return;
  const currentIdx = videoEntries.length - 1;
  const targetEntry = videoEntries[segIdx];
  const duration = targetEntry.duration || (segIdx === currentIdx ? gameVideo.duration : 0);
  const seekTime = duration && Number.isFinite(duration) ? Math.max(0, Math.min(duration - 0.2, duration * innerPct)) : 0;

  if (segIdx === currentIdx) {
    clearDecisionCue();
    hideDecisionPanel();
    gameVideo.currentTime = seekTime;
    isPlayingNode = true;
    gameVideo.play().catch(() => {});
    renderProgressBar();
    return;
  }

  // 在 gamePath 中找到该视频段的位置
  let videoCount = 0;
  let pathIdx = -1;
  for (let i = 0; i < gamePath.length; i++) {
    if (gamePath[i].type === "video") {
      if (videoCount === segIdx) { pathIdx = i; break; }
      videoCount++;
    }
  }
  if (pathIdx === -1) return;

  gamePath = gamePath.slice(0, pathIdx);
  const newTriggered = new Set();
  for (const p of gamePath) {
    if (p.type === "decision") newTriggered.add(p.dpId);
  }
  triggeredDecisions.clear();
  for (const id of newTriggered) triggeredDecisions.add(id);

  clearDecisionCue();
  hideDecisionPanel();
  playNode(targetEntry.nodeId, true, seekTime);
  showToast("已跳转至第" + (segIdx + 1) + "段", false);
}

/* ── 回播：从指定决策点重新开始 ── */
function replayFromDecision(decisionIdx) {
  // 找到该决策在 gamePath 中的位置
  let foundIdx = -1;
  let currentDecIdx = 0;
  for (let i = 0; i < gamePath.length; i++) {
    if (gamePath[i].type === "decision") {
      if (currentDecIdx === decisionIdx) {
        foundIdx = i;
        break;
      }
      currentDecIdx++;
    }
  }
  if (foundIdx === -1) return;

  const decisionEntry = gamePath[foundIdx];

  // 截断路径到该决策之前
  gamePath = gamePath.slice(0, foundIdx);

  // 重置 triggeredDecisions — 保留该决策之前的
  const newTriggered = new Set();
  for (let i = 0; i < foundIdx; i++) {
    if (gamePath[i].type === "decision") {
      newTriggered.add(gamePath[i].dpId);
    }
  }
  // 清除当前决策的触发状态，以便重新展示
  triggeredDecisions.clear();
  for (const id of newTriggered) {
    triggeredDecisions.add(id);
  }

  // 重新显示该决策
  const dp = decisionPoints[decisionEntry.dpId];
  if (dp) {
    clearDecisionCue();
    gameVideo.pause();
    isPlayingNode = false;
    hideDecisionPanel();
    // 短暂延迟后显示，确保 transition 触发
    setTimeout(() => showDecisionPanel(decisionEntry.dpId, dp), 150);
    showToast("已回溯至「" + decisionEntry.label + "」", false);
  }
}

function clearDecisionCue() {
  if (decisionCueTimer) {
    clearTimeout(decisionCueTimer);
    decisionCueTimer = null;
  }
}

function resolveNodeAfterPlayback(nodeId) {
  const node = gameNodes[nodeId];
  if (!node || !isPlayingNode) return;

  isPlayingNode = false;
  if (node.nextDecision) {
    const dp = decisionPoints[node.nextDecision];
    if (dp) showDecisionPanel(node.nextDecision, dp);
  } else if (node.nextNode) {
    setTimeout(() => playNode(node.nextNode, true), 100);
  } else if (node.ending) {
    const endData = endings[node.ending];
    if (endData) showEnding(node.ending, endData);
  }
}

function scheduleDecisionCue(nodeId) {
  clearDecisionCue();
  const node = gameNodes[nodeId];
  if (!node || !node.decisionCue) return;

  decisionCueTimer = setTimeout(() => {
    if (currentNodeId !== nodeId || isDecisionPanelActive()) return;
    resolveNodeAfterPlayback(nodeId);
  }, node.decisionCue * 1000);
}

function playNode(nodeId, tryAutoplay = false, startAtOverride = null) {
  const path = getVideoPath(nodeId);
  if (!path) {
    console.error("Unknown node:", nodeId);
    return;
  }

  currentNodeId = nodeId;
  currentVideoPath = path;
  isPlayingNode = true;
  clearDecisionCue();
  hideDecisionPanel();

  // 添加到游戏路径
  if (gamePath.length === 0 || gamePath[gamePath.length - 1].type !== "video" || gamePath[gamePath.length - 1].nodeId !== nodeId) {
    gamePath.push({ type: "video", nodeId, duration: null, lastTime: 0 });
  }
  renderProgressBar();

  // 切换到游戏画面
  home.classList.add("is-hidden");
  game.classList.add("is-active");
  setGameActiveState(true);
  window.scrollTo({ top: 0, behavior: "instant" });

  // 显示加载提示
  const loadingEl = document.querySelector("[data-video-loading]");
  if (loadingEl) loadingEl.classList.add("is-active");

  function hideLoading() {
    if (loadingEl) loadingEl.classList.remove("is-active");
  }

  const node = gameNodes[nodeId];

  pendingSeekTime = typeof startAtOverride === "number" && Number.isFinite(startAtOverride)
    ? Math.max(0, startAtOverride)
    : null;

  if (gameVideo.src !== new URL(path, window.location.href).href) {
    gameVideo.src = path;
    gameVideo.load();
  }

  function applyNodeStartAndCue() {
    updateCurrentVideoEntry({ duration: gameVideo.duration || null });
    const targetStart = pendingSeekTime ?? node.startAt;
    pendingSeekTime = null;
    if (typeof targetStart === "number" && Number.isFinite(targetStart)) {
      try {
        gameVideo.currentTime = targetStart;
      } catch {
        // Some browsers reject seeks before enough metadata is available.
      }
    }
    hideLoading();
    scheduleDecisionCue(nodeId);
  }

  scheduleDecisionCue(nodeId);

  if (tryAutoplay) {
    // 用户手势链中：尝试自动播放
    gameVideo.controls = false;
    const p = gameVideo.play();
    if (p !== undefined) {
      p.then(() => {
        hideLoading();
        syncVideoPauseUI();
      }).catch(() => {
        hideLoading();
        gameVideo.controls = true;
        syncVideoPauseUI();
      });
    }
    // loadedmetadata 兜底
    gameVideo.onloadedmetadata = applyNodeStartAndCue;
  } else {
    // 非用户手势：展示控件让用户手动播放
    gameVideo.controls = true;
    gameVideo.onloadedmetadata = applyNodeStartAndCue;
  }

  if (gameVideo.readyState >= 1) {
    applyNodeStartAndCue();
  }

  // 错误处理
  gameVideo.onerror = () => {
    hideLoading();
    gameVideo.controls = true;
    showToast("视频加载失败，已进入文字决策模式", false);
    scheduleDecisionCue(nodeId);
  };
}

/** 视频播放结束 → 检查节点后续 */
function onNodeEnded() {
  if (!isPlayingNode) return;
  clearDecisionCue();
  resolveNodeAfterPlayback(currentNodeId);
}

gameVideo.addEventListener("ended", onNodeEnded);
gameVideo.addEventListener("play", syncVideoPauseUI);
gameVideo.addEventListener("pause", syncVideoPauseUI);
gameVideo.addEventListener("timeupdate", () => {
  updateCurrentVideoEntry({ lastTime: gameVideo.currentTime, duration: gameVideo.duration || null });
  renderProgressBar();
  saveProgress({ videoTime: gameVideo.currentTime, currentNodeId });
});
gameVideo.addEventListener("loadedmetadata", () => {
  updateCurrentVideoEntry({ duration: gameVideo.duration || null });
  renderProgressBar();
  syncVideoPauseUI();
});

if (videoPauseBtn) {
  videoPauseBtn.addEventListener("click", () => {
    if (gameVideo.paused) {
      gameVideo.play().catch(() => {
        gameVideo.controls = true;
        syncVideoPauseUI();
      });
    } else {
      gameVideo.pause();
    }
    syncVideoPauseUI();
  });
}

const progressBarEl = document.querySelector("[data-game-progress]");
if (progressBarEl) {
  progressBarEl.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("progress-marker")) return;
    isSeekingProgress = true;
    progressBarEl.setPointerCapture(e.pointerId);
    seekProgressFromPointer(e.clientX);
  });
  progressBarEl.addEventListener("pointermove", (e) => {
    if (!isSeekingProgress) return;
    seekProgressFromPointer(e.clientX);
  });
  progressBarEl.addEventListener("pointerup", (e) => {
    isSeekingProgress = false;
    if (progressBarEl.hasPointerCapture(e.pointerId)) progressBarEl.releasePointerCapture(e.pointerId);
  });
  progressBarEl.addEventListener("pointercancel", () => {
    isSeekingProgress = false;
  });
}

/* ── 进入游戏 ── */
document.querySelector("[data-enter-game]").addEventListener("click", () => {
  // 重置游戏状态
  triggeredDecisions.clear();
  gamePath = [];
  saveProgress({
    videoTime: 0,
    choices: [],
    stats: { archivesOpened: 0, cardsFlipped: 0, aiQuestions: 0, decisionsMade: 0 }
  });
  playNode("prologue_start", true);
});

/* ── 返回首页 ── */
document.querySelector("[data-back-home]").addEventListener("click", () => {
  gameVideo.pause();
  isPlayingNode = false;
  gamePath = [];
  game.classList.remove("is-active");
  home.classList.remove("is-hidden");
  setGameActiveState(false);
  window.scrollTo({ top: 0, behavior: "instant" });
  // 清空进度条
  if (progressSegments) progressSegments.innerHTML = "";
  if (progressCursor) progressCursor.style.left = "0%";
  if (progressTrack) progressTrack.querySelectorAll(".progress-marker").forEach(m => m.remove());
});

/* ═══════════════════════════════════════════════
   决策点引擎 (video-ended 触发)
   ═══════════════════════════════════════════════ */

const decisionPanel = document.querySelector("[data-decision-panel]");
const decisionTitle = document.querySelector("[data-decision-title]");
const decisionDesc = document.querySelector("[data-decision-desc]");
const decisionChoices = document.querySelector("[data-decision-choices]");

let activeDecisionId = null;
const triggeredDecisions = new Set();

function isDecisionPanelActive() {
  return decisionPanel && decisionPanel.classList.contains("is-active");
}

if (decisionPanel) {
  decisionPanel.setAttribute("aria-hidden", "true");
  decisionPanel.inert = true;
}

function showDecisionPanel(dpId, dp) {
  if (triggeredDecisions.has(dpId)) return;

  triggeredDecisions.add(dpId);
  activeDecisionId = dpId;

  // 添加到游戏路径
  gamePath.push({ type: "decision", dpId, label: dp.title, nodeId: currentNodeId });
  renderProgressBar();

  decisionTitle.textContent = dp.title;
  decisionDesc.textContent = dp.description;
  decisionChoices.innerHTML = "";
  // 清除结局样式
  decisionPanel.classList.remove("is-ending", "is-good-ending", "is-bad-ending");
  const badge = decisionPanel.querySelector(".decision-badge");
  if (badge) {
    badge.textContent = "";
    badge.hidden = true;
  }

  dp.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "decision-choice-btn";
    btn.innerHTML = `
      <span class="decision-choice-text">
        <strong>${choice.text}</strong>
      </span>
    `;
    btn.addEventListener("click", () => handleChoice(dp, choice));
    decisionChoices.appendChild(btn);
  });

  // 恢复默认提示
  const hint = decisionPanel.querySelector(".decision-hint");
  if (hint) hint.textContent = "在当下做出你的判断";

  // 入场动画
  const card = decisionPanel.querySelector(".decision-card");
  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "decisionIn 0.6s var(--ease-spring) both";

  decisionPanel.classList.add("is-active");
  decisionPanel.setAttribute("aria-hidden", "false");
  decisionPanel.inert = false;
  gameVideo.pause();
}

function hideDecisionPanel() {
  decisionPanel.classList.remove("is-active", "is-ending", "is-good-ending", "is-bad-ending");
  decisionPanel.setAttribute("aria-hidden", "true");
  decisionPanel.inert = true;
  activeDecisionId = null;
}

function handleChoice(dp, choice) {
  const progress = getProgress();
  progress.choices.push({
    decisionId: activeDecisionId,
    chosen: choice.text,
    goto: choice.goto,
    timestamp: new Date().toISOString()
  });
  progress.stats.decisionsMade = (progress.stats.decisionsMade || 0) + 1;
  saveProgress(progress);

  hideDecisionPanel();

  // 播放下一个节点视频
  if (choice.goto && gameNodes[choice.goto]) {
    playNode(choice.goto, true);
  }

  showToast(`你选择了"${choice.text}"`, false);
}

/* ── 结局展示 ── */
function showEnding(endId, endData) {
  const isGood = endData.type === "good";

  decisionTitle.textContent = endData.title;
  decisionDesc.textContent = isGood ? "这一路的选择，终于汇入更辽阔的河声。" : "故事在这里停住，但你的下一次选择仍会留下痕迹。";
  decisionChoices.innerHTML = "";

  const panelBadge = decisionPanel.querySelector(".decision-badge");
  if (panelBadge) {
    panelBadge.hidden = false;
    panelBadge.textContent = isGood ? "归档结局" : "未竟之路";
  }

  const endingScene = document.createElement("div");
  endingScene.className = "ending-scene";

  const seal = document.createElement("div");
  seal.className = "ending-seal" + (isGood ? " ending-seal-good" : " ending-seal-bad");
  const sealMark = document.createElement("span");
  sealMark.textContent = endData.badge;
  const sealLabel = document.createElement("small");
  sealLabel.textContent = isGood ? "胜利回响" : "此路留痕";
  seal.append(sealMark, sealLabel);

  const record = document.createElement("div");
  record.className = "ending-record";
  const recordLabel = document.createElement("div");
  recordLabel.className = "ending-record-label";
  recordLabel.textContent = "个人行迹";
  const recordText = document.createElement("p");
  recordText.textContent = endData.description;
  record.append(recordLabel, recordText);
  endingScene.append(seal, record);
  decisionChoices.appendChild(endingScene);

  // 操作按钮
  const actions = document.createElement("div");
  actions.className = "ending-actions";

  // 返回首页
  const homeBtn = document.createElement("button");
  homeBtn.className = "decision-choice-btn ending-home-btn";
  homeBtn.innerHTML = `<span class="decision-choice-text"><strong>返回首页</strong><span>回到运河入口</span></span>`;
  homeBtn.addEventListener("click", () => {
    hideDecisionPanel();
    gamePath = [];
    game.classList.remove("is-active");
    home.classList.remove("is-hidden");
    setGameActiveState(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (progressSegments) progressSegments.innerHTML = "";
    if (progressCursor) progressCursor.style.left = "0%";
    if (progressTrack) progressTrack.querySelectorAll(".progress-marker").forEach(m => m.remove());
  });
  actions.appendChild(homeBtn);

  // 查看报告
  const reportBtn = document.createElement("button");
  reportBtn.className = "decision-choice-btn ending-report-btn";
  reportBtn.innerHTML = `<span class="decision-choice-text"><strong>查看我的征途鉴</strong><span>生成本轮档案</span></span>`;
  reportBtn.addEventListener("click", () => {
    hideDecisionPanel();
    openReport();
  });
  actions.appendChild(reportBtn);

  decisionChoices.appendChild(actions);

  // 更换提示文字
  const hint = decisionPanel.querySelector(".decision-hint");
  if (hint) {
    hint.textContent = isGood ? "运河之水奔流不息，英雄精神代代相传" : "每一次选择都是成长，重新来过，书写不同的结局";
  }

  // 结局样式
  decisionPanel.classList.add("is-active", "is-ending");
  decisionPanel.classList.add(isGood ? "is-good-ending" : "is-bad-ending");
  decisionPanel.setAttribute("aria-hidden", "false");
  decisionPanel.inert = false;

  const card = decisionPanel.querySelector(".decision-card");
  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "decisionIn 0.6s var(--ease-spring) both";

  // 保存结局信息
  const progress = getProgress();
  saveProgress({ ending: { id: endId, ...endData, timestamp: new Date().toISOString() } });
}

/* ═══════════════════════════════════════════════
   全局遮罩
   ═══════════════════════════════════════════════ */

const globalOverlay = document.querySelector("[data-global-overlay]");

function showOverlay() {
  globalOverlay.classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

function hideOverlay() {
  globalOverlay.classList.remove("is-visible");
  document.body.style.overflow = "";
}

globalOverlay.addEventListener("click", () => {
  closeAllFeatures();
});

/* ═══════════════════════════════════════════════
   1. AI 交互系统 — DeepSeek API 驱动
   ═══════════════════════════════════════════════ */

const aiFloatBtn = document.querySelector(".ai-float-btn");
const aiDialog = document.querySelector("#ai-dialog");
const aiChatBody = document.querySelector("[data-ai-chat-body]");
const aiInput = document.querySelector("[data-ai-input]");
const aiSend = document.querySelector("[data-ai-send]");
const aiQuickBtns = document.querySelectorAll("[data-ai-quick]");

// 对话历史（发送给 API）
let aiMessageHistory = [];
const AI_MAX_HISTORY = 10;

function addMessage(type, text) {
  const msg = document.createElement("div");
  msg.className = `ai-message ai-${type}`;
  const p = document.createElement("p");
  p.textContent = text;
  msg.appendChild(p);
  aiChatBody.appendChild(msg);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

// 添加加载中指示器
function addLoadingMsg() {
  const msg = document.createElement("div");
  msg.className = "ai-message ai-system ai-loading-msg";
  msg.innerHTML = '<span class="ai-typing-dots"><span></span><span></span><span></span></span>';
  aiChatBody.appendChild(msg);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
  return msg;
}

async function handleAIQuery(input) {
  const trimmed = input.trim();
  if (!trimmed) return;

  addMessage("user", trimmed);
  aiInput.value = "";
  aiInput.disabled = true;
  aiSend.disabled = true;

  const loadingEl = addLoadingMsg();
  trackAction("aiQuestions");

  // 添加到历史
  aiMessageHistory.push({ role: "user", content: trimmed });
  if (aiMessageHistory.length > AI_MAX_HISTORY) {
    aiMessageHistory = aiMessageHistory.slice(-AI_MAX_HISTORY);
  }

  try {
    const apiUrl = (typeof DEPLOY_CONFIG !== "undefined" && DEPLOY_CONFIG.apiBase) || "/api/chat";
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: aiMessageHistory })
    });

    const data = await resp.json();

    // 移除加载指示器
    loadingEl.remove();

    if (data.error) {
      addMessage("system", "抱歉，AI 服务暂时不可用：" + data.error);
    } else if (data.content) {
      addMessage("system", data.content);
      aiMessageHistory.push({ role: "assistant", content: data.content });
      if (aiMessageHistory.length > AI_MAX_HISTORY) {
        aiMessageHistory = aiMessageHistory.slice(-AI_MAX_HISTORY);
      }
    } else {
      addMessage("system", "AI 返回了空响应，请再试一次。");
    }
  } catch (err) {
    loadingEl.remove();
    // API 不可用时的本地回退
    const localResult = findBestAnswerLocal(trimmed);
    addMessage("system", localResult.answer + "\n\n（离线模式，AI 服务启动后将提供更智能的回答）");
  }

  aiInput.disabled = false;
  aiSend.disabled = false;
  aiInput.focus();
}

/* ── 本地关键词回退 ── */
function normalizeQuestion(input) {
  let result = input.trim();
  if (typeof synonymMap !== "undefined") {
    for (const [slang, standard] of Object.entries(synonymMap)) {
      result = result.replace(new RegExp(slang, "g"), standard);
    }
  }
  return result;
}

function findBestAnswerLocal(input) {
  const q = normalizeQuestion(input);
  if (!q) return { answer: "请再说一遍？" };

  const lowerQ = q.toLowerCase();
  let best = null;
  let bestScore = 0;

  if (typeof qaDatabase !== "undefined") {
    for (const entry of qaDatabase) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lowerQ.includes(kw.toLowerCase())) score += kw.length;
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
  }

  if (best && bestScore >= 2) {
    return { question: q, answer: best.answer, matched: best.question };
  }
  const fallback = typeof fallbackAnswers !== "undefined"
    ? fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)]
    : "运河两岸的故事，三天三夜也说不完。同志，你有什么想问的？";
  return { question: q, answer: fallback, matched: null };
}

aiSend.addEventListener("click", () => {
  handleAIQuery(aiInput.value);
});

aiInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleAIQuery(aiInput.value);
  }
});

aiQuickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleAIQuery(btn.dataset.aiQuick);
  });
});

function openAI() {
  aiDialog.showModal();
  setTimeout(() => aiInput.focus(), 400);
}

function closeAI() {
  aiDialog.close();
}

document.querySelector("[data-close-ai]").addEventListener("click", closeAI);

/* ═══════════════════════════════════════════════
   2. 历史档案库 — 横向卷轴
   ═══════════════════════════════════════════════ */

const timelineOverlay = document.querySelector("#timeline-overlay");
const scrollTrackEl = document.querySelector("[data-scroll-track]");

function openTimeline() {
  timelineOverlay.classList.add("is-visible");
  showOverlay();
  trackAction("archivesOpened");
  renderTimeline();
}

function closeTimeline() {
  timelineOverlay.classList.remove("is-visible");
  hideOverlay();
  const cards = scrollTrackEl.querySelectorAll("[data-scroll-card]");
  cards.forEach((c) => c.classList.remove("is-revealed"));
  // 重置卡片区滚动
  const cardTrack = scrollTrackEl.querySelector(".archive-card-track");
  if (cardTrack) cardTrack.scrollLeft = 0;
}

document.querySelector("[data-close-timeline]").addEventListener("click", closeTimeline);

/* ═══════════════════════════════════════════════
   3. 人物资料库 — 翻转卡牌 + 筛选
   ═══════════════════════════════════════════════ */

const charactersOverlay = document.querySelector("#characters-overlay");
let currentCharacterFilter = "all";

function setCharacterFilter(filter) {
  currentCharacterFilter = filter;
  // 更新筛选标签 active 状态
  document.querySelectorAll("[data-filter-btn]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filterBtn === filter);
  });
  renderCharacters(filter);
  // 重新触发入场动画
  setTimeout(() => {
    document.querySelectorAll("[data-flip-card]").forEach((card, i) => {
        setTimeout(() => card.classList.add("is-revealed"), i * 60);
    });
  }, 100);
}

function renderFilterTabs() {
  const container = document.querySelector("[data-filter-tabs]");
  if (!container) return;
  container.innerHTML = `
    <button class="filter-tab is-active" type="button" data-filter-btn="all">全部</button>
    <button class="filter-tab" type="button" data-filter-btn="real">真实人物</button>
    <button class="filter-tab" type="button" data-filter-btn="adapted">剧情化</button>
    <button class="filter-tab" type="button" data-filter-btn="fictional">虚构</button>
  `;
  container.querySelectorAll("[data-filter-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setCharacterFilter(btn.dataset.filterBtn));
  });
}

function openCharacters() {
  charactersOverlay.classList.add("is-visible");
  showOverlay();
  currentCharacterFilter = "all";
  renderFilterTabs();
  renderCharacters("all");
  setTimeout(() => {
    const cards = document.querySelectorAll("[data-flip-card]");
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add("is-revealed"), i * 80);
    });
  }, 200);
}

function closeCharacters() {
  charactersOverlay.classList.remove("is-visible");
  hideOverlay();
  currentCharacterFilter = "all";
  document.querySelectorAll("[data-flip-card]").forEach((c) => {
    c.classList.remove("is-revealed", "is-flipped");
  });
}

document.querySelector("[data-close-characters]").addEventListener("click", closeCharacters);

/* ═══════════════════════════════════════════════
   4. 个人报告 — 古风书信 · 动态数据
   ═══════════════════════════════════════════════ */

const reportOverlay = document.querySelector("#report-overlay");
const letterSeal = document.querySelector("[data-letter-seal]");
const letterPaper = document.querySelector("[data-letter-paper]");

function getTitleFromChoices() {
  const progress = getProgress();

  // 如果有结局，直接使用结局信息
  if (progress.ending) {
    return { title: progress.ending.title, desc: progress.ending.description.split("。")[0] + "。" };
  }

  if (!progress.choices || progress.choices.length === 0) {
    return { title: "运河新兵", desc: "你的运河之旅才刚刚开始。" };
  }

  const choiceText = (progress.choices || []).map(c => c.chosen).join(" ");
  if (/村民|护民|守护|护送|掩护/.test(choiceText)) {
    return { title: "运河守护者", desc: "你的选择更常指向保护同伴与百姓。" };
  }
  if (/正面|爆破|带路|留下/.test(choiceText)) {
    return { title: "烽火先行者", desc: "你的选择更常指向主动承担与正面行动。" };
  }
  if (/谨慎|中间|请示|普通人/.test(choiceText)) {
    return { title: "沉稳行路人", desc: "你的选择更常指向审慎判断与稳妥推进。" };
  }

  const count = progress.stats.decisionsMade || 0;
  if (count >= 7) {
    return { title: "运河卫士", desc: "你亲历了运河支队从组建到胜利的完整历程。" };
  } else if (count >= 5) {
    return { title: "烽火行者", desc: "你在战火中一步步成长，运河见证了你的勇气。" };
  } else if (count >= 3) {
    return { title: "初露锋芒", desc: "你已经做出了几个关键选择，运河之路仍在继续。" };
  }
  return { title: "运河新兵", desc: "你的运河之旅才刚刚开始。" };
}

function getReportInsights(progress) {
  const choices = progress.choices || [];
  const stats = progress.stats || {};
  const chosenText = choices.map(c => c.chosen).join(" ");
  const lines = [];

  if (!choices.length) {
    lines.push("你还没有留下剧情抉择记录，档案将以初始身份生成。进入游戏并完成选择后，这里会变成更完整的个人轨迹。");
  } else {
    lines.push(`你已经完成 ${choices.length} 次剧情抉择。系统记录到，你的行动并非单纯追求胜负，而是在恐惧、责任与同伴之间不断权衡。`);
  }

  if (/村民|护民|守护|护送|掩护/.test(chosenText)) {
    lines.push("你的档案关键词是“守护”：面对危险时，你更倾向于先保住人，再推进任务。");
  } else if (/正面|爆破|带路|留下/.test(chosenText)) {
    lines.push("你的档案关键词是“担当”：关键时刻，你更愿意站到前面，把风险接到自己手里。");
  } else if (/谨慎|中间|请示|普通人/.test(chosenText)) {
    lines.push("你的档案关键词是“审慎”：你会先确认路线、队伍和后果，再做决定。");
  } else {
    lines.push("你的档案关键词是“初入烽火”：当前记录还不多，但已经开始形成属于你的运河路线。");
  }

  if (stats.archivesOpened || stats.cardsFlipped) {
    const parts = [];
    if (stats.archivesOpened) parts.push(`${stats.archivesOpened} 次历史档案`);
    if (stats.cardsFlipped) parts.push(`${stats.cardsFlipped} 次人物卡`);
    lines.push(`你查阅过 ${parts.join("、")}，这些资料正在把剧情选择与真实人物、真实地点连接起来。`);
  }
  if (stats.aiQuestions) lines.push(`你向 AI 智囊提问过 ${stats.aiQuestions} 次，说明你在用追问补全剧情背后的史实。`);
  if (progress.ending) lines.push(`本轮结局记录为“${progress.ending.title}”。`);

  return lines;
}

function getCompletion(progress) {
  const decisionCount = progress.stats && progress.stats.decisionsMade ? progress.stats.decisionsMade : 0;
  if (progress.ending) return 100;
  return Math.min(95, Math.max(12, decisionCount * 14 + (progress.videoTime ? 8 : 0)));
}

function generateReportContent() {
  const progress = getProgress();
  const stats = progress.stats || {};
  const titleInfo = getTitleFromChoices();
  const insights = getReportInsights(progress);
  const completion = getCompletion(progress);
  const referenceViews = (stats.archivesOpened || 0) + (stats.cardsFlipped || 0);

  return `
    <div class="letter-head">
      <span>个人体验档案</span>
      <small>本轮行动轨迹摘要</small>
    </div>
    <div class="letter-body">
      <p>同志您好：</p>
      <p>这份档案依据您在《运河支队日记》中的剧情抉择、资料查阅、提问与结局记录生成。它记录的不是胜负分数，而是您在战火情境中的判断方式。</p>
      <div class="letter-stats">
        <div class="letter-stat">
          <strong>${stats.decisionsMade || 0}</strong>
          <span>已记录选择</span>
        </div>
        <div class="letter-stat">
          <strong>${referenceViews}</strong>
          <span>资料查看</span>
        </div>
        <div class="letter-stat">
          <strong>${completion}%</strong>
          <span>剧情完成度</span>
        </div>
      </div>
      ${insights.map(line => `<p>${line}</p>`).join("")}
      <p class="report-title-line">本轮称号：<strong>${titleInfo.title}</strong></p>
      <p>${titleInfo.desc}</p>
      <p class="letter-sign">运河支队日记 项目组<br/>敬上</p>
    </div>
  `;
}

function showReportGenerator() {
  const letterInner = letterPaper.querySelector(".letter-inner");
  const letterBadge = letterPaper.querySelector("[data-letter-badge]");
  letterInner.innerHTML = `
    <div class="letter-head">
      <span>个人体验档案</span>
      <small>生成本轮行动轨迹</small>
    </div>
    <div class="letter-body report-generate-body">
      <p>系统将读取本机保存的剧情选择、资料查看、AI 提问与结局记录，整理成本轮个人体验档案。</p>
      <button class="generate-report-btn" type="button" data-generate-report>生成我的档案</button>
    </div>
  `;
  if (letterBadge) letterBadge.innerHTML = "";
  const generateBtn = letterInner.querySelector("[data-generate-report]");
  if (generateBtn) generateBtn.addEventListener("click", renderGeneratedReport);
}

function renderGeneratedReport() {
  const letterInner = letterPaper.querySelector(".letter-inner");
  const letterBadge = letterPaper.querySelector("[data-letter-badge]");
  const titleInfo = getTitleFromChoices();
  letterInner.innerHTML = generateReportContent();
  if (letterBadge) {
    letterBadge.innerHTML = `
      <div class="badge-medal">
        <span class="badge-icon">档</span>
        <strong>${titleInfo.title}</strong>
        <small>${titleInfo.desc}</small>
      </div>
    `;
  }
}

function openReport() {
  reportOverlay.classList.add("is-visible");
  showOverlay();

  showReportGenerator();

  letterPaper.style.animation = "none";
  letterPaper.offsetHeight;
  letterPaper.style.animation = "letterUnfold 0.8s 0.2s var(--ease-out) both";
}

function closeReport() {
  reportOverlay.classList.remove("is-visible");
  hideOverlay();
}

document.querySelector("[data-close-report]").addEventListener("click", closeReport);

/* ═══════════════════════════════════════════════
   环境音效
   ═══════════════════════════════════════════════ */

const ambientAudio = document.querySelector("[data-ambient-audio]");
const audioToggle = document.querySelector("[data-audio-toggle]");
const audioIcon = audioToggle ? audioToggle.querySelector(".audio-icon") : null;
const audioToggleInline = document.querySelector("[data-audio-toggle-inline]");
const audioIconInline = audioToggleInline ? audioToggleInline.querySelector(".audio-icon-inline") : null;
let audioEnabled = false;

function syncAudioUI() {
  const icon = audioEnabled ? "🔊" : "🔇";
  if (audioIcon) audioIcon.textContent = icon;
  if (audioIconInline) audioIconInline.textContent = icon;
  if (audioToggle) audioToggle.classList.toggle("is-on", audioEnabled);
  if (audioToggleInline) audioToggleInline.classList.toggle("is-on", audioEnabled);
}

function toggleAudio() {
  if (!ambientAudio) return;
  audioEnabled = !audioEnabled;
  if (audioEnabled) {
    ambientAudio.volume = 0.15;
    ambientAudio.play().catch(() => {});
  } else {
    ambientAudio.pause();
  }
  syncAudioUI();
  saveProgress({ audioEnabled });
}

if (audioToggle) audioToggle.addEventListener("click", toggleAudio);
if (audioToggleInline) audioToggleInline.addEventListener("click", toggleAudio);

// 恢复音频设置
const savedProgress = getProgress();
if (savedProgress.audioEnabled && ambientAudio) {
  audioEnabled = true;
  ambientAudio.volume = 0.15;
  syncAudioUI();
  setTimeout(() => {
    ambientAudio.play().catch(() => {});
  }, 1000);
}

/* ═══════════════════════════════════════════════
   功能入口路由
   ═══════════════════════════════════════════════ */

const featureMap = {
  ai: openAI,
  timeline: openTimeline,
  characters: openCharacters,
  report: openReport,
};

document.querySelectorAll("[data-feature]").forEach((btn) => {
  const feature = btn.dataset.feature;
  const handler = featureMap[feature];
  if (handler) {
    btn.addEventListener("click", handler);
  }
});

/* ═══════════════════════════════════════════════
   全局关闭
   ═══════════════════════════════════════════════ */

function closeAllFeatures() {
  if (isDecisionPanelActive()) { hideDecisionPanel(); if (!isPlayingNode) { gameVideo.play().catch(() => {}); } }
  if (aiDialog.open) closeAI();
  if (timelineOverlay.classList.contains("is-visible")) closeTimeline();
  if (charactersOverlay.classList.contains("is-visible")) closeCharacters();
  if (reportOverlay.classList.contains("is-visible")) closeReport();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (isDecisionPanelActive()) {
      const isEnding = decisionPanel.classList.contains("is-ending");
      hideDecisionPanel();
      if (!isEnding && !isPlayingNode) { gameVideo.play().catch(() => {}); }
      return;
    }
    if (aiDialog.open) { closeAI(); return; }
    if (timelineOverlay.classList.contains("is-visible")) { closeTimeline(); return; }
    if (charactersOverlay.classList.contains("is-visible")) { closeCharacters(); return; }
    if (reportOverlay.classList.contains("is-visible")) { closeReport(); return; }
  }
});

/* ═══════════════════════════════════════════════
   启动
   ═══════════════════════════════════════════════ */

initPage();
