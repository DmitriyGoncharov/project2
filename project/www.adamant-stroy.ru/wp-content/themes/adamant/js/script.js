(function($){
    //    custom placeholder:
    function Placeholder(options) {
        var $input = options.elem,
            placeholderValue = $input.attr('data-placeholder');
        $input.on('focus', onfocus);
        $input.on('blur', onblur);

        function onfocus() {
            if($(this).val() == placeholderValue){
                $(this).val('');
            }
        }

        function onblur(){
            if(!$(this).val()) {
                $(this).val(placeholderValue);
                $(this).removeClass('filled');
            } else {
                $(this).addClass('filled');
            }
        }
    }

    $('input[type="text"], input[type="search"], ' +
        'input[type="email"], input[type="tel"], textarea')
        .each(function(){
            new Placeholder(
                {
                    elem: $(this)
                }
            );
        });


    //Galleria play code:
    if(document.getElementById('galleria')) {
        $(window).load(function(){
            Galleria.loadTheme('js/galleria/galleria.azur.js');
            Galleria.run('#galleria', {
                transition: 'slide',
                imageCrop: true,
                carouselSpeed: 1200,
                autoplay: 4000,
                default: true,
                responsive: true,
                showCounter: false,
                _showTooltip: false
            });
        });
    }

    //bx-slider:
    var thumbnailSlider = $('.object-list-nav.bx-slider').bxSlider({
        mode:'vertical',
        pager: false,
        minSlides: 15,
        maxSlides: 15,
//        infiniteLoop:false,
        nextText:'',
        prevText:'',
        moveSlides: 3
    });
    $(".bx-slider").swipe({
        //Generic swipe handler for all directions
        swipe:function(event, direction) {
            if(direction == 'right') {
                mainSlider.goToPrevSlide();
            }
            if(direction == 'left') {
                mainSlider.goToNextSlide();
            }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold:10,
        fallbackToMouseEvents: false
    });

    //tap handler for showcase:
    $('.showcase-plate').swipe({
        tap:function(event, target) {
            event.preventDefault();
            $('.showcase-plate').removeClass('js-tap');
            $(target).addClass('js-tap');
        },
        fallbackToMouseEvents: false
    });


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

    //Вакансии:
    var vacancyTab = new TabController({
        tabLinkSelector: '.vacancy-nav a',
        tabLinkAttr: 'id',
        //tabWindowSelector: '.tab-content',
        openTabNumber: 0,
        init: function($firstLink, $firstWindow, showTab) {
            //showTab($firstLink, $firstWindow); // эта штука показывает активную табу при загрузке

            if(!$firstLink.length) return;

            var $linkWrap = $firstLink.parent(),
                arrPosition = $linkWrap.position().top + $linkWrap.height()/2;
            $('.vacancy-wrap .tab-arr').css({
                top: arrPosition
            });
        },
        beforeShow: function($activeTabLink, $activeTabWindow) {
            var $linkWrap = $activeTabLink.parent(),
                arrPosition = $linkWrap.position().top + $linkWrap.height()/2;

            $('.vacancy-wrap .tab-arr').css({
                top: arrPosition
            });

            $('.vacancy-wrap.tabs-wrap').css('opacity', '0.3');
            if(!$('.landing_page').length) history.pushState(null, null, $activeTabLink.attr('href'));
            $.ajax({
                url: $activeTabLink.attr('href'),
                success: function(html){
                    html = $(html).find('.tab-content');
                    $('.tab-content').replaceWith(html);
                    $('.vacancy-wrap.tabs-wrap').css('opacity', '1');
                    $('.vacancy-wrap.tabs-wrap .tab-arr').css({
                        top: arrPosition
                    });

                    $('input[type="text"], input[type="search"], input[type="email"], input[type="tel"], textarea').each(function(){
                        new Placeholder({elem: $(this)});
                    });

                    $('input[type="file"]').change(function(e){
                        handleFileSelect(e, $(this));
                    });

                    $(html).find('form').each(function(){
                        var form = new FormController({
                            $form: $(this)
                        });
                    });

                    $('iframe#superframe').load(function(){
                        $('iframe#superframe').load(function(){
                            $('.vacancy_submit').css('opacity', '1');
                            $('.vacancy_submit').val('Отправлено!');
                        });
                    });
                }
            });

        },
        afterShow: function(l,$activeTabWindow){
            var tabWindowHeight = $activeTabWindow.parent().outerHeight();
            $('.vacancy-section .common-border-wrap').css({
                minHeight: tabWindowHeight + 50
            });
        }
    });

    // Отправка резюме
    /* $('.vacancy_mail_form').submit(function(){
     // $('.vacancy_submit').css('opacity', '0.3');
     }); */
    $('iframe#superframe').load(function(){
        $('.vacancy_submit').css('opacity', '1');
        $('.vacancy_submit').val('Отправлено!');
        yaCounter156663.reachGoal('order2');
        /* html = $(this).contents().find('body').html();
         console.log(html); */
    });

    //Р’РёРґС‹ СЂР°Р±РѕС‚:
    var jobTab = new TabController({
        tabLinkSelector: '.objects_archive .jobs-nav a',
        tabLinkAttr: 'id',
        tabWindowSelector: '.tab-content123',
        openTabNumber: 0,
        init: function($firstLink, $firstWindow) {
            if(!$firstLink.length) return;

            var $linkWrap = $firstLink.parent(),
                arrPosition = $linkWrap.position().top + $linkWrap.height()/2;
            $('.job-section .tab-arr').css({
                top: arrPosition
            });
        },
        beforeShow: function($activeTabLink) {
            var $linkWrap = $activeTabLink.parent(),
                arrPosition = $linkWrap.position().top + $linkWrap.height()/2;

            $('.job-section').css('opacity', '0.3');
            $('.job-section .tab-arr').css({
                top: arrPosition
            });
            if(!$('.landing_page').length) history.pushState(null, null, $activeTabLink.attr('href'));
            $.ajax({
                url: $activeTabLink.attr('href'),
                success: function(html){
                    html = $(html).find('.common-white-wrap');
                    $('.common-white-wrap').replaceWith(html);
                    $('.job-section').css('opacity', '1');
                    $('.job-section .tab-arr').css({
                        top: arrPosition
                    });
					fancybox_func();

                    $("body.landing_page .job-page-wrap .object-list a").fancybox({
                        'padding'	:	'0',
                        'type'	   :	'ajax',
                        'ajax' : {
                            complete: function(jqXHR, textStatus) {
                                $('.fotorama').fotorama();
                            }
                        }
                    });
                }
            });
        }
    });

    //objects map:
    function ObjectMap(options) {
        var mapWrap = options.mapWrap || document.getElementById('map'),
            mLat = options.centerCoords.lat || 59.921947,
            mLon = options.centerCoords.lon || 30.333273,
            zoom = options.zoom || 13,
            markerImg = options.markerImg || 'img/markerImg.png',
            markerList = options.markerList,
            map;

        var styles = [{
            stylers: [
                { saturation: -100 },
                { lightness: 15 }
            ]},
            {
                featureType: "administrative.locality",
                elementType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "poi",
                elementType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "water",
                stylers: [
                    { hue: "#adc9fd" },
                    { saturation: 0 },
                    { lightness: 5 }
                ]

            }];

        function initialize() {

            var styledMap = new google.maps.StyledMapType(styles,
                {name: "Styled Map"});

            var mapOptions = {
                zoom: zoom,
                center: new google.maps.LatLng(mLat, mLon),
                mapTypeControl: false,
                streetViewControl:false,
                panControl:false,
                scrollwheel:false
            };
            map = new google.maps.Map(mapWrap,
                mapOptions);

            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');
        }

        initialize();

		var markers = [];
        markerList.forEach(function(work){
            var workCoords = new google.maps.LatLng(work.coords.lat, work.coords.lon);
            var markerImg;

            if(work.underConstruction) {
                markerImg = 'http://www.adamant-stroy.ru/wp-content/themes/adamant/img/marker-construction.png';
            } else {
                markerImg = 'http://www.adamant-stroy.ru/wp-content/themes/adamant/img/marker.png';
            }

            var workMarker = new google.maps.Marker({
                position: workCoords,
                // map: map,
                icon: markerImg,
                title: work.title
            });
			markers.push(workMarker);

            var popupContent =
                '<div class="popup">' +
                    '<div class="popup-close" onclick = "this.parentNode.style.display = \'none\'">&times;</div>' +
                    '<div class="img-wrap">'+
                    '<a href="' + work.link +'">'+
                    '<img src="'+work.image+'"/>' +
                    '</a>' +
                    '</div>' +
                    '<div class="text-wrap">' +
                    '<a class="name" href="' + work.link +'">' + work.title + '</a>' +
                    '</div>'+
                    '</div>';

            var popup = new InfoBox({
                boxClass:	'popupWrap',
                alignBottom:true,
                pixelOffset:new google.maps.Size(-110, -40),
                closeBoxURL:'',
                latlng:		workCoords,
                map:		map,
                content:	popupContent
            });

            google.maps.event.addListener(workMarker, 'click', function() {
                $('.popup').hide();
                popup.open(map,workMarker);
            });
        });
		
		var markerCluster = new MarkerClusterer(map, markers, {
			gridSize: 35,
			styles: [{
				url: markerImg,
				maxZoom: 16,
				height: 33,
				width: 24,
				anchor: [4,0],
				textColor: '#fff',
				textSize: 15,
			}]
		});
		
		google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
			
		});
	
    }
    window.ObjectMap = ObjectMap;

    //contacts map
    //objects map:
    function ContactsMap(options) {
        var mapWrap = options.mapWrap || document.getElementById('map'),
            mLat = options.centerCoords.lat || 59.921947,
            mLon = options.centerCoords.lon || 30.333273,
            zoom = options.zoom || 13,
            marker = options.marker,
            routePicture = options.routePicture,
            routeCoords = options.routeCoords,
            map;

        var styles = [{
            stylers: [
                { saturation: -100 },
                { lightness: 15 }
            ]},
            {
                featureType: "administrative.locality",
                elementType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "poi",
                elementType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "water",
                stylers: [
                    { hue: "#adc9fd" },
                    { saturation: 0 },
                    { lightness: 5 }
                ]

            }];

        function initialize() {

            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control.
            var styledMap = new google.maps.StyledMapType(styles,
                {name: "Styled Map"});

            // Create a map object, and include the MapTypeId to add
            // to the map type control.
            var mapOptions = {
                zoom: zoom,
                center: new google.maps.LatLng(mLat, mLon),
                mapTypeControl: false,
                streetViewControl:false,
                panControl:false,
                scrollwheel:false
            };
            map = new google.maps.Map(mapWrap, mapOptions);

            //Associate the styled map with the MapTypeId and set it to display.
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');
        }

        initialize();

        var markerCoords = new google.maps.LatLng(marker.coords.lat, marker.coords.lon);
        var settedMarker = new google.maps.Marker({
            position: markerCoords,
            map: map,
            title: marker.title
        });

        if(routePicture) {
            var layerplace = new google.maps.LatLngBounds(
                new google.maps.LatLng(routeCoords.bottomLeftCorner.lat,routeCoords.bottomLeftCorner.lng),
                new google.maps.LatLng(routeCoords.topRightCorner.lat,routeCoords.topRightCorner.lng)
            );
            var layer = new google.maps.GroundOverlay(
                routePicture,
                layerplace);
            layer.setMap(map);
        }


    }

    window.ContactsMap = ContactsMap;


    //fancy:
	fancybox_func();
	function fancybox_func(){
		if($('.fancybox-elem').fancybox){
			$('.fancybox-elem').fancybox({
				padding:0
			});
		}

		$(".common-white-wrap a, .job-content a, .alignnone a, .alignleft a, .alignright a, .aligncenter a, .vacancy-wrap a, .object-page-wrap .main-content-wrap a").bind('click', function(event){
				var exttrue;
				fileName = $(this).attr('href');
				ext = fileName.split('.').pop();
				if (ext=='jpg' || ext=='jpeg' || ext=='png' || ext=='gif') {exttrue = true;}
				if(exttrue==true && $(this).children('img').length){
					event.preventDefault();
					var href1 = $(this).attr('href');
					$.fancybox.open([
						{href : href1, title : '', padding : '0'}
					]);
				}
			}
		);
	}


    //masonry
    var masonryContainer = $('.certificate-list');
    masonryContainer.imagesLoaded(function(){
        masonryContainer.masonry({
            itemSelector: '.certificate-list >li',
            gutter: 0
        });
    });

    //file api:
    function handleFileSelect(evt, $this) {
        var files = evt.target.files; // FileList object
        var caption = $this.parent().find('span');

        console.log(caption,files[0].name);
        caption.html(files[0].name);
    }

    $('input[type="file"]').change(function(e){
        handleFileSelect(e, $(this));
    });


    //validate form:

    function FormController(options) {

        var $form = options.$form,
            $textInputs = $form.find('input')
                .not('[type="radio"],[type="checked"],[type="submit"],[type="button"],[type="file"]');

        //check all fields before submit:
        $form.submit(function(e){
            var formIsCorrect = true;

            $textInputs.each(function(){
                if( !validateTextInput($(this)) ){
                    formIsCorrect = false;
                }
            });

            if(!formIsCorrect) {
                e.preventDefault();
            } else {
                $('.vacancy_submit').css('opacity', '0.3');
            }
        });

        //check field after blur:
        $textInputs.blur(function(){
            validateTextInput($(this));
        });

        function validateTextInput($textInput) {
            var correctField = true;
            var value = $textInput.val();

            if(!value || value == $textInput.attr('data-placeholder')) {
                correctField = false;
            }

            if($textInput.attr('type') == 'email') {
                if(!validateEmail(value)) {
                    correctField = false;
                }
            }

            if(!correctField) {
                showError($textInput);
                return false;
            } else {
                hideError($textInput);
                return true;
            }

            function validateEmail(x) {
                var atpos = x.indexOf("@");
                var dotpos = x.lastIndexOf(".");
                if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
                    return false;
                }
                return true;
            }
        }

        function showError($textInput) {
            $textInput.addClass('js-input-error');
        }

        function hideError($textInput) {
            $textInput.removeClass('js-input-error');
        }
    }

    $('.vacancy-bid-form form').each(function(){
        var form = new FormController({
            $form: $(this)
        });
    });

    //and validate form




})(jQuery);




















