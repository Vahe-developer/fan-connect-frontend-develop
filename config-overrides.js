const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins');

module.exports = function override(config, env) {

    config.plugins[0].options.title = process.env.REACT_APP_PAGE_TITLE
    config.plugins[0].options.TITLE_FAVICON = process.env.TITLE_FAVICON

    if (env !== 'development') {
        config.plugins.push(
            new BugsnagSourceMapUploaderPlugin({
                apiKey: '4b49fe27ae496a80109b51431d9ef346',
                appVersion: process.env.REACT_APP_CURRENT_GIT_SHA,
                publicPath: 'https://*myfan.co',
                overwrite: true

            })
        );
    }

    return config;
};
