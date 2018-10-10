module.exports = {
  chainWebpack: (config) => {
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
  },
};