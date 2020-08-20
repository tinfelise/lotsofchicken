//Block IE browsers
// function checkBrowser(browser) {
// 	if (browser == 'IE') {
// 		blockBrowser();
// 	};
// };
function blockBrowser() {
	$('#ie').toggleClass('show');
};

//Scroll events
$(window).scroll( function () {
	var position = $(this).scrollTop();
	var header = $('header').height();
	var offsetPosition = position + header;
	var height = $(window).height();
	var bottom = position + height;
	var pageBottom = $(document).height();

	// Nav bar positioning
    $('section').each(function() {
    	var id = $(this).attr('id');
        if (offsetPosition > $(this).offset().top && offsetPosition <= $(this).offset().top + $(this).height() ){ 
            $('nav a[href="#'+id+'"]').addClass('current');
        } else {
            $('nav a[href="#'+id+'"]').removeClass('current');
        }   
    });
    if (bottom == pageBottom) {
		var last = $('section').last().attr('id');
		$('nav a').removeClass('current');
		$('nav a[href="#'+last+'"]').addClass('current');
	};

    // Header fill state
    if (position > header) {
        $("header").addClass("filledHeader");
    }
    else {
        $("header").removeClass("filledHeader");
    };

    // Mobile upcoming bar placement
    // if (position > 0) {
    // 	$('.sidebar').addClass('scroll');
    // } else {
    // 	$('.sidebar').removeClass('scroll');
    // }

    // Chickenback Animation
    var guaranteePosition = $('.guarantee').offset().top + $('.guarantee').height();
    if (bottom > guaranteePosition && guaranteePosition > offsetPosition) {
    	$('.guarantee').addClass('wiggle');
    } else {
    	$('.guarantee').removeClass('wiggle');
    }

    // Team section title changing
    var teamTitlePosition = $('#team h2').offset().top + $('#team h2').height();
    if (bottom > teamTitlePosition) {
    	$('#team h2').removeClass('initial');
    }
});

//Smooth scrolling to anchor tags
$( document ).ready(function() {
	$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function() {
		var destination = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(destination).offset().top
		}, 1000);
	});
});

// Mobile nav menu
$('nav').on("click", function () {
	$('body').toggleClass('blurSubheader');
	$('header').toggleClass('open');
	$('header.open #logo').on("click", function () {
		$('body').toggleClass('blurSubheader');
		$('header').toggleClass('open');
	});
});

// Create upcoming events calendar, countdown, pay button, etc.
function calendar () {
	// var now = new Date($.now());
	var now = new Date();
		now = now.getTime();

	// var html, css;
	var html = '';
	var css = '';
	var eventCount = 0;
	
	testURLs();
	orderEvents();

	for (i=0;i<events.length;i++) {
		var x = events[i];
		var loc = locations[x.location - 1];
		
		var start = x.start;
		if (!$.isNumeric(start)) {
			start = Date.parse(start);
		};
		var end = x.end;
		if (!$.isNumeric(end)) {
			end = Date.parse(end);
		};
		
		var day = moment(start).format('D');
		var mon = moment(start).format('MMM');
		
		var startTime = moment(start).format('kk:mm');
			startTime = formatTime(startTime);
		var endTime = moment(end).format('kk:mm');
			endTime = formatTime(endTime);
		
		if (now < end) {
			eventCount++;
			html += 
				'<div class=\'event\'id=\'event_' + i +'\'>' +
					'<div class=\'calendarDay\'>' +
						'<span class=\'day\'>' + day + '</span>' +
						'<span class=\'month\'>' + mon + '</span>' +
					'</div>' +
					'<span class=\'location\'>' + loc.name + '</span>' +
				'</div>';
			css += 
				'#event_' + i + '{' +
					'background-image:url(' + loc.image + ')' +
				'}';
			// if (eventCount == 1) {
			// 	createCountdown(start);
			// 	$('#current').append(
			// 		'<div id=\'currentPlace\'>' + 
			// 			'<span>' + loc.name + ' | </span> ' + 
			// 			// '<span>' + loc.neighborhood + ' | <\/span> ' + 
			// 			'<span>' + loc.city + '</span> ' + 
			// 		'</div>' +
			// 		'<div id=\'currentTime\'>' + 
			// 			'<span>' + moment(start).format('dddd, MMMM Do') + '</span>' + 
			// 			' | <span>' + startTime + ' to ' + endTime + '</span>' + 
			// 		'</div>'
			// 	);
			// };
		};
		if (eventCount == 1 && x.occasion) {
			$('#coop').addClass(x.occasion);
		}
	};

	var width = (100/3);
	if (0 < eventCount && eventCount < 3) {
		width = (100/eventCount);
		css += '@media only screen and (max-width: 700px) {' +
			'.event {' +
				'width:' + width +'%;' +
			'}' +
		'}';
	};

	if (eventCount > 0) {
		$('#upcoming').append(html);
		injectStyles(css);
		// $('.event:first-of-type').addClass('upNext');
	} else {
		$('#rapResponse').html('Nope! (Sorry)');
		$('#current').html('No upcoming LOC events on the books.<a href="#houseCalls">Request some chicken</a>');
	}
};
calendar();

