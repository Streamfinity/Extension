module.exports = {
    inputs: ['./package.json'],
    output: 'licenses/licenses.txt',
    overwrite: true,
    lineEnding: undefined,
    omitVersions: true,
    append: [
        './licenses/microsoft-fluentui-emoji.txt',
    ],
    replace: {
        'bare-path@2.1.0': './node_modules/bare-path/LICENSE',
        'echarts@5.5.0': './node_modules/echarts/LICENSE',
        'rc@1.2.8': './node_modules/rc/LICENSE.MIT',
    },
};
