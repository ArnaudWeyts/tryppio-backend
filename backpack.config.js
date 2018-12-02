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

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    });

    config.plugins.push(new Dotenv());

    return config;
  }
};