function orderEvents () {
	events = events.sort(function (a, b) {
    	// return a.start.localeCompare(b.start);
    	return moment(a.start).format('x')
    		.localeCompare(
    			moment(b.start).format('x')
			);
	});
};

function formatTime(time) {
	var hour = time.split(':')[0]
	var period = 'AM';
	if (hour > 11) {
		period = 'PM'
	};
	if (hour > 12) {
		hour = hour - 12;
	} else if (hour < 10) {
		hour = hour[1];
	}
	var minute = time.split(':')[1]
	if (minute != '00') {
		minute = ':' + minute;
	} else {
		minute = '';
	}
	time = hour + minute + period;
	return time;		
};

// function getMonthFromString(mon){
//    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
// }

// var test = 'Sat Apr 08 2017 12:00:00 GMT-0700 (PDT)';
// var test = "2017/05/01";
// var test = "2017/05/01 13:00:00 PDT";

// function createCountdown (timestamp) {
// 	$("#countdown").countdown(timestamp, function(event) {
// 	    $(this).html(
// 	    	event.strftime(
// 	    		'In ' +
// 		      	// '<span>%w</span> week%!W ' +
// 			    '<strong><span>%-D</span> day%!D</strong> ' +
// 			    '<strong><span>%-H</span> hour%!H</strong> ' +
// 			    '<strong><span>%-M</span> minute%!M</strong> ' +
// 			    '<strong><span>%-S</span> second%!S</strong>'
// 		    )
// 	  	);
// 	});
// };
function createCountdown (timestamp) {
	$('#coop .pay').removeClass('viewPay');
	$('#countdown').countdown(timestamp)
		.on('update.countdown', function(event) {
			var format = '<div>In ';
			if(event.offset.totalDays > 0) {
				format += '<strong><span>%-D</span> day%!D</strong> ';
			}
			if(event.offset.hours > 0) {
				format += '<strong><span>%-H</span> hour%!H</strong> ';
			}
			format += '</div> <div>'
			if(event.offset.minutes > 0) {
				format += '<strong><span>%-M</span> minute%!M</strong> ';
			}
			if(event.offset.seconds > 0) {
				format += '<strong><span>%-S</span> second%!S</strong>';
			}
			format += '</div>'
			$(this).html(event.strftime(format));
		})
		.on('finish.countdown', function(event) {
			$(this).html('LOC Chicken is currently open');
			$('#coop .pay').addClass('viewPay');
		});
};
function createEventDetails(id) {
	var x = events[id];
	var loc = locations[x.location - 1];
	
	var start = moment(x.start,'MMM D YYYY h:mm:ss');	
	var day = start.format('D');
	var mon = start.format('MMM');
	var startTime = start.format('kk:mm');
		startTime = formatTime(startTime);
	var unixStart = start.format('x');
	createCountdown(unixStart);

	var end = moment(x.end, 'MMM D YYYY h:mm:ss');
	var endTime = end.format('kk:mm');
		endTime = formatTime(endTime);

	var occasion = '';
	if (x.occasion) {
		occasion = '<span class="occasion">' + x.occasion + '</span> | '
	}
	
	$('#current').html(
		'<a href=\'' + loc.directions + '\' target=\'blank_\' id=\'currentPlace\'>' + 
			'<i class="fa fa-location-arrow" aria-hidden="true"></i> ' +
			'<span>' + loc.name + ' | </span> ' + 
			// '<span>' + loc.neighborhood + ' | <\/span> ' + 
			'<span>' + loc.city + '</span> ' + 
		'</a>' +
		'<div id=\'currentTime\'>' + 
			occasion +
			'<span>' + moment(start).format('dddd, MMMM Do') + '</span>' + 
			// ' | <span>' + startTime + ' to ' + endTime + '</span>' + 
			' | <span>' + startTime + ' until done</span>' + 
		'</div>'
	);
	$('.event').removeClass('upNext');
	$('#event_' + id).addClass('upNext');
};
function getFirstUpcoming() {
	if ($('.event').length > 0) {
		var id = $('.event:first-of-type').attr('id');
		id = id.split('_')[1];
		createEventDetails(id);
	};
};
getFirstUpcoming();
$('.event').on('click', function() {
	var id = $(this).attr('id');
	id = id.split('_')[1];
	createEventDetails(id);
});

