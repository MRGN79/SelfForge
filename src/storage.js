const KEYS = {
  habits: 'selfforge_habits',
  logs: 'selfforge_logs',
  profile: 'selfforge_profile',
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Habits
export function getHabits() {
  return read(KEYS.habits) ?? []
}

export function saveHabits(habits) {
  write(KEYS.habits, habits)
}

// Logs
export function getLogs() {
  return read(KEYS.logs) ?? []
}

export function saveLogs(logs) {
  write(KEYS.logs, logs)
}

// Profile
export function getProfile() {
  return read(KEYS.profile) ?? { name: '', createdAt: new Date().toISOString() }
}

export function saveProfile(profile) {
  write(KEYS.profile, profile)
}
