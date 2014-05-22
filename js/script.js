(function() {
    // Main app logic
    var app = new Function();
    
    $.extend(app, {
        activationDelay: 100,
        rafineryTime: 5000,
        
        windowTop: $(window).scrollTop(),
        
        init: function() {
            this.applyWebFont();
            this.activateSections($(window).height(), $(window).scrollTop());
            this.initEvents();
            this.animateSmokeClouds();
            this.animateOilRafinery();
        },
                
        initEvents: function() {
            this.initWindowScroll();
        },
        
        initWindowScroll: function() {
            var self = this;
            $(window).scroll(function() {
                self.activateSections($(this).height(), $(this).scrollTop());
            });
        },
        
        activateSections: function(wHeight, wScrollTop) {
            if (wHeight + wScrollTop - $('.welcome-section').offset().top >= $('.welcome-section').outerHeight()) {
                this.activateSection($('.welcome-section'));
            }
            
            if (wHeight + wScrollTop - $('.oil-section').offset().top >= $('.oil-section').outerHeight()) {
                this.activateSection($('.oil-section'));
            }
            
            if (wHeight + wScrollTop - $('.small-truck').offset().top >= $('.small-truck').outerHeight()) {
                this.truck.activateTruck($('.small-truck'));
            }
            
            if (wHeight + wScrollTop - $('.big-truck').offset().top >= $('.big-truck').outerHeight()) {
                this.truck.activateTruck($('.big-truck'));
            }

            if (wHeight + wScrollTop - $('.contact-section').offset().top >= $('.contact-section').outerHeight()) {
                this.activateSection($('.contact-section'));
            }
        },
        
        applyWebFont: function() {
            WebFont.load({
                google: {
                    families: ['Open+Sans:400,400italic,700,700italic:latin,latin-ext', 'Oswald:300,400,700:latin,latin-ext']
                }
            });
        },
        
        animateSmokeClouds: function() {
            this.smokeAnimation($('.left-smoke'));
            this.smokeAnimation($('.right-smoke'));
        },
        
        smokeAnimation: function(el) {
            for (var a = 0; a < 15; a++) {
                setTimeout(function b() {
                    var a = Math.random() * 1e3 + 5e3,
                    c = $("<div />",{"class": "smoke", css: {left: Math.random() * 50}});

                    $(c).appendTo(el);

                    $.when ($(c).animate({},{
                        duration: a / 4,
                        easing: "linear",
                        queue: false,
                        complete: function(){
                            $(c).animate({},{
                                duration: a / 3,
                                easing: "linear",
                                queue:false
                            });
                        }
                    }), $(c).animate({
                        bottom: el.height() - $(c).height()
                    }, {
                        duration: a,
                        easing: "linear",
                        queue:false
                    })).then(function(){
                        $(c).remove();
                        b();
                    });
                }, Math.random() * 3e3);
            }
        },
        
        animateOilRafinery: function() {
            this.animateWheel($('.wheel'));
            this.animateWheelJoint($('.wheel-joint'));
            this.animateOilArm($('.oil-arm'));
        },
        
        animateWheel: function(el) {
            var self = this;
            
            this.animateRotate(el, 0, 360, self.rafineryTime, 'linear', function() {
                self.animateWheel(el);
            });
        },
        
        animateWheelJoint: function(el) {
            this.animateWheelJointArmToRight(el);
        },
        
        animateWheelJointArmToRight: function(el) {
            var self = this;
            
            this.animateRotate(el, 0, 0.4, self.rafineryTime / 2, 'linear', function() {
                self.animateWheelJointArmToLeft(el);
            });
            el.animate({
                height: 203
            }, self.rafineryTime / 2);
        },
        
        animateWheelJointArmToLeft: function(el) {
            var self = this;
            
            this.animateRotate(el, 0.4, 0, self.rafineryTime / 2, 'linear', function() {
                self.animateWheelJoint(el);
            });
            el.animate({
                height: 149
            }, self.rafineryTime / 2);
        },
        
        animateOilArm: function(el) {
            var self = this;
            this.animateRotate(el, 0, Math.atan(30 / 136) * 2 * 180 / Math.PI, self.rafineryTime / 2, 'linear', function() {
                    self.animateRotate(el, Math.atan(30 / 136) * 2 * 180 / Math.PI, 0, self.rafineryTime / 2, 'linear', function() {
                        self.animateOilArm(el);
                    });
            });
        },
        
        animateRotate: function(el, startAngle, endAngle, duration, easing, complete) {
            $({deg: startAngle}).animate({deg: endAngle}, {
                duration: duration,
                easing: easing,
                step: function(now){
                    el.css({
                        '-moz-transform': 'rotate('+now+'deg)',
                        '-webkit-transform': 'rotate('+now+'deg)',
                        '-o-transform':' rotate('+now+'deg)',
                        '-ms-transform': 'rotate('+now+'deg)',
                        'transform': 'rotate('+now+'deg)'
                    });
                },
                complete: complete || $.noop
            });
        },
        
        truck: {
            truckAnimationInterval: 7000,
            driveDuration: 1000,
            fadeDuration: 500,
            hideDelay: 2000,
            
            activateTruck: function(el) {
                this.smallTruck = el.hasClass('small-truck') ? true : false;
                
                if (!el.hasClass('active')) {
                    el.addClass('active');
                    this.smallTruck ? this.activateSmallTruck(el) : this.activateBigTruck(el);
                }
            },
            
            activateSmallTruck: function(el) {
                var self = this;
                
                this.showSmallTruck(el);
                setInterval(function(){
                    self.showSmallTruck(el);
                }, self.truckAnimationInterval);
            },
            
            activateBigTruck: function(el) {
                this.driveBigTruck(el);
            },
            
            showSmallTruck: function(el) {
                var self = this;
                
                this.resetSmallTruck(el);
                el.fadeTo(self.fadeDuration, 1, function(){
                    setTimeout(function() {
                        self.driveSmallTruck(el);
                    }, self.driveDuration, el);
                });
            },
            
            resetSmallTruck: function(el) {
                el.css({
                    opacity: 0,
                    left: 30
                });
            },
            
            driveSmallTruck: function(el) {
                var self = this;
            
                el.animate({
                    opacity: 0,
                    left: -70
                }, self.driveDuration, function() {
                    self.resetSmallTruck(el);
                });
            },
            
            driveBigTruck: function(el) {
                var self = this;
            
                el.animate({
                    left: 586,
                    bottom: -82
                }, {
                    duration: self.driveDuration * 2,
                    easing: 'swing'
                });
            }
        },
        
        activateSection: function(section) {
            if (!section.hasClass('active')) {
                var self = this,
                    headerDelay = 1000,
                    articleDelay = 150;
                
                section.addClass('active');
                setTimeout(function() {
                    self.showHeader(section.find('header'), {
                        duration: headerDelay,
                        easing: 'easeOutBounce'
                    });
                    self.showArticle(section.find('article'), {
                        duration: articleDelay,
                        easing: 'easeInOutQuart'
                    });
                }, self.activationDelay);
            }
        },
        
        showHeader: function(el, opts) {
            el.animate({
                top: 0,
                opacity: 1
            }, {
                duration: opts.duration,
                easing: opts.easing
            });
        },
        
        showArticle: function(el, opts) {
            el.animate({
                left: 0,
                opacity: 1
            }, {
                duration: opts.duration,
                easing: opts.easing
            });
        }
    });
    
    app.init();
})($, WebFont)