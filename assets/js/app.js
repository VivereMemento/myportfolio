(function() {
  'use strict';

svg4everybody();


//Tabs
    
$('.tabs__controls-link').on('click', function(e){
  e.preventDefault();

  var $this = $(this),
      container = $this.closest('.tabs'),
      item = container.find('.tabs__controls-item'),
      closestItem = $this.closest(item),
      contentItem = container.find('.tabs__list-item'),
      itemPosition = closestItem.index();

      contentItem.eq(itemPosition)
          .addClass('active')
          .siblings()
          .removeClass('active');

      closestItem.addClass('active')
          .siblings()
          .removeClass('active');

});

var clickArrow = function() {
  var winHeight = $('header').innerHeight();
  $('html, body').animate({scrollTop: winHeight}, 1500);
};

$('.clickArrow').on('click', clickArrow);

// autorize

var clickLogin = function(event) {
  var 
      formGroup = $('.form__text, .form__input-item'),
      labelGroup = $('.form__input-icon'),
      iconGroup = $('.icons'),
      checkGroup = $('.form__checks'),
      target = $( event.target );
  if(target.is('.login__auth-btn')) {
    $('.flipper').addClass('flip');
  }

  else {
    if(target.is('.login-wrap') || target.is('.form__btn-link_mods')) {
      $('.flipper').removeClass('flip');
      formGroup.find('.tooltip').remove();
      formGroup.removeClass('error');
      labelGroup.removeClass('label-error');
      iconGroup.removeClass('icon-error');
      checkGroup.find('.tooltip').remove();
    }
  }
};

$(document).on('click', clickLogin);

var parallaxHeader = (function() {
  var bg = document.querySelector('.bg-wrap');
  var portfolioBg = document.querySelector('.portfolio-bg__img');
  var avatar = document.querySelector('.avatar');

  var leave_1 = document.querySelector('.testimonials__leaves-1');
  var leave_2 = document.querySelector('.testimonials__leaves-2');
  var leave_3 = document.querySelector('.testimonials__leaves-3');

  return {
    move: function(block, windowScroll, strafeAmount) {
      var strafe = windowScroll / -strafeAmount + '%';
      var transformString = 'translate3d(0, ' + strafe + ', 0)';

      var style = block.style;

      style.transform = transformString;
      style.webkiTtransform = transformString;
    },

    init: function (wScroll) {
      this.move(bg, wScroll, 40);

      if ($('.works, .about').length) {
        this.move(portfolioBg, wScroll, 10);
        this.move(avatar, wScroll, 5);
      }
      

      if ($('.works').length) {
        this.move(leave_1, wScroll, 15);
        this.move(leave_2, wScroll, 5);
        this.move(leave_3, wScroll, 3); 
      }
    }
  }
}());

window.onscroll = function() {
  var wScroll = window.pageYOffset;

  parallaxHeader.init(wScroll);
}

})();


var preLoader = (function () {

	var init = function () {
		var imgs = imgPath.toArray();
		loadImages(imgs);
	};

	var _setUpListners = function () {
			
		};

	var percentsTotal = 1,
		preloader = $('.preloader');

	var imgPath = $('*').map(function(ndx, element) {
		var background = $(element).css('background-image'),
			img = $(element).is('img'),
			path = '';

		if (background != 'none') {
			path = background.replace('url("', '').replace('")', '');
		}

		if (img) {
			path = $(element).attr('src');
		}

		if (path) return path
	});

	var setPercents = function (total, current) {
		var persents = Math.ceil(current / total * 100);

		$('.preloader__percents').text(persents + '%');

		if (persents >= 100) {
			preloader.fadeOut();
		}
	}

	var loadImages = function (images) {

		if (!images.length) preloader.fadeOut();

		images.forEach(function (img, i, images) {
		   var fakeImage = $('<img>', {
				attr : {
					src : img
				}
		   });

			fakeImage.on('load error', function () {
				setPercents(images.length, percentsTotal);
				percentsTotal++;
				$('.login__avatar').addClass('avatar__rotate-js');
			});
		});
	}

	return {
		init: init
	}

})();

preLoader.init();
var myMenu = (function() {

	var init = function() {
			_setUpListners();
		};

	var _setUpListners = function() {
		$('.trigger-menu-wrap').on('click', _showMenu);
	};

	var _showMenu = function() {
		if($('.trigger-menu').hasClass('js-change')){
			$('.trigger-menu').removeClass('js-change');
			$('.menu__list').fadeOut();
			$('.menu').delay(300).fadeOut();
			$('.menu-wrap').removeClass('js-change');
		}
		else{
			$('.trigger-menu').addClass('js-change');
			$('.menu').fadeIn();
			$('.menu-wrap').addClass('js-change');
			$('.menu__list').delay(800).fadeIn();
		}
	};

	return {
		init: init
	}

})();

myMenu.init();
var formValidate = function(){

	var init = function() {
		_setUpListners();
	};

	var _setUpListners = function() {
		$('#contact-me').on('submit', _mailMe);
		$('#login-form').on('submit', _loginValid);
		$('.form__input').on('focus', _focused);
		$('.form__input').on('focusout', _unfocused);
	};

	var _focused = function() {
		$this = $(this)
		formGroup = $this.closest('.form__input-item'),
		labelGroup = formGroup.find('.form__input-icon')
		iconGroup = formGroup.find('.icons');

		formGroup.addClass('input-focused');
		labelGroup.addClass('label-focused');
		iconGroup.addClass('icon-focused');
		labelGroup.removeClass('label-error');
		iconGroup.removeClass('icon-error');
	};

	var _unfocused = function() {
		$this = $(this)
		formGroup = $this.closest('.form__input-item'),
		labelGroup = formGroup.find('.form__input-icon');

		formGroup.removeClass('input-focused');
		labelGroup.removeClass('label-focused');
		iconGroup.removeClass('icon-focused');
	};

	var _loginValid = function(e) {
		e.preventDefault();
		var form = $(this);
		if ( valid(form) === false ) return false;

		$.ajax({
			url: "/",
			method: "POST",
			data: form.serialize(),
			statusCode: {
				200: function() {
				form.html("Вы вошли на сайт").addClass('alert-success');
				window.location.href = "/auth.html";
				},
				403: function(jqXHR) {
				var error = JSON.parse(jqXHR.responseText);
				$('.error', form).html(error.message);
				}
			}
		});
		return false;
	};

	var _mailMe = function(e) {
		e.preventDefault();
		var form = $(this);
		if ( valid(form) === false ) return false;

		var from,email,message,data;
		var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
		from = $("#mail-name").val();
		email = $("#mail-email").val();
		message = $("#mail-message").val();
		data = form.serialize();
		if(email != ''){
			if(email.search(pattern) == 0){
				$.ajax({
					url: '/send',
					type: 'POST',
					data: data
				})
				.done(function() {
					form.slideUp(200);
					$('.form__btn-wrap').hide();
					$('.form__succes').show();
				})
				.fail(function() {
					form.slideUp(200);
					$('.form__btn-wrap').hide();
					$('.form__error').show();
				})
			} else {
				$('input#mail-email').parents('.form__text').addClass('error');
				$('<span class="tooltip">Некорректрый email</span>').prependTo('.error');
			}
		}
	};

	var valid = function(form) {
		var inputs = form.find('input, textarea'),
			labels = form.find('.form__input-icon'),
			icons = form.find('.icons'),
			checks = form.find('input:checkbox, input:radio'),
			checksOk = form.find('input:checked'),
			valid = true;

		$.each(inputs, function(index, val) {
			var input = $(val),
			val = input.val(),
			resetBtn = $('.resetBtn'),
			formGroup = input.parents('.form__input-item'),
			label = formGroup.find('label').text().toLowerCase(),
			textError = 'Вы не ввели ' + label,
			tooltip = $('<span class="tooltip">' + textError + '</span>');

			if (val.length === 0){
				formGroup.addClass('error');
				labels.addClass('label-error');
				icons.addClass('icon-error');
				tooltip.appendTo(formGroup);
				input.on('focus', function(){
					formGroup.find('.tooltip').remove();
					formGroup.removeClass('error');
					formGroup.removeClass('label-error');
				});
				input.on('keydown', function(){
					formGroup.removeClass('error');
				});
				resetBtn.on('click', function() {
					formGroup.removeClass('error');
					formGroup.find('.tooltip').remove();
				});
				checks.on('change', function(){
					checkGroup.find('.tooltip').remove();
				});
				valid = false;
			}
		});

		var checkGroup = $('.form__checks'),
			tooltip = $('<span class="tooltip">Роботам тут не место</span>');

		if (checks.length > 0) {

			if (checksOk.length < 2) {
				tooltip.appendTo(checkGroup);
				valid = false;
			}
		}
		return valid;
	}
	return {
		init: init
	}
}();

