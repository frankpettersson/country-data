loaders: [
  {
    test: /\.(eot|otf|woff|woff2|ttf)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]'
      }
    }
  }
];
