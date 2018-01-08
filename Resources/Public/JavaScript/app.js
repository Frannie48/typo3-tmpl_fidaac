'use strict';

$(document).ready(function () {

    var searchForm = $('#search-form');

    var searchEngineSettingsMetasearch = {
        'action': '/search/metasearch-engine',
        'id': 'choice-pazpar2',
        'name': 'tx_pazpar2_pazpar2[queryString]',
        'query': '/search/metasearch-engine?tx_pazpar2_pazpar2[useJS]=yes&tx_pazpar2_pazpar2[queryString]='
    };

    var searchEngineSettingsWebsite = {
        'action': '/search/website/',
        'id': 'choice-website',
        'name': 'q',
        'query': '/search/website/?q='
    };

    var initializeSearchForm = function initializeSearchForm() {
        var parameters = searchEngineSettingsMetasearch;
        searchForm.attr('action', parameters.action);
        searchForm.attr('name', parameters.name);
    };

    $('.header_search').click(function () {
        $('.js-search-bar').slideToggle(250);
        initializeSearchForm();

        return false;
    });

    $('input[name=search-choice]').change(function (event) {
        if (event.target.id === 'choice-website') {
            var parameters = searchEngineSettingsWebsite;

            searchForm.attr('action', parameters.action);
            searchForm.attr('name', parameters.name);
        } else {
            var _parameters = searchEngineSettingsMetasearch;

            searchForm.attr('action', _parameters.action);
            searchForm.attr('name', _parameters.name);
        }
    });

    var getQuery = function getQuery(choice) {
        if (choice === 'choice-website') {
            var _parameters2 = searchEngineSettingsWebsite;
            return _parameters2.query;
        }

        var parameters = searchEngineSettingsMetasearch;
        return parameters.query;
    };

    searchForm.submit(function () {
        var id = document.querySelector('input[name=search-choice]:checked').getAttribute('id');
        window.location = getQuery(id) + $('#search').val();
        return false;
    });

    $('.pagination .previous a').html('<svg><use xlink:href="#icon-caret-left"/></svg>');
    $('.pagination .last.next a').html('<svg><use xlink:href="#icon-caret-right"/></svg>');
});

/**
 * Navigation.js
 *
 * Change the menu, so that hovering over or clicking on a link leads to the page
 * which opens and closes the submenu
 *
 * Submenu levels in L and S are taken out of their regular dom element and moved into submenuContainer
 * so that levels can be shown in a horizontal way
 * This behaviour is not possible with position:fixed. Therefore, submenus are moved with jQuery.
 */

$(document).ready(function () {

    /**
     * Stuff related to scrolling and page up button
     */
    $(window).on('scroll', function () {
        if ($(this).scrollTop() === 0) {
            $('.toTop_inner').css('visibility', 'hidden');
        } else if ($('.toTop_inner').css('visibility') === 'hidden') {
            $('.toTop_inner').css('visibility', 'visible');
        }
    });

    $('.toTop_inner').on('click', function () {
        $('html').animate({ scrollTop: 0 }, 'fast');
    });

    /**
     * Stuff related to ajax-menu
     * To show navigation horizontally:
     * + javascript is enabled -> the second level of submenus are hidden and created via ajax
     * + javascript is not enabled -> the second level of submenus are shown via css
     */
    var createURLForAjax = function createURLForAjax(path) {
        var url = '';
        // ie10 doesn't recognice window.location.origin...
        if (window.location.origin) {
            url = window.location.origin;
        } else {
            url = window.location.protocol + '//' + window.location.hostname;
            if (window.location.port) {
                url += ':' + window.location.port;
            }
        }
        url += path;
        if (url.indexOf('&index.php') === '0') {
            url += '&type=37902';
        } else {
            url += '?type=37902';
        }
        return url;
    };

    var makePathBold = function makePathBold() {
        var actUrl = window.location.pathname;
        console.log(actUrl);
        $('a[href$="' + actUrl + '"]').parents('.navigation_default-submenuItem').first().removeClass('-no').addClass('-cur');
    };

    var showPath = function showPath() {
        var url = createURLForAjax($('.navigation_default-submenuItem.-actSub').find('a').first().attr('href'));
        $('.navigation_default-submenuItem.-actSub').parents('.navigation_default-submenuContainer-inner').find('.navigation_default-submenu').first().siblings().remove();
        var menu = $('.navigation_default-submenuItem.-actSub').parents('.navigation_default-submenuContainer-inner').append('<ul class="navigation_default-submenu"></ul>');
        $(menu).find('.navigation_default-submenu').last().load(url, function (response, status) {
            if (status === 'error') {
                console.log('Error loading submenu');
            } else if (status === 'success') {
                makePathBold();
            }
        });
    };
    showPath();

    $('.navigation_default-submenuItem.-sub, .navigation_default-submenuItem.-curIfSub, .navigation_default-submenuItem.-actSub').on('mouseenter', function () {
        var url = createURLForAjax($(this).find('a').first().attr('href'));
        // clean up first, then refill
        $(this).parents('.navigation_default-submenuContainer-inner').find('.navigation_default-submenu').first().siblings().remove();
        var menu = $(this).parents('.navigation_default-submenuContainer-inner').append('<ul class="navigation_default-submenu"></ul>');
        $(menu).find('.navigation_default-submenu').last().load(url, function (response, status) {
            if (status === 'error') {
                console.log('Error loading submenu');
            }
            makePathBold();
        });
    });

    $('.navigation_default-submenuItem.-no').on('mouseenter', function () {
        $(this).parents('.navigation_default-submenuContainer-inner').find('.navigation_default-submenu').first().siblings().remove();
    });
});

