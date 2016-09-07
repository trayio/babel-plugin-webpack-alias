
[![Build Status](https://travis-ci.org/trayio/babel-plugin-webpack-alias.svg?branch=master)](https://travis-ci.org/trayio/babel-plugin-webpack-alias)
[![codecov](https://codecov.io/gh/trayio/babel-plugin-webpack-alias/branch/master/graph/badge.svg)](https://codecov.io/gh/trayio/babel-plugin-webpack-alias)
[![Stable version](https://img.shields.io/npm/v/babel-plugin-webpack-alias.svg?style=flat)](https://www.npmjs.com/package/babel-plugin-webpack-alias)
[![Downloads](https://img.shields.io/npm/dm/babel-plugin-webpack-alias.svg?style=flat)](https://npm-stat.com/charts.html?package=babel-plugin-webpack-alias)
[![Gemnasium](https://img.shields.io/gemnasium/trayio/babel-plugin-webpack-alias.svg)](https://gemnasium.com/github.com/trayio/babel-plugin-webpack-alias)

# babel-plugin-webpack-alias

This Babel 6 plugin allows you to use webpack aliases in Babel.

This plugin is simply going to take the aliases defined in your webpack config and replace require paths. It is especially useful when you rely on webpack aliases to keep require paths nicer (and sometimes more consistent depending on your project configuration) but you can't use webpack in a context, for example for unit testing.

If you are having issues while making this plugin work, have a look at the [examples](/examples) folder. Play with them, mix your own config in, and feel free to [open an issue](https://github.com/trayio/babel-plugin-webpack-alias/issues/new)!

## Example
With the following `webpack.config.js`:
```js
module.exports = {
    ...
    resolve: {
        alias: {
            'my-alias': path.join(__dirname, '/alias-folder/js/'),
            'library-name': './library-folder/folder'
        }
    }
    ...
};
```
A javascript file before compilation:
```js
var MyModule = require('my-alias/src/lib/MyModule');
import MyImport from 'library-name/lib/import/MyImport';
```
will become:
```js
var MyModule = require('../../alias-folder/js/lib/MyModule');
import MyImport from '../../library-folder/folder/lib/import/MyImport';
```
This is an example but the plugin will output the relative path depending on the position of the file and the alias folder.

## Install

```console
$ npm install --save-dev babel-plugin-webpack-alias
```

Add it as a plugin to your `.babelrc` file. You can optionally add a path to a config file, for example:
```json
{
   "presets":[ "react", "es2015", "stage-0" ],
   "env": {
    "test": {
      "plugins": [
        [ "babel-plugin-webpack-alias", { "config": "./webpack.config.test.js" } ]
      ]
    }
  }
}
```
In this case, the plugin will only be run when `NODE_ENV` is set to `test`.

## Configuration path

It is also possible to pass a findConfig option, and the plugin will attempt to find the nearest configuration file within the project using [find-up](https://github.com/sindresorhus/find-up). For example:
```json
{
   "presets":[ "react", "es2015", "stage-0" ],
   "env": {
    "test": {
      "plugins": [
        [ "babel-plugin-webpack-alias", {
            "config": "webpack.config.test.js",
            "findConfig": true
          } ]
      ]
    }
  }
}
```

You can also use environment variable to build a path to your webpack configuration file using [lodash template](https://lodash.com/docs#template), for example:
```json
{
   "presets":[ "react", "es2015", "stage-0" ],
   "env": {
    "test": {
      "plugins": [
        [ "babel-plugin-webpack-alias", {
            "config": "${PWD}/webpack.config.test.js"
          }
        ]
      ]
    }
  }
}
```
And run with:
```console
$ PWD=$(pwd) NODE_ENV=test ava
```
