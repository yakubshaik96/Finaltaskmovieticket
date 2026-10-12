// Demo-only password hashing for the frontend-only auth flow.
// PBKDF2-SHA256 via Web Crypto with a per-user random salt. This keeps plain-text
// passwords out of localStorage, but it is NOT a substitute for server-side auth:
// anyone with access to the browser profile can still read and tamper with the data.
const ITERATIONS = 150000

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
const fromHex = (hex) => Uint8Array.from(hex.match(/.{2}/g) || [], (h) => parseInt(h, 16))

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ])
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256)
  return new Uint8Array(bits)
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derive(password, salt, ITERATIONS)
  return { salt: toHex(salt), hash: toHex(hash), iterations: ITERATIONS }
}

export async function verifyPassword(password, record) {
  if (!record?.salt || !record?.hash) return false
  const hash = toHex(await derive(password, fromHex(record.salt), record.iterations || ITERATIONS))
  if (hash.length !== record.hash.length) return false
  let diff = 0
  for (let i = 0; i < hash.length; i += 1) diff |= hash.charCodeAt(i) ^ record.hash.charCodeAt(i)
  return diff === 0
}
