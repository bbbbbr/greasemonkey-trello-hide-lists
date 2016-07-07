// ==UserScript==
// @name         Trello Hide Lists
// @namespace    https://github.com/shesek/trello-hide-lists
// @version      0.1
// @description  Trello Hist Lists
// @author       You
// @match        https://trello.com/b/*
// @grant        none
//
// Copied from FooBarWidget @ https://github.com/shesek/trello-hide-lists/issues
//
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function () {
    function start() {
        var closeList = function (list) {
            list.querySelector('.list-cards').style.display = 'none';
        };

        var openList = function (list) {
            list.querySelector('.list-cards').style.display = 'block';
        };

        var lists = document.getElementById('board').querySelectorAll('div.js-li

        for (var i = 0; i < lists.length; i++) {
            (function () {
                var list    = lists[i];
                var close   = document.createElement('a');

                openList(list);

                close.setAttribute('href', '#');
                close.setAttribute('class', 'close icon-sm dark-hover');

                close.innerHTML             = '&times;';
                    }
                });
            })();
        }
    }

    function checkReady() {
        if (document.getElementById('board')) {
            start();
        } else {
            setTimeout(checkReady, 100);
        }
    }

    setTimeout(checkReady, 100);
})();
