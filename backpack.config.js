const Dotenv = require('dotenv-webpack');

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = ['./src/main.ts'];

    config.resolve = {
      extensions: ['.ts', '.js', '.json']
    };

    config.module.rules.push({
      test: /\.ts$/,
      loader: 'ts-loader'
    });

    config.plugins.push(new Dotenv());
    return config;
  }
};
