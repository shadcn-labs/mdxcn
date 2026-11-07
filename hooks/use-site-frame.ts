"use client"

import { useSyncExternalStore } from "react"

import type { GraphFrame } from "@/components/graphs"

const FRAME_STORAGE_KEY = "graph-frame"
const FRAME_EVENT = "graph-frame"
const FRAMES: readonly GraphFrame[] = ["box", "corners", "rule", "none"]

function isFrame(value: unknown): value is GraphFrame {
  return FRAMES.includes(value as GraphFrame)
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(FRAME_EVENT, onStoreChange)
  window.addEventListener("storage", onStoreChange)

  return () => {
    window.removeEventListener(FRAME_EVENT, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

/** Holds the choice when storage is blocked, for the life of the page. */
let picked: GraphFrame | null = null

function getSnapshot(): GraphFrame {
  if (picked) {
    return picked
  }

  try {
    const stored = localStorage.getItem(FRAME_STORAGE_KEY)
    return isFrame(stored) ? stored : "box"
  } catch {
    return "box"
  }
}

function getServerSnapshot(): GraphFrame {
  return "box"
}

/** The frame picked on the site, shared by every page and kept across visits. */
function useSiteFrame(): GraphFrame {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function setSiteFrame(frame: GraphFrame) {
  picked = frame
  try {
    localStorage.setItem(FRAME_STORAGE_KEY, frame)
  } catch {
    // Storage blocked: `picked` keeps the choice until the next load.
  }
  window.dispatchEvent(new Event(FRAME_EVENT))
}

export { FRAMES, setSiteFrame, useSiteFrame }
