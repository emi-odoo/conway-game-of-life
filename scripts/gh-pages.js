const ghpages = require('gh-pages');

ghpages.publish(
    '__sapper__/export/conway-game-of-life',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/uovodikiwi/conway-game-of-life.git',
        user: {
            name: 'uovodikiwi',
            email: 'emanuele.maruzzi@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
