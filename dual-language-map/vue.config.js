const CompressionWebpackPlugin = require('compression-webpack-plugin');

const isProduction = () => process.env.NODE_ENV === 'production';

const setSvgRule = config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
        .use('vue-svg-loader')
        .loader('vue-svg-loader')
        .tap(options => {
            return Object.assign({}, options, { 
                svgo: {
                    plugins: [
                        {removeDoctype: true},
                        {removeComments: true},
                        {cleanupIDs: false}
                    ]
                }
            });
        });
    return svgRule;
};

const setGzipRule = config => {
    const gzipRule = config.plugin('gzip');
    gzipRule.use(new CompressionWebpackPlugin({
        filename: '[file]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    }));
    return gzipRule;
};

const setCSVRule = config => {
    const csvRule = config.module.rule('csv');
    csvRule.uses.clear();
    csvRule
        .test(/\.csv$/)
        .use("csv-loader")
        .loader("csv-loader")
        .options({
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
        })
        .end();
};

module.exports = {
    chainWebpack: config => {
        const svgRule = setSvgRule(config);
        const csvRule = setCSVRule(config);

        if (isProduction()) {
            const gzipRule = setGzipRule(config);
        }
    },
    publicPath: './',
};