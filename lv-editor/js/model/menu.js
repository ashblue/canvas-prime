define(
    function () {
        /**
         * @todo Recent needs to dynamically build data out of the local storage
         */
        var menuData = [
            {
                title: 'File',
                children: [
                    {
                        title: 'New level',
                        action: 'newLevel'
                    },
                    {
                        title: 'Save',
                        action: 'saveLevel'
                    },
                    {
                        title: 'Save as',
                        action: 'saveLevelAs'
                    },
                    {
                        title: 'Open',
                        action: 'openLevel'
                    },
                    {
                        title: 'Recent',
                        id: 'recent-files',
                        children: []
                    },
                    {
                        title: 'Resize',
                        action: 'resizeLevel'
                    },
                    {
                        title: 'Disable shorcuts',
                        action: 'disableShortcuts'
                    }
                ]
            },
            {
                title: 'Edit',
                children: [
                    {
                        title: 'Delete',
                        action: 'delete'
                    },
                    {
                        title: 'Copy',
                        action: 'copy'
                    },
                    {
                        title: 'Paste',
                        action: 'paste'
                    },
                    {
                        title: 'Cut',
                        action: 'cut'
                    },
                    {
                        title: 'Redo',
                        action: 'undo'
                    }
                ]
            },
            {
                title: 'Window',
                children: [
                    {
                        title: 'Reset Workspace',
                        action: 'resetWorkspace'
                    },
                    {
                        title: 'Modules'
                    },
                    {
                        title: 'Info',
                        module: 'info'
                    },
                    {
                        title: 'Tiles',
                        module: 'tiles'
                    },
                    {
                        title: 'Layers',
                        module: 'layers'
                    },
                    {
                        title: 'Assets',
                        module: 'assets'
                    },
                    {
                        title: 'History',
                        module: 'history'
                    }
                ]
            },
            {
                title: 'Help',
                children: [
                    {
                        title: 'About',
                        link: '#'
                    },
                    {
                        title: 'Documentation',
                        link: '#'
                    }
                ]
            },
            {
                title: 'Run',
                link: '#'
            }
        ];

        return menuData;
    }
);