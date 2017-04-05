(function () {
	'use strict'
	angular
		.module('sqo-ng-parallax', [])
		.directive('sqoNgParallax', SqoNgParallax);

	SqoNgParallax.$inject = ['$window', '$document', '$timeout'];

	function SqoNgParallax($window, $document, $timeout) {

		var ddo = {
			restric: 'EA',
			scope: {
				speed: '@',
				image: '@',
				yPos: '=?',
				debug: '=?',
				useStyle : '@?',
			},
			transclude: true,
			template: '<div ng-transclude></div>',
			link: link
		};

		return ddo;




		function link(scope, element, attr) {
			var debug = scope.debug ? scope.debug : false;
			var el = element[0];
			var vendorPrefixes;
			var transformProperty;
			var hasImage = angular.element(el.querySelector('img')).length > 0 ? true : false;
			var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
			var speed = scope.speed;
			var defaultCssProperties = {
				display: 'block',
				overflow: 'hidden',
				position: 'relative'
			}

			init();

			vendorPrefixes = function () {
				var test = angular.element('<div></div>')[0];
				var prefixes = 'transform WebkitTransform MozTransform OTransform'.split(' ');
				for (var i = 0; i < prefixes.length; i++) {
					if (test.style[prefixes[i]] !== undefined) {
						transformProperty = prefixes[i];
						break;
					}
				}
				return {
					prefix: transformProperty
				};
			};

			(function () {
				var lastTime = 0;
				var vendors = ['webkit', 'moz', 'o'];
				for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
					window.cancelAnimationFrame =
						window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
				}
				if (!window.requestAnimationFrame)
					window.requestAnimationFrame = function (callback, element) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function () {
								callback(currTime + timeToCall);
							},
							timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};

				if (!window.cancelAnimationFrame)
					window.cancelAnimationFrame = function (id) {
						clearTimeout(id);
					};
			})();


			function doParallaxEffect() {
				var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
				var yPos = -(scrollTop / speed);
				if (hasImage) {
					var image = angular.element(el.querySelector('img'))[0];
					image.style[vendorPrefixes.prefix] = 'translate3d( 0px ,' + Math.round(yPos) + 'px , 0 )';
				} else {
					el.style.backgroundImage = "url('" + scope.image + "')" || {};
					el.style.backgroundSize = '100%';
					el.style.backgroundPosition = '0% ' + yPos + 'px';
				}
				// debug 
				if (debug) {
					scope.$parent.debug = debug;
					scope.$apply(function () {
						scope.$parent.yPos = yPos;
					})
				}

			}



			function init(){
				// addind a default class
				el.classList.add('__sq_ng_parallax');
				angular.merge( el.style, defaultCssProperties );

				angular.element($window).bind("scroll", function () {
					requestAnimationFrame(doParallaxEffect);
				});
				requestAnimationFrame(doParallaxEffect);

				scope.$on('$destroy', function () {
					$window.off('scroll', doParallaxEffect);
				});

			}


		}
	}

})();