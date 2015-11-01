#!/bin/bash -e

npm run build-examples
git subtree push --prefix examples origin gh-pages
