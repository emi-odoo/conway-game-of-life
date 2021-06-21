var ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/uovodikiwi/conway-game-of-life.git',
        user: {
            name: 'Emanuele Maruzzi (uovodikiwi)',
            email: 'emanuele.maruzzi@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
