export function currentPath(location) {
  var path = decodeURI(window.location[location].slice(1).split('?')[0]);
  if (path.charAt(0) !== '/') {
    return `/${path}`;
  } else {
    return path;
  }
}

export function removeTrailingSlash(path) {
  if (path === '/') {
    return path;
  } else {
    return path.slice(-1) !== '/' ? path : path.slice(0, -1);
  }
}

export function formatPathRegex(basePath, path) {
  return `${removeTrailingSlash(basePath + path)}/?`;
}

export function createRegexFromPaths(paths) {
  return new RegExp(`^${paths.join('|')}$`);
}

export function getSwitch(path, {children, basePath}) {
  var consistentPath = removeTrailingSlash(path);
  var switches = [].concat(children || []);
  return switches.filter(child => {
    var childPaths = [].concat(child.props.path).map(childPath => formatPathRegex(basePath, childPath));
    var regex = createRegexFromPaths(childPaths);
    return regex.test(consistentPath);
  })[0] || null;
}
