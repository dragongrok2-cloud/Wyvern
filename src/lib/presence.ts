/**
 * Presence of a rider in the lair.
 * Keep this tiny and isomorphic so UI and sockets can share it.
 */

export type PresenceStatus = "online" | "flying" | "dnd" | "offline";

export const PRESENCE_LABELS: Record<PresenceStatus, string> = {
  online: "В логове",
  flying: "Улетел полетать",
  dnd: "Не беспокоить дракона",
  offline: "В пещере",
};

export const PRESENCE_DOT: Record<PresenceStatus, string> = {
  online: "bg-emerald-400",
  flying: "bg-amber-400",
  dnd: "bg-rose-500",
  offline: "bg-zinc-500",
};

export function isAvailable(status: PresenceStatus): boolean {
  return status === "online" || status === "flying";
}

export function nextPresence(current: PresenceStatus): PresenceStatus {
  const order: PresenceStatus[] = ["online", "flying", "dnd", "offline"];
  const i = order.indexOf(current);
  return order[(i + 1) % order.length];
}
