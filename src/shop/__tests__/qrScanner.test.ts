import { describe, it, expect } from 'vitest';
import { parseVoucherInput } from '../qrScanner';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('parseVoucherInput', () => {
  it('accepts a raw UUID', () => {
    expect(parseVoucherInput(VALID_UUID)).toBe(VALID_UUID.toLowerCase());
  });

  it('accepts a raw UUID with uppercase letters', () => {
    expect(parseVoucherInput(VALID_UUID.toUpperCase())).toBe(VALID_UUID.toLowerCase());
  });

  it('accepts a URL with voucher query param', () => {
    expect(parseVoucherInput(`https://app.aym.de/redeem?voucher=${VALID_UUID}`)).toBe(VALID_UUID.toLowerCase());
  });

  it('accepts a URL with UUID in path', () => {
    expect(parseVoucherInput(`https://app.aym.de/redeem/${VALID_UUID}`)).toBe(VALID_UUID.toLowerCase());
  });

  it('returns null for empty input', () => {
    expect(parseVoucherInput('')).toBeNull();
  });

  it('returns null for garbage input', () => {
    expect(parseVoucherInput('hello world')).toBeNull();
    expect(parseVoucherInput('not-a-uuid')).toBeNull();
    expect(parseVoucherInput('12345')).toBeNull();
  });

  it('returns null for malformed UUID', () => {
    expect(parseVoucherInput('550e8400-e29b-41d4-a716-44665544000Z')).toBeNull();
  });
});
