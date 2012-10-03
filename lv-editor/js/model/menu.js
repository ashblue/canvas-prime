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
                        //children: [
                        //    {
                        //        title: 'Lorem Ipsum'
                        //    }
                        //]
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
                        title: 'Lorem Ipsum'
                    }
                ]
            }
        ];

        return menuData;
    }
);