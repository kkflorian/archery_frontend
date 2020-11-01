const CracoLessPlugin = require('craco-less');
const webpack = require('webpack')

module.exports = {
    webpack: {
        plugins: [
          new webpack.EnvironmentPlugin(["API_URL"])
        ]
    },

    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        javascriptEnabled: true,
                        modifyVars: {
                            'primary-color': '#ff4d4f',
                            'link-color': '#ff4d4f',
                        },
                    },
                },
            }
        },
        {
            plugin: CracoLessPlugin,
            options: {
                modifyLessRule: function(lessRule, _context) {
                    lessRule.test = /\.(module)\.(less)$/;
                    lessRule.exclude = /node_modules/;
                    return lessRule;
                },
                lessLoaderOptions: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
                cssLoaderOptions: {
                    modules: {
                        localIdentName: "[local]_[hash:base64:5]"
                    }
                }
            }
        }
    ]
};