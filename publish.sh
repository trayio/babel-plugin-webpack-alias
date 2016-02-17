#!/usr/bin/env sh

rm -rf node_modules

npm install &&
npm test &&
npm version ${1:-patch} &&
npm run build

npm publish

git push origin master --follow-tags
