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

export function replaceDynamicSegments(path) {
  return path.replace(/\/:[^\/]+/g, '/([^/]+)');
}

export function getDynamicSegmentNames(path) {
  var dynamicSegementNames = path.match(/:[^\/]+/g) || [];
  return dynamicSegementNames.map(name => name.substr(1));
}

export function formatPathRegex(basePath, path) {
  return replaceDynamicSegments(`${removeTrailingSlash(basePath + path)}/?`);
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

export function getDynamicSegments(path, basePath, swtch) {
  var dynamicValues = {};
  var consistentPath = removeTrailingSlash(path);
  if (swtch) {
    [].concat(swtch.props.path).forEach(childPath => {
      var dynamicSegments = getDynamicSegmentNames(basePath + childPath);
      var regexStr = formatPathRegex(basePath, childPath);
      var matches = consistentPath.match(new RegExp(`^${regexStr}$`));
      if (matches) {
        matches.shift();
        dynamicSegments.forEach((segment, index) => {
          dynamicValues[segment] = matches[index];
        });
      }
    });
  }
  return dynamicValues;
}
