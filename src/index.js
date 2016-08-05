
import { join, resolve, relative, isAbsolute, dirname } from 'path';
import { StringLiteral } from 'babel-types';
import template from 'lodash.template';
import findUp from 'find-up';

function getConfig(configPath, findConfig) {
    // Compile config using environment variables
    const compiledConfigPath = template(configPath)(process.env);

    var conf;
    if(!findConfig) {
        // Get webpack config
        conf = require(resolve(process.cwd(), compiledConfigPath));
    } else {
        conf = require(findUp.sync(compiledConfigPath));
    }

    return conf;
}

export default function({ types: t }) {
    return {
        visitor: {
            CallExpression(path, { file: { opts: { filename: filename } }, opts: { config: configPath = 'webpack.config.js', findConfig: findConfig = false } = {} }) {

                // Get webpack config
                const conf = getConfig(configPath, findConfig);

                // If the config comes back as null, we didn't find it, so throw an exception.
                if(conf === null) {
                    throw new Error('Cannot find configuration file: ' + configPath);
                }

                // exit if there's no alias config
                if(!conf.resolve || !conf.resolve.alias) {
                    return;
                }

                // Get the webpack alias config
                const aliasConf = conf.resolve.alias;

                const { callee: { name: calleeName }, arguments: args } = path.node;

                // Exit if it's not a require statement
                if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
                    return;
                }

                // Get the path of the StringLiteral
                const [{ value: filePath }] = args;

                for(let aliasFrom in aliasConf) {
                    if(aliasConf.hasOwnProperty(aliasFrom)) {

                        let aliasTo = aliasConf[aliasFrom];
                        let regex = new RegExp(`^${aliasFrom}(\/|$)`);

                        // If the regex matches, replace by the right config
                        if(regex.test(filePath)) {

                            // notModuleRegExp from https://github.com/webpack/enhanced-resolve/blob/master/lib/Resolver.js
                            const notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
                            let isModule = !notModuleRegExp.test(aliasTo);

                            if(isModule) {
                                path.node.arguments = [StringLiteral(aliasTo)];
                                return;
                            }

                            // If the filepath is not absolute, make it absolute
                            if(!isAbsolute(aliasTo)) {
                                aliasTo = join(process.cwd(), aliasTo);
                            }
                            let relativeFilePath = relative(dirname(filename), aliasTo).replace(/\\/g, '/');

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
                                requiredFilePath = './' + requiredFilePath;
                            }

                            path.node.arguments = [StringLiteral(requiredFilePath)];
                            return;
                        }
                    }
                }
            }
        }
    };
}