formValidate.init();
var blogMenu = (function() {

	var init = function() {
			if ($('.blog').length) {
				_setUpListners();
			}
		};

	var _setUpListners = function () {
		$('.blog__aside-menu').on('click', _showBlogMenu);
		$('body').on('click', '.blog__aside-title', _clickToArticle);
		$(window).scroll(function(){
			_stickMenu ();
			_lightLink();
		});
	};

//stick blog-menu
	
	var _stickMenu = function() {
		var asidePos = $('.blog__aside').offset().top - 50;
		var winPos = $(window).scrollTop();
		
		if (winPos >= asidePos) {
			$('.blog__aside-menu').addClass('menu-fixed');  
		} else {
			$('.blog__aside-menu').removeClass('menu-fixed');
		}
	};


//lightning menu-item

	var _lightLink = function() {
		$('.articles__item').each(function() {
			var
				$this = $(this),
				topEdge = $this.offset().top - 200,
				bottomEdge = topEdge + $this.height(),
				wScroll = $(window).scrollTop();

			if (topEdge < wScroll && bottomEdge > wScroll) {
				var
					currentId = $this.data('section'),
					reqLink = $('.blog__aside-title').filter('[href="#' + currentId + '"]');

				reqLink.closest('.blog__aside-item').addClass('active')
					.siblings().removeClass('active');
			}
		});
	};

//click trigger-menu

	var _showBlogMenu = function() {
		if($('.blog__aside-menu').hasClass('menu-fixed-tablets')){
			$('.blog__aside-menu').removeClass('menu-fixed-tablets');
			} else {
			$('.blog__aside-menu').addClass('menu-fixed-tablets');
		}
	};

	var _clickToArticle = function(e) {
			e.preventDefault();
			var
				$this = $(this),
				item = $this.closest('.blog__aside-item'),
				index = item.index(),
				sections = $('.articles__item'),
				reqSection = sections.eq(index),
				windowMargin = $(window).height() / 3,
				sectionOffset = reqSection.offset().top;
			$('body, html').animate({
				'scrollTop' : sectionOffset - 100
			});
		};

	return {
		init: init
	}

})();

blogMenu.init();
var aviatitle = (function() {

    var generate = function (string, block) {
        var
            wordsArray = string.split(' '),
            stringArray = string.split(''),
            sentence = [],
            word = '';

        block.text('');

        wordsArray.forEach(function(currentWord) {
            var wordsArray = currentWord.split('');

            wordsArray.forEach(function(letter) {
                var letterHtml = '<span class="letter-span">' + letter + '</span>';

                word += letterHtml;
            });

            var wordHTML = '<span class="letter-word">' + word + '</span>'

            sentence.push(wordHTML);
            word = '';
        });

        block.append(sentence.join(' '));

        // анимация появления
        var
            letters = block.find('.letter-span'),
            counter = 0,
            timer,
            duration = 500 / stringArray.length;

        function showLetters() {
            var currentLetter = letters.eq(counter);

            currentLetter.addClass('active');
            counter++;

            if (typeof timer !== 'undefined') {
                clearTimeout(timer);
            }

            timer = setTimeout(showLetters, duration);
        }

        showLetters();

    };


    return {
        generate : generate
    }
    
})();
var mySlider = (function() {

	var init = function() {
			_setUpListners();
		};

	var _setUpListners = function () {
		var slider = new Slider($('.works'));
			slider.setDefaults();

		$('.works-slider__control-btn_left').on('click', function(e){
			e.preventDefault();
			slider.moveSlide('prev');
		});

		$('.works-slider__control-btn_right').on('click', function(e){
			e.preventDefault();
			slider.moveSlide('next');
		});
	};

	//slider

	var Slider = function() {

		var
			container   = $('.works');
			nextBtn     = container.find('.works-slider__control-btn_left'),
			prevBtn     = container.find('.works-slider__control-btn_right'),
			items       = nextBtn.find('.works-slider__control-item'),
			display     = container.find('.works-slider__display'),
			title       = container.find('.subtitle'),
			skills      = container.find('.works__content-desc'),
			link        = container.find('.works__content-view'),
			itemsLength = items.length,
			duration    = 500,
			flag        = true;

		var timeout;

		this.counter = 0;

		// private

		var generateMarkups = function() {
			var list = nextBtn.find('.works-slider__control-list'),
				markups = list.clone();

			prevBtn
				.append(markups)
				.find('.works-slider__control-item')
				.removeClass('active')
				.eq(this.counter + 1)
				.addClass('active');
		}

		var getDataArrays = function() {
			var dataObject = {
				pics : [],
				title : [],
				skills : [],
				link : []
			};

			$.each(items, function() {
				var $this = $(this);

				dataObject.pics.push($this.data('full'));
				dataObject.title.push($this.data('title'));
				dataObject.skills.push($this.data('skills'));
				dataObject.link.push($this.data('link'));
			});

			return dataObject;
		}

		var slideInLeftBtn = function(slide) {
			var
				reqItem = items.eq(slide - 1),
				activeItem = items.filter('.active');

			activeItem
				.stop(true, true)
				.animate({'top' : '100%'}, duration);

				reqItem
					.stop(true, true)
					.animate({'top' : '0%'}, duration, function () {
						$(this).addClass('active')
							.siblings().removeClass('active')
							.css('top', '-100%')
					});


		}

		var slideInRightBtn = function (slide) {
			var
				items = prevBtn.find('.works-slider__control-item'),
				activeItem = items.filter('.active'),
				reqSlide = slide + 1;

			if (reqSlide > itemsLength - 1) {
				reqSlide = 0;
			}

			var reqItem = items.eq(reqSlide);

			activeItem
				.stop(true, true)
				.animate({'top' : '-100%'}, duration);

			reqItem
				.stop(true, true)
				.animate({'top' : '0%'}, duration, function () {
					$(this).addClass('active')
						.siblings().removeClass('active')
						.css('top', '100%')
				});
		};

		var changeMainPicture = function(slide) {
			var image = display.find('.works-slider__display-pic');
			var data = getDataArrays();

			image
				.stop(true, true)
				.fadeOut(duration / 2, function() {
					image.attr('src', data.pics[slide]);
					$(this).fadeIn(duration / 2);
				});
		}

		var changeTextData = function(slide) {
			var data = getDataArrays();

			// name of work
			aviatitle.generate(data.title[slide], title, 'ru');

			// description of technology
			aviatitle.generate(data.skills[slide], skills, 'en');

			// link to work
			link.attr('href', data.link[slide]);
		}
		
		// public
		this.setDefaults = function() {
			var
				_that = this,
				data = getDataArrays();

			// making murkup
			generateMarkups();

			// left button
			nextBtn
				.find('.works-slider__control-item')
				.eq(_that.counter - 1)
				.addClass('active');

			// right button
			prevBtn
				.find('.works-slider__control-item')
				.eq(_that.counter + 1)
				.addClass('active');

			// main image
			display
				.find('.works-slider__display-pic')
				.attr('src', data.pics[_that.counter]);

			// text description
			changeTextData(_that.counter);

		};

		this.moveSlide = function(direction) {
			var _that = this;

			var directions = {
				next : function() {
					// loopback of slider-item
					if (_that.counter < itemsLength - 1) {
						_that.counter++;
					} else {
						_that.counter = 0;
					}
				},

				prev : function () {
					if (_that.counter > 0) {
						_that.counter--;
					} else {
						_that.counter = itemsLength - 1;
					}
				}
			};

			directions[direction]();

			if (flag) {
				flag = false;

				if (typeof timeout != 'undefined') {
					clearTimeout(timeout);
				}

				timeout = setTimeout(function () {
					flag = true;
				}, duration + 50);

				slideInLeftBtn(_that.counter);
				slideInRightBtn(_that.counter);
				changeMainPicture(_that.counter);
				changeTextData(_that.counter);
			}
		};
	};
	return {
		init: init
	}
})();