/**
 * Main.js
 *
 * Show the website after all javascript is done
 */

$(document).ready(function () {

    /**
     * The body is not displayed by default, only after javascript is done it is finally displayed
     * This removes jumping elements
     */
    // hide, so that space is preserved
    $('.toTop_inner').css('visibility', 'hidden');
});

$(document).ready(function () {

    /**
     * make sure, text in stairs view of news is cut according to image height
     */
    $('.news-stairs-view .article').each(function (index, el) {
        var teaserheight = $(el).find('.teaser-text').height();
        var imgheight = $(el).find('.img-wrap').height();
        var headerheight = $(el).find('.news-header').height();
        var buttonheight = $(el).find('.infos-wrap').children('a').last().height();
        var theight = imgheight - buttonheight - headerheight;
        if (teaserheight + buttonheight + headerheight >= imgheight) {
            $(el).find('.teaser-text').css('height', theight - 2);
        }
    });

    /**
     * Implement handles for slider view of news
     */
    $('.news-overlay.-left').hide();
    if ($('.news-slide').length < 3) {
        $('.news-overlay.-right').hide();
    }

    $('.news-overlay.-right').on('click', function () {

        $('.news-overlay.-left').show();
        $.when($('.news-rel-slider').animate({ 'left': '-=416px' })).done(function () {
            // show handles only, if there is still something to scroll
            var relleft = $('.news-rel-slider').children('.article').last().offset().left;
            if (relleft <= 960) {
                $('.news-overlay.-right').hide();
            }
        });
    });

    $('.news-overlay.-left').on('click', function () {
        $('.news-overlay.-right').show();
        // show handles only, if there is still something to scroll
        $.when($('.news-rel-slider').animate({ 'left': '+=416px' })).done(function () {
            var relleft = $('.news-rel-slider').position().left;
            if (relleft === 0) {
                $('.news-overlay.-left').hide();
            }
        });
    });

    /**
     * make sure images in slider view are horizonally aligned
     */
    var sliderheaderheight = $('.news-slider-view .news-header').first().height();
    $('.news-slider-view .news-header').each(function (index, el) {
        if (sliderheaderheight < $(el).height()) {
            sliderheaderheight = $(el).height();
        }
    });
    $('.news-slider-view .news-header').css('height', sliderheaderheight);

    /**
     * Make sure, pagination resembles design
     */
    $('.news .f3-widget-paginator .previous a').html('<svg><use xlink:href="#icon-caret-left"/></svg>');
    $('.news .f3-widget-paginator .next a').html('<svg><use xlink:href="#icon-caret-right"/></svg>');
});

/**
 * Images.js
 *
 * Image manipulations
 */

