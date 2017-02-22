var _cart = null;
var _isVisible = false;
var defaults = {
    maxViewable: 4
};
(function($) {
    $.fn.icomCart = function(opts) {

        var options = $.extend(defaults, opts || {});
        var me = this;

        return this.each(function() {
        	var $t = $(this);
            _cart = null;
            var _isLoggedIn = false;
            _isVisible = false;
            var _userHasGuestCartCookie = false;

            var ajaxOptions = {
                error: function(msg) {
                    setCartMessage("There was a problem loading your cart.", "ui-state-error");
                }
            };

            isUserLoggedIn();

            function isUserLoggedIn() {
            	var isLoggedin = false;
                
                var wcToken = getCookie("WCToken");
                var wcTrustedToken = getCookie("WCTrustedToken");
                var psToken = getCookie("psToken");
                isLoggedin = (wcToken != null && wcToken != "")
                					&& (wcTrustedToken != null && wcTrustedToken != "")
                					&& (psToken != null && psToken != "")
                					&& isLoggedInUser;	//isLoggedInUser - variable set in ext/Header_UI.jsp
                
                if(isLoggedin  || isGuest) {
                	refreshCart($t);
                }
            }

            function getProductDescription(original) {
                var o = [];
                var words = original.split(" ");
                for (var i = 0; i < words.length; i++) {
                    var word = words[i];
                    if (word.length <= 23) {
                        o.push(word);
                        o.push(" ");
                    } else {
                        o.push(word.substring(0, 23));
                        o.push('&hellip;');
                        o.push('<br />');
                    }
                }
                return o.join('');
            }

            function working() {
                var baseIcomUrl = "https://my.illumina.com";
                var o = [];
                o.push('<div><img src="' + baseIcomUrl + '/content/images/SmallSpinner.gif" alt="working..." /></div>');
                $t.html(o.join(''));
            }

            function setCartMessage(message, cssClass) {
                var en = '#' + this.id + '_message';
                $(en).removeClass("ui-state-highlight");
                $(en).removeClass("ui-state-error");
                $(en).addClass(cssClass);
                $(en).html(message);
                $(en).show();
                setTimeout(function() {
                    $(en).fadeOut("slow");
                }, 2000);
            }

            function getCookie(cName) {
                var i, x, y, arRcookies = document.cookie.split(";");
                for (i = 0; i < arRcookies.length; i++) {
                    x = arRcookies[i].substr(0, arRcookies[i].indexOf("="));
                    y = arRcookies[i].substr(arRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == cName) {
                        return unescape(y);
                    }
                }
            }

            function userHasGuestCartCookie() {
                var guestCartCookie = getCookie("iComGuestCart");
                return (guestCartCookie != null && guestCartCookie != "");
            }
            
            // this is running before the vars are setup.  possible cause of guest cart bug.
            //render();
        });

        return this;
    };
})(jQuery);

