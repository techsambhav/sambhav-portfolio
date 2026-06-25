// Global mute flag stored in window to communicate across components
declare global {
  interface Window {
    isSoundMuted?: boolean;
  }
}

if (typeof window !== 'undefined') {
  window.isSoundMuted = true;
}

export function toggleGlobalMute(): boolean {
  return true;
}

export function isGlobalMuted(): boolean {
  return true;
}

export function playUISound(..._args: any[]) {
  // Sound system disabled by user request
  return;
}
