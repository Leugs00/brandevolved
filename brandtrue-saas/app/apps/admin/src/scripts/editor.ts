// Visual editor controller: talks to the preview iframe (postMessage) and the
// admin JSON API. All writes go through the API as the logged-in user — RLS is
// the real gatekeeper; this UI only hides what a role can't do anyway.

interface FieldDef {
  type: string;
  label: string;
  options?: string[];
  item?: Record<string, FieldDef>;
}
interface BlockDefLite {
  label: string;
  description: string;
  fields: Record<string, FieldDef>;
}
interface Block {
  id: string;
  kind: string;
  data: Record<string, any>;
  locked: boolean;
  position: number;
}
interface Boot {
  siteId: string;
  page: { id: string; path: string; title: string; meta_description: string | null; status: string };
  blocks: Block[];
  defs: Record<string, BlockDefLite>;
  can: { structure: boolean; lock: boolean; meta: boolean; editLocked: boolean };
  previewUrl: string;
}

const boot: Boot = JSON.parse(document.getElementById("boot")!.textContent!);
const blocks = boot.blocks;
const iframe = document.getElementById("preview") as HTMLIFrameElement;
const saveState = document.getElementById("save-state")!;
const blockList = document.getElementById("block-list")!;
const blockEditor = document.getElementById("block-editor")!;
let selectedId: string | null = null;

const canEditBlock = (b: Block) => boot.can.editLocked || !b.locked;

function setState(text: string, error = false) {
  saveState.textContent = text;
  saveState.className = `ml-auto text-xs ${error ? "text-red-600 font-semibold" : "text-slate-400"}`;
  if (text === "Saved") setTimeout(() => (saveState.textContent === "Saved" ? (saveState.textContent = "") : null), 2000);
}

async function api(path: string, method: string, body?: unknown): Promise<any> {
  setState("Saving…");
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) {
    setState(out.error || "Save failed", true);
    throw new Error(out.error || "Save failed");
  }
  setState("Saved");
  return out;
}

const reloadPreview = () => iframe.contentWindow?.location.reload();

// ── block list panel ─────────────────────────────────────────
function renderBlockList() {
  blockList.innerHTML = "";
  blocks.sort((a, b) => a.position - b.position);
  blocks.forEach((block, i) => {
    const def = boot.defs[block.kind];
    const li = document.createElement("li");
    li.className = `flex items-center gap-1.5 rounded-lg border px-2 py-1.5 ${
      block.id === selectedId ? "border-teal-600 bg-teal-50" : "border-slate-200"
    }`;
    const name = document.createElement("button");
    name.className = "grow text-left truncate";
    name.textContent = def?.label ?? block.kind;
    name.onclick = () => select(block.id);
    li.appendChild(name);

    if (block.locked) {
      const lockBadge = document.createElement("span");
      lockBadge.textContent = "🔒";
      lockBadge.title = "Locked — clients and designers cannot edit";
      li.appendChild(lockBadge);
    }

    if (boot.can.lock) {
      const lockBtn = mini(block.locked ? "Unlock" : "Lock", async () => {
        await api(`/api/blocks/${block.id}`, "PATCH", { locked: !block.locked });
        block.locked = !block.locked;
        renderBlockList();
        reloadPreview();
      });
      li.appendChild(lockBtn);
    }
    if (boot.can.structure) {
      li.appendChild(
        mini("↑", async () => {
          const prev = blocks[i - 1];
          if (!prev) return;
          await swap(block, prev);
        }),
      );
      li.appendChild(
        mini("↓", async () => {
          const next = blocks[i + 1];
          if (!next) return;
          await swap(block, next);
        }),
      );
      li.appendChild(
        mini("✕", async () => {
          if (!confirm("Delete this block?")) return;
          await api(`/api/blocks/${block.id}`, "DELETE");
          blocks.splice(i, 1);
          if (selectedId === block.id) select(null);
          renderBlockList();
          reloadPreview();
        }),
      );
    }
    blockList.appendChild(li);
  });
}

function mini(label: string, onClick: () => void) {
  const b = document.createElement("button");
  b.className = "rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200";
  b.textContent = label;
  b.onclick = onClick;
  return b;
}

async function swap(a: Block, b: Block) {
  const [pa, pb] = [a.position, b.position];
  await api(`/api/blocks/${a.id}`, "PATCH", { position: pb === pa ? pa + 1 : pb });
  await api(`/api/blocks/${b.id}`, "PATCH", { position: pa });
  a.position = pb === pa ? pa + 1 : pb;
  b.position = pa;
  renderBlockList();
  reloadPreview();
}

