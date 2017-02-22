function initGetTimeZone() {
    // get the browser's current date and time
    var d = new Date();

    // find the timeoffset between browser time and GMT
    var timeOffset = -d.getTimezoneOffset() / 60;

    // store the time offset in cookie
    var gmtTimeZone;
    if (timeOffset < 0)
        gmtTimeZone = "GMT" + timeOffset;
    else if (timeOffset == 0)
        gmtTimeZone = "GMT";
    else
        gmtTimeZone = "GMT" + encodeURIComponent('+') + timeOffset;
    document.cookie = "WC_timeoffset=" + gmtTimeZone + "; path=/; domain=.illumina.com";
}
initGetTimeZone();
(function($) {
    $.fn.icomCart = function(opts, cart) {
        var defaults = {
            maxViewable: 4
        };
        var currency = "$";
        if (opts.currency) {
            currency = opts.currency
        }

        var options = $.extend(defaults, opts || {});
        var me = this;
        return cart.each(function() {
            var $t = $(this);
            var _cart = null;
            var _isLoggedIn = false;
            var _isVisible = false;
            var _userHasGuestCartCookie = false;

            var ajaxOptions = {
                error: function(msg) {
                    setCartMessage("There was a problem loading your cart.", "ui-state-error");
                }
            };

            getDetails();

            function getDetails() {
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: '/bin/wcs/getCart',
                    success: function(data) {
                        if (!jQuery.isEmptyObject(data) && !data["errors"]) {
                            _cart = data;
                            if (!_wcs.isLoggedIn && data.orderId) {
                                var guestRedirect = _wcs.config.wcsHttpsProtocolHost + _wcs.config.wcsRedirect + '?returnUrl=' + window.location.href + '&order=' + data.orderId + '&emailCartCheckOut=true' + "&deleteGuestUserActivity" + "=true";
                                $('#userStatus').attr('href', guestRedirect);
                            }
                        }
                        render();
                    },
                    error: function(request, status, error) {

                    }

                });
            };

            function render() {
                //---render markup and add to dom
                if (_cart != null && _cart.orderItem) {
                    var prtNumbers = [];
                    for (var i = 0; i < _cart.orderItem.length; i++) {
                        prtNumbers.push(_cart.orderItem[i].partNumber);
                    }
                    _wcs.getCart(prtNumbers, function(obj) {
                            obj = JSON.parse(obj);
                            if (obj) {
                                attachMarkup(obj);
                            }
                            var $con = $t;
                            var $but = $('#cart_button');
                            //---attach any event handlers
                            $but.click(function(event) {
                                event.stopPropagation();
                                if ($(window).width() > 768) {
                                    showCart();
                                }
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
                            }

                            // $but.hover(showCart, function() {});
                            // $con.hover(function() {}, hideCart);
                        },
                        function(request, status, error) {
                            attachMarkup({});
                            console.log(request.responseText);
                        }
                    );
                } else {

                    attachMarkup({});
                }
            }

            function showCart() {

                if (_isVisible == false) {
                    $('#CartDropdown-Container').slideDown(500);
                    // if ($.browser.msie && $.browser.version > 7)
                    // $('#CartDropdown-Container').css('top', '-24px');
                }
                _isVisible = true;
            }

            function hideCart() {
                if (_isVisible == true) {
                    $('#CartDropdown-Container').slideUp(500);
                }
                _isVisible = false;
            }

            function attachMarkup(obj) {
                var defaults = {
                    maxViewable: 4
                };
                baseIcomUrl = wcsHost;
                var o = [];
                var fullCartUrl;
                var checkoutUrl;
                var orderId = ".";
                if (null != _cart) {
                    orderId = _cart.orderId;
                }

                if (opts.cartUrl.toString().indexOf('&orderId') !== -1) {
                    fullCartUrl = opts.cartUrl.substring(0, opts.cartUrl.indexOf('&orderId'));
                } else {
                    fullCartUrl = opts.cartUrl;

                }
                fullCartUrl = fullCartUrl + '&orderId=' + orderId;
                opts.cartUrl = fullCartUrl;
                checkoutUrl = opts.checkOutUrl;

                if (_cart == null || !_cart.orderItem) {
                    o.push('<span>&nbsp;&nbsp;&nbsp;&nbsp;<a id="cart_button" href="' + fullCartUrl + '">VIEW CART</a></span>');
                } else {
                    counter = {};
                    prices = {};
                    var quantity = 0;
                    _cart.orderItem.forEach(function(obj) {

                        counter[obj.partNumber] = (counter[obj.partNumber] || 0) + 1;
                        prices[obj.partNumber] = obj.orderItemPrice;
                        if (obj.quantity && !isNaN(parseInt(obj.quantity))) {
                            var q = parseInt(obj.quantity);
                            quantity = quantity + q;
                        }
                    })

                    for (var key in counter) {
                        if (counter.hasOwnProperty(key)) {
                            console.log(key + " -> " + counter[key]);
                        }
                    }

                    o.push('<span id="CartDropDown-Placeholder"><a id="cart_button" href="' + fullCartUrl + '">VIEW CART (' + quantity + ')</a>');
                    o.push('<div style="display:none;" id="CartDropdown-Container">');
                    o.push('<div id="CartDropdown-Tab">');
                    o.push('</div>');
                    o.push('<div id="CartDropdown-Form">');
                    o.push('<div id="CartDropdown-Form-Inner">');
                    o.push('<div class="popupContainer col-lg-3 col-sm-3 col-md-3 col-xs-3">');
                    o.push('<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 popupHeader">');
                    o.push('<span> Items in your cart:</span>');
                    o.push('<span><a href="javascript:$(\'#CartDropdown-Container\').hide();void 0;">&times;</a></span></div>');
                    var exceedsLimit = _cart.orderItem.length > defaults.maxViewable;
                    if (_cart.orderItem.length > 0) {
                        o.push('<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 detailsSectionCont">');

                        //   var itemCount = exceedsLimit ? Math.min(_cart.orderItem.length, defaults.maxViewable) : _cart.orderItem.length;
                        //  for (var i = 0; i < itemCount; i++) {
                        //    var currentIndex = _cart.orderItem.length - (1 + i);
                        //  var item = _cart.orderItem[currentIndex]; //start backwards
                        currentIndex = 0;
                        for (var key in counter) {
                            var item = _cart.orderItem[currentIndex];
                            o.push('<div class="row popupDetails">');
                            o.push('<div class="imgContainer col-lg-3 col-md-3 col-sm-3 col-xs-3">');
                            var imagePath = obj[key].productImagePath ? obj[key].productImagePath : '/images/products/image-coming-soon.png';
                            o.push('<img class="cartImg" src="' + imagePath + '">');
                            o.push('</div>');
                            o.push('<div class="promoDetails  col-lg-9 col-md-9 col-sm-9 col-xs-9">');
                            o.push('<p class="promoName">' + obj[key].productName + '</p>');
                            o.push('<p class="promoPrice">' + key + '</p>');
                            o.push(' <p class="itemQty"><span>QTY: </span><span>' + item.quantity + '</span></p>');
                            var itemPrice = item.orderItemPrice;
                            if (itemPrice && itemPrice.toString().indexOf(".") != -1) {
                                itemPrice = itemPrice.substring(0, itemPrice.toString().indexOf(".") + 3);
                            }
                            if ((opts.basicUserRole && opts.basicUserRole == true) || (!_wcs.isLoggedIn)) {
                                /*No need to show the PRICE : Basic User and Guest User*/
                            } else {
                                o.push(' <p class="myPriceSec"><strong><span>My Price: </span><span>' + currency + parseFloat(itemPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + '</span></strong></p></br>');
                            }

                            o.push(' </div>');
                            o.push('</div>');
                            currentIndex = currentIndex + 1;
                            if (currentIndex >= 4) {
                                o.push('	<div class="viewMore"><a href=\'' + checkoutUrl + '\' >View More Items in Cart</a></div>');
                                break;
                            }
                        }
                        ///    }
                        o.push('</div>');
                    }
                    if ((opts.basicUserRole && opts.basicUserRole == true) || (!_wcs.isLoggedIn)) {
                        /*No need to show ORDER SUBTOTAL and YOUR SAVING : Basic User*/
                    } else {
                        o.push('<div class="orderTotalDet col-lg-12 col-sm-12 col-md-12 col-xs-12">');
                        o.push('	<div>');
                        var totalProductPrice = _cart.totalProductPrice;
                        if (totalProductPrice && totalProductPrice.toString().toString().indexOf(".") != -1) {
                            totalProductPrice = totalProductPrice.toString().substring(0, totalProductPrice.toString().indexOf(".") + 3);
                        }
                        o.push('<p><strong>Order Subtotal: <span>' + currency + parseFloat(totalProductPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + '</strong></p>');
                        o.push('</div>');
                        /* Defect #1669 fix, removing Your savings section    
                        o.push('<div class="savingTotDet col-lg-12 col-sm-12 col-md-12 col-xs-12">');
                        var totalAdjustment = _cart.totalAdjustment;
                        if (totalAdjustment && totalAdjustment.toString().indexOf(".") != -1) {
                            if (totalAdjustment.toString().charAt(0) == "0") {
                                totalAdjustment = totalAdjustment.toString().substring(0, totalAdjustment.toString().indexOf(".") + 3);
                            } else {
                                totalAdjustment = totalAdjustment.toString().substring(1, totalAdjustment.toString().indexOf(".") + 3);
                            }
                        }
                        o.push('		<p class="timeSpan">Your Savings: <span>' + currency + totalAdjustment + '</span></p>');
                        o.push('	</div>');
                        */
                        o.push('</div>'); /// orderTotalDet div ending here
                    }
                    o.push('<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 quickOrderSec">');
                    if (punchOutMode != 3) {
                        o.push('	<div class="knwOrder col-lg-8 col-sm-8 col-md-8 col-xs-8">');
                        o.push('		<p>Know what you want to order?</p>');
                        o.push('		<p><a href="' + opts.quickOrderUrl + '">Go To Quick Cart</a></p>');
                        o.push('	</div>');
                    }
                    o.push('<a href="' + opts.checkOutUrl + '"><button type="button" class="btn btn-primary">Go To Cart</button></a>');
                    o.push('</div>');
                    o.push('</div>');
                    o.push('</div>');
                    o.push('</div>');
                    o.push('</div>');
                    o.push('</span>');

                } ///// else ending here
                $t.html(o.join(''));

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
        });
        
        return this;
    };

    _wcs = {};

    _wcs.loadCart = $.fn.icomCart;
    _wcs.isLoggedIn = false;

    _wcs.findProducts = function(catIds, param, callback) {
        $.ajax({
            type: 'POST',
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            traditional: true,
            data: {
                catIds: catIds
            },
            url: '/bin/wcs/findProducts',
            success: function(data) {
                callback(data);
            },
            error: function(request, status, error) {
                // alert(request.responseText);
            }
        });
    }
    _wcs.getCart = function(prtNumbers, callback, errorCallback) {
        $.ajax({
            type: 'GET',
            url: '/bin/aem/cartProductInfo',
            dataType: 'text',
            traditional: true,
            data: {
                prtNumbers: prtNumbers,
                locale: $("[name='hiddenLocalePath']") ? $("[name='urlLocalePath']").val() : "/amr/en_US"
            },
            success: function(data) {
                callback(data);
            },
            error: function(request, status, error) {
                errorCallback(request, status, error);
            }
        });
    }
    _wcs.currentUser = function(param, callback, err) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/bin/wcs/isLoggedIn',
            success: function(user) {
                if (!$.fn.icomCart) {
                    $.fn.icomCart = _wcs.icomCart;
                }
                callback(user);
            },
            error: function(request, status, error) {
                err(request, status, error);
            }

        });
    }
    _wcs.addToCart = function(addedProducts, options) {
        if (addedProducts && addedProducts.length > 0) {
            var t = JSON.stringify(addedProducts);
            var params = {};
            params['products'] = options;
            params['rectype'] = "postback";
            params['eventtype'] = "cartAdd";

            $.ajax({
                type: 'POST',
                url: '/bin/aem/servlet',
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    products: t,
                    operation: "addToCart"
                },
                success: function(obj) {
                    if (obj) {
                        //Adding cartid and cartcreate params in Add to cart analytics options
                        if (obj.TransactionId) {
                            var temp;
                            params['cartid'] = obj.TransactionId;
                            if (_wcs.config.cartUrl.toString().indexOf('&orderId') !== -1) {
                                temp = _wcs.config.cartUrl.substring(0, _wcs.config.cartUrl.indexOf('&orderId'));
                            } else {
                                temp = _wcs.config.cartUrl;
                            }
                            _wcs.config.cartUrl = temp + '&orderId=' + obj.TransactionId;
                        }
                        if (obj.createCart && obj.createCart == 'true') {
                            params['cartcreate'] = 'true';
                        }
                        //triggering add to cart event analytics call

                        $('#cart-plugin').icomCart(_wcs.config);
                        $('#addToCartModal').modal('show');
                        naf.wcs.events.cartAdd(params);
                    }
                },
                error: function(request, status, error) {
                    console.log(request.responseText);
                }
            });
        }

    };

    _wcs.getWCSConfig = function(callback, errorCallback) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/bin/aem/wcsconfig',
            success: function(config) {
                if (config && config.wcsHttpsProtocolHost) {
                    _wcs.config = config;
                    callback(config);
                }
            },
            error: function(request, status, error) {
                errorCallback(request, status, error);
            }
        });

    };

    _wcs.removeImpersonatedSession = function() {
        $.ajax({
            type: 'GET',
            url: _wcs.config.userSessionSetIn,
            //url: _wcs.config.wcsHttpsProtocolHost+_wcs.config.userSessionSetIn,
            success: function(config) {
                var wcTokenCSR = $.cookie('WCToken_CSR');
                var wcTrustedTokenCSR = $.cookie('WCTrustedToken_CSR');
                $.cookie("WCToken", wcTokenCSR, { path: '/', domain: '.illumina.com' });
                $.cookie("WCTrustedToken", wcTrustedTokenCSR, { path: '/', domain:'.illumina.com'});
                $.removeCookie("refreshOnBehalfTokens", {path: '/',domain:'.illumina.com'});
                $.removeCookie("WCToken_CSR", {path: '/',domain:'.illumina.com'});
                $.removeCookie("WCTrustedToken_CSR", {path: '/',domain:'.illumina.com'});
                $.removeCookie("WC_OnBehalf_Role_"+_wcs.config.storeID, {path: '/',domain:'.illumina.com'});
                window.location.href = _wcs.config.wcsHttpsProtocolHost + '/webapp/wcs/stores/servlet/CustomerServiceLandingPageView?catalogId='+_wcs.config.catalogID+'&langId=-1&storeId='+_wcs.config.storeID;
            },
            error: function(request, status, error) {
                errorCallback(request, status, error);
            }
        });

    }

})(jQuery);
