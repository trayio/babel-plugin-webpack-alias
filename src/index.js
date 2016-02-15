
import { join, resolve, relative, isAbsolute, dirname } from 'path';
import { StringLiteral } from 'babel-types';

export default function({ types: t }) {
    return {
        visitor: {
            CallExpression(path, { file: { opts: { filename: filename } }, opts: { config: configPath = './webpack.config.js' } = {} }) {

                // Get webpack config
                const conf = require(resolve(process.cwd(), configPath));

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
                        // If the filepath is not absolute, make it absolute
                        if(!isAbsolute(aliasTo)) {
                            aliasTo = join(process.cwd(), aliasTo);
                        }

                        let regex = new RegExp(`^${aliasFrom}`);

                        // If the regex matches, replace by the right config
                        if(regex.test(filePath)) {
                            path.node.arguments = [StringLiteral(filePath.replace(aliasFrom, relative(dirname(filename), aliasTo)))];
                            return;
                        }
                    }
                }
            }
        }
    };
}
