$(document).ready(function(){
	$('form.object-filters input').change(function(){
		rubrics(1);
	});
	$('.main-menu .sub-menu li.ready a').click(function(e){
		if (e.preventDefault) {e.preventDefault();} else {e.returnValue = false;}
		$('.main-menu .sub-menu li.ready').removeClass('active');
		$(this).parent().addClass('active');
		rubrics(1);
	});
	
	$('.object-list-wrap').on('click', '.object-more-button', pagination);
});

function rubrics(paged, more){
	var rez = 0;
	var list_id = '';
	//var results = '';
	$('.job-section, .object-list-section').css('opacity','0.5');
	list_id = 'ajax=object&term_id=0';
	
	// Рубрики
	$('.object-filters input.obj_cat_num:checked').each(function (){
		list_id += ','+$(this).attr('term_id'); rez=1;
	});
	if (!rez) {
		list_id = 'ajax=object&term_id=0';
		$('.object-filters input.obj_cat_num').each(function (){
			list_id += ','+$(this).attr('term_id');
		});
	}
	
	// Готовность
	list_id += '&ready=';
	/* $('.object-filters input.ready_or_not:checked').each(function (){
		list_id += $(this).attr('ready'); rez=1;
	}); */
	$('.main-menu .sub-menu li.ready.active a').each(function (){
		list_id += $(this).attr('ready'); rez=1;
	});
	
	// Ajax
	$.ajax({
		type:'post',
		dataType:'json',
		data:list_id+'&current_page='+paged,
		success:function(result){
			$('.job-section, .object-list-section').css('opacity','1');
			updateNews(result, more);
			//max_num_pages(result.max_num_pages, paged);
		}
	});
}

// Обновить новости
function updateNews(results, more) {
	var result = '';
	var html = '';
	var current_year = results.year;
	for(result in results.posts){
		result=results.posts[result];
		
		if((Number(result.get_the_year) + Number(results.interval)) <= current_year){ current_year = result.get_the_year;
			html = html + '</ul></div></div></section><section class="common-section object-list-section"><div class="wrap-border"><div class="common-border-wrap"><h1 class="object-list-title"><span>'+(current_year - results.interval + 1)+' - '+current_year+'</span></h1><ul class="object-list">';
		}
		
		html = html + 
		'<li>'+
			'<a href="'+result.get_permalink+'">'+
				'<figure class="object-wrap">'+
					'<div class="object-picture" style="background-image: url('+result.image_url_bw+');"></div>'+
					'<div class="object-picture-hover" style="background-image: url('+result.image_url+');"></div>'+
					'<figcaption class="object-description">'+
						'<h2 class="object-name">'+result.get_the_title+'</h2>'+
						'<p class="object-info">'+
							'<span>Сдача объекта: '+result.get_the_date+' г.</span>'+
							'<span>Общая площадь: '+result.squea +' м²</span>'+
							'<span>Адрес: '+result.adress+'</span>'+
						'</p>'+
					'</figcaption>'+
				'</figure>'+
			'</a>'+
		'</li>';
	}
	html = '<section class="common-section object-list-section"><div class="wrap-border"><div class="common-border-wrap"><h1 class="object-list-title"><span>'+(results.year - results.interval + 1)+' - '+results.year+'</span></h1><ul class="object-list">' + html + '</ul><a class="object-more-button" href="#">Показать больше объектов</a></div></div></section>';
	
	if (!more) $('.object-list-section').remove();
	if (more) $('.object-more-button').remove();
	$('.object-list-wrap').append(html);
	
	$('.paginator').html(results.paginator);
	if (!$('.paginator .next').length) $('.object-more-button').hide();
}

function pagination(e) {
	if (e.preventDefault) {e.preventDefault();} else {e.returnValue = false;}
	next = $('.paginator .page-numbers.next').text();
	rubrics(next, true);
}





$(document).ready(function(){
	// Для событий
	$(".event-more-button").click(function(e){
		if (e.preventDefault) {e.preventDefault();} else {e.returnValue = false;}
		$('.news-row').css('opacity', '0.5');
		
		$.ajax({
			url: $('.next.page-numbers').attr('href'),
			success: function(results){
				html = $(results).find('.news-row');
				$('.news-section .news-row:last').after(html);
				$('.news-row').css('opacity', '1');
				
				$('.paginator').html($(results).find('.paginator a'));
				if (!$('.paginator .next').length) $('.event-more-button').hide();
			}
		});
	});
	
	// Для поиска
	$(".search-nav li a").not('.contacts_link').click(function(e){
		if (e.preventDefault) {e.preventDefault();} else {e.returnValue = false;}
		$li = $(this);
		$('.search-results-wrap').css('opacity', '0.3');
		
		$.get($li.attr('href'), function(html){
			html = $(html).find('.search-results');
			$('.search-results').replaceWith(html);
			$('.search-results-wrap').css('opacity', '1');
			$(".search-nav li").removeClass('active');
			$li.parent().addClass('active');
		});
	});
});









// Отправка почты для вакансий
/* $(".vacancy_mail_form").submit(function(e){
	if (e.preventDefault) {e.preventDefault();} else {e.returnValue = false;}
	$regForm = $(this);
	$('input[type="submit"]').css('opacity', '0.5');
	$.ajax({
		type:'POST', 
		dataType:'json',
		data:"ajax=mail&"+$regForm.serialize(),
		success: function(response){
			$('input[type="submit"]').css('opacity', '1');
		}
	});
}); */