var countdownState = 1;
function toggleCountdown() {
	if (countdownState == 1) {
		$('#countdown').countdown('stop');
		countdownState = 0;
	} else {
		$('#countdown').countdown('start');
		countdownState = 1;
	};
};

function injectStyles(rule) {
  var stylesheet = $("<style />", {
    html: rule
  }).appendTo("body");    
};

// Mobile invite button functionality
function showShareButtons() {
	$('#invite').addClass('popup');
	$('body').addClass('blurBackground');
	// $('.sharing .mobile').hide();
};
function hideShareButtons() {
	$('#invite').removeClass('popup');
	$('body').removeClass('blurBackground');
};
$('#invite.popup').on('click', function() {
	console.log('click');
	$('.sharing').removeClass('popup');
});

// Filter by menu type
function menuSelector() {
	var itemSelected = $('input[name="menu-item"]:checked').val();
	var selector = '#' + itemSelected + '-info';
	$('.food').removeClass('view');
	$(selector).addClass('view');
};
menuSelector();
$('input[name="menu-item"]').bind('change', menuSelector);

// Expand menu item descriptions
$('.food').on('click', function() {
	var id = '#' + $(this).attr('id');
	$(id).toggleClass('expand');
});

// Chickenback guarantee funtionality
function showChickenBack() {
	$('#chickenBack').addClass('showChickenBack');
	$('#wings div:first-of-type, #wings .food, #wings .guarantee').addClass('blur');
};
function hideChickenBack() {
	$('#chickenBack').removeClass('showChickenBack');
	$('#wings div:first-of-type, #wings .food, #wings .guarantee').toggleClass('blur');	
};

// Expand team member descriptions on mobile widths
$('.member').on('click', function() {
	var id = '#' + $(this).attr('id');
	$(id).toggleClass('expand');
});

function testimonials() {
	var html = '';
	for(i=0; i<testimonialsData.length; i++) {
		var x = testimonialsData[i];
		html +=
			'<div class=\'testimonial\'>' +
				'<div class=\'photo\' style=\'background-image:url(' + x.photo + ')\' alt=\'Photo of ' + x.name + '\'></div>' +
				'<div class=\'testimonialText\'>' + 
					'<span class=\'name\'>' + x.name + '</span>' +
					'<span class=\'title\'> | ' + x.title + '</span>' +
					'<span class=\'quote\'>' + x.quote + '</span>' +
				'</div>' +
			'</div>';
	};
	$('#testimonials div').append(html);
};
testimonials();

function createFAQs() {
	var html = '';
	for(i=0; i<faqs.length; i++) {
		var x = faqs[i];
		html += 
			'<li>' + 
				'<h3>' + x.question + '</h3>' +
				'<span>' + x.answer + '</span>' +
			'</li>';
	}
	$('#faqs ul').append(html);
};
createFAQs();

function createContactSuggestions () {
	var html = '';
	for(i=0; i<contactSuggestionsData.length; i++) {
		var x = contactSuggestionsData[i];
		x = x.split('\n').join('</span> <span>');
		// console.log(x);
		html += '<div><span>' + x + '</span></div>';
	}
	$('#contactSuggestions').append(html);
	createCSSslideshow('#contactSuggestions div', 'contactSuggestions', '4', 'infinite');
};
createContactSuggestions();

