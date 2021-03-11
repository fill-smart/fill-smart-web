module.exports = {
    client: {
      service: 'fillsmart-dev',
      skipSSLValidation: true,
      excludes: ['node_modules/**/*'],
      includes: ['src/hooks/**/*.{ts,gql,tsx,js,jsx,graphql}'],
    },
  };
  