// ── add block ────────────────────────────────────────────────
if (boot.can.structure) {
  document.getElementById("add-block")!.classList.remove("hidden");
  const sel = document.getElementById("add-kind") as HTMLSelectElement;
  for (const [kind, def] of Object.entries(boot.defs)) {
    const opt = document.createElement("option");
    opt.value = kind;
    opt.textContent = def.label;
    sel.appendChild(opt);
  }
  document.getElementById("add-btn")!.addEventListener("click", async () => {
    const out = await api("/api/blocks", "POST", { page_id: boot.page.id, kind: sel.value });
    const maxPos = Math.max(0, ...blocks.map((b) => b.position));
    blocks.push({ id: out.id, kind: sel.value, data: {}, locked: false, position: maxPos + 10 });
    renderBlockList();
    reloadPreview();
    select(out.id);
  });
}

// ── field editors ────────────────────────────────────────────
function select(id: string | null) {
  selectedId = id;
  renderBlockList();
  renderBlockEditor();
}

function renderBlockEditor() {
  const block = blocks.find((b) => b.id === selectedId);
  if (!block) {
    blockEditor.innerHTML = "Click a block in the preview to edit it. Text can be edited directly on the page.";
    return;
  }
  const def = boot.defs[block.kind];
  blockEditor.innerHTML = "";

  if (!canEditBlock(block)) {
    blockEditor.textContent = "This block is locked. Ask your agency to change it.";
    return;
  }

  const title = document.createElement("p");
  title.className = "font-semibold text-slate-700 mb-3";
  title.textContent = def?.label ?? block.kind;
  blockEditor.appendChild(title);

  if (!def) return;

  const form = document.createElement("div");
  form.className = "space-y-3";
  for (const [name, field] of Object.entries(def.fields)) {
    form.appendChild(fieldEditor(block, name, field));
  }

  const save = document.createElement("button");
  save.className = "w-full rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800";
  save.textContent = "Save block";
  save.onclick = () => saveBlock(block, true);
  form.appendChild(save);
  blockEditor.appendChild(form);
}

function fieldEditor(block: Block, name: string, field: FieldDef): HTMLElement {
  const wrap = document.createElement("label");
  wrap.className = "block";
  const caption = document.createElement("span");
  caption.className = "block text-xs text-slate-500 mb-1";
  caption.textContent = field.label;
  wrap.appendChild(caption);
  const inputCls = "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm";

  const value = block.data[name];

  if (field.type === "richtext") {
    const ta = document.createElement("textarea");
    ta.className = inputCls;
    ta.rows = 6;
    ta.value = String(value ?? "");
    ta.onchange = () => (block.data[name] = ta.value);
    wrap.appendChild(ta);
  } else if (field.type === "select") {
    const sel = document.createElement("select");
    sel.className = inputCls;
    for (const opt of field.options ?? []) {
      const o = document.createElement("option");
      o.value = o.textContent = opt;
      o.selected = value === opt;
      sel.appendChild(o);
    }
    sel.onchange = () => (block.data[name] = sel.value);
    wrap.appendChild(sel);
  } else if (field.type === "number") {
    const inp = document.createElement("input");
    inp.type = "number";
    inp.className = inputCls;
    inp.value = value != null ? String(value) : "";
    inp.onchange = () => (block.data[name] = Number(inp.value));
    wrap.appendChild(inp);
  } else if (field.type === "image") {
    wrap.appendChild(imageEditor(block, name, value));
  } else if (field.type === "list") {
    wrap.appendChild(listEditor(block, name, field));
  } else {
    const inp = document.createElement("input");
    inp.className = inputCls;
    inp.value = String(value ?? "");
    inp.onchange = () => (block.data[name] = inp.value);
    wrap.appendChild(inp);
  }
  return wrap;
}

