import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import autoprefixer from 'autoprefixer';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

const lintConfig = {
  enforce: 'pre',
  test: /\.js$/,
  use: 'eslint-loader',
};

const styleConfig = [
  isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: {
        safe: true,
      },
    },
  },
];

const pluginsConfig = [
  new webpack.NoEmitOnErrorsPlugin(),
  new CleanWebpackPlugin(['build'], {
    root: path.resolve(`${__dirname}`),
    verbose: false,
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: `${__dirname}/public/index.html`,
  }),
];

if (isProduction) {
  styleConfig.push({
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9',
          ],
        }),
      ],
    },
  });
  pluginsConfig.pop();
  pluginsConfig.push(
    new MiniCssExtractPlugin({
      filename: 'static/css/style.[hash:8].css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new CopyWebpackPlugin([
      {
        from: `${__dirname}/public/favicon.ico`,
        to: `${__dirname}/build/favicon.ico`,
      },
    ]),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      test: /\.(js|css)$/,
      algorithm: 'gzip',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: `${__dirname}/public/index.html`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  );
}

export default {
  mode: isProduction ? 'production' : 'development',
  entry: {
    index: [
      path.resolve(`${__dirname}/src/index.css`),
      path.resolve(`${__dirname}/src/index.js`),
    ],
  },
  output: {
    path: path.resolve(`${__dirname}/build`),
    filename: isProduction ? 'static/js/[name].[hash:8].js' : 'static/js/[name].js',
  },
  stats: {
    entrypoints: false,
    version: false,
    colors: true,
    modules: false,
    children: false,
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss'],
  },
  devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
  target: 'web',
  plugins: pluginsConfig,
  devServer: {
    stats: {
      assets: false,
      entrypoints: false,
      version: false,
      colors: true,
      hash: false,
      modules: false,
    },
  },
  module: {
    rules: [
      isProduction ? {} : lintConfig,
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.resolve(`${__dirname}/node_modules/`),
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [...styleConfig, 'sass-loader'],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              name: isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]',
              outputPath: 'static/img/',
              publicPath: './static/img',
            },
          },
        ],
      },
    ],
  },
};
