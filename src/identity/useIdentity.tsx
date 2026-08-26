import { useState, useCallback, useEffect } from 'react';
import { ensureIdentity, markBackupConfirmed, loadIdentity, type StoredIdentity } from './storage';

let _identity: StoredIdentity | null = null;
const _listeners = new Set<() => void>();

function notifyListeners() {
  _listeners.forEach(fn => fn());
}

export function initIdentity(): Promise<StoredIdentity> {
  return ensureIdentity().then(id => {
    _identity = id;
    notifyListeners();
    return id;
  });
}

export function resetIdentityCache(): void {
  _identity = null;
  notifyListeners();
}

export function useIdentity() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const rerender = () => setTick(t => t + 1);
    _listeners.add(rerender);
    return () => { _listeners.delete(rerender); };
  }, []);

  const confirmBackup = useCallback(() => {
    _identity = markBackupConfirmed();
    notifyListeners();
  }, []);

  const identity = _identity ?? loadIdentity()!;
  const needsBackup = !identity?.backupConfirmedAt;

  return { identity, needsBackup, confirmBackup };
}
