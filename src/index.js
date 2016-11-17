
import { join, resolve, relative, isAbsolute, dirname, basename, sep } from 'path';
import fs from 'fs';
import { StringLiteral } from 'babel-types';
import template from 'lodash.template';
import some from 'lodash.some';
import findUp from 'find-up';

const DEFAULT_CONFIG_NAMES = ['webpack.config.js', 'webpack.config.babel.js'];

function fileExists(path) {
    try {
        return !fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
}

function getConfigPath(configPaths, findConfig) {
    let conf = null;

    // Try all config paths and return for the first found one
    some(configPaths, configPath => {
        if(!configPath) return;

        // Compile config using environment variables
        const compiledConfigPath = template(configPath)(process.env);

        let resolvedConfigPath;
        if(!findConfig) {
            // Get webpack config
            resolvedConfigPath = resolve(process.cwd(), compiledConfigPath);
        } else {
            resolvedConfigPath = findUp.sync(compiledConfigPath);
        }

        if(resolvedConfigPath && fileExists(resolvedConfigPath)) {
            conf = resolvedConfigPath;
        }

        return conf;
    });

    return conf;
}

export default function({ types: t }) {
    return {
        visitor: {
            CallExpression(path, {file: { opts: { filename } }, opts: { config: configPath, findConfig: findConfig = false, noOutputExtension = false } = {} }) {
                const configPaths = configPath ? [configPath, ...DEFAULT_CONFIG_NAMES] : DEFAULT_CONFIG_NAMES;

                // Get webpack config
                const confPath = getConfigPath(
                    configPaths,
                    findConfig
                );

                // If the config comes back as null, we didn't find it, so throw an exception.
                if(!confPath) {
                    throw new Error(`Cannot find any of these configuration files: ${configPaths.join(', ')}`);
                }

                // Because of babel-register, babel is actually run on webpack config files using themselves
                // as config, leading to odd errors
                if(filename === resolve(confPath)) return;

                // Require the config
                let conf = require(confPath);

                // if the object is empty, we might be in a dependency of the config - bail without warning
                if (!Object.keys(conf).length) {
                    return;
                }

                // In the case the webpack config is an es6 config, we need to get the default
                if (conf && conf.__esModule && conf.default) {
                    conf = conf.default;
                }

                // exit if there's no alias config and the config is not an array
                if(!(conf.resolve && conf.resolve.alias) && !Array.isArray(conf)) {
                    throw new Error('The resolved config file doesn\'t contain a resolve configuration');
                }

                // Get the webpack alias config
                let aliasConf;
                let extensionsConf;

                if (Array.isArray(conf)) {
                    // the exported webpack config is an array ...
                    // (i.e., the project is using webpack's multicompile feature) ...

                    // reduce the configs to a single alias object
                    aliasConf = conf.reduce((prev, curr) => {
                        const next = Object.assign({}, prev);
                        if (curr.resolve && curr.resolve.alias) {
                            Object.assign(next, curr.resolve.alias);
                        }
                        return next;
                    }, {});

                    // if the object is empty, bail
                    if (!Object.keys(aliasConf).length) {
                        return;
                    }

                    // reduce the configs to a single extensions array
                    extensionsConf = conf.reduce((prev, curr) => {
                        const next = [].concat(prev);
                        if (curr.resolve && curr.resolve.extensions && curr.resolve.extensions.length) {
                            curr.resolve.extensions.forEach(ext => {
                                if (next.indexOf(ext) === -1) {
                                    next.push(ext);
                                }
                            });
                        }
                        return next;
                    }, []);

                    if (!extensionsConf.length) {
                        extensionsConf = null;
                    }
                } else {
                    // the exported webpack config is a single object...

                    // use it's resolve.alias property
                    aliasConf = conf.resolve.alias;

                    // use it's resolve.extensions property, if available
                    extensionsConf =
                        (conf.resolve.extensions && conf.resolve.extensions.length) ?
                        conf.resolve.extensions :
                        null;
                }

                const { callee: { name: calleeName }, arguments: args } = path.node;

                // Exit if it's not a require statement
                if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
                    return;
                }

                // Get the path of the StringLiteral
                const [{ value: filePath }] = args;

                for(const aliasFrom in aliasConf) {
                    if(aliasConf.hasOwnProperty(aliasFrom)) {

                        let aliasTo = aliasConf[aliasFrom];
                        const regex = new RegExp(`^${aliasFrom}(\/|$)`);

                        // If the regex matches, replace by the right config
                        if(regex.test(filePath)) {

                            // notModuleRegExp from https://github.com/webpack/enhanced-resolve/blob/master/lib/Resolver.js
                            const notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
                            const isModule = !notModuleRegExp.test(aliasTo);

                            if(isModule) {
                                path.node.arguments = [StringLiteral(aliasTo)];
                                return;
                            }

                            // If the filepath is not absolute, make it absolute
                            if(!isAbsolute(aliasTo)) {
                                aliasTo = join(process.cwd(), aliasTo);
                            }
                            let relativeFilePath = relative(dirname(filename), aliasTo).split(sep).join('/');

                            // In case the file path is the root of the alias, need to put a dot to avoid having an absolute path
                            if(relativeFilePath.length === 0) {
                                relativeFilePath = '.';
                            }

                            let requiredFilePath = filePath.replace(aliasFrom, relativeFilePath);

                            // In the unfortunate case of a file requiring the current directory which is the alias, we need to add
                            // an extra slash
                            if(requiredFilePath === '.') {
                                requiredFilePath = './';
                            }

                            // In the case of a file requiring a child directory of the current directory, we need to add a dot slash
                            if (['.','/'].indexOf(requiredFilePath[0]) === -1) {
                                requiredFilePath = `./${requiredFilePath}`;
                            }

                            // In case the extension option is passed
                            if(extensionsConf && !noOutputExtension) {
                                // Get an absolute path to the file
                                const absoluteRequire = join(aliasTo, basename(filePath));

                                let extension = null;
                                some(extensionsConf, ext => {
                                    if(!ext) return;

                                    // If the file with this extension exists set it
                                    if(fileExists(absoluteRequire + ext)) {
                                        extension = ext;
                                    }

                                    return extension;
                                });

                                // Set the extension to the file path, or keep the original one
                                requiredFilePath += extension || '';
                            }

                            path.node.arguments = [StringLiteral(requiredFilePath)];
                            return;
                        }
                    }
                }
            },
        },
    };
}