mySlider.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInByZWxvYWRlci5qcyIsIm1lbnUuanMiLCJ2YWxpZGF0aW9uLmpzIiwiYmxvZy1tZW51LmpzIiwiYXZpYXRpdGxlLmpzIiwic2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbnN2ZzRldmVyeWJvZHkoKTtcclxuXHJcblxyXG4vL1RhYnNcclxuICAgIFxyXG4kKCcudGFic19fY29udHJvbHMtbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCgnLnRhYnMnKSxcclxuICAgICAgaXRlbSA9IGNvbnRhaW5lci5maW5kKCcudGFic19fY29udHJvbHMtaXRlbScpLFxyXG4gICAgICBjbG9zZXN0SXRlbSA9ICR0aGlzLmNsb3Nlc3QoaXRlbSksXHJcbiAgICAgIGNvbnRlbnRJdGVtID0gY29udGFpbmVyLmZpbmQoJy50YWJzX19saXN0LWl0ZW0nKSxcclxuICAgICAgaXRlbVBvc2l0aW9uID0gY2xvc2VzdEl0ZW0uaW5kZXgoKTtcclxuXHJcbiAgICAgIGNvbnRlbnRJdGVtLmVxKGl0ZW1Qb3NpdGlvbilcclxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgIC5zaWJsaW5ncygpXHJcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgY2xvc2VzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAuc2libGluZ3MoKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbn0pO1xyXG5cclxudmFyIGNsaWNrQXJyb3cgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgd2luSGVpZ2h0ID0gJCgnaGVhZGVyJykuaW5uZXJIZWlnaHQoKTtcclxuICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiB3aW5IZWlnaHR9LCAxNTAwKTtcclxufTtcclxuXHJcbiQoJy5jbGlja0Fycm93Jykub24oJ2NsaWNrJywgY2xpY2tBcnJvdyk7XHJcblxyXG4vLyBhdXRvcml6ZVxyXG5cclxudmFyIGNsaWNrTG9naW4gPSBmdW5jdGlvbihldmVudCkge1xyXG4gIHZhciBcclxuICAgICAgZm9ybUdyb3VwID0gJCgnLmZvcm1fX3RleHQsIC5mb3JtX19pbnB1dC1pdGVtJyksXHJcbiAgICAgIGxhYmVsR3JvdXAgPSAkKCcuZm9ybV9faW5wdXQtaWNvbicpLFxyXG4gICAgICBpY29uR3JvdXAgPSAkKCcuaWNvbnMnKSxcclxuICAgICAgY2hlY2tHcm91cCA9ICQoJy5mb3JtX19jaGVja3MnKSxcclxuICAgICAgdGFyZ2V0ID0gJCggZXZlbnQudGFyZ2V0ICk7XHJcbiAgaWYodGFyZ2V0LmlzKCcubG9naW5fX2F1dGgtYnRuJykpIHtcclxuICAgICQoJy5mbGlwcGVyJykuYWRkQ2xhc3MoJ2ZsaXAnKTtcclxuICB9XHJcblxyXG4gIGVsc2Uge1xyXG4gICAgaWYodGFyZ2V0LmlzKCcubG9naW4td3JhcCcpIHx8IHRhcmdldC5pcygnLmZvcm1fX2J0bi1saW5rX21vZHMnKSkge1xyXG4gICAgICAkKCcuZmxpcHBlcicpLnJlbW92ZUNsYXNzKCdmbGlwJyk7XHJcbiAgICAgIGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG4gICAgICBmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgIGxhYmVsR3JvdXAucmVtb3ZlQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcbiAgICAgIGljb25Hcm91cC5yZW1vdmVDbGFzcygnaWNvbi1lcnJvcicpO1xyXG4gICAgICBjaGVja0dyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywgY2xpY2tMb2dpbik7XHJcblxyXG52YXIgcGFyYWxsYXhIZWFkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJnLXdyYXAnKTtcclxuICB2YXIgcG9ydGZvbGlvQmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9ydGZvbGlvLWJnX19pbWcnKTtcclxuICB2YXIgYXZhdGFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmF2YXRhcicpO1xyXG5cclxuICB2YXIgbGVhdmVfMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0aW1vbmlhbHNfX2xlYXZlcy0xJyk7XHJcbiAgdmFyIGxlYXZlXzIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVzdGltb25pYWxzX19sZWF2ZXMtMicpO1xyXG4gIHZhciBsZWF2ZV8zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3RpbW9uaWFsc19fbGVhdmVzLTMnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vdmU6IGZ1bmN0aW9uKGJsb2NrLCB3aW5kb3dTY3JvbGwsIHN0cmFmZUFtb3VudCkge1xyXG4gICAgICB2YXIgc3RyYWZlID0gd2luZG93U2Nyb2xsIC8gLXN0cmFmZUFtb3VudCArICclJztcclxuICAgICAgdmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCAnICsgc3RyYWZlICsgJywgMCknO1xyXG5cclxuICAgICAgdmFyIHN0eWxlID0gYmxvY2suc3R5bGU7XHJcblxyXG4gICAgICBzdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcbiAgICAgIHN0eWxlLndlYmtpVHRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKHdTY3JvbGwpIHtcclxuICAgICAgdGhpcy5tb3ZlKGJnLCB3U2Nyb2xsLCA0MCk7XHJcblxyXG4gICAgICBpZiAoJCgnLndvcmtzLCAuYWJvdXQnKS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLm1vdmUocG9ydGZvbGlvQmcsIHdTY3JvbGwsIDEwKTtcclxuICAgICAgICB0aGlzLm1vdmUoYXZhdGFyLCB3U2Nyb2xsLCA1KTtcclxuICAgICAgfVxyXG4gICAgICBcclxuXHJcbiAgICAgIGlmICgkKCcud29ya3MnKS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLm1vdmUobGVhdmVfMSwgd1Njcm9sbCwgMTUpO1xyXG4gICAgICAgIHRoaXMubW92ZShsZWF2ZV8yLCB3U2Nyb2xsLCA1KTtcclxuICAgICAgICB0aGlzLm1vdmUobGVhdmVfMywgd1Njcm9sbCwgMyk7IFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KCkpO1xyXG5cclxud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHdTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG4gIHBhcmFsbGF4SGVhZGVyLmluaXQod1Njcm9sbCk7XHJcbn1cclxuXHJcbn0pKCk7XHJcblxyXG4iLCJ2YXIgcHJlTG9hZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgaW1ncyA9IGltZ1BhdGgudG9BcnJheSgpO1xyXG5cdFx0bG9hZEltYWdlcyhpbWdzKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0dmFyIHBlcmNlbnRzVG90YWwgPSAxLFxyXG5cdFx0cHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpO1xyXG5cclxuXHR2YXIgaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24obmR4LCBlbGVtZW50KSB7XHJcblx0XHR2YXIgYmFja2dyb3VuZCA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXHJcblx0XHRcdGltZyA9ICQoZWxlbWVudCkuaXMoJ2ltZycpLFxyXG5cdFx0XHRwYXRoID0gJyc7XHJcblxyXG5cdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcclxuXHR9KTtcclxuXHJcblx0dmFyIHNldFBlcmNlbnRzID0gZnVuY3Rpb24gKHRvdGFsLCBjdXJyZW50KSB7XHJcblx0XHR2YXIgcGVyc2VudHMgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcclxuXHJcblx0XHQkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyc2VudHMgKyAnJScpO1xyXG5cclxuXHRcdGlmIChwZXJzZW50cyA+PSAxMDApIHtcclxuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBsb2FkSW1hZ2VzID0gZnVuY3Rpb24gKGltYWdlcykge1xyXG5cclxuXHRcdGlmICghaW1hZ2VzLmxlbmd0aCkgcHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHJcblx0XHRpbWFnZXMuZm9yRWFjaChmdW5jdGlvbiAoaW1nLCBpLCBpbWFnZXMpIHtcclxuXHRcdCAgIHZhciBmYWtlSW1hZ2UgPSAkKCc8aW1nPicsIHtcclxuXHRcdFx0XHRhdHRyIDoge1xyXG5cdFx0XHRcdFx0c3JjIDogaW1nXHJcblx0XHRcdFx0fVxyXG5cdFx0ICAgfSk7XHJcblxyXG5cdFx0XHRmYWtlSW1hZ2Uub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2V0UGVyY2VudHMoaW1hZ2VzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHRcdCQoJy5sb2dpbl9fYXZhdGFyJykuYWRkQ2xhc3MoJ2F2YXRhcl9fcm90YXRlLWpzJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH1cclxuXHJcbn0pKCk7XHJcblxyXG5wcmVMb2FkZXIuaW5pdCgpOyIsInZhciBteU1lbnUgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0XHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdCQoJy50cmlnZ2VyLW1lbnUtd3JhcCcpLm9uKCdjbGljaycsIF9zaG93TWVudSk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9zaG93TWVudSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoJCgnLnRyaWdnZXItbWVudScpLmhhc0NsYXNzKCdqcy1jaGFuZ2UnKSl7XHJcblx0XHRcdCQoJy50cmlnZ2VyLW1lbnUnKS5yZW1vdmVDbGFzcygnanMtY2hhbmdlJyk7XHJcblx0XHRcdCQoJy5tZW51X19saXN0JykuZmFkZU91dCgpO1xyXG5cdFx0XHQkKCcubWVudScpLmRlbGF5KDMwMCkuZmFkZU91dCgpO1xyXG5cdFx0XHQkKCcubWVudS13cmFwJykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZScpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0JCgnLnRyaWdnZXItbWVudScpLmFkZENsYXNzKCdqcy1jaGFuZ2UnKTtcclxuXHRcdFx0JCgnLm1lbnUnKS5mYWRlSW4oKTtcclxuXHRcdFx0JCgnLm1lbnUtd3JhcCcpLmFkZENsYXNzKCdqcy1jaGFuZ2UnKTtcclxuXHRcdFx0JCgnLm1lbnVfX2xpc3QnKS5kZWxheSg4MDApLmZhZGVJbigpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fVxyXG5cclxufSkoKTtcclxuXHJcbm15TWVudS5pbml0KCk7IiwidmFyIGZvcm1WYWxpZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdH07XHJcblxyXG5cdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnI2NvbnRhY3QtbWUnKS5vbignc3VibWl0JywgX21haWxNZSk7XHJcblx0XHQkKCcjbG9naW4tZm9ybScpLm9uKCdzdWJtaXQnLCBfbG9naW5WYWxpZCk7XHJcblx0XHQkKCcuZm9ybV9faW5wdXQnKS5vbignZm9jdXMnLCBfZm9jdXNlZCk7XHJcblx0XHQkKCcuZm9ybV9faW5wdXQnKS5vbignZm9jdXNvdXQnLCBfdW5mb2N1c2VkKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX2ZvY3VzZWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdCR0aGlzID0gJCh0aGlzKVxyXG5cdFx0Zm9ybUdyb3VwID0gJHRoaXMuY2xvc2VzdCgnLmZvcm1fX2lucHV0LWl0ZW0nKSxcclxuXHRcdGxhYmVsR3JvdXAgPSBmb3JtR3JvdXAuZmluZCgnLmZvcm1fX2lucHV0LWljb24nKVxyXG5cdFx0aWNvbkdyb3VwID0gZm9ybUdyb3VwLmZpbmQoJy5pY29ucycpO1xyXG5cclxuXHRcdGZvcm1Hcm91cC5hZGRDbGFzcygnaW5wdXQtZm9jdXNlZCcpO1xyXG5cdFx0bGFiZWxHcm91cC5hZGRDbGFzcygnbGFiZWwtZm9jdXNlZCcpO1xyXG5cdFx0aWNvbkdyb3VwLmFkZENsYXNzKCdpY29uLWZvY3VzZWQnKTtcclxuXHRcdGxhYmVsR3JvdXAucmVtb3ZlQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcblx0XHRpY29uR3JvdXAucmVtb3ZlQ2xhc3MoJ2ljb24tZXJyb3InKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3VuZm9jdXNlZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JHRoaXMgPSAkKHRoaXMpXHJcblx0XHRmb3JtR3JvdXAgPSAkdGhpcy5jbG9zZXN0KCcuZm9ybV9faW5wdXQtaXRlbScpLFxyXG5cdFx0bGFiZWxHcm91cCA9IGZvcm1Hcm91cC5maW5kKCcuZm9ybV9faW5wdXQtaWNvbicpO1xyXG5cclxuXHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnaW5wdXQtZm9jdXNlZCcpO1xyXG5cdFx0bGFiZWxHcm91cC5yZW1vdmVDbGFzcygnbGFiZWwtZm9jdXNlZCcpO1xyXG5cdFx0aWNvbkdyb3VwLnJlbW92ZUNsYXNzKCdpY29uLWZvY3VzZWQnKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX2xvZ2luVmFsaWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZm9ybSA9ICQodGhpcyk7XHJcblx0XHRpZiAoIHZhbGlkKGZvcm0pID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHQkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IFwiL1wiLFxyXG5cdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRkYXRhOiBmb3JtLnNlcmlhbGl6ZSgpLFxyXG5cdFx0XHRzdGF0dXNDb2RlOiB7XHJcblx0XHRcdFx0MjAwOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRmb3JtLmh0bWwoXCLQktGLINCy0L7RiNC70Lgg0L3QsCDRgdCw0LnRglwiKS5hZGRDbGFzcygnYWxlcnQtc3VjY2VzcycpO1xyXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYXV0aC5odG1sXCI7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQ0MDM6IGZ1bmN0aW9uKGpxWEhSKSB7XHJcblx0XHRcdFx0dmFyIGVycm9yID0gSlNPTi5wYXJzZShqcVhIUi5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdCQoJy5lcnJvcicsIGZvcm0pLmh0bWwoZXJyb3IubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX21haWxNZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBmb3JtID0gJCh0aGlzKTtcclxuXHRcdGlmICggdmFsaWQoZm9ybSkgPT09IGZhbHNlICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHZhciBmcm9tLGVtYWlsLG1lc3NhZ2UsZGF0YTtcclxuXHRcdHZhciBwYXR0ZXJuID0gL15bYS16MC05Xy1dK0BbYS16MC05LV0rXFwuKFthLXpdezEsNn1cXC4pP1thLXpdezIsNn0kL2k7XHJcblx0XHRmcm9tID0gJChcIiNtYWlsLW5hbWVcIikudmFsKCk7XHJcblx0XHRlbWFpbCA9ICQoXCIjbWFpbC1lbWFpbFwiKS52YWwoKTtcclxuXHRcdG1lc3NhZ2UgPSAkKFwiI21haWwtbWVzc2FnZVwiKS52YWwoKTtcclxuXHRcdGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xyXG5cdFx0aWYoZW1haWwgIT0gJycpe1xyXG5cdFx0XHRpZihlbWFpbC5zZWFyY2gocGF0dGVybikgPT0gMCl7XHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogJy9zZW5kJyxcclxuXHRcdFx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Zm9ybS5zbGlkZVVwKDIwMCk7XHJcblx0XHRcdFx0XHQkKCcuZm9ybV9fYnRuLXdyYXAnKS5oaWRlKCk7XHJcblx0XHRcdFx0XHQkKCcuZm9ybV9fc3VjY2VzJykuc2hvdygpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRmb3JtLnNsaWRlVXAoMjAwKTtcclxuXHRcdFx0XHRcdCQoJy5mb3JtX19idG4td3JhcCcpLmhpZGUoKTtcclxuXHRcdFx0XHRcdCQoJy5mb3JtX19lcnJvcicpLnNob3coKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJ2lucHV0I21haWwtZW1haWwnKS5wYXJlbnRzKCcuZm9ybV9fdGV4dCcpLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdCQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPtCd0LXQutC+0YDRgNC10LrRgtGA0YvQuSBlbWFpbDwvc3Bhbj4nKS5wcmVwZW5kVG8oJy5lcnJvcicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dmFyIHZhbGlkID0gZnVuY3Rpb24oZm9ybSkge1xyXG5cdFx0dmFyIGlucHV0cyA9IGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhJyksXHJcblx0XHRcdGxhYmVscyA9IGZvcm0uZmluZCgnLmZvcm1fX2lucHV0LWljb24nKSxcclxuXHRcdFx0aWNvbnMgPSBmb3JtLmZpbmQoJy5pY29ucycpLFxyXG5cdFx0XHRjaGVja3MgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrYm94LCBpbnB1dDpyYWRpbycpLFxyXG5cdFx0XHRjaGVja3NPayA9IGZvcm0uZmluZCgnaW5wdXQ6Y2hlY2tlZCcpLFxyXG5cdFx0XHR2YWxpZCA9IHRydWU7XHJcblxyXG5cdFx0JC5lYWNoKGlucHV0cywgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xyXG5cdFx0XHR2YXIgaW5wdXQgPSAkKHZhbCksXHJcblx0XHRcdHZhbCA9IGlucHV0LnZhbCgpLFxyXG5cdFx0XHRyZXNldEJ0biA9ICQoJy5yZXNldEJ0bicpLFxyXG5cdFx0XHRmb3JtR3JvdXAgPSBpbnB1dC5wYXJlbnRzKCcuZm9ybV9faW5wdXQtaXRlbScpLFxyXG5cdFx0XHRsYWJlbCA9IGZvcm1Hcm91cC5maW5kKCdsYWJlbCcpLnRleHQoKS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHR0ZXh0RXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LggJyArIGxhYmVsLFxyXG5cdFx0XHR0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+JyArIHRleHRFcnJvciArICc8L3NwYW4+Jyk7XHJcblxyXG5cdFx0XHRpZiAodmFsLmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0Zm9ybUdyb3VwLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdGxhYmVscy5hZGRDbGFzcygnbGFiZWwtZXJyb3InKTtcclxuXHRcdFx0XHRpY29ucy5hZGRDbGFzcygnaWNvbi1lcnJvcicpO1xyXG5cdFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oZm9ybUdyb3VwKTtcclxuXHRcdFx0XHRpbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJlc2V0QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Y2hlY2tzLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y2hlY2tHcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBjaGVja0dyb3VwID0gJCgnLmZvcm1fX2NoZWNrcycpLFxyXG5cdFx0XHR0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+0KDQvtCx0L7RgtCw0Lwg0YLRg9GCINC90LUg0LzQtdGB0YLQvjwvc3Bhbj4nKTtcclxuXHJcblx0XHRpZiAoY2hlY2tzLmxlbmd0aCA+IDApIHtcclxuXHJcblx0XHRcdGlmIChjaGVja3NPay5sZW5ndGggPCAyKSB7XHJcblx0XHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhjaGVja0dyb3VwKTtcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmFsaWQ7XHJcblx0fVxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fVxyXG59KCk7XHJcblxyXG5mb3JtVmFsaWRhdGUuaW5pdCgpOyIsInZhciBibG9nTWVudSA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCQoJy5ibG9nJykubGVuZ3RoKSB7XHJcblx0XHRcdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnLmJsb2dfX2FzaWRlLW1lbnUnKS5vbignY2xpY2snLCBfc2hvd0Jsb2dNZW51KTtcclxuXHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCAnLmJsb2dfX2FzaWRlLXRpdGxlJywgX2NsaWNrVG9BcnRpY2xlKTtcclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuXHRcdFx0X3N0aWNrTWVudSAoKTtcclxuXHRcdFx0X2xpZ2h0TGluaygpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcbi8vc3RpY2sgYmxvZy1tZW51XHJcblx0XHJcblx0dmFyIF9zdGlja01lbnUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBhc2lkZVBvcyA9ICQoJy5ibG9nX19hc2lkZScpLm9mZnNldCgpLnRvcCAtIDUwO1xyXG5cdFx0dmFyIHdpblBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHRcdFxyXG5cdFx0aWYgKHdpblBvcyA+PSBhc2lkZVBvcykge1xyXG5cdFx0XHQkKCcuYmxvZ19fYXNpZGUtbWVudScpLmFkZENsYXNzKCdtZW51LWZpeGVkJyk7ICBcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5ibG9nX19hc2lkZS1tZW51JykucmVtb3ZlQ2xhc3MoJ21lbnUtZml4ZWQnKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHJcbi8vbGlnaHRuaW5nIG1lbnUtaXRlbVxyXG5cclxuXHR2YXIgX2xpZ2h0TGluayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnLmFydGljbGVzX19pdGVtJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyXHJcblx0XHRcdFx0JHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHRvcEVkZ2UgPSAkdGhpcy5vZmZzZXQoKS50b3AgLSAyMDAsXHJcblx0XHRcdFx0Ym90dG9tRWRnZSA9IHRvcEVkZ2UgKyAkdGhpcy5oZWlnaHQoKSxcclxuXHRcdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0aWYgKHRvcEVkZ2UgPCB3U2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB3U2Nyb2xsKSB7XHJcblx0XHRcdFx0dmFyXHJcblx0XHRcdFx0XHRjdXJyZW50SWQgPSAkdGhpcy5kYXRhKCdzZWN0aW9uJyksXHJcblx0XHRcdFx0XHRyZXFMaW5rID0gJCgnLmJsb2dfX2FzaWRlLXRpdGxlJykuZmlsdGVyKCdbaHJlZj1cIiMnICsgY3VycmVudElkICsgJ1wiXScpO1xyXG5cclxuXHRcdFx0XHRyZXFMaW5rLmNsb3Nlc3QoJy5ibG9nX19hc2lkZS1pdGVtJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG4vL2NsaWNrIHRyaWdnZXItbWVudVxyXG5cclxuXHR2YXIgX3Nob3dCbG9nTWVudSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoJCgnLmJsb2dfX2FzaWRlLW1lbnUnKS5oYXNDbGFzcygnbWVudS1maXhlZC10YWJsZXRzJykpe1xyXG5cdFx0XHQkKCcuYmxvZ19fYXNpZGUtbWVudScpLnJlbW92ZUNsYXNzKCdtZW51LWZpeGVkLXRhYmxldHMnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmJsb2dfX2FzaWRlLW1lbnUnKS5hZGRDbGFzcygnbWVudS1maXhlZC10YWJsZXRzJyk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dmFyIF9jbGlja1RvQXJ0aWNsZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXJcclxuXHRcdFx0XHQkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0aXRlbSA9ICR0aGlzLmNsb3Nlc3QoJy5ibG9nX19hc2lkZS1pdGVtJyksXHJcblx0XHRcdFx0aW5kZXggPSBpdGVtLmluZGV4KCksXHJcblx0XHRcdFx0c2VjdGlvbnMgPSAkKCcuYXJ0aWNsZXNfX2l0ZW0nKSxcclxuXHRcdFx0XHRyZXFTZWN0aW9uID0gc2VjdGlvbnMuZXEoaW5kZXgpLFxyXG5cdFx0XHRcdHdpbmRvd01hcmdpbiA9ICQod2luZG93KS5oZWlnaHQoKSAvIDMsXHJcblx0XHRcdFx0c2VjdGlvbk9mZnNldCA9IHJlcVNlY3Rpb24ub2Zmc2V0KCkudG9wO1xyXG5cdFx0XHQkKCdib2R5LCBodG1sJykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0J3Njcm9sbFRvcCcgOiBzZWN0aW9uT2Zmc2V0IC0gMTAwXHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG5cclxuYmxvZ01lbnUuaW5pdCgpOyIsInZhciBhdmlhdGl0bGUgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIGdlbmVyYXRlID0gZnVuY3Rpb24gKHN0cmluZywgYmxvY2spIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgd29yZHNBcnJheSA9IHN0cmluZy5zcGxpdCgnICcpLFxyXG4gICAgICAgICAgICBzdHJpbmdBcnJheSA9IHN0cmluZy5zcGxpdCgnJyksXHJcbiAgICAgICAgICAgIHNlbnRlbmNlID0gW10sXHJcbiAgICAgICAgICAgIHdvcmQgPSAnJztcclxuXHJcbiAgICAgICAgYmxvY2sudGV4dCgnJyk7XHJcblxyXG4gICAgICAgIHdvcmRzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihjdXJyZW50V29yZCkge1xyXG4gICAgICAgICAgICB2YXIgd29yZHNBcnJheSA9IGN1cnJlbnRXb3JkLnNwbGl0KCcnKTtcclxuXHJcbiAgICAgICAgICAgIHdvcmRzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsZXR0ZXJIdG1sID0gJzxzcGFuIGNsYXNzPVwibGV0dGVyLXNwYW5cIj4nICsgbGV0dGVyICsgJzwvc3Bhbj4nO1xyXG5cclxuICAgICAgICAgICAgICAgIHdvcmQgKz0gbGV0dGVySHRtbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgd29yZEhUTUwgPSAnPHNwYW4gY2xhc3M9XCJsZXR0ZXItd29yZFwiPicgKyB3b3JkICsgJzwvc3Bhbj4nXHJcblxyXG4gICAgICAgICAgICBzZW50ZW5jZS5wdXNoKHdvcmRIVE1MKTtcclxuICAgICAgICAgICAgd29yZCA9ICcnO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBibG9jay5hcHBlbmQoc2VudGVuY2Uuam9pbignICcpKTtcclxuXHJcbiAgICAgICAgLy8g0LDQvdC40LzQsNGG0LjRjyDQv9C+0Y/QstC70LXQvdC40Y9cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgbGV0dGVycyA9IGJsb2NrLmZpbmQoJy5sZXR0ZXItc3BhbicpLFxyXG4gICAgICAgICAgICBjb3VudGVyID0gMCxcclxuICAgICAgICAgICAgdGltZXIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uID0gNTAwIC8gc3RyaW5nQXJyYXkubGVuZ3RoO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93TGV0dGVycygpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRMZXR0ZXIgPSBsZXR0ZXJzLmVxKGNvdW50ZXIpO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudExldHRlci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGNvdW50ZXIrKztcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGltZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoc2hvd0xldHRlcnMsIGR1cmF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNob3dMZXR0ZXJzKCk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZW5lcmF0ZSA6IGdlbmVyYXRlXHJcbiAgICB9XHJcbiAgICBcclxufSkoKTsiLCJ2YXIgbXlTbGlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0XHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2xpZGVyID0gbmV3IFNsaWRlcigkKCcud29ya3MnKSk7XHJcblx0XHRcdHNsaWRlci5zZXREZWZhdWx0cygpO1xyXG5cclxuXHRcdCQoJy53b3Jrcy1zbGlkZXJfX2NvbnRyb2wtYnRuX2xlZnQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRzbGlkZXIubW92ZVNsaWRlKCdwcmV2Jyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcud29ya3Mtc2xpZGVyX19jb250cm9sLWJ0bl9yaWdodCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHNsaWRlci5tb3ZlU2xpZGUoJ25leHQnKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vc2xpZGVyXHJcblxyXG5cdHZhciBTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXJcclxuXHRcdFx0Y29udGFpbmVyICAgPSAkKCcud29ya3MnKTtcclxuXHRcdFx0bmV4dEJ0biAgICAgPSBjb250YWluZXIuZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1idG5fbGVmdCcpLFxyXG5cdFx0XHRwcmV2QnRuICAgICA9IGNvbnRhaW5lci5maW5kKCcud29ya3Mtc2xpZGVyX19jb250cm9sLWJ0bl9yaWdodCcpLFxyXG5cdFx0XHRpdGVtcyAgICAgICA9IG5leHRCdG4uZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1pdGVtJyksXHJcblx0XHRcdGRpc3BsYXkgICAgID0gY29udGFpbmVyLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2Rpc3BsYXknKSxcclxuXHRcdFx0dGl0bGUgICAgICAgPSBjb250YWluZXIuZmluZCgnLnN1YnRpdGxlJyksXHJcblx0XHRcdHNraWxscyAgICAgID0gY29udGFpbmVyLmZpbmQoJy53b3Jrc19fY29udGVudC1kZXNjJyksXHJcblx0XHRcdGxpbmsgICAgICAgID0gY29udGFpbmVyLmZpbmQoJy53b3Jrc19fY29udGVudC12aWV3JyksXHJcblx0XHRcdGl0ZW1zTGVuZ3RoID0gaXRlbXMubGVuZ3RoLFxyXG5cdFx0XHRkdXJhdGlvbiAgICA9IDUwMCxcclxuXHRcdFx0ZmxhZyAgICAgICAgPSB0cnVlO1xyXG5cclxuXHRcdHZhciB0aW1lb3V0O1xyXG5cclxuXHRcdHRoaXMuY291bnRlciA9IDA7XHJcblxyXG5cdFx0Ly8gcHJpdmF0ZVxyXG5cclxuXHRcdHZhciBnZW5lcmF0ZU1hcmt1cHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGxpc3QgPSBuZXh0QnRuLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2NvbnRyb2wtbGlzdCcpLFxyXG5cdFx0XHRcdG1hcmt1cHMgPSBsaXN0LmNsb25lKCk7XHJcblxyXG5cdFx0XHRwcmV2QnRuXHJcblx0XHRcdFx0LmFwcGVuZChtYXJrdXBzKVxyXG5cdFx0XHRcdC5maW5kKCcud29ya3Mtc2xpZGVyX19jb250cm9sLWl0ZW0nKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHQuZXEodGhpcy5jb3VudGVyICsgMSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBnZXREYXRhQXJyYXlzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBkYXRhT2JqZWN0ID0ge1xyXG5cdFx0XHRcdHBpY3MgOiBbXSxcclxuXHRcdFx0XHR0aXRsZSA6IFtdLFxyXG5cdFx0XHRcdHNraWxscyA6IFtdLFxyXG5cdFx0XHRcdGxpbmsgOiBbXVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JC5lYWNoKGl0ZW1zLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRkYXRhT2JqZWN0LnBpY3MucHVzaCgkdGhpcy5kYXRhKCdmdWxsJykpO1xyXG5cdFx0XHRcdGRhdGFPYmplY3QudGl0bGUucHVzaCgkdGhpcy5kYXRhKCd0aXRsZScpKTtcclxuXHRcdFx0XHRkYXRhT2JqZWN0LnNraWxscy5wdXNoKCR0aGlzLmRhdGEoJ3NraWxscycpKTtcclxuXHRcdFx0XHRkYXRhT2JqZWN0LmxpbmsucHVzaCgkdGhpcy5kYXRhKCdsaW5rJykpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBkYXRhT2JqZWN0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzbGlkZUluTGVmdEJ0biA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblx0XHRcdHZhclxyXG5cdFx0XHRcdHJlcUl0ZW0gPSBpdGVtcy5lcShzbGlkZSAtIDEpLFxyXG5cdFx0XHRcdGFjdGl2ZUl0ZW0gPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKTtcclxuXHJcblx0XHRcdGFjdGl2ZUl0ZW1cclxuXHRcdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHRcdC5hbmltYXRlKHsndG9wJyA6ICcxMDAlJ30sIGR1cmF0aW9uKTtcclxuXHJcblx0XHRcdFx0cmVxSXRlbVxyXG5cdFx0XHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0XHRcdC5hbmltYXRlKHsndG9wJyA6ICcwJSd9LCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHRcdC5jc3MoJ3RvcCcsICctMTAwJScpXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzbGlkZUluUmlnaHRCdG4gPSBmdW5jdGlvbiAoc2xpZGUpIHtcclxuXHRcdFx0dmFyXHJcblx0XHRcdFx0aXRlbXMgPSBwcmV2QnRuLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2NvbnRyb2wtaXRlbScpLFxyXG5cdFx0XHRcdGFjdGl2ZUl0ZW0gPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuXHRcdFx0XHRyZXFTbGlkZSA9IHNsaWRlICsgMTtcclxuXHJcblx0XHRcdGlmIChyZXFTbGlkZSA+IGl0ZW1zTGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdHJlcVNsaWRlID0gMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlcUl0ZW0gPSBpdGVtcy5lcShyZXFTbGlkZSk7XHJcblxyXG5cdFx0XHRhY3RpdmVJdGVtXHJcblx0XHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0XHQuYW5pbWF0ZSh7J3RvcCcgOiAnLTEwMCUnfSwgZHVyYXRpb24pO1xyXG5cclxuXHRcdFx0cmVxSXRlbVxyXG5cdFx0XHRcdC5zdG9wKHRydWUsIHRydWUpXHJcblx0XHRcdFx0LmFuaW1hdGUoeyd0b3AnIDogJzAlJ30sIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0LmNzcygndG9wJywgJzEwMCUnKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgY2hhbmdlTWFpblBpY3R1cmUgPSBmdW5jdGlvbihzbGlkZSkge1xyXG5cdFx0XHR2YXIgaW1hZ2UgPSBkaXNwbGF5LmZpbmQoJy53b3Jrcy1zbGlkZXJfX2Rpc3BsYXktcGljJyk7XHJcblx0XHRcdHZhciBkYXRhID0gZ2V0RGF0YUFycmF5cygpO1xyXG5cclxuXHRcdFx0aW1hZ2VcclxuXHRcdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uIC8gMiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpbWFnZS5hdHRyKCdzcmMnLCBkYXRhLnBpY3Nbc2xpZGVdKTtcclxuXHRcdFx0XHRcdCQodGhpcykuZmFkZUluKGR1cmF0aW9uIC8gMik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNoYW5nZVRleHREYXRhID0gZnVuY3Rpb24oc2xpZGUpIHtcclxuXHRcdFx0dmFyIGRhdGEgPSBnZXREYXRhQXJyYXlzKCk7XHJcblxyXG5cdFx0XHQvLyBuYW1lIG9mIHdvcmtcclxuXHRcdFx0YXZpYXRpdGxlLmdlbmVyYXRlKGRhdGEudGl0bGVbc2xpZGVdLCB0aXRsZSwgJ3J1Jyk7XHJcblxyXG5cdFx0XHQvLyBkZXNjcmlwdGlvbiBvZiB0ZWNobm9sb2d5XHJcblx0XHRcdGF2aWF0aXRsZS5nZW5lcmF0ZShkYXRhLnNraWxsc1tzbGlkZV0sIHNraWxscywgJ2VuJyk7XHJcblxyXG5cdFx0XHQvLyBsaW5rIHRvIHdvcmtcclxuXHRcdFx0bGluay5hdHRyKCdocmVmJywgZGF0YS5saW5rW3NsaWRlXSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIHB1YmxpY1xyXG5cdFx0dGhpcy5zZXREZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXJcclxuXHRcdFx0XHRfdGhhdCA9IHRoaXMsXHJcblx0XHRcdFx0ZGF0YSA9IGdldERhdGFBcnJheXMoKTtcclxuXHJcblx0XHRcdC8vIG1ha2luZyBtdXJrdXBcclxuXHRcdFx0Z2VuZXJhdGVNYXJrdXBzKCk7XHJcblxyXG5cdFx0XHQvLyBsZWZ0IGJ1dHRvblxyXG5cdFx0XHRuZXh0QnRuXHJcblx0XHRcdFx0LmZpbmQoJy53b3Jrcy1zbGlkZXJfX2NvbnRyb2wtaXRlbScpXHJcblx0XHRcdFx0LmVxKF90aGF0LmNvdW50ZXIgLSAxKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQvLyByaWdodCBidXR0b25cclxuXHRcdFx0cHJldkJ0blxyXG5cdFx0XHRcdC5maW5kKCcud29ya3Mtc2xpZGVyX19jb250cm9sLWl0ZW0nKVxyXG5cdFx0XHRcdC5lcShfdGhhdC5jb3VudGVyICsgMSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0Ly8gbWFpbiBpbWFnZVxyXG5cdFx0XHRkaXNwbGF5XHJcblx0XHRcdFx0LmZpbmQoJy53b3Jrcy1zbGlkZXJfX2Rpc3BsYXktcGljJylcclxuXHRcdFx0XHQuYXR0cignc3JjJywgZGF0YS5waWNzW190aGF0LmNvdW50ZXJdKTtcclxuXHJcblx0XHRcdC8vIHRleHQgZGVzY3JpcHRpb25cclxuXHRcdFx0Y2hhbmdlVGV4dERhdGEoX3RoYXQuY291bnRlcik7XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLm1vdmVTbGlkZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xyXG5cdFx0XHR2YXIgX3RoYXQgPSB0aGlzO1xyXG5cclxuXHRcdFx0dmFyIGRpcmVjdGlvbnMgPSB7XHJcblx0XHRcdFx0bmV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Ly8gbG9vcGJhY2sgb2Ygc2xpZGVyLWl0ZW1cclxuXHRcdFx0XHRcdGlmIChfdGhhdC5jb3VudGVyIDwgaXRlbXNMZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0XHRcdF90aGF0LmNvdW50ZXIrKztcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGF0LmNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRcdHByZXYgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRpZiAoX3RoYXQuY291bnRlciA+IDApIHtcclxuXHRcdFx0XHRcdFx0X3RoYXQuY291bnRlci0tO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoYXQuY291bnRlciA9IGl0ZW1zTGVuZ3RoIC0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRkaXJlY3Rpb25zW2RpcmVjdGlvbl0oKTtcclxuXHJcblx0XHRcdGlmIChmbGFnKSB7XHJcblx0XHRcdFx0ZmxhZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIHRpbWVvdXQgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGZsYWcgPSB0cnVlO1xyXG5cdFx0XHRcdH0sIGR1cmF0aW9uICsgNTApO1xyXG5cclxuXHRcdFx0XHRzbGlkZUluTGVmdEJ0bihfdGhhdC5jb3VudGVyKTtcclxuXHRcdFx0XHRzbGlkZUluUmlnaHRCdG4oX3RoYXQuY291bnRlcik7XHJcblx0XHRcdFx0Y2hhbmdlTWFpblBpY3R1cmUoX3RoYXQuY291bnRlcik7XHJcblx0XHRcdFx0Y2hhbmdlVGV4dERhdGEoX3RoYXQuY291bnRlcik7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH1cclxufSkoKTtcclxuXHJcbm15U2xpZGVyLmluaXQoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
