// Diese Datei macht nur eines: Frage finden, Tipp finden, StopIndex bestimmen
import type { Message } from "../../common/types";

const isDev = import.meta.env.DEV;

export function getQuestionIndex(messages: Message[], chapterLabel?: string): number {
  const idx = messages.findIndex(
    (m) => m.type === "main" && m.kind === "amy-question"
  );

  if (idx === -1 && isDev) {
    console.warn("[story] amy-question missing", chapterLabel ?? "");
  }

  return idx;
}

export function getTipIndex(messages: Message[], chapterLabel?: string): number {
  const idx = messages.findIndex(
    (m) => m.type === "main" && m.kind === "amy-tip"
  );

  if (idx === -1 && isDev) {
    console.warn("[story] amy-tip missing", chapterLabel ?? "");
  }

  return idx;
}

export function getStopIndex(messages: Message[], chapterLabel?: string): number {
  const q = getQuestionIndex(messages, chapterLabel);
  if (q === -1) return messages.length;
  return q + 1;
}

export function getQuestionText(messages: Message[], chapterLabel?: string): string {
  const q = getQuestionIndex(messages, chapterLabel);
  return q >= 0 ? messages[q].content ?? "" : "";
}

export function getTipText(messages: Message[], chapterLabel?: string): string {
  const t = getTipIndex(messages, chapterLabel);
  return t >= 0 ? messages[t].content ?? "" : "";
}