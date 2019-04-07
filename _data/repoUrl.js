const { repository } = require('../package.json');

module.exports = () => repository.url.replace('.git', '');