function imageEditor(block: Block, name: string, value: any): HTMLElement {
  const box = document.createElement("div");
  box.className = "space-y-1.5";
  const preview = document.createElement("img");
  preview.className = "w-full rounded-lg border border-slate-200 max-h-32 object-cover";
  const src = value?.src;
  if (src) preview.src = src;
  else preview.style.display = "none";
  box.appendChild(preview);

  const file = document.createElement("input");
  file.type = "file";
  file.accept = "image/*";
  file.className = "w-full text-xs";
  file.onchange = async () => {
    const f = file.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("site_id", boot.siteId);
    fd.append("file", f);
    setState("Uploading…");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const out = await res.json();
    if (!res.ok) return setState(out.error || "Upload failed", true);
    block.data[name] = { src: out.url, alt: alt.value };
    preview.src = out.url;
    preview.style.display = "";
    await saveBlock(block, true);
  };
  box.appendChild(file);

  const alt = document.createElement("input");
  alt.className = "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs";
  alt.placeholder = "Alt text (describe the image)";
  alt.value = value?.alt ?? "";
  alt.onchange = () => (block.data[name] = { ...(block.data[name] ?? {}), alt: alt.value });
  box.appendChild(alt);
  return box;
}

function listEditor(block: Block, name: string, field: FieldDef): HTMLElement {
  const box = document.createElement("div");
  box.className = "space-y-2";
  const items: any[] = Array.isArray(block.data[name]) ? block.data[name] : (block.data[name] = []);

  const renderItems = () => {
    box.innerHTML = "";
    items.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "rounded-lg border border-slate-200 p-2 space-y-1.5";
      for (const [subName, subField] of Object.entries(field.item ?? {})) {
        if (subField.type === "image") {
          card.appendChild(imageEditorForItem(item, subName));
          continue;
        }
        const inp = document.createElement(subField.type === "richtext" ? "textarea" : "input");
        inp.className = "w-full rounded border border-slate-300 px-2 py-1 text-xs";
        (inp as HTMLInputElement).placeholder = subField.label;
        (inp as HTMLInputElement).value = String(item[subName] ?? "");
        inp.onchange = () => (item[subName] = (inp as HTMLInputElement).value);
        card.appendChild(inp);
      }
      const rm = document.createElement("button");
      rm.className = "text-xs text-red-500 hover:underline";
      rm.textContent = "Remove";
      rm.onclick = () => {
        items.splice(idx, 1);
        renderItems();
      };
      card.appendChild(rm);
      box.appendChild(card);
    });
    const add = document.createElement("button");
    add.className = "text-xs text-teal-700 font-semibold hover:underline";
    add.textContent = `+ Add ${field.label.replace(/s$/, "").toLowerCase()}`;
    add.onclick = () => {
      items.push({});
      renderItems();
    };
    box.appendChild(add);
  };
  renderItems();
  return box;
}

function imageEditorForItem(item: any, subName: string): HTMLElement {
  const file = document.createElement("input");
  file.type = "file";
  file.accept = "image/*";
  file.className = "w-full text-xs";
  file.onchange = async () => {
    const f = file.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("site_id", boot.siteId);
    fd.append("file", f);
    setState("Uploading…");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const out = await res.json();
    if (!res.ok) return setState(out.error || "Upload failed", true);
    item[subName] = { src: out.url, alt: f.name };
    setState("Saved");
  };
  return file;
}

async function saveBlock(block: Block, reload: boolean) {
  await api(`/api/blocks/${block.id}`, "PATCH", { data: block.data });
  if (reload) reloadPreview();
}

// ── messages from the preview iframe ─────────────────────────
window.addEventListener("message", (e) => {
  const msg = e.data;
  if (!msg || msg.source !== "be-editor") return;
  if (msg.type === "select") select(msg.blockId);
  if (msg.type === "field") {
    const block = blocks.find((b) => b.id === msg.blockId);
    if (!block || !canEditBlock(block)) return;
    block.data[msg.field] = msg.value;
    // inline edit: save without reloading (the page already shows the change)
    saveBlock(block, false);
    if (selectedId === block.id) renderBlockEditor();
  }
});

// ── page meta ────────────────────────────────────────────────
document.getElementById("meta-toggle")?.addEventListener("click", () => {
  document.getElementById("meta-panel")!.classList.toggle("hidden");
});
document.getElementById("meta-save")?.addEventListener("click", async () => {
  await api(`/api/pages/${boot.page.id}`, "PATCH", {
    title: (document.getElementById("meta-title") as HTMLInputElement).value,
    path: (document.getElementById("meta-path") as HTMLInputElement).value,
    meta_description: (document.getElementById("meta-desc") as HTMLInputElement).value,
    status: (document.getElementById("meta-status") as HTMLSelectElement).value,
  });
  reloadPreview();
});
document.getElementById("page-delete")?.addEventListener("click", async () => {
  if (!confirm("Delete this page and all its blocks?")) return;
  await api(`/api/pages/${boot.page.id}`, "DELETE");
  location.href = `/sites/${boot.siteId}/pages`;
});

renderBlockList();
