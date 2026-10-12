import { describe, expect, it } from "vitest"
import { ROWS, allSeatIds, presetBooked, seatKey } from "../data/cinema"
import { comingSoon, getMovie, isBookable, nowShowing } from "../data/movies"
import { priceBreakdown } from "../lib/format"
import { hashPassword, verifyPassword } from "../lib/passwords"
import { validateConfirm, validateEmail, validateName, validatePassword } from "../lib/validation"

describe("price calculation", () => {
  it("sums seats, convenience fee and GST on the fee", () => {
    const seats = [{ price: 190 }, { price: 320 }, { price: 540 }]
    expect(priceBreakdown(seats)).toEqual({ subtotal: 1050, convenience: 96, gst: 17, total: 1163 })
  })

  it("is zero for an empty selection", () => {
    expect(priceBreakdown([]).total).toBe(0)
  })
})

describe("seat data", () => {
  it("has unique seat ids and the expected capacity", () => {
    const ids = allSeatIds()
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.length).toBe(ROWS.reduce((sum, row) => sum + row.count, 0))
  })

  it("pre-books a stable, non-empty subset for each show", () => {
    const key = seatKey({ movieId: "oppenheimer", theatreId: "pvr", date: "2026-10-12", time: "07:20 PM" })
    const a = presetBooked(key)
    expect([...a]).toEqual([...presetBooked(key)])
    expect(a.size).toBeGreaterThan(0)
    expect(a.size).toBeLessThan(allSeatIds().length)
  })

  it("keeps seat state separate per show", () => {
    const one = seatKey({ movieId: "a", theatreId: "pvr", date: "2026-10-12", time: "09:30 AM" })
    const two = seatKey({ movieId: "a", theatreId: "pvr", date: "2026-10-13", time: "09:30 AM" })
    expect(one).not.toBe(two)
  })
})

describe("movie data", () => {
  it("splits now showing from coming soon", () => {
    expect(nowShowing.length).toBeGreaterThan(0)
    expect(comingSoon.length).toBeGreaterThan(0)
    expect(isBookable(nowShowing[0])).toBe(true)
    expect(isBookable(comingSoon[0])).toBe(false)
    expect(getMovie("does-not-exist")).toBeUndefined()
  })
})

describe("validation", () => {
  it("validates names and emails", () => {
    expect(validateName("")).toBeTruthy()
    expect(validateName("Al")).toBe("")
    expect(validateEmail("nope")).toBeTruthy()
    expect(validateEmail("a@b")).toBeTruthy()
    expect(validateEmail("a@b.co")).toBe("")
  })

  it("enforces password rules and matching confirmation", () => {
    expect(validatePassword("short1")).toBeTruthy()
    expect(validatePassword("allletters")).toBeTruthy()
    expect(validatePassword("12345678")).toBeTruthy()
    expect(validatePassword("goodpass1")).toBe("")
    expect(validateConfirm("goodpass1", "goodpass2")).toBeTruthy()
    expect(validateConfirm("goodpass1", "goodpass1")).toBe("")
  })
})

describe("password hashing", () => {
  it("never contains the plain text and verifies correctly", async () => {
    const record = await hashPassword("goodpass1")
    expect(JSON.stringify(record)).not.toContain("goodpass1")
    expect(await verifyPassword("goodpass1", record)).toBe(true)
    expect(await verifyPassword("wrongpass1", record)).toBe(false)
  })

  it("uses a different salt every time", async () => {
    const a = await hashPassword("goodpass1")
    const b = await hashPassword("goodpass1")
    expect(a.salt).not.toBe(b.salt)
    expect(a.hash).not.toBe(b.hash)
  })
})
