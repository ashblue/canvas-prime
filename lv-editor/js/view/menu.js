define(
    function () {
        var menuBuilder = function (menuList, menuTier) {
            // Create base for list
            var menu = document.createElement('ul');
            menu.classList.add('menu-list');
            menu.classList.add('tier' + menuTier);

            // Keep variables outside of the loop for faster processing
            var link, li;

            // Loop passed menu data
            for (var i = menuList.length; i--;) {
                // Create list item
                li = document.createElement('li');
                li.classList.add('menu-item');
                li.innerHTML = menuList[i].title;

                // Add action if available
                if (menuList[i].action) {
                    li.dataset.action = menuList[i].action;
                }

                // Add id if available
                if (menuList[i].id) {
                    li.id = menuList[i].id;
                }

                // Mark the last link with a class
                if (i === menuList.length - 1) {
                    li.classList.add('last');
                }

                // Insert children if present
                if (menuList[i].children) {
                    li.classList.add('menu-children');
                    li.appendChild(menuBuilder(menuList[i].children, menuTier + 1));
                }

                menu.insertBefore(li, menu.firstChild);
            }

            return menu;
        };

        return menuBuilder;
    }
);