function createCSSslideshow(selector, name, interval, repeat) {
	var slideCount = $(selector).length;
	var runtime = slideCount * interval;
	var stagger = 0;

	var selectors = '';
	for (i=1; i<=slideCount; i++) {
		stagger = interval * i;
		selectors +=  selector + ':nth-child(' + i + ') {' +
			'animation: xfade_' + name + ' ' + runtime + 's ' + stagger + 's ' + repeat + ';' + 
		'}';
	};

	var showTime = 100 / slideCount;
	var showFadeRatio = 90/100; // change to fadeTime (seconds), which is then translated into a ratio
	var startFade = showTime * showFadeRatio;

	var steps = {
		'0':1,
		[startFade]:1,
		[showTime]:0,
		'98':0,
		'100':1
	};

	var keyframes = '@keyframes xfade_' + name + ' {';
	for (var i in steps) {
		keyframes += 
			i + '% {' +
				'opacity: ' + steps[i] +';' + 
			'}';
	};
	keyframes += '}'

	var css = selectors + '\n' + keyframes;
	injectStyles(css);
};

function contactUsMailto (link) {
	var domain = 'lotsofchicken.com';
	var email = 'lotsofchickensf@gmail.com';
	var subject = 'Hello LOC!';
	var body = 'Hi there, Team LOC!%0A%0AI\'m looking to...';
	body += '%0A%0A%0A%0A%0ADetails on my upcoming event (if applicable)!%0ALocation:%0ADate%0ATime%0ANumber of chicken eaters:%0ASpecial requests:';
	var mailto = 'mailto:' + email + '?&subject=' + subject + '&body=' + body;
	mailto.split(' ').join('%20');
	$(link).attr('href', mailto);
}
contactUsMailto('#houseCalls a');

// Invite links creation
function createInviteLinks() {
	var url = 'https://lotsofchicken.com/';
	var shareTypes = [
		{
			'type':'yelp',
			'url':'https://www.yelp.com/biz/l-o-c-lots-of-chicken-san-francisco'
		}
	];

	// Email
	var subject = 'Found the best wings EVER!!!';
	var emailURL = url + '?utm_source=' + 'Email' + '\%26utm_medium=' + 'InviteButton';
	var body = 'Check out Lots Of Chicken (L.O.C) in Dolores Park:' + '%0A' + emailURL;
	emailURL = 'mailto:?&subject=' + subject + '&body=' + body;
	emailURL.split(" ").join("%20");

	var email = {};
	email.type = 'email';
	email.url = emailURL;
	shareTypes.push(email);

	// Facebook

	var fbURL = 'https://www.facebook.com/sharer/sharer.php?u=';
	fbURL += url + '?utm_source=' + 'Facebook' + '\%26utm_medium=' + 'InviteButton';
	fbURL.split(" ").join("%20");

	var facebook = {};
	facebook.type = 'fb';
	facebook.url = fbURL;
	shareTypes.push(facebook);

	//Twitter
	var handle = '@LotsofChix';
	var tweetURL = 'https://twitter.com/home?status=';
	tweetURL += 'The best chicken wings ever are in Dolores Park. Thanks ' + handle + ' ';
	tweetURL += url + '?utm_source=' + 'Twitter' + '\%26utm_medium=' + 'InviteButton';
	tweetURL.split(" ").join("%20");

	var twitter = {};
	twitter.type = 'twitter';
	twitter.url = tweetURL;
	shareTypes.push(twitter);

	$(shareTypes).each(function() {
		// console.log(this.url);
		$('.' + this.type + '_share').attr('href',this.url);
	});
};
createInviteLinks();

