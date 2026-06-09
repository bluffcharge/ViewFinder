"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { newScreenId } from "@/lib/board";

/** Form-side representation of a screen — source links stay as one
 *  textarea string (one URL per line) until save. */
export type ScreenDraft = {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  group: string;
  sourceLinksText: string;
};

export function emptyScreenDraft(): ScreenDraft {
  return {
    id: newScreenId(),
    path: "",
    title: "",
    subtitle: "",
    group: "",
    sourceLinksText: "",
  };
}

export function ScreensEditor({
  screens,
  onChange,
}: {
  screens: ScreenDraft[];
  onChange: (screens: ScreenDraft[]) => void;
}) {
  const update = (id: string, patch: Partial<ScreenDraft>) =>
    onChange(screens.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => onChange(screens.filter((s) => s.id !== id));
  const move = (id: string, dir: -1 | 1) => {
    const i = screens.findIndex((s) => s.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= screens.length) return;
    const next = [...screens];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {screens.map((s, i) => (
        <fieldset
          key={s.id}
          className="rounded-xl border border-border bg-card p-3.5"
        >
          <div className="mb-2.5 flex items-center justify-between">
            <legend className="t-mono-label float-left">
              Screen {String(i + 1).padStart(2, "0")}
            </legend>
            <div className="flex items-center gap-1">
              <IconBtn
                label="Move up"
                disabled={i === 0}
                onClick={() => move(s.id, -1)}
              >
                <ArrowUp size={12} strokeWidth={1.85} />
              </IconBtn>
              <IconBtn
                label="Move down"
                disabled={i === screens.length - 1}
                onClick={() => move(s.id, 1)}
              >
                <ArrowDown size={12} strokeWidth={1.85} />
              </IconBtn>
              <IconBtn
                label="Remove screen"
                disabled={screens.length === 1}
                onClick={() => remove(s.id)}
              >
                <Trash2 size={12} strokeWidth={1.85} />
              </IconBtn>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field
              label="Path or URL"
              required
              placeholder="/leads or https://…"
              value={s.path}
              onChange={(v) => update(s.id, { path: v })}
              mono
            />
            <Field
              label="Title"
              required
              placeholder="Leads — overview"
              value={s.title}
              onChange={(v) => update(s.id, { title: v })}
            />
            <Field
              label="Subtitle"
              placeholder="What's on this screen, in a phrase"
              value={s.subtitle}
              onChange={(v) => update(s.id, { subtitle: v })}
            />
            <Field
              label="Group"
              placeholder="e.g. Leads — screens in a group share a pip color"
              value={s.group}
              onChange={(v) => update(s.id, { group: v })}
            />
          </div>

          <label className="mt-2.5 block">
            <span className="t-mono-label">Source files — one URL per line</span>
            <textarea
              value={s.sourceLinksText}
              onChange={(e) => update(s.id, { sourceLinksText: e.target.value })}
              placeholder={"https://github.com/you/repo/blob/main/src/Screen.jsx"}
              rows={s.sourceLinksText ? 3 : 1}
              spellCheck={false}
              className="mt-1.5 w-full resize-y rounded-[12px] border border-border bg-canvas px-3 py-2 font-mono text-[11.5px] text-ink-body placeholder:text-ink-disabled"
            />
          </label>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => onChange([...screens, emptyScreenDraft()])}
        className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
      >
        <Plus size={12} strokeWidth={1.85} />
        Add screen
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="t-mono-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={[
          "mt-1.5 h-9 w-full rounded-[12px] border border-border bg-canvas px-3 text-[13px] text-ink-body placeholder:text-ink-disabled",
          mono ? "font-mono text-[12px]" : "",
        ].join(" ")}
      />
    </label>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
