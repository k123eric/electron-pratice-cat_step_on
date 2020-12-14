var grunt = require('grunt');

grunt.config.init({
    pkg: grunt.file.readJSON('./CatStepOn/package.json'),
    'create-windows-installer': {
        ia32: {
            appDirectory: './CatStepOn/CatStepOn-win32-x64',
            outputDirectory: './CatStepOn/installer64',
            authors: 'Blajja',
            title: 'CatStepOn',
            exe: 'CatStepOn.exe',
            description: 'cat step on',
            noMsi: true,
            loadingGif: 'cat.ico',
            setupIcon: 'cat.ico',
            icon: 'cat.ico',
        }
    }
})

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask("default", ['create-windows-installer']);