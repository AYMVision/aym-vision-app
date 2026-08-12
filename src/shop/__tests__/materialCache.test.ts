import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import 'fake-indexeddb/auto';

vi.mock('../../identity/handshake', () => ({
  aymFetch: vi.fn(),
}));

import { aymFetch } from '../../identity/handshake';
import { getMaterial, checkForUpdate, clearMaterial } from '../materialCache';

const PROFILE_ID = 'test-profile-123';
const COURSE_ID = 's1e01';

const BUNDLE = { courseId: COURSE_ID, version: 'v1', payload: { scenes: [] } };

describe('materialCache', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await clearMaterial(COURSE_ID, PROFILE_ID);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and stores on cache miss', async () => {
    vi.mocked(aymFetch).mockResolvedValueOnce(
      new Response(JSON.stringify(BUNDLE), { status: 200 })
    );

    const result = await getMaterial(COURSE_ID, PROFILE_ID);
    expect(result).toMatchObject({ courseId: COURSE_ID, version: 'v1' });
    expect(aymFetch).toHaveBeenCalledTimes(1);
  });

  it('returns cached bundle without network on cache hit', async () => {
    vi.mocked(aymFetch).mockResolvedValueOnce(
      new Response(JSON.stringify(BUNDLE), { status: 200 })
    );
    await getMaterial(COURSE_ID, PROFILE_ID);

    vi.clearAllMocks();

    const result = await getMaterial(COURSE_ID, PROFILE_ID);
    expect(result).toMatchObject({ courseId: COURSE_ID, version: 'v1' });
    expect(aymFetch).not.toHaveBeenCalled();
  });

  it('returns null for 403 (not owner)', async () => {
    vi.mocked(aymFetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
    const result = await getMaterial(COURSE_ID, PROFILE_ID);
    expect(result).toBeNull();
  });

  it('checkForUpdate returns false when versions match', async () => {
    vi.mocked(aymFetch)
      .mockResolvedValueOnce(new Response(JSON.stringify(BUNDLE), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ version: 'v1' }), { status: 200 }));
    await getMaterial(COURSE_ID, PROFILE_ID);

    const needsUpdate = await checkForUpdate(COURSE_ID, PROFILE_ID);
    expect(needsUpdate).toBe(false);
  });

  it('checkForUpdate returns true when server has newer version', async () => {
    vi.mocked(aymFetch)
      .mockResolvedValueOnce(new Response(JSON.stringify(BUNDLE), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ version: 'v2' }), { status: 200 }));
    await getMaterial(COURSE_ID, PROFILE_ID);

    const needsUpdate = await checkForUpdate(COURSE_ID, PROFILE_ID);
    expect(needsUpdate).toBe(true);
  });

  it('checkForUpdate returns false when no cache exists', async () => {
    vi.mocked(aymFetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ version: 'v1' }), { status: 200 })
    );
    const needsUpdate = await checkForUpdate(COURSE_ID, PROFILE_ID);
    expect(needsUpdate).toBe(false);
  });
});
