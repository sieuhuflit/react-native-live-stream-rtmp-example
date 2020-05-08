module.exports = {
  root: true,
  extends: ['airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 100,
      },
    ],
    'global-require': 0,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'react/jsx-props-no-spreading': 0,
  },
  plugins: ['prettier'],
};