$(document).ready(function () {
    var lightboxId = Math.ceil(Math.random() * 100);

    /**
     * Add caption and translate number info to image overlays
     */
    $('a[href$=".jpg"], a[href$=".png"]').attr('rel', 'lightbox[' + lightboxId + ']');
    $('a[href$=".jpg"], a[href$=".png"]').each(function (index, el) {
        if ($('figcaption').length > 0) {
            // content element
            $(el).attr('data-title', $(el).siblings('figcaption').html());
        } else {
            // news
            $(el).attr('data-title', $(el).parent().siblings('.news-img-caption').html());
        }
    });

    if ($('html').attr('lang') === 'de') {
        $('body').on('DOMNodeInserted', '.lb-number', function () {
            var lbNumberEn = $('.lb-number').text();
            var lbNumberGer = lbNumberEn.replace('Image', 'Bild');
            lbNumberGer = lbNumberGer.replace('of', 'von');
            $('.lb-number').text(lbNumberGer);
        });
    }
});

/**
 * Powermail.js
 */

$(document).ready(function () {
    $('.powermail_input').focus(function (event) {
        var id = $(event.target).attr('id');
        $('.powermail_label[for=' + id + ']').addClass('activeLabel');
    });

    $('.powermail_input').blur(function (event) {
        if ($(event.target).val()) {
            return;
        }

        var id = $(event.target).attr('id');
        $('.powermail_label[for=' + id + ']').removeClass('activeLabel');
    });

    /**
     * In checkbox, the label is part of the checkbox and has to be separated in an extra label
     */
    // TODO: When changing the checkbox, the original event has to be delegated to its child
    // const but = $('.powermail_field .checkbox input:required').addClass('changedCheckbox');
    // const butLabel = `<label class="changedLabel">${$(but).attr('value')}</label>`;
    // const butEvent = $('.powermail_field .checkbox input:required').parent('label').getScript();

    // $(but).parent('label').replaceWith($(but).parent('label').children());
    // $('.powermail_field .checkbox').children().last().after(butLabel);
});

/**
 * Javascript for Pazpar2
 */
$(document).ready(function () {

    $('body').on('DOMNodeInserted', 'a.pz2-prev', function () {
        $('a.pz2-prev').each(function (index, el) {
            if ($(el).html().indexOf('svg') === -1) {
                $(el).html('<svg><use xlink:href="#icon-caret-left"/></svg>');
            }
        });
    });

    $('body').on('DOMNodeInserted', 'a.pz2-next', function () {
        $('a.pz2-next').each(function (index, el) {
            if ($(el).html().indexOf('svg') === -1) {
                $(el).html('<svg><use xlink:href="#icon-caret-right"/></svg>');
            }
        });
    });
});

