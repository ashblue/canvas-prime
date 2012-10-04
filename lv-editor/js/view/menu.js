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

                // Add action if available
                if (menuList[i].action) {
                    li.dataset.action = menuList[i].action;

                // Add module if available
                } else if (menuList[i].module) {
                    li.dataset.module = menuList[i].module;
                }

                // Add id if available
                if (menuList[i].id) {
                    li.id = menuList[i].id;
                }

                // Add link if available
                if (menuList[i].link) {
                    link = document.createElement('a');
                    link.href = menuList[i].link;
                    link.innerHTML = menuList[i].title;
                    li.appendChild(link);
                } else {
                    li.innerHTML = menuList[i].title;
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