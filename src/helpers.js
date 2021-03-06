import { Children } from 'react';

export function currentPath(location) {
  const [windowLocation, paramString] = window.location[location]
    .slice(1)
    .split('?');
  const params = (paramString || '')
    .split('&')
    .map(param => param.split('='))
    .reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {});

  const path = decodeURI(windowLocation);
  return path.charAt(0) !== '/'
    ? { path: `/${path}`, params }
    : { path, params };
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
  const dynamicSegementNames = path.match(/:[^\/]+/g) || [];
  return dynamicSegementNames.map(name => name.substr(1));
}

export function formatPathRegex(basePath, path) {
  return replaceDynamicSegments(`${removeTrailingSlash(basePath + path)}/?`);
}

export function createRegexFromPaths(paths) {
  return new RegExp(`^(${paths.join('|')})$`);
}

export function getSwitch(path, { children, basePath }) {
  const consistentPath = removeTrailingSlash(path);
  const switches = Children.toArray(children);
  return (
    switches.filter(child => {
      const childPaths = []
        .concat(child.props.path)
        .map(childPath => formatPathRegex(basePath, childPath));
      const regex = createRegexFromPaths(childPaths);
      return regex.test(consistentPath);
    })[0] || null
  );
}

export function getActivePath(currentPath, basePath, currentSwitch) {
  if (!currentSwitch) {
    return null;
  }

  const consistentPath = removeTrailingSlash(currentPath);
  const paths = [].concat(currentSwitch.props.path);
  return (
    paths.filter(path => {
      const formattedPath = formatPathRegex(basePath, path);
      const regex = new RegExp(`^${formattedPath}$`);
      return regex.test(consistentPath);
    })[0] || null
  );
}

export function getDynamicSegments(path, basePath, swtch) {
  const dynamicValues = {};
  const consistentPath = removeTrailingSlash(path);
  if (swtch) {
    [].concat(swtch.props.path).forEach(childPath => {
      const dynamicSegments = getDynamicSegmentNames(basePath + childPath);
      const regexStr = formatPathRegex(basePath, childPath);
      const matches = consistentPath.match(new RegExp(`^${regexStr}$`));
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