(function () {
    if (sessionStorage.foutFontsLoaded) {
        document.documentElement.className += " fonts-loaded";
        return;
    }

    (function () {
        function e(e, t) {
            document.addEventListener ? e.addEventListener("scroll", t, !1) : e.attachEvent("scroll", t);
        }function t(e) {
            document.body ? e() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function t() {
                document.removeEventListener("DOMContentLoaded", t), e();
            }) : document.attachEvent("onreadystatechange", function n() {
                if ("interactive" == document.readyState || "complete" == document.readyState) document.detachEvent("onreadystatechange", n), e();
            });
        }function n(e) {
            this.a = document.createElement("div"), this.a.setAttribute("aria-hidden", "true"), this.a.appendChild(document.createTextNode(e)), this.b = document.createElement("span"), this.c = document.createElement("span"), this.h = document.createElement("span"), this.f = document.createElement("span"), this.g = -1, this.b.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.c.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.f.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.h.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;", this.b.appendChild(this.h), this.c.appendChild(this.f), this.a.appendChild(this.b), this.a.appendChild(this.c);
        }function r(e, t) {
            e.a.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;left:-999px;white-space:nowrap;font:" + t + ";";
        }function i(e) {
            var t = e.a.offsetWidth,
                n = t + 100;return e.f.style.width = n + "px", e.c.scrollLeft = n, e.b.scrollLeft = e.b.scrollWidth + 100, e.g !== t ? (e.g = t, !0) : !1;
        }function s(t, n) {
            function r() {
                var e = s;i(e) && null !== e.a.parentNode && n(e.g);
            }var s = t;e(t.b, r), e(t.c, r), i(t);
        }function o(e, t) {
            var n = t || {};this.family = e, this.style = n.style || "normal", this.weight = n.weight || "normal", this.stretch = n.stretch || "normal";
        }function l() {
            if (null === a) {
                var e = document.createElement("div");try {
                    e.style.font = "condensed 100px sans-serif";
                } catch (t) {}a = "" !== e.style.font;
            }return a;
        }function c(e, t) {
            return [e.style, e.weight, l() ? e.stretch : "", "100px", t].join(" ");
        }var u = null,
            a = null,
            f = null;o.prototype.load = function (e, i) {
            var o = this,
                a = e || "BESbswy",
                l = i || 3e3,
                h = new Date().getTime();return new Promise(function (e, i) {
                null === f && (f = !!window.FontFace);if (f) {
                    var p = new Promise(function (e, t) {
                        function n() {
                            new Date().getTime() - h >= l ? t() : document.fonts.load(c(o, o.family), a).then(function (t) {
                                1 <= t.length ? e() : setTimeout(n, 25);
                            }, function () {
                                t();
                            });
                        }n();
                    }),
                        d = new Promise(function (e, t) {
                        setTimeout(t, l);
                    });Promise.race([d, p]).then(function () {
                        e(o);
                    }, function () {
                        i(o);
                    });
                } else t(function () {
                    function t() {
                        var t;if (t = -1 != m && -1 != g || -1 != m && -1 != S || -1 != g && -1 != S) (t = m != g && m != S && g != S) || (null === u && (t = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), u = !!t && (536 > parseInt(t[1], 10) || 536 === parseInt(t[1], 10) && 11 >= parseInt(t[2], 10))), t = u && (m == x && g == x && S == x || m == T && g == T && S == T || m == N && g == N && S == N)), t = !t;t && (null !== C.parentNode && C.parentNode.removeChild(C), clearTimeout(L), e(o));
                    }function f() {
                        if (new Date().getTime() - h >= l) null !== C.parentNode && C.parentNode.removeChild(C), i(o);else {
                            var e = document.hidden;if (!0 === e || void 0 === e) m = p.a.offsetWidth, g = d.a.offsetWidth, S = v.a.offsetWidth, t();L = setTimeout(f, 50);
                        }
                    }var p = new n(a),
                        d = new n(a),
                        v = new n(a),
                        m = -1,
                        g = -1,
                        S = -1,
                        x = -1,
                        T = -1,
                        N = -1,
                        C = document.createElement("div"),
                        L = 0;C.dir = "ltr", r(p, c(o, "sans-serif")), r(d, c(o, "serif")), r(v, c(o, "monospace")), C.appendChild(p.a), C.appendChild(d.a), C.appendChild(v.a), document.body.appendChild(C), x = p.a.offsetWidth, T = d.a.offsetWidth, N = v.a.offsetWidth, f(), s(p, function (e) {
                        m = e, t();
                    }), r(p, c(o, '"' + o.family + '",sans-serif')), s(d, function (e) {
                        g = e, t();
                    }), r(d, c(o, '"' + o.family + '",serif')), s(v, function (e) {
                        S = e, t();
                    }), r(v, c(o, '"' + o.family + '",monospace'));
                });
            });
        }, "undefined" != typeof module ? module.exports = o : (window.FontFaceObserver = o, window.FontFaceObserver.prototype.load = o.prototype.load);
    })();

    var font_a = new FontFaceObserver('Open Sans', {
        weight: 300
    });
    var font_b = new FontFaceObserver('Open Sans', {
        weight: 400,
        style: 'italic'
    });
    var font_c = new FontFaceObserver('Open Sans', {
        weight: 400
    });
    var font_d = new FontFaceObserver('Open Sans', {
        weight: 400,
        style: 'italic'
    });
    var font_e = new FontFaceObserver('Open Sans', {
        weight: 600
    });
    var font_f = new FontFaceObserver('Open Sans', {
        weight: 600,
        style: 'italic'
    });

    Promise.all([font_a.load(), font_b.load(), font_c.load(), font_d.load(), font_e.load(), font_f.load()]).then(function () {
        document.documentElement.className += " fonts-loaded";
        sessionStorage.foutFontsLoaded = true;
    });
})();
