import { Buffer } from 'buffer';
import process from 'process';

(globalThis as unknown as Record<string, unknown>).Buffer = Buffer;
(globalThis as unknown as Record<string, unknown>).process = process;