// METADATA CREATION
function createMetadata () {
	var name = 'L.O.C.';
	var title = document.title;
	var description = 'Serving Dolores Park the absolute best chicken wings and nugs you\'ll ever have.';

	var domain = 'lotsofchicken.com/';
	var menu = 'https://' + domain + '#menu';
	var email = 'lotsofchickensf@gmail.com';
	var phone = '';

	// var image = $('#wings-info').css('background-image');
	// image = sharedImage.substring(5,sharedImage.length - 2);
	var image = 'images/social.jpg';
	image = 'https://' + domain + image;
	var width = '3600';
	var height = '2400';
	// imageDimensions(image);

	var address = {
		'street':'Dolores St & 19th St',
		'city':'San Francisco',
		'state':'CA',
		'zip':'94114',
		'country':'United States'
	};
	
	var openGraph = 
		'<meta property="og:type" content="restaurant.restaurant">' +
		'<meta property="og:title" content="' + title + '">' +
		'<meta property="og:site_name" content="' + name + '">' +
		'<meta property="og:url" content="https://' + domain + '">' +
		'<meta property="og:description" content="' + description + '">' +
		'<meta property="og:image" content="' + image + '">';
	if (width) {
		openGraph += '<meta property="og:image:width" content="'+ width + '">';
	};
	if (height) {
		openGraph += '<meta property="og:image:height" content="' + height + '">';
	};
	openGraph +=
		'<meta property="restaurant:menu" content="' + menu + '">' +
		'<meta property="restaurant:contact_info:website" content="https://' + domain + '">' +
		'<meta property="restaurant:contact_info:street_address" content="' + address.street + '">' +
		'<meta property="restaurant:contact_info:locality" content="' + address.city + '">' +
		'<meta property="restaurant:contact_info:region" content="' + address.state + '">' +
		'<meta property="restaurant:contact_info:postal_code" content="' + address.zip + '">' +
		'<meta property="restaurant:contact_info:country_name" content="' +  address.country + '">' +
		'<meta property="restaurant:contact_info:email" content="' + email + '">';
	if (phone != '') {
		openGraph += '<meta property="restaurant:contact_info:phone_number" content="' + phone + '">';
	};

	var twitterHandle = '@LotsofChix';
	var altImage = 'Making awesome wings in Dolores Park';
	var twitterCard =
		'<meta name="twitter:card" content="summary_large_image">' +
		'<meta name="twitter:site" content="' + twitterHandle + '">' +
		'<meta name="twitter:title" content="' + title + '">' +
		'<meta name="twitter:description" content="' + description + '">' +
		'<meta name="twitter:image" content="' + image + '">' +
		'<meta name="twitter:image:alt" content="' + altImage + '">';

	var reservations = 'No';
	var cuisine = 'Chicken Wings';
	var priceRange = '$';

	var schemaOrg = 
		'<script type="application/ld+json">' +
		'{' +
		  '"@context": "http://schema.org/",' +
		  '"@type": "Restaurant",' +
		  '"name": "' + title + '",' +
		  '"acceptsReservations": "' + reservations + '",' +
		  '"menu": "' + menu + '",' +
		  '"servesCuisine": "' + cuisine + '",' +
		  '"priceRange": "' + priceRange + '",' +
		  '"address": {' +
		    '"@type": "PostalAddress",' +
		    '"streetAddress": "' + address.street + '",' +
		    '"addressLocality": "' + address.city + '",' +
		    '"addressRegion": "' + address.state + '",' +
		    '"postalCode": "' + address.zip + '"' +
		  '},';
	if (phone != '') {
		schemaOrg += '"telephone": "' + phone + '"';
	};
	schemaOrg += 
		'}' +
		'<\/script>';

	var tags =
		'<!-- Facebook Open Graph Tags -->' +
		openGraph +

		'<!-- Twitter Card Tags -->' + 
		twitterCard +

		'<!-- Schema.org JSON-LD Tags -->' +
		schemaOrg;

	// $('head').append(tags);
	console.log(tags);
}
// createMetadata();

function imageDimensions(imageURL) {
	console.log('start');
	var tmpImg = new Image();
	tmpImg.src = imageURL;
	$(tmpImg)
		.on('load',function() {
			var height = tmpImg.height;
			var width = tmpImg.width;
			console.log('Image loaded')
			console.log('Height:' + height);
			console.log('Width:' + width);
			// createMetadata(imageURL, height, width);
		})
		.on('error',function() {
			console.log('Sharing image not found')
			// createMetadata(imageURL);
		});
};
// imageDimensions(sharedImage);

// TEST CASES
function testURLs() {
	var currentURL = window.location.href;
	var test = currentURL.split('?')[1];
	
	if (test) {
		var position = test.split('#')[1];
		test = test.split('#')[0];
		console.log('Testing ' + test + ' at height ' + position);
	};
	if (test == 'open') {
		testOpen();
	};
	if (test == 'noevents') {
		testNoEvents();
	};
	if (test == 'busy') {
		testBusy();
	};
	if (test == 'freezetime') {
		toggleCountdown();
	};
	if (test == 'ie') {
		blockBrowser();
	};
};
function testOpen () {
	var now = new Date();
		now = now.getTime();

	var second = 1000;
	var hour = second*60*60;
	
	var start = now + (second*5);
	var length = 3*hour;
	var end = start + length;
	
	var testEvent = {};
		testEvent.location = '1';
		testEvent.start = start;
		testEvent.end = end;
	events.push(testEvent);
};
function testNoEvents () {
	events = [];
}
function testBusy() {
	$(events).each(function() {
		events.push(this);
		events.push(this);
		events.push(this);
	});
};
// testURLs();