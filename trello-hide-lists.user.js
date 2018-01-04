// ==UserScript==
// @name        Trello Hide Lists
// @namespace   http://trello.com/*
// @description Trello Hide Lists (without having to archive)
// @include     /^https?://trello\.com/.*$/
// @grant       none
// @version     1.0.0
// @license     GPL
// Additional credits to :
// * https://github.com/shesek/trello-hide-lists
// * FooBarWidget @ https://github.com/shesek/trello-hide-lists/issues/1#issuecomment-199693936
//
// ==/UserScript==


(function () {


    function AddMinimizeButtons() {

        var closeList = function (list) {
            list.style.transition   = 'max-height 0.2s ease-in-out, max-width .2s 0.21s ease-in-out';
            list.style.maxHeight    = '30px';
        };

        var openList = function (list) {
            list.style.transition   = 'max-height .2s 0.2s ease-in-out, max-width .1s ease-in-out';
            list.style.overflow     = 'hidden';
            list.style.maxHeight    = '100%';
        };

        // Get all of the lists for the current board
        var lists = document.getElementById('board').querySelectorAll('div.list');

        // Add the show/hide selectors to each list (and update the default show/hide state)
        for (var i = 0; i < lists.length; i++) {
            (function () {
                var list    = lists[i];
                // Close button element and a container Div for it
                var close   = document.createElement('a');
                var closeDiv   = document.createElement('div');

                openList(list);

                close.setAttribute('href', '#');
                close.setAttribute('class', 'toggle-list-opened');

                // Use a Triangle HTML character for the close button
                close.innerHTML             = '&blacktriangledown;';
                close.style.textDecoration  = 'none';
                close.style.opacity         = '0.40';
                close.style.fontSize        = '15pt';

                // Add the Close button to a container Div and set the position
                closeDiv.appendChild(close);
                closeDiv.style.position      = 'absolute';
                closeDiv.style.top           = '6px';

                // Locate the show/hide button left of the list header name text field
                var attachElements = list.getElementsByClassName('list-header-name');


                // Attach the show/hide click handler
                if (attachElements.length >=0) {

                    // Bump the list header name to the right so there is room for the Close button
                    // then insert the button before it
                    attachElements[0].style.paddingLeft = '20px';
                    attachElements[0].parentNode.insertBefore(closeDiv, attachElements[0]);

                    // TODO : convert to non-inline toggle function
                    close.addEventListener('click', function (e) {
                        e.preventDefault();

                        if (close.getAttribute('class') == 'toggle-list-opened') {
                            closeList(list);
                            close.setAttribute('class', 'toggle-list-closed');
                            close.innerHTML = '&blacktriangleright;';
                        }
                        else {
                            openList(list);
                            close.setAttribute('class', 'toggle-list-opened');
                            close.innerHTML = '&blacktriangledown;';
                        }
                    });


                    // TODO : Move this to a function
                    // Determine default hide/show state based on presence of "--"
                    var headingElements = list.getElementsByClassName('list-header-name');

                    if (headingElements.length >=0) {

                        var collapseTokenMatch  = /.*-.*/i.exec(headingElements[0].value);

                        // If a match was found then collapse the list by default
                        if (collapseTokenMatch != null) {
                            // TODO : consolidate to function
                            closeList(list);
                            close.setAttribute('class', 'toggle-list-closed');
                            close.innerHTML = '&blacktriangleright;';

                        }
                    }

                }
            })();
        }
    }





    //
    // Toggle showing/hiding all boards with "--' in the name
    //
    function toggleAutoLists(e)
    {
        e.preventDefault();

        // Get all of the lists for the current board
        var lists = document.getElementById('board').querySelectorAll('div.list');

        for (var i = 0; i < lists.length; i++) {

            // Can't simplify this with a [value$="--"] selector since textareas don't support it
            // Check the heading textarea for each board, toggle it based on presence of "--"
            var headingElements = lists[i].getElementsByClassName('list-header-name');

            if (headingElements.length >=0) {

                // If the list header name has "--" present then click it's show/hide button
                var collapseTokenMatch  = /.*\-\-.*/i.exec(headingElements[0].value);

                if (collapseTokenMatch != null) {

                    var closeButtons = lists[i].querySelectorAll('[class*=toggle-list]');

                    if (closeButtons.length >=0) {
                        // Self click the toggle button
                        closeButtons[0].click();
                    }

                }
            }
        }
    }



    //
    // Add a button near the top to toggle showing/hiding all boards with "--' in the name
    //
    function AddToggleAutoButton()
    {

        if (!document.getElementById('toggleAutoAnchorButton')) {

            var toggleAutoAnchor   = document.createElement('a');

            toggleAutoAnchor.setAttribute(          'href', '#');
            toggleAutoAnchor.setAttribute(          'class', 'toggle-list-close-hide-button board-header-btn');
            toggleAutoAnchor.innerHTML              = '-- / ++';
            toggleAutoAnchor.style.paddingLeft      = '10px';
            toggleAutoAnchor.style.paddingRight     = '20px';

            // Add the button right after (to the right) of the board permission selector
            document.getElementById('permission-level').parentNode.appendChild(toggleAutoAnchor);

            // When clicked : trigger open or close event on all of the boards that match the "--"
            toggleAutoAnchor.addEventListener('click', toggleAutoLists );
            toggleAutoAnchor.setAttribute("id", "toggleAutoAnchorButton");
        }
    };



    //
    // Util : Installs a mutation observer callback for nodes matching the given css selector
    //
    function registerMutationObserver(selectorCriteria, monitorSubtree, callbackFunction)
    {
        // Cross browser mutation observer support
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        // Find the requested DOM nodes
        var targetNodeList = document.querySelectorAll(selectorCriteria);


        // Make sure the required elements were found, otherwise don't install the observer
        if ((targetNodeList != null) && (MutationObserver != null)) {

            // Create an observer and callback
            var observer = new MutationObserver( callbackFunction );

            // Start observing the target element(s)
            for(var i = 0; i < targetNodeList.length; ++i) {

                observer.observe(targetNodeList[i], {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: monitorSubtree,
                    characterDataOldValue: true
                });
            }
        }
    }


    //
    // Set a timer to wait until the board is loaded before running the script
    // Use this plus the mutation observer instead of purely the load event
    // since the load event misses page loads and board changes sometimes
    //
    function checkReady() {

       if (document.getElementById('board')) {
          AddMinimizeButtons();
          AddToggleAutoButton();

        } else {
            setTimeout(checkReady, 100);
        }
    }


    //
    // Once logged in, the actively displayed board can change without a page load.
    // Register a hook to trigger on changes to the "content" div which is the container
    // for the boards, then re-apply the script as needed
    //
    function installBoardChangeHook()
    {
        // TODO : debug visual hook hinting
        // if (document.getElementById('content'))
        //    document.getElementById('content').style.border  = "1px dashed red";

        // Subtree monitoring disabled to avoid excessive triggering
        registerMutationObserver('[id=content]', false,
            function(mutations)
            {
                setTimeout(checkReady, 100);
            }
        );
    }


    //
    // Apply the script to the newly loaded board and try
    // to capture any future non-page-reload board changes
    //
    function init()
    {
        setTimeout(checkReady, 100);
        installBoardChangeHook();
    }



    // Add an event to start the script once the page has loaded
    window.addEventListener ("load", init, false);


})();
