import { Children } from 'react';

// http://stackoverflow.com/a/2117523
export function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function currentPath(location) {
  const path = decodeURI(window.location[location].slice(1).split('?')[0]);
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
