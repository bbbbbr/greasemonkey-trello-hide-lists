// ==UserScript==
// @name        Trello Hide Lists
// @namespace   http://trello.com/*
// @description Trello Hide Lists (without having to archive)
// @include     /^https?://trello\.com/.*$/
// @grant       none
// @version     1.0.0
// @license     TODO
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
                close.setAttribute('class', 'close');

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

                    // TODO : convert to non-inline functions
                    close.addEventListener('click', function (e) {
                        e.preventDefault();

                        if (close.getAttribute('class') == 'close') {
                            closeList(list);
                            close.setAttribute('class', 'open');
                            close.innerHTML = '&blacktriangleright;';
                        }
                        else {
                            openList(list);
                            close.setAttribute('class', 'close');
                            close.innerHTML = '&blacktriangledown;';
                        }
                    });


                    // Determine default hide/show state based on presence of "--"
                    var headingElements = list.getElementsByClassName('list-header-name');

                    if (headingElements.length >=0) {

                        var collapseTokenMatch  = /.*-.*/i.exec(headingElements[0].value);

                        // If a match was found then collapse the list by default
                        if (collapseTokenMatch != null) {
                            // TODO : consolidate to function
                            closeList(list);
                            close.setAttribute('class', 'open');
                            close.innerHTML = '&blacktriangleright;';

                        }
                    }

                }
            })();
        }
    }


    // TODO : Consider adding a mutation observer
    window.addEventListener ("load", AddMinimizeButtons, false);

    // Using Load event instead
    // function checkReady() {
    //    if (document.getElementById('board')) {
    //       start();
    //     } else {
    //         setTimeout(checkReady, 100);
    //     }
    // }
    //
    // setTimeout(checkReady, 100);

})();
