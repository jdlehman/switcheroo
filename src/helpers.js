export function ensureTrailingSlash(path) {
  return path.slice(-1) !== '/' ? `${path}/` : path;
}
