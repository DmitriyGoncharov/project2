jQuery(document).ready(function($) {

    //tabs:
    function TabController(options){
        var $tabLinks = $(options.tabLinkSelector),
            tabLinkAttr = options.tabLinkAttr || 'href',
            $tabWindows = $(options.tabWindowSelector),
            firstTabNumber = options.openTabNumber,
            activeLinkClass = options.activeLinkClass || 'active',
            activeWindowClass = options.activeWindowClass || 'js-show',
            self = this;

        //open first tab:
        var $firstTab = $tabLinks.parent().filter('.active').find('a'),
            $firstWindow = $tabWindows.filter($firstTab.attr(tabLinkAttr));

        if(options.init) {
            options.init($firstTab, $firstWindow, showTab);
        }

        //link handler:
        $tabLinks.click(function(e){
            e.preventDefault();

            var $currentTabLink = $(e.target),
                $currentTabWindow = $tabWindows.filter($currentTabLink.attr(tabLinkAttr));

            //do not reload active tab:
            if($currentTabLink.parent().hasClass('active')){
                return;
            }

            //close early open tab:
            closeTab();

            //call before function:
            if(options.beforeShow){
                options.beforeShow($currentTabLink, $currentTabWindow);
            }

            //show new tab:
            showTab($currentTabLink, $currentTabWindow);
        });


        function showTab($link, $window){
            $link.parent().addClass(activeLinkClass);
            $window.fadeIn('normal', function(){
                if(options.afterShow){
                    options.afterShow($link, $window);
                }
            });
            $window.addClass(activeWindowClass);
        }

        function closeTab(){
            $tabLinks.parent().removeClass(activeLinkClass);

            $tabWindows.filter('.'+activeWindowClass)
                .hide()
                .removeClass(activeWindowClass);
        }

    }

    //var workTab = new TabController({
    //    tabLinkSelector: '.work-nav a',
    //    tabLinkAttr: 'id',
    //    tabWindowSelector: '.work-content',
    //    openTabNumber: 0,
    //    beforeShow: function ($activeTabLink) {
    //        var $linkWrap = $activeTabLink.parent(),
    //            arrPosition = $linkWrap.position().top + $linkWrap.height() / 2;
    //
    //        $('.job-section .tab-arr').css({
    //            top: arrPosition
    //        });
    //    }
    //});

    var otzivTab = new TabController({
        tabLinkSelector: '.otziv-nav a',
        tabLinkAttr: 'id',
        tabWindowSelector: '.tab-otziv',
        openTabNumber: 0,
        beforeShow: function ($activeTabLink) {
            var $linkWrap = $activeTabLink.parent(),
                arrPosition = $linkWrap.position().top + $linkWrap.height() / 2;

            $('.job-section .tab-arr').css({
                top: arrPosition
            });
        }
    });

    // скрол при клике на кнопку
    $('a.navigation[href^="#"]').click(function () {
        var el = $(this).attr('href');
        $('body').animate({
            scrollTop: $(el).offset().top - 85
        }, 1000);
        return false;
    });

    // Модальное окно _____________________
    if ($('.js-modal').length) {
        $('.js-modal').magnificPopup({
            type: 'inline',
            preloader: false,
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            removalDelay: 300,
            mainClass: 'my-mfp-zoom-in',
            callbacks: {
                open: function() {
                    var mp = $.magnificPopup.instance,
                        t = $(mp.currItem.el[0]);
                    if (t.attr('data-type')) {
                        if (t.attr('data-type') == 'Получить первичную консультацию') {
                            $(t.attr('href')).find('select[name=title]').val('Получить первичную консультацию');
                        } else if (t.attr('data-type') == 'Консультация по оптимизации строительства') {
                            $(t.attr('href')).find('select[name=title]').val('Консультация по оптимизации строительства');
                        } else if (t.attr('data-type') == 'Консультирование в выборе подрядчика') {
                            $(t.attr('href')).find('select[name=title]').val('Консультирование в выборе подрядчика');
                        } else {
                            $(t.attr('href')).find('select[name=title]').val('Оставить запрос');
                        }
                    }
                },
            }
        });
    }

    if ($(".js-tel").length) {
        $(".js-tel").mask("+7 (999) 999-9999");
    }

    $('.file input').change(function () {
        var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
        console.log(filename);
        $(this).parent().find('label').text(filename);
    });

    //Заказ звонка
    //// отправка mail топовая
    var id_form = $('#bk_form');
    var button_class = '.send_button';
    id_form.submit(function (e) {
        id_form.find(button_class).css('opacity', '0.3');
        id_form.find(button_class).prop('disabled', true);
        $.ajax({
            type: 'post',
            data: 'ajax=mail2&' + id_form.serialize(),
            success: function (result) {

                yaCounter156663.reachGoal('order1');
                id_form.find(button_class).val('Отправлено!');
                id_form.find(button_class).addClass('sended');
                id_form.find(button_class).css('opacity', '1');

                setTimeout(function () {
                    id_form.find(button_class).removeClass('sended');
                    id_form.find(button_class).val('Отправить');
                    id_form.find(button_class).prop('disabled', false);
                }, 2000);

                id_form.trigger('reset');  // очистить форму

                // Открываем форму спасибо
                $.magnificPopup.open({
                    items: {
                        src: '#modal-send'
                    },
                    type: 'inline'
                });
            }
        });
        return false;
    });


    var id_form_2 = $('#bk_form_2');
    var button_class_2 = '.send_button_2';
    id_form_2.submit(function (e) {
        id_form_2.find(button_class_2).prop('disabled', true);
        $.ajax({
            type: 'post',
            data: 'ajax=mail2&' + id_form_2.serialize(),
            success: function (result) {

                yaCounter156663.reachGoal('order1');
                id_form_2.find(button_class_2).val('Отправлено!');
                id_form_2.find(button_class_2).addClass('sended');

                /*setTimeout(function () {
                    id_form_2.find(button_class_2).removeClass('sended');
                    id_form_2.find(button_class_2).val('Отправить');
                    id_form_2.find(button_class_2).prop('disabled', false);
                }, 2000);*/

                id_form_2.trigger('reset');  // очистить форму

            }
        });
        return false;
    });

    $("#phone").mask("+7 (999) 999-9999");

            $('.callback_01 .submit_btn').click(function() {
                if ($(this).hasClass('sended')) return false;
            });
            $(".callback_01 ul li a").click(function(){ 
                $(".callback_01 ul li a.selected").removeClass("selected");
                $(this).addClass("selected"); 
                $(".callback_01").find('input[name=title]').val($(this).text());
            });

    // фиксированное меню при прокрутке
    function fixDiv() {
        var $cache = $('#menu');
        if ($(window).scrollTop() > 38){
            $cache.css({
                'position': 'fixed',
                'top': '0',
                'width': '100%'
            });
            $cache.addClass('scroll_bg');
            $('#menu .main-menu').addClass('scroll');
        }else {
            $cache.css({
                'position': 'absolute',
                'left' : '0',
                'right' : '0',
                'top': 'auto',
            });
            $cache.removeClass('scroll_bg');
            $('#menu .main-menu').removeClass('scroll');
        }
    }
    $(window).scroll(fixDiv);
    fixDiv();

    //fancybox
    $("a.fancybox_mod").fancybox({
        'padding'	:	'0',
        'type'	   :	'ajax',
        'ajax' : {
            complete: function(jqXHR, textStatus) {
                $('.fotorama').fotorama();
            }
        }
    });



    $("body.landing_page .job-page-wrap .object-list a").fancybox({
        'padding'	:	'0',
        'type'	   :	'ajax',
        'ajax' : {
            complete: function(jqXHR, textStatus) {
                $('.fotorama').fotorama();
            }
        }
    });





});