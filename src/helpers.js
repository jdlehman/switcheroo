/* @flow */

import React, { Children } from 'react';

// http://stackoverflow.com/a/2117523
export function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c: string
  ) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function currentPath(location: string) {
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

export function removeTrailingSlash(path: string) {
  if (path === '/') {
    return path;
  } else {
    return path.slice(-1) !== '/' ? path : path.slice(0, -1);
  }
}

export function replaceDynamicSegments(path: string) {
  return path.replace(/\/:[^\/]+/g, '/([^/]+)');
}

export function getDynamicSegmentNames(path: string) {
  const dynamicSegementNames = path.match(/:[^\/]+/g) || [];
  return dynamicSegementNames.map(name => name.substr(1));
}

export function formatPathRegex(basePath: string, path: string) {
  return replaceDynamicSegments(`${removeTrailingSlash(basePath + path)}/?`);
}

export function createRegexFromPaths(paths: Array<string>) {
  return new RegExp(`^(${paths.join('|')})$`);
}

export function getSwitch(
  path: string,
  { children, basePath }: { children: React.Element<*>, basePath: string }
) {
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

export function getActivePath(
  currentPath: string,
  basePath: string,
  currentSwitch: ?React.Element<*>
) {
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

export function getDynamicSegments(
  path: string,
  basePath: string,
  swtch: ?React.Element<*>
) {
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
