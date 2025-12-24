// src/ai/transformersConfig.ts
import { env } from '@xenova/transformers';

env.allowRemoteModels = false;              // keine Remote-Modelle
env.localModelPath = '/models';             // Modelle liegen in public/models
env.backends.onnx.wasm.wasmPaths = '/wasm/'; // WASM liegt in public/wasm
