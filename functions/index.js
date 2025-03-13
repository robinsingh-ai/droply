export { default as getChunksFromFile } from './getChunksFromFile';
export { default as getFileFromChunks } from './getFileFromChunks';
export { default as getFileTypeFromMIME } from './getFileTypeFromMIME';
export { default as getFileIconFromMIME } from './getFileIconFromMIME';
// Export a dummy FileChunker for server-side rendering
// The real one will be dynamically imported on the client side
export const FileChunker = typeof window !== 'undefined' 
  ? require('./fileChunker').default 
  : class DummyFileChunker {
      constructor() {
        throw new Error('FileChunker is only available in the browser');
      }
    };
export { default as throwToast } from './throwToast';
