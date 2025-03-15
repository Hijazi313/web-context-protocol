const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const targetBrowser = env.browser || process.env.TARGET_BROWSER || 'chrome';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      background: './src/background/index.ts',
      content: './src/content/index.ts',
      popup: './src/popup/index.tsx',
      options: './src/options/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist', targetBrowser),
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: targetBrowser === 'safari' ? './src/safari/Info.plist' : './src/manifest.json',
            to: targetBrowser === 'safari' ? 'Info.plist' : 'manifest.json',
            transform(content) {
              if (targetBrowser === 'firefox') {
                const manifest = JSON.parse(content.toString());
                
                // Firefox doesn't support service_worker type in manifest v3
                if (manifest.background && manifest.background.type === 'module') {
                  delete manifest.background.type;
                }
                
                return JSON.stringify(manifest, null, 2);
              }
              return content;
            },
          },
          { from: './src/assets', to: 'assets', noErrorOnMissing: true },
          ...(targetBrowser === 'safari' ? [
            { from: './src/safari', to: '.', globOptions: { ignore: ['**/Info.plist'] } }
          ] : []),
        ],
      }),
      new HtmlWebpackPlugin({
        template: './src/popup/index.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new HtmlWebpackPlugin({
        template: './src/options/index.html',
        filename: 'options.html',
        chunks: ['options'],
      }),
      new HtmlWebpackPlugin({
        template: './src/background/index.html',
        filename: 'background.html',
        chunks: ['background'],
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({ filename: '[name].css' })] : []),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: chunk => chunk.name !== 'content',
          },
        },
      },
    },
  };
}; 