(function ($) {

	var pluses = /\+/g;

function encode(s) {
	return config.raw ? s : encodeURIComponent(s);
}

function decode(s) {
	return config.raw ? s : decodeURIComponent(s);
}

function stringifyCookieValue(value) {
	return encode(config.json ? JSON.stringify(value) : String(value));
}

function parseCookieValue(s) {
	if (s.indexOf('"') === 0) {
		// This is a quoted cookie as according to RFC2068, unescape...
		s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	}

	try {
		// Replace server-side written pluses with spaces.
		// If we can't decode the cookie, ignore it, it's unusable.
		// If we can't parse the cookie, ignore it, it's unusable.
		s = decodeURIComponent(s.replace(pluses, ' '));
		return config.json ? JSON.parse(s) : s;
	} catch(e) {}
}

function read(s, converter) {
	var value = config.raw ? s : parseCookieValue(s);
	return $.isFunction(converter) ? converter(value) : value;
}

var config = $.cookie = function (key, value, options) {

	// Write

	if (value !== undefined && !$.isFunction(value)) {
		options = $.extend({}, config.defaults, options);

		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setTime(+t + days * 864e+5);
		}

		return (document.cookie = [
			encode(key), '=', stringifyCookieValue(value),
			options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path    ? '; path=' + options.path : '',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		].join(''));
	}

	// Read

	var result = key ? undefined : {};

	// To prevent the for loop in the first place assign an empty array
	// in case there are no cookies at all. Also prevents odd result when
	// calling $.cookie().
	var cookies = document.cookie ? document.cookie.split('; ') : [];

	for (var i = 0, l = cookies.length; i < l; i++) {
		var parts = cookies[i].split('=');
		var name = decode(parts.shift());
		var cookie = parts.join('=');

		if (key && key === name) {
			// If second argument (value) is a function it's a converter...
			result = read(cookie, value);
			break;
		}

		// Prevent storing a cookie that we couldn't decode.
		if (!key && (cookie = read(cookie)) !== undefined) {
			result[name] = cookie;
		}
	}

	return result;
};
/*  BROWSER UPGRADE

IE < version 11
Chrome < version 47
Firefox < version 45
Safari < version 9
*/

var user = $.cookie("browserunsupported");

if (user == null && suggestUpgrade()) {

$.cookie("browserunsupported", "true", {expires: 3});
var imgSource="https://assets.illumina.com";

$('body').prepend('<div class="unsupported-browser"><div class="unsupported-browser__modal"><div class="unsupported-browser__message-intro"><img src="'+imgSource+'/content/dam/illumina-marketing/images/logos/illumina.gif"> <strong>Upgrade your browser or select an alternate</strong><p>For the best experience using our website, we recommend that you upgrade to a newer version or use another web browser. A list of the most popular web browsers can be found below.<p><p>Click on an icon below to go to the download page or <span class="unsupported-browser__close-modal">close this notice</span>.</div><div class="unsupported-browser__message-option-row"><div class="unsupported-browser__message-option-item"><a href="http://www.google.com/chrome"><img src="'+imgSource+'/content/dam/illumina-marketing/images/unsupported-browser/chrome.gif"> Chrome</a></div><div class="unsupported-browser__message-option-item"><a href="http://www.mozilla.org/"><img src="'+imgSource+'/content/dam/illumina-marketing/images/unsupported-browser/firefox.gif"> Firefox</a></div><div class="unsupported-browser__message-option-item"><a href="http://www.apple.com/safari/"><img src="'+imgSource+'/content/dam/illumina-marketing/images/unsupported-browser/safari.gif"> Safari</a></div><div class="unsupported-browser__message-option-item"><a href="https://support.microsoft.com/en-us/help/17621/internet-explorer-downloads"><img src="'+imgSource+'/content/dam/illumina-marketing/images/unsupported-browser/ie.gif"> Internet Explorer 11</a></div></div></div></div>');
$('.unsupported-browser__close-modal').click(function() {
    $('.unsupported-browser').remove();
});

}

// SUGGEST UPGRADE | RETURNS BOOLEAN
function suggestUpgrade(){

var ua = navigator.userAgent;
var suggest = false, browser, version, temp = '';
var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

var mobile = ua.match(/Mobile|mobile/) == null ? false : true;
if (!mobile) {
	
    if(/trident/i.test(M[1])){
        browser = "MSIE";
        version = 11;
    }
    
    if(M[1] === 'Chrome'){
        temp = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(temp != null){
            M = temp.slice(1).join(' ').replace('OPR', 'Opera');
        }
    }
    
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    
    if((temp = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, temp[1]);
    }
    
    browser = M[0];
    version = parseInt(M[1]);

    if(browser === "Chrome" && version < 47){
        suggest = true;
        
    } else if(browser === "Firefox" && version < 45){
        suggest = true;
        
    } else if(browser === "Safari" && ( version < 9 || version > 100)){
        suggest = true;
    
    } else if(browser === "MSIE"){
    	
        if (version === 7) {
            
            // assume Vista (6.0) is most recent version with possibility of real IE7
            var ie7real = new RegExp("5.1|5.2|6.0");
            
            if (ie7real.exec(navigator.userAgent) !== null) {
                suggest = true;
            }
            
        } else if(version < 11 && version != 7){
            suggest = true;
            
        }
    }
}

return suggest;
}

config.defaults = {};

})(jQuery);

//for IE as it doesn't support startsdWith method
if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function(searchString, position) {
	    position = position || 0;
	    return this.indexOf(searchString, position) === position;
	  };
	}

function updateCartInHeader($t) {
    var baseIcomUrl = __wcsServerHost;
    var o = [];

    var fullCartUrl;
    var checkoutUrl;
    var punchoutMode = ETPUtils.getCookie('punchoutMode');

    fullCartUrl = baseIcomUrl + '/webapp/wcs/stores/servlet/RESTOrderCalculate?updatePrices=1&ETPSimulateCall=Y&doConfigurationValidation=Y&calculationUsageId=-1&errorViewName=AjaxOrderItemDisplayView&catalogId='+ __catalogId +'&langId=-1&URL='
    				+ baseIcomUrl + '%2Fwebapp%2Fwcs%2Fstores%2Fservlet%2FAjaxOrderItemDisplayView&storeId='+ __storeId + '&orderId=.';
    checkoutUrl = baseIcomUrl + '/webapp/wcs/stores/servlet/RESTOrderCalculate?updatePrices=1&ETPSimulateCall=Y&doConfigurationValidation=Y&calculationUsageId=-1&errorViewName=AjaxOrderItemDisplayView&catalogId='+ __catalogId +'&langId=-1&URL='
					+ baseIcomUrl + '%2Fwebapp%2Fwcs%2Fstores%2Fservlet%2FAjaxOrderItemDisplayView&storeId='+ __storeId + '&orderId=.';

    if (_cart == null) {
        o.push('<span><a id="cart_button" href="' + fullCartUrl + '">VIEW CART</a></span>');
    } else {
    	var itemsTotal = 0;
        if (_cart.recordSetCount > 0) {
            if (_cart.orderItem.length) {
                for(var idx = 0; idx < _cart.orderItem.length; idx++) {
                    itemsTotal += parseInt(_cart.orderItem[idx].quantity);
                }
            }
        }

        var cartItemsCountText = '';
        var cartUrl = fullCartUrl;
	// Give a dummy cart id to prevent the scroll up/down behavior of the minicart when there are no items
        var cartDivId = 'dummyIdToPreventMiniCartScrollDown';
        if(itemsTotal > 0) {
        	cartItemsCountText = '(' + itemsTotal + ')';
        	cartUrl = '#';
        	cartDivId = 'cartdropdown-container';
        }
        if($(window).width()>768){
        	o.push('<a id="cart_button" href="' + cartUrl + '">VIEW CART ' + cartItemsCountText + ' <img src="https://my.illumina.com/content/images/cart.gif" style="vertical-align:middle;padding-left:3px;" border="0" /></a>');
        }
        else{
        	o.push('<a id="cart_button" href="' + fullCartUrl + '">VIEW CART ' + cartItemsCountText + ' <img src="https://my.illumina.com/content/images/cart.gif" style="vertical-align:middle;padding-left:3px;" border="0" /></a>');	
        }
        o.push('<!--popupcontainer start -->');
        o.push('<div style="display:none" class="popupContainer col-lg-3 col-sm-3 col-md-3 col-xs-3" id="' + cartDivId + '">');
        o.push('<div class="arrow-up" id="arrow" style="display:none;"></div>');

        var exceedsLimit = _cart.recordSetCount > defaults.maxViewable;
        
    	o.push('<!--popupTopLayer start-->');
    	o.push('<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 popupTopLayer">');
       	o.push('	<!--popupheader start-->');
       	o.push('	<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 popupHeader">');
       	o.push('		<span> Items in your cart:</span>');
       	o.push('		<span class="minicartClose"><a href="javascript:$(\'#cartdropdown-container\').hide();void 0;">&times;</a></span>');
       	o.push('	<!--popupheader end-->');
       	o.push('	</div>');

       	o.push('	<!--detailsSectionCont start -->');
       	o.push('	<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 detailsSectionCont"');
       	
        if (_cart.recordSetCount > 0) {
        	o.push(' style="overflow-y:auto;">');
        	var itemCount = exceedsLimit ? Math.min(_cart.recordSetCount, defaults.maxViewable) : _cart.recordSetCount;
        	for (var i = 0; i < itemCount; i++) {
                var currentIndex = i;//_cart.orderItem.length - (1 + i);
                var item = _cart.orderItem[currentIndex]; //start backwards
                o.push('		<!--row starts-->');
                o.push('		<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 popupDetails">');
                o.push('			<div class="imgContainer col-lg-3 col-md-3 col-sm-3 col-xs-3">');
                o.push('				<img id="cart_product_img" src="' + item.thumbnail + '">');
                o.push('			</div>');
                o.push('			<div class="promoDetails  col-lg-9 col-md-9 col-sm-9 col-xs-9">');
                o.push('				<p class="promoName">' + item.itemDesc + '</p>');
                o.push('				<p class="promoPrice">' + item.partNumber + '</p>');
                o.push('				<p style="float:left;margin:0px;"><span>QTY:&nbsp;</span><span>' + item.quantity + '</span></p>');
                if((basicUserRole == 'true' && 'S' != superImpersonationCookie) || isGuest){
                	/*No need to show the PRICE : Basic User and for impersonation*/
                }else{
                	o.push('				<p class="myPriceSec"><strong><span>My Price:&nbsp;</span><span>' + ( __currSymbol ? __currSymbol : item.currency ) + parseFloat(item.orderItemPrice).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span></strong></p><br/>');
                }
                //o.push('				<p class="discSec"><span>('+ (parseFloat(item.totalAdjustment.value).toFixed(2) == '0.00' ? '0' : (-1) * (parseFloat(item.totalAdjustment.value).toFixed(2)/parseFloat(item.orderItemPrice).toFixed(2)*100).toFixed(2)) +'%)</span></p>');
                o.push('			</div>');
                o.push('		<!--row end-->');
                o.push('		</div>');
                
            }
        	if(exceedsLimit) {
        		o.push('	<!--Items are more than viewable limit-->');
            	o.push('	<div class="viewMore"><a href=\'' + checkoutUrl + '\' >View More Items in Cart</a></div>');
        	}
        	
        	o.push('	<!--detailsSectionCont end -->');
        	o.push('	</div>');
        	if((basicUserRole == 'true' && 'S' != superImpersonationCookie) || isGuest){
        		/*No need to show ORDER SUBTOTAL and YOUR SAVING : Basic User*/
        	}else{
        		o.push('	<!--orderTotalDet start-->');
            	o.push('	<div class="orderTotalDet col-lg-12 col-sm-12 col-md-12 col-xs-12">');
            	o.push('		<div>');
            	o.push('			<p><strong>Order Subtotal: <span>'+ ( __currSymbol ? __currSymbol : _cart.grandTotalCurrency ) + parseFloat(_cart.totalProductPrice).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</strong></p>');
            	o.push('		</div><br/>');
            	//o.push('		<div class="savingTotDet col-lg-12 col-sm-12 col-md-12 col-xs-12">');
            	//o.push('			<p class="timeSpan">Your Savings: <span>' + ( __currSymbol ? __currSymbol : _cart.grandTotalCurrency ) + (-1) * parseFloat(_cart.totalAdjustment).toFixed(2) + '</span></p>');
            	//o.push('		</div>');
            	o.push('	<!--orderTotalDet end-->');
            	o.push('	</div>');
        	}
        	o.push('<!--popupTopLayer end-->');
        	o.push('</div>');
        	
	        	o.push('<!--quickOrderSec start-->');
	        	o.push('<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 quickOrderSec">');
	        	if(punchoutMode!=null && punchoutMode==3){
	        		
	        	}else{
	        	o.push('	<div class="col-lg-7 col-sm-7 col-md-7 col-xs-7">');
	        	o.push('		<p>Know what you want to order?</p>');
	        	o.push('		<a href="' + __wcsServerHost + '/webapp/wcs/stores/servlet/QuickOrderView?catalogId=' + __catalogId + '&amp;langId=-1&amp;storeId=' + __storeId + '">Go To Quick Cart</a>');
	        	o.push('	</div>');
        		}	
	        	o.push('	<button type="button" class="btn btn-primary goToCartBtn col-lg-4 col-sm-4 col-md-4 col-xs-4"'); 
	            o.push('			onclick="window.location=\'' + checkoutUrl + '\'">Go To Cart');
	            o.push('	</button>');
	        	o.push('	<!--quickOrderSec end-->');
	        	o.push('</div>');
        } else {
        	o.push('>');
            o.push('&nbsp;&nbsp;You have no items in your cart');
        }

        o.push('<!--popupcontainer end -->');
        o.push('</div>');
        $('.goToCartSuccess').attr('onclick','window.location=\'' + checkoutUrl + '\'');
    }
    //add the quick order link
    //o.push('<a id="quickOrder" href="' + __wcsServerHost + '/webapp/wcs/stores/servlet/QuickOrderView?catalogId=' + __catalogId + '&amp;langId=-1&amp;storeId=' + __storeId + '">Quick Order</a>');
    
    $t.html(o.join(''));
}

function showCart() {

    if (_isVisible == false) {
        $('#CartDropdown-Container').slideDown(500);
        
        document.getElementById('cartdropdown-container').style.display='block';
    	document.getElementById('arrow').style.display='block';
    }
    _isVisible = true;
}

function hideCart() {
    if (_isVisible == true) {
        $('#CartDropdown-Container').slideUp(500);
    	document.getElementById('cartdropdown-container').style.display='none';
    	document.getElementById('arrow').style.display='none';
    }
    _isVisible = false;
}

function render($t) {
	
    if(!$t) {
    	$t = $('#cart-plugin');
    	$t.empty();
    }
	
    //---render markup and add to dom
    attachMarkup($t);

    var $con = $t;
    var $but = $('#cart_button');

    //---attach any event handlers
    /*$but.click(function(event) {
        event.stopPropagation();
        showCart();
    });

    if (jQuery().hoverIntent) {
        var hOptions = {
            timeout: 0,
            over: showCart,
            out: function() {}
        };
        $but.hoverIntent(hOptions);

        var outOptions = {
            timeout: 500,
            over: function() {},
            out: hideCart
        };
        $con.hoverIntent(outOptions);

    } else {
        $con.mouseleave(function(event) {
            hideCart();
        });
    }*/
}

function attachMarkup($t) {
	updateCartInHeader($t);
}

function refreshCart($t) {
	ETPUtils.callAjax('GET', '/wcs/resources/store/' + __storeId + '/cart/@self', 'json', 
				null, null, null, renderAjaxSuccessResponseForCart, renderAjaxErrorResponseForCart, $t, $t);
};

function renderAjaxSuccessResponseForCart(data, $t) {
	
    _cart = data;
    var itemsLength = _cart.recordSetCount;
    
    // Get item description
    for (var i = 0; i < itemsLength; i++) {
        var currentIndex = i;//_cart.orderItem.length - (1 + i);
        var item = _cart.orderItem[currentIndex]; //start backwards
        var _productInfo;
        ETPUtils.callAjax('GET', '/wcs/resources/store/' + __storeId + '/ETPOrder/getProductSKUDetails/' + item.partNumber
        		+ '/' + 'en',
        		'json', false, 'application/json', null, updateCartItemsSuccess, updateCartItemsFailure);
        
        function updateCartItemsSuccess (data, $t) {
        	_productInfo = data;
        	_cart.orderItem[currentIndex].itemDesc = (_productInfo.productName ? _productInfo.productName : 'Name Not Avbl' );
        	_cart.orderItem[currentIndex].thumbnail = (_productInfo.productImagePath ? _productInfo.productImagePath : 'Image Not Avbl');
        };
        
        function updateCartItemsFailure (request, status, error) {
        	console.log(error);
        };
    }
    render($t);
};

/*function updateCartItemsSuccess (data) {
	_productInfo = data;
	_cart.orderItem[currentIndex].itemDesc = _productInfo.CatalogEntryView[0].name;
	_cart.orderItem[currentIndex].thumbnail = _productInfo.CatalogEntryView[0].thumbnail;
};

function error (request, status, error) {
	console.log(error);
};*/

function renderAjaxErrorResponseForCart(request, status, error, $t) {
	// by-pass and continue because, IBM REST call for getting cart gives 404, when there is no order
	if (request.status==404) {
		// clear cart
		_cart = null;
	} 
		render($t);		
	
}

// Called from Quick Order Page
function renderCart() {
	refreshCart();
}
$( document ).ready(function() {
	$('.systems-megamenu .series-toggle').on('click', function() {
		if ($(window).width() > 1023) {
			if ($(this).parents('.has-children').hasClass('open')) {
				closeSeries($(this).parents('.sequencing-col'), false);
			} else {
				openSeries($(this).parents('.sequencing-col'));
			}
		} else {
			if ($(this).parents('.has-children').hasClass('open')) {
				closeSeriesMobile($(this).parents('.sequencing-col'), false);
			} else {
				openSeriesMobile($(this).parents('.sequencing-col'), false);
			}
		}
	});
	
	function closeSeries(series, fadeOut) {
		var subMenu = series.find('.systems-submenu');
		var otherSeries = series.siblings();
	
		subMenu.animate({opacity: 0}, 100, function() {
			$(this).animate({width: "0px"}, 500, function() {
				$(this).parents('.sequencing-col').removeClass('open');
			});
		});
	
		if (fadeOut) {
			series.find('.sys-img').animate({opacity: 0.4}, 500);
			series.addClass('outfocus');
		} else {
			otherSeries.each(function() {
				$(this).find('.sys-img').animate({opacity: 1}, 500);
				$(this).removeClass('outfocus');
			});
		}
	}
	
	function openSeries(series) {
		var subMenu = series.find('.systems-submenu');
		var otherSeries = series.siblings();
		subMenu.stop();
		// test if we need to delay the animation to avoid pushing elements
		if (series.hasClass('outfocus')) { delay = 250; } else { delay = 0; }
	
	
		// fade this series image in
		series.find('.sys-img').animate({opacity: 1}, 500);
		series.removeClass('outfocus');
		
		// animate this submenu open
		subMenu.css("width","auto");
		var subMenuWidth = subMenu.outerWidth();
		subMenu.css({"width":"0px","opacity":"0"});
	
		subMenu.delay(delay).animate({width: subMenuWidth}, 500, function() {
			subMenu.animate({opacity: 1}, 500);
			series.addClass('open');
		});
		
		// fade other series out
		otherSeries.each(function() {
			closeSeries($(this), true);
		});
	}
});
