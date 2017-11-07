/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Created by stepanov on 6/8/16.
	 */

	__webpack_require__(1);
	__webpack_require__(5);
	__webpack_require__(7);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(12);
	__webpack_require__(13)
	var Swiper = __webpack_require__(15);
	var dialogPolyfill = __webpack_require__(16);

	$(document).ready(function () {
	    function getCriteria() {
	        return $('#criteria').val();
	    }

	    function getUrl() {
	        if (getCriteria() === 'group') {
	            return '/api/group'
	        } else {
	            return '/api/teacher'
	        }
	    }

	    $(function () {
	        $("#search").autocomplete({
	            source: function (request, response) {
	                $.ajax({
	                    url: getUrl(),
	                    dataType: "json",
	                    data: {
	                        search: request.term
	                    },
	                    success: function (data) {
	                        // Handle 'no match' indicated by [ "" ] response
	                        response(
	                            $.map(data, function (value, key) {
	                                if (getCriteria() === 'group') {
	                                    return {
	                                        label: value.group_full_name,
	                                        value: value.group_id
	                                    }
	                                } else {
	                                    return {
	                                        label: value.teacher_name + '[' + value.institute.institute_abbr + ']',
	                                        value: value.teacher_id
	                                    }
	                                }
	                            })
	                        );
	                    }
	                });
	            },
	            minLength: 2,
	            select: function (event, ui) {
	                $("#search").val(ui.item.label);
	                location.href = '/timetable/' + getCriteria() + '/' + ui.item.value;
	                return false;
	            }
	        });
	    });
	    var snackbarContainer = document.querySelector("#messages");
	    var initialSlide = 0;
	    $(".mdl-tabs__tab").each(function (key, value) {
	        if ($(value).hasClass('is-active')) {
	            initialSlide = key;
	        }
	    })
	    //initialize swiper when document ready  and element is exist
	    if ($(".swiper-container").length > 0) {
	        var mySwiper = new Swiper('.swiper-container', {
	            // Optional parameters
	            initialSlide: initialSlide,
	            direction: 'horizontal',
	            loop: false,
	            prevButton: '#week-one',
	            nextButton: '#week-two'
	        })
	        mySwiper.on('slideChangeStart', function () {
	            $(".mdl-tabs__tab").each(function (key, value) {
	                if (mySwiper.activeIndex == key) {
	                    snackbarContainer.MaterialSnackbar.showSnackbar({message: $(value).text()});
	                }
	                $(value).toggleClass("is-active");
	            });
	        });
	    }

	    function getGroups(institute_id) {
	        $.ajax({
	            url: '/api/institute/' + institute_id + '/groups',
	            dataType: "json",
	            method: "GET",
	            success: function (data) {
	                $('#group').empty();
	                var listitems = '<option disabled selected value> -- Виберіть групу -- </option>';
	                $.each(data, function (key, value) {
	                    listitems += '<option value=' + value.group_id + '>' + value.group_full_name + '</option>';
	                });
	                $("#group").append(listitems)
	            },
	            error: function (data) {
	                alert("Проблеми з’єднання з сервером!")
	            }
	        })
	    }

	    function getInstitutes() {
	        $.ajax({
	            url: '/api/institutes',
	            dataType: "json",
	            method: "GET",
	            success: function (data) {
	                $('#institute').empty();
	                $("#group").empty();
	                var listitems = '<option disabled selected value> -- Виберіть інститут -- </option>';
	                $.each(data, function (key, value) {
	                    listitems += '<option value=' + value.institute_id + '>' + value.institute_abbr + '</option>';
	                });
	                $("#institute").append(listitems)
	            },
	            error: function (data) {
	                alert("Проблеми з’єднання з сервером!")
	            }
	        })
	    }

	    $('#favorite').on('click', function () {
	        $.ajax({
	                url: '/api/favorite',
	                dataType: 'json',
	                data: {
	                    group_id: $('#favorite').data('group')
	                },
	                method: 'POST',
	                success: function (data) {
	                    if (data === 'updated') {
	                        $('#favorite').children().text('favorite');
	                        snackbarContainer.MaterialSnackbar.showSnackbar({message: "Групу оновлено!"});
	                    } else {
	                        snackbarContainer.MaterialSnackbar.showSnackbar({message: "Групу запам’ятовано!"});
	                    }
	                },
	                error: function (data) {
	                    console.log(data)
	                    alert('Проблеми з’єднання з сервером')
	                }
	            }
	        )
	    });
	    $('#institute').change(function (event) {
	        getGroups($(event.target).val())
	    });

	    $('#group').change(function (event) {
	        location.href = '/timetable/group/' + $(event.target).val()
	    });

	    (function () {
	        var dialogButton = document.querySelector('#list');
	        var dialog = document.querySelector('#dialog');
	        if (dialog) {
	            if (!dialog.showModal) {
	                dialogPolyfill.registerDialog(dialog);
	            }
	            if (dialogButton) {
	                dialogButton.addEventListener('click', function () {
	                    dialog.showModal();
	                    getInstitutes();
	                });
	            }
	            dialog.querySelector('button:not([disabled])')
	                .addEventListener('click', function () {
	                    dialog.close();
	                });
	        }
	    })()

	});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

	;(function() {
	"use strict";

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * A component handler interface using the revealing module design pattern.
	 * More details on this design pattern here:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 *
	 * @author Jason Mayes.
	 */
	/* exported componentHandler */

	// Pre-defining the componentHandler interface, for closure documentation and
	// static verification.
	var componentHandler = {
	  /**
	   * Searches existing DOM for elements of our component type and upgrades them
	   * if they have not already been upgraded.
	   *
	   * @param {string=} optJsClass the programatic name of the element class we
	   * need to create a new instance of.
	   * @param {string=} optCssClass the name of the CSS class elements of this
	   * type will have.
	   */
	  upgradeDom: function(optJsClass, optCssClass) {},
	  /**
	   * Upgrades a specific element rather than all in the DOM.
	   *
	   * @param {!Element} element The element we wish to upgrade.
	   * @param {string=} optJsClass Optional name of the class we want to upgrade
	   * the element to.
	   */
	  upgradeElement: function(element, optJsClass) {},
	  /**
	   * Upgrades a specific list of elements rather than all in the DOM.
	   *
	   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
	   * The elements we wish to upgrade.
	   */
	  upgradeElements: function(elements) {},
	  /**
	   * Upgrades all registered components found in the current DOM. This is
	   * automatically called on window load.
	   */
	  upgradeAllRegistered: function() {},
	  /**
	   * Allows user to be alerted to any upgrades that are performed for a given
	   * component type
	   *
	   * @param {string} jsClass The class name of the MDL component we wish
	   * to hook into for any upgrades performed.
	   * @param {function(!HTMLElement)} callback The function to call upon an
	   * upgrade. This function should expect 1 parameter - the HTMLElement which
	   * got upgraded.
	   */
	  registerUpgradedCallback: function(jsClass, callback) {},
	  /**
	   * Registers a class for future use and attempts to upgrade existing DOM.
	   *
	   * @param {componentHandler.ComponentConfigPublic} config the registration configuration
	   */
	  register: function(config) {},
	  /**
	   * Downgrade either a given node, an array of nodes, or a NodeList.
	   *
	   * @param {!Node|!Array<!Node>|!NodeList} nodes
	   */
	  downgradeElements: function(nodes) {}
	};

	componentHandler = (function() {
	  'use strict';

	  /** @type {!Array<componentHandler.ComponentConfig>} */
	  var registeredComponents_ = [];

	  /** @type {!Array<componentHandler.Component>} */
	  var createdComponents_ = [];

	  var componentConfigProperty_ = 'mdlComponentConfigInternal_';

	  /**
	   * Searches registered components for a class we are interested in using.
	   * Optionally replaces a match with passed object if specified.
	   *
	   * @param {string} name The name of a class we want to use.
	   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
	   * @return {!Object|boolean}
	   * @private
	   */
	  function findRegisteredClass_(name, optReplace) {
	    for (var i = 0; i < registeredComponents_.length; i++) {
	      if (registeredComponents_[i].className === name) {
	        if (typeof optReplace !== 'undefined') {
	          registeredComponents_[i] = optReplace;
	        }
	        return registeredComponents_[i];
	      }
	    }
	    return false;
	  }

	  /**
	   * Returns an array of the classNames of the upgraded classes on the element.
	   *
	   * @param {!Element} element The element to fetch data from.
	   * @return {!Array<string>}
	   * @private
	   */
	  function getUpgradedListOfElement_(element) {
	    var dataUpgraded = element.getAttribute('data-upgraded');
	    // Use `['']` as default value to conform the `,name,name...` style.
	    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
	  }

	  /**
	   * Returns true if the given element has already been upgraded for the given
	   * class.
	   *
	   * @param {!Element} element The element we want to check.
	   * @param {string} jsClass The class to check for.
	   * @returns {boolean}
	   * @private
	   */
	  function isElementUpgraded_(element, jsClass) {
	    var upgradedList = getUpgradedListOfElement_(element);
	    return upgradedList.indexOf(jsClass) !== -1;
	  }

	  /**
	   * Searches existing DOM for elements of our component type and upgrades them
	   * if they have not already been upgraded.
	   *
	   * @param {string=} optJsClass the programatic name of the element class we
	   * need to create a new instance of.
	   * @param {string=} optCssClass the name of the CSS class elements of this
	   * type will have.
	   */
	  function upgradeDomInternal(optJsClass, optCssClass) {
	    if (typeof optJsClass === 'undefined' &&
	        typeof optCssClass === 'undefined') {
	      for (var i = 0; i < registeredComponents_.length; i++) {
	        upgradeDomInternal(registeredComponents_[i].className,
	            registeredComponents_[i].cssClass);
	      }
	    } else {
	      var jsClass = /** @type {string} */ (optJsClass);
	      if (typeof optCssClass === 'undefined') {
	        var registeredClass = findRegisteredClass_(jsClass);
	        if (registeredClass) {
	          optCssClass = registeredClass.cssClass;
	        }
	      }

	      var elements = document.querySelectorAll('.' + optCssClass);
	      for (var n = 0; n < elements.length; n++) {
	        upgradeElementInternal(elements[n], jsClass);
	      }
	    }
	  }

	  /**
	   * Upgrades a specific element rather than all in the DOM.
	   *
	   * @param {!Element} element The element we wish to upgrade.
	   * @param {string=} optJsClass Optional name of the class we want to upgrade
	   * the element to.
	   */
	  function upgradeElementInternal(element, optJsClass) {
	    // Verify argument type.
	    if (!(typeof element === 'object' && element instanceof Element)) {
	      throw new Error('Invalid argument provided to upgrade MDL element.');
	    }
	    var upgradedList = getUpgradedListOfElement_(element);
	    var classesToUpgrade = [];
	    // If jsClass is not provided scan the registered components to find the
	    // ones matching the element's CSS classList.
	    if (!optJsClass) {
	      var classList = element.classList;
	      registeredComponents_.forEach(function(component) {
	        // Match CSS & Not to be upgraded & Not upgraded.
	        if (classList.contains(component.cssClass) &&
	            classesToUpgrade.indexOf(component) === -1 &&
	            !isElementUpgraded_(element, component.className)) {
	          classesToUpgrade.push(component);
	        }
	      });
	    } else if (!isElementUpgraded_(element, optJsClass)) {
	      classesToUpgrade.push(findRegisteredClass_(optJsClass));
	    }

	    // Upgrade the element for each classes.
	    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
	      registeredClass = classesToUpgrade[i];
	      if (registeredClass) {
	        // Mark element as upgraded.
	        upgradedList.push(registeredClass.className);
	        element.setAttribute('data-upgraded', upgradedList.join(','));
	        var instance = new registeredClass.classConstructor(element);
	        instance[componentConfigProperty_] = registeredClass;
	        createdComponents_.push(instance);
	        // Call any callbacks the user has registered with this component type.
	        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
	          registeredClass.callbacks[j](element);
	        }

	        if (registeredClass.widget) {
	          // Assign per element instance for control over API
	          element[registeredClass.className] = instance;
	        }
	      } else {
	        throw new Error(
	          'Unable to find a registered component for the given class.');
	      }

	      var ev;
	      if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
	        ev = new CustomEvent('mdl-componentupgraded', {
	          bubbles: true, cancelable: false
	        });
	      } else {
	        ev = document.createEvent('Events');
	        ev.initEvent('mdl-componentupgraded', true, true);
	      }
	      element.dispatchEvent(ev);
	    }
	  }

	  /**
	   * Upgrades a specific list of elements rather than all in the DOM.
	   *
	   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
	   * The elements we wish to upgrade.
	   */
	  function upgradeElementsInternal(elements) {
	    if (!Array.isArray(elements)) {
	      if (elements instanceof Element) {
	        elements = [elements];
	      } else {
	        elements = Array.prototype.slice.call(elements);
	      }
	    }
	    for (var i = 0, n = elements.length, element; i < n; i++) {
	      element = elements[i];
	      if (element instanceof HTMLElement) {
	        upgradeElementInternal(element);
	        if (element.children.length > 0) {
	          upgradeElementsInternal(element.children);
	        }
	      }
	    }
	  }

	  /**
	   * Registers a class for future use and attempts to upgrade existing DOM.
	   *
	   * @param {componentHandler.ComponentConfigPublic} config
	   */
	  function registerInternal(config) {
	    // In order to support both Closure-compiled and uncompiled code accessing
	    // this method, we need to allow for both the dot and array syntax for
	    // property access. You'll therefore see the `foo.bar || foo['bar']`
	    // pattern repeated across this method.
	    var widgetMissing = (typeof config.widget === 'undefined' &&
	        typeof config['widget'] === 'undefined');
	    var widget = true;

	    if (!widgetMissing) {
	      widget = config.widget || config['widget'];
	    }

	    var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
	      classConstructor: config.constructor || config['constructor'],
	      className: config.classAsString || config['classAsString'],
	      cssClass: config.cssClass || config['cssClass'],
	      widget: widget,
	      callbacks: []
	    });

	    registeredComponents_.forEach(function(item) {
	      if (item.cssClass === newConfig.cssClass) {
	        throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
	      }
	      if (item.className === newConfig.className) {
	        throw new Error('The provided className has already been registered');
	      }
	    });

	    if (config.constructor.prototype
	        .hasOwnProperty(componentConfigProperty_)) {
	      throw new Error(
	          'MDL component classes must not have ' + componentConfigProperty_ +
	          ' defined as a property.');
	    }

	    var found = findRegisteredClass_(config.classAsString, newConfig);

	    if (!found) {
	      registeredComponents_.push(newConfig);
	    }
	  }

	  /**
	   * Allows user to be alerted to any upgrades that are performed for a given
	   * component type
	   *
	   * @param {string} jsClass The class name of the MDL component we wish
	   * to hook into for any upgrades performed.
	   * @param {function(!HTMLElement)} callback The function to call upon an
	   * upgrade. This function should expect 1 parameter - the HTMLElement which
	   * got upgraded.
	   */
	  function registerUpgradedCallbackInternal(jsClass, callback) {
	    var regClass = findRegisteredClass_(jsClass);
	    if (regClass) {
	      regClass.callbacks.push(callback);
	    }
	  }

	  /**
	   * Upgrades all registered components found in the current DOM. This is
	   * automatically called on window load.
	   */
	  function upgradeAllRegisteredInternal() {
	    for (var n = 0; n < registeredComponents_.length; n++) {
	      upgradeDomInternal(registeredComponents_[n].className);
	    }
	  }

	  /**
	   * Check the component for the downgrade method.
	   * Execute if found.
	   * Remove component from createdComponents list.
	   *
	   * @param {?componentHandler.Component} component
	   */
	  function deconstructComponentInternal(component) {
	    if (component) {
	      var componentIndex = createdComponents_.indexOf(component);
	      createdComponents_.splice(componentIndex, 1);

	      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
	      var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
	      upgrades.splice(componentPlace, 1);
	      component.element_.setAttribute('data-upgraded', upgrades.join(','));

	      var ev;
	      if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
	        ev = new CustomEvent('mdl-componentdowngraded', {
	          bubbles: true, cancelable: false
	        });
	      } else {
	        ev = document.createEvent('Events');
	        ev.initEvent('mdl-componentdowngraded', true, true);
	      }
	      component.element_.dispatchEvent(ev);
	    }
	  }

	  /**
	   * Downgrade either a given node, an array of nodes, or a NodeList.
	   *
	   * @param {!Node|!Array<!Node>|!NodeList} nodes
	   */
	  function downgradeNodesInternal(nodes) {
	    /**
	     * Auxiliary function to downgrade a single node.
	     * @param  {!Node} node the node to be downgraded
	     */
	    var downgradeNode = function(node) {
	      createdComponents_.filter(function(item) {
	        return item.element_ === node;
	      }).forEach(deconstructComponentInternal);
	    };
	    if (nodes instanceof Array || nodes instanceof NodeList) {
	      for (var n = 0; n < nodes.length; n++) {
	        downgradeNode(nodes[n]);
	      }
	    } else if (nodes instanceof Node) {
	      downgradeNode(nodes);
	    } else {
	      throw new Error('Invalid argument provided to downgrade MDL nodes.');
	    }
	  }

	  // Now return the functions that should be made public with their publicly
	  // facing names...
	  return {
	    upgradeDom: upgradeDomInternal,
	    upgradeElement: upgradeElementInternal,
	    upgradeElements: upgradeElementsInternal,
	    upgradeAllRegistered: upgradeAllRegisteredInternal,
	    registerUpgradedCallback: registerUpgradedCallbackInternal,
	    register: registerInternal,
	    downgradeElements: downgradeNodesInternal
	  };
	})();

	/**
	 * Describes the type of a registered component type managed by
	 * componentHandler. Provided for benefit of the Closure compiler.
	 *
	 * @typedef {{
	 *   constructor: Function,
	 *   classAsString: string,
	 *   cssClass: string,
	 *   widget: (string|boolean|undefined)
	 * }}
	 */
	componentHandler.ComponentConfigPublic;  // jshint ignore:line

	/**
	 * Describes the type of a registered component type managed by
	 * componentHandler. Provided for benefit of the Closure compiler.
	 *
	 * @typedef {{
	 *   constructor: !Function,
	 *   className: string,
	 *   cssClass: string,
	 *   widget: (string|boolean),
	 *   callbacks: !Array<function(!HTMLElement)>
	 * }}
	 */
	componentHandler.ComponentConfig;  // jshint ignore:line

	/**
	 * Created component (i.e., upgraded element) type as managed by
	 * componentHandler. Provided for benefit of the Closure compiler.
	 *
	 * @typedef {{
	 *   element_: !HTMLElement,
	 *   className: string,
	 *   classAsString: string,
	 *   cssClass: string,
	 *   widget: string
	 * }}
	 */
	componentHandler.Component;  // jshint ignore:line

	// Export all symbols, for the benefit of Closure compiler.
	// No effect on uncompiled code.
	componentHandler['upgradeDom'] = componentHandler.upgradeDom;
	componentHandler['upgradeElement'] = componentHandler.upgradeElement;
	componentHandler['upgradeElements'] = componentHandler.upgradeElements;
	componentHandler['upgradeAllRegistered'] =
	    componentHandler.upgradeAllRegistered;
	componentHandler['registerUpgradedCallback'] =
	    componentHandler.registerUpgradedCallback;
	componentHandler['register'] = componentHandler.register;
	componentHandler['downgradeElements'] = componentHandler.downgradeElements;
	window.componentHandler = componentHandler;
	window['componentHandler'] = componentHandler;

	window.addEventListener('load', function() {
	  'use strict';

	  /**
	   * Performs a "Cutting the mustard" test. If the browser supports the features
	   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
	   * components requiring JavaScript.
	   */
	  if ('classList' in document.createElement('div') &&
	      'querySelector' in document &&
	      'addEventListener' in window && Array.prototype.forEach) {
	    document.documentElement.classList.add('mdl-js');
	    componentHandler.upgradeAllRegistered();
	  } else {
	    /**
	     * Dummy function to avoid JS errors.
	     */
	    componentHandler.upgradeElement = function() {};
	    /**
	     * Dummy function to avoid JS errors.
	     */
	    componentHandler.register = function() {};
	  }
	});

	// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
	// Adapted from https://gist.github.com/paulirish/1579671 which derived from
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller.
	// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
	// MIT license
	if (!Date.now) {
	    /**
	   * Date.now polyfill.
	   * @return {number} the current Date
	   */
	    Date.now = function () {
	        return new Date().getTime();
	    };
	    Date['now'] = Date.now;
	}
	var vendors = [
	    'webkit',
	    'moz'
	];
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	    var vp = vendors[i];
	    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
	    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
	    window['requestAnimationFrame'] = window.requestAnimationFrame;
	    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
	}
	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
	    var lastTime = 0;
	    /**
	   * requestAnimationFrame polyfill.
	   * @param  {!Function} callback the callback function.
	   */
	    window.requestAnimationFrame = function (callback) {
	        var now = Date.now();
	        var nextTime = Math.max(lastTime + 16, now);
	        return setTimeout(function () {
	            callback(lastTime = nextTime);
	        }, nextTime - now);
	    };
	    window.cancelAnimationFrame = clearTimeout;
	    window['requestAnimationFrame'] = window.requestAnimationFrame;
	    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
	}
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Button MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialButton = function MaterialButton(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialButton'] = MaterialButton;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialButton.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialButton.prototype.CssClasses_ = {
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_CONTAINER: 'mdl-button__ripple-container',
	    RIPPLE: 'mdl-ripple'
	};
	/**
	   * Handle blur of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialButton.prototype.blurHandler_ = function (event) {
	    if (event) {
	        this.element_.blur();
	    }
	};
	// Public methods.
	/**
	   * Disable button.
	   *
	   * @public
	   */
	MaterialButton.prototype.disable = function () {
	    this.element_.disabled = true;
	};
	MaterialButton.prototype['disable'] = MaterialButton.prototype.disable;
	/**
	   * Enable button.
	   *
	   * @public
	   */
	MaterialButton.prototype.enable = function () {
	    this.element_.disabled = false;
	};
	MaterialButton.prototype['enable'] = MaterialButton.prototype.enable;
	/**
	   * Initialize element.
	   */
	MaterialButton.prototype.init = function () {
	    if (this.element_) {
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            var rippleContainer = document.createElement('span');
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleElement_ = document.createElement('span');
	            this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
	            rippleContainer.appendChild(this.rippleElement_);
	            this.boundRippleBlurHandler = this.blurHandler_.bind(this);
	            this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
	            this.element_.appendChild(rippleContainer);
	        }
	        this.boundButtonBlurHandler = this.blurHandler_.bind(this);
	        this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
	        this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialButton,
	    classAsString: 'MaterialButton',
	    cssClass: 'mdl-js-button',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Checkbox MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialCheckbox = function MaterialCheckbox(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialCheckbox'] = MaterialCheckbox;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialCheckbox.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialCheckbox.prototype.CssClasses_ = {
	    INPUT: 'mdl-checkbox__input',
	    BOX_OUTLINE: 'mdl-checkbox__box-outline',
	    FOCUS_HELPER: 'mdl-checkbox__focus-helper',
	    TICK_OUTLINE: 'mdl-checkbox__tick-outline',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onChange_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onMouseUp_ = function (event) {
	    this.blur_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialCheckbox.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialCheckbox.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.inputElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the inputs toggle state and update display.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.checkToggleState = function () {
	    if (this.inputElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialCheckbox.prototype['checkToggleState'] = MaterialCheckbox.prototype.checkToggleState;
	/**
	   * Check the inputs disabled state and update display.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.checkDisabled = function () {
	    if (this.inputElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialCheckbox.prototype['checkDisabled'] = MaterialCheckbox.prototype.checkDisabled;
	/**
	   * Disable checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.disable = function () {
	    this.inputElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['disable'] = MaterialCheckbox.prototype.disable;
	/**
	   * Enable checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.enable = function () {
	    this.inputElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['enable'] = MaterialCheckbox.prototype.enable;
	/**
	   * Check checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.check = function () {
	    this.inputElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['check'] = MaterialCheckbox.prototype.check;
	/**
	   * Uncheck checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.uncheck = function () {
	    this.inputElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['uncheck'] = MaterialCheckbox.prototype.uncheck;
	/**
	   * Initialize element.
	   */
	MaterialCheckbox.prototype.init = function () {
	    if (this.element_) {
	        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        var boxOutline = document.createElement('span');
	        boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);
	        var tickContainer = document.createElement('span');
	        tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);
	        var tickOutline = document.createElement('span');
	        tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);
	        boxOutline.appendChild(tickOutline);
	        this.element_.appendChild(tickContainer);
	        this.element_.appendChild(boxOutline);
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            this.rippleContainerElement_ = document.createElement('span');
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
	            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            this.rippleContainerElement_.appendChild(ripple);
	            this.element_.appendChild(this.rippleContainerElement_);
	        }
	        this.boundInputOnChange = this.onChange_.bind(this);
	        this.boundInputOnFocus = this.onFocus_.bind(this);
	        this.boundInputOnBlur = this.onBlur_.bind(this);
	        this.boundElementMouseUp = this.onMouseUp_.bind(this);
	        this.inputElement_.addEventListener('change', this.boundInputOnChange);
	        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
	        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
	        this.element_.addEventListener('mouseup', this.boundElementMouseUp);
	        this.updateClasses_();
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialCheckbox,
	    classAsString: 'MaterialCheckbox',
	    cssClass: 'mdl-js-checkbox',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for icon toggle MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialIconToggle = function MaterialIconToggle(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialIconToggle'] = MaterialIconToggle;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialIconToggle.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialIconToggle.prototype.CssClasses_ = {
	    INPUT: 'mdl-icon-toggle__input',
	    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onChange_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onMouseUp_ = function (event) {
	    this.blur_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialIconToggle.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialIconToggle.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.inputElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the inputs toggle state and update display.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.checkToggleState = function () {
	    if (this.inputElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialIconToggle.prototype['checkToggleState'] = MaterialIconToggle.prototype.checkToggleState;
	/**
	   * Check the inputs disabled state and update display.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.checkDisabled = function () {
	    if (this.inputElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialIconToggle.prototype['checkDisabled'] = MaterialIconToggle.prototype.checkDisabled;
	/**
	   * Disable icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.disable = function () {
	    this.inputElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['disable'] = MaterialIconToggle.prototype.disable;
	/**
	   * Enable icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.enable = function () {
	    this.inputElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['enable'] = MaterialIconToggle.prototype.enable;
	/**
	   * Check icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.check = function () {
	    this.inputElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['check'] = MaterialIconToggle.prototype.check;
	/**
	   * Uncheck icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.uncheck = function () {
	    this.inputElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['uncheck'] = MaterialIconToggle.prototype.uncheck;
	/**
	   * Initialize element.
	   */
	MaterialIconToggle.prototype.init = function () {
	    if (this.element_) {
	        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            this.rippleContainerElement_ = document.createElement('span');
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
	            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            this.rippleContainerElement_.appendChild(ripple);
	            this.element_.appendChild(this.rippleContainerElement_);
	        }
	        this.boundInputOnChange = this.onChange_.bind(this);
	        this.boundInputOnFocus = this.onFocus_.bind(this);
	        this.boundInputOnBlur = this.onBlur_.bind(this);
	        this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
	        this.inputElement_.addEventListener('change', this.boundInputOnChange);
	        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
	        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
	        this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);
	        this.updateClasses_();
	        this.element_.classList.add('is-upgraded');
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialIconToggle,
	    classAsString: 'MaterialIconToggle',
	    cssClass: 'mdl-js-icon-toggle',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for dropdown MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialMenu = function MaterialMenu(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialMenu'] = MaterialMenu;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialMenu.prototype.Constant_ = {
	    // Total duration of the menu animation.
	    TRANSITION_DURATION_SECONDS: 0.3,
	    // The fraction of the total duration we want to use for menu item animations.
	    TRANSITION_DURATION_FRACTION: 0.8,
	    // How long the menu stays open after choosing an option (so the user can see
	    // the ripple).
	    CLOSE_TIMEOUT: 150
	};
	/**
	   * Keycodes, for code readability.
	   *
	   * @enum {number}
	   * @private
	   */
	MaterialMenu.prototype.Keycodes_ = {
	    ENTER: 13,
	    ESCAPE: 27,
	    SPACE: 32,
	    UP_ARROW: 38,
	    DOWN_ARROW: 40
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialMenu.prototype.CssClasses_ = {
	    CONTAINER: 'mdl-menu__container',
	    OUTLINE: 'mdl-menu__outline',
	    ITEM: 'mdl-menu__item',
	    ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE: 'mdl-ripple',
	    // Statuses
	    IS_UPGRADED: 'is-upgraded',
	    IS_VISIBLE: 'is-visible',
	    IS_ANIMATING: 'is-animating',
	    // Alignment options
	    BOTTOM_LEFT: 'mdl-menu--bottom-left',
	    // This is the default.
	    BOTTOM_RIGHT: 'mdl-menu--bottom-right',
	    TOP_LEFT: 'mdl-menu--top-left',
	    TOP_RIGHT: 'mdl-menu--top-right',
	    UNALIGNED: 'mdl-menu--unaligned'
	};
	/**
	   * Initialize element.
	   */
	MaterialMenu.prototype.init = function () {
	    if (this.element_) {
	        // Create container for the menu.
	        var container = document.createElement('div');
	        container.classList.add(this.CssClasses_.CONTAINER);
	        this.element_.parentElement.insertBefore(container, this.element_);
	        this.element_.parentElement.removeChild(this.element_);
	        container.appendChild(this.element_);
	        this.container_ = container;
	        // Create outline for the menu (shadow and background).
	        var outline = document.createElement('div');
	        outline.classList.add(this.CssClasses_.OUTLINE);
	        this.outline_ = outline;
	        container.insertBefore(outline, this.element_);
	        // Find the "for" element and bind events to it.
	        var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');
	        var forEl = null;
	        if (forElId) {
	            forEl = document.getElementById(forElId);
	            if (forEl) {
	                this.forElement_ = forEl;
	                forEl.addEventListener('click', this.handleForClick_.bind(this));
	                forEl.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this));
	            }
	        }
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	        this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
	        this.boundItemClick_ = this.handleItemClick_.bind(this);
	        for (var i = 0; i < items.length; i++) {
	            // Add a listener to each menu item.
	            items[i].addEventListener('click', this.boundItemClick_);
	            // Add a tab index to each menu item.
	            items[i].tabIndex = '-1';
	            // Add a keyboard listener to each menu item.
	            items[i].addEventListener('keydown', this.boundItemKeydown_);
	        }
	        // Add ripple classes to each item, if the user has enabled ripples.
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            for (i = 0; i < items.length; i++) {
	                var item = items[i];
	                var rippleContainer = document.createElement('span');
	                rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
	                var ripple = document.createElement('span');
	                ripple.classList.add(this.CssClasses_.RIPPLE);
	                rippleContainer.appendChild(ripple);
	                item.appendChild(rippleContainer);
	                item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            }
	        }
	        // Copy alignment classes to the container, so the outline can use them.
	        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
	            this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	            this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	            this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	            this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	            this.outline_.classList.add(this.CssClasses_.UNALIGNED);
	        }
	        container.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Handles a click on the "for" element, by positioning the menu and then
	   * toggling it.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleForClick_ = function (evt) {
	    if (this.element_ && this.forElement_) {
	        var rect = this.forElement_.getBoundingClientRect();
	        var forRect = this.forElement_.parentElement.getBoundingClientRect();
	        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	        } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	            // Position below the "for" element, aligned to its right.
	            this.container_.style.right = forRect.right - rect.right + 'px';
	            this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
	        } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	            // Position above the "for" element, aligned to its left.
	            this.container_.style.left = this.forElement_.offsetLeft + 'px';
	            this.container_.style.bottom = forRect.bottom - rect.top + 'px';
	        } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	            // Position above the "for" element, aligned to its right.
	            this.container_.style.right = forRect.right - rect.right + 'px';
	            this.container_.style.bottom = forRect.bottom - rect.top + 'px';
	        } else {
	            // Default: position below the "for" element, aligned to its left.
	            this.container_.style.left = this.forElement_.offsetLeft + 'px';
	            this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
	        }
	    }
	    this.toggle(evt);
	};
	/**
	   * Handles a keyboard event on the "for" element.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleForKeyboardEvent_ = function (evt) {
	    if (this.element_ && this.container_ && this.forElement_) {
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
	        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	            if (evt.keyCode === this.Keycodes_.UP_ARROW) {
	                evt.preventDefault();
	                items[items.length - 1].focus();
	            } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
	                evt.preventDefault();
	                items[0].focus();
	            }
	        }
	    }
	};
	/**
	   * Handles a keyboard event on an item.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleItemKeyboardEvent_ = function (evt) {
	    if (this.element_ && this.container_) {
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
	        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	            var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);
	            if (evt.keyCode === this.Keycodes_.UP_ARROW) {
	                evt.preventDefault();
	                if (currentIndex > 0) {
	                    items[currentIndex - 1].focus();
	                } else {
	                    items[items.length - 1].focus();
	                }
	            } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
	                evt.preventDefault();
	                if (items.length > currentIndex + 1) {
	                    items[currentIndex + 1].focus();
	                } else {
	                    items[0].focus();
	                }
	            } else if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
	                evt.preventDefault();
	                // Send mousedown and mouseup to trigger ripple.
	                var e = new MouseEvent('mousedown');
	                evt.target.dispatchEvent(e);
	                e = new MouseEvent('mouseup');
	                evt.target.dispatchEvent(e);
	                // Send click.
	                evt.target.click();
	            } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
	                evt.preventDefault();
	                this.hide();
	            }
	        }
	    }
	};
	/**
	   * Handles a click event on an item.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleItemClick_ = function (evt) {
	    if (evt.target.hasAttribute('disabled')) {
	        evt.stopPropagation();
	    } else {
	        // Wait some time before closing menu, so the user can see the ripple.
	        this.closing_ = true;
	        window.setTimeout(function (evt) {
	            this.hide();
	            this.closing_ = false;
	        }.bind(this), this.Constant_.CLOSE_TIMEOUT);
	    }
	};
	/**
	   * Calculates the initial clip (for opening the menu) or final clip (for closing
	   * it), and applies it. This allows us to animate from or to the correct point,
	   * that is, the point it's aligned to in the "for" element.
	   *
	   * @param {number} height Height of the clip rectangle
	   * @param {number} width Width of the clip rectangle
	   * @private
	   */
	MaterialMenu.prototype.applyClip_ = function (height, width) {
	    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	        // Do not clip.
	        this.element_.style.clip = '';
	    } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	        // Clip to the top right corner of the menu.
	        this.element_.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
	    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	        // Clip to the bottom left corner of the menu.
	        this.element_.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
	    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	        // Clip to the bottom right corner of the menu.
	        this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
	    } else {
	        // Default: do not clip (same as clipping to the top left corner).
	        this.element_.style.clip = '';
	    }
	};
	/**
	   * Cleanup function to remove animation listeners.
	   *
	   * @param {Event} evt
	   * @private
	   */
	MaterialMenu.prototype.removeAnimationEndListener_ = function (evt) {
	    evt.target.classList.remove(MaterialMenu.prototype.CssClasses_.IS_ANIMATING);
	};
	/**
	   * Adds an event listener to clean up after the animation ends.
	   *
	   * @private
	   */
	MaterialMenu.prototype.addAnimationEndListener_ = function () {
	    this.element_.addEventListener('transitionend', this.removeAnimationEndListener_);
	    this.element_.addEventListener('webkitTransitionEnd', this.removeAnimationEndListener_);
	};
	/**
	   * Displays the menu.
	   *
	   * @public
	   */
	MaterialMenu.prototype.show = function (evt) {
	    if (this.element_ && this.container_ && this.outline_) {
	        // Measure the inner element.
	        var height = this.element_.getBoundingClientRect().height;
	        var width = this.element_.getBoundingClientRect().width;
	        // Apply the inner element's size to the container and outline.
	        this.container_.style.width = width + 'px';
	        this.container_.style.height = height + 'px';
	        this.outline_.style.width = width + 'px';
	        this.outline_.style.height = height + 'px';
	        var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;
	        // Calculate transition delays for individual menu items, so that they fade
	        // in one at a time.
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	        for (var i = 0; i < items.length; i++) {
	            var itemDelay = null;
	            if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) || this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	                itemDelay = (height - items[i].offsetTop - items[i].offsetHeight) / height * transitionDuration + 's';
	            } else {
	                itemDelay = items[i].offsetTop / height * transitionDuration + 's';
	            }
	            items[i].style.transitionDelay = itemDelay;
	        }
	        // Apply the initial clip to the text before we start animating.
	        this.applyClip_(height, width);
	        // Wait for the next frame, turn on animation, and apply the final clip.
	        // Also make it visible. This triggers the transitions.
	        window.requestAnimationFrame(function () {
	            this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
	            this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
	            this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
	        }.bind(this));
	        // Clean up after the animation is complete.
	        this.addAnimationEndListener_();
	        // Add a click listener to the document, to close the menu.
	        var callback = function (e) {
	            // Check to see if the document is processing the same event that
	            // displayed the menu in the first place. If so, do nothing.
	            // Also check to see if the menu is in the process of closing itself, and
	            // do nothing in that case.
	            // Also check if the clicked element is a menu item
	            // if so, do nothing.
	            if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
	                document.removeEventListener('click', callback);
	                this.hide();
	            }
	        }.bind(this);
	        document.addEventListener('click', callback);
	    }
	};
	MaterialMenu.prototype['show'] = MaterialMenu.prototype.show;
	/**
	   * Hides the menu.
	   *
	   * @public
	   */
	MaterialMenu.prototype.hide = function () {
	    if (this.element_ && this.container_ && this.outline_) {
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	        // Remove all transition delays; menu items fade out concurrently.
	        for (var i = 0; i < items.length; i++) {
	            items[i].style.removeProperty('transition-delay');
	        }
	        // Measure the inner element.
	        var rect = this.element_.getBoundingClientRect();
	        var height = rect.height;
	        var width = rect.width;
	        // Turn on animation, and apply the final clip. Also make invisible.
	        // This triggers the transitions.
	        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
	        this.applyClip_(height, width);
	        this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);
	        // Clean up after the animation is complete.
	        this.addAnimationEndListener_();
	    }
	};
	MaterialMenu.prototype['hide'] = MaterialMenu.prototype.hide;
	/**
	   * Displays or hides the menu, depending on current state.
	   *
	   * @public
	   */
	MaterialMenu.prototype.toggle = function (evt) {
	    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	        this.hide();
	    } else {
	        this.show(evt);
	    }
	};
	MaterialMenu.prototype['toggle'] = MaterialMenu.prototype.toggle;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialMenu,
	    classAsString: 'MaterialMenu',
	    cssClass: 'mdl-js-menu',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Progress MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialProgress = function MaterialProgress(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialProgress'] = MaterialProgress;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialProgress.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialProgress.prototype.CssClasses_ = { INDETERMINATE_CLASS: 'mdl-progress__indeterminate' };
	/**
	   * Set the current progress of the progressbar.
	   *
	   * @param {number} p Percentage of the progress (0-100)
	   * @public
	   */
	MaterialProgress.prototype.setProgress = function (p) {
	    if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
	        return;
	    }
	    this.progressbar_.style.width = p + '%';
	};
	MaterialProgress.prototype['setProgress'] = MaterialProgress.prototype.setProgress;
	/**
	   * Set the current progress of the buffer.
	   *
	   * @param {number} p Percentage of the buffer (0-100)
	   * @public
	   */
	MaterialProgress.prototype.setBuffer = function (p) {
	    this.bufferbar_.style.width = p + '%';
	    this.auxbar_.style.width = 100 - p + '%';
	};
	MaterialProgress.prototype['setBuffer'] = MaterialProgress.prototype.setBuffer;
	/**
	   * Initialize element.
	   */
	MaterialProgress.prototype.init = function () {
	    if (this.element_) {
	        var el = document.createElement('div');
	        el.className = 'progressbar bar bar1';
	        this.element_.appendChild(el);
	        this.progressbar_ = el;
	        el = document.createElement('div');
	        el.className = 'bufferbar bar bar2';
	        this.element_.appendChild(el);
	        this.bufferbar_ = el;
	        el = document.createElement('div');
	        el.className = 'auxbar bar bar3';
	        this.element_.appendChild(el);
	        this.auxbar_ = el;
	        this.progressbar_.style.width = '0%';
	        this.bufferbar_.style.width = '100%';
	        this.auxbar_.style.width = '0%';
	        this.element_.classList.add('is-upgraded');
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialProgress,
	    classAsString: 'MaterialProgress',
	    cssClass: 'mdl-js-progress',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Radio MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialRadio = function MaterialRadio(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialRadio'] = MaterialRadio;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialRadio.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialRadio.prototype.CssClasses_ = {
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked',
	    IS_UPGRADED: 'is-upgraded',
	    JS_RADIO: 'mdl-js-radio',
	    RADIO_BTN: 'mdl-radio__button',
	    RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
	    RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onChange_ = function (event) {
	    // Since other radio buttons don't get change events, we need to look for
	    // them to update their classes.
	    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
	    for (var i = 0; i < radios.length; i++) {
	        var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
	        // Different name == different group, so no point updating those.
	        if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
	            radios[i]['MaterialRadio'].updateClasses_();
	        }
	    }
	};
	/**
	   * Handle focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onMouseup_ = function (event) {
	    this.blur_();
	};
	/**
	   * Update classes.
	   *
	   * @private
	   */
	MaterialRadio.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialRadio.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.btnElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the components disabled state.
	   *
	   * @public
	   */
	MaterialRadio.prototype.checkDisabled = function () {
	    if (this.btnElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialRadio.prototype['checkDisabled'] = MaterialRadio.prototype.checkDisabled;
	/**
	   * Check the components toggled state.
	   *
	   * @public
	   */
	MaterialRadio.prototype.checkToggleState = function () {
	    if (this.btnElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialRadio.prototype['checkToggleState'] = MaterialRadio.prototype.checkToggleState;
	/**
	   * Disable radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.disable = function () {
	    this.btnElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialRadio.prototype['disable'] = MaterialRadio.prototype.disable;
	/**
	   * Enable radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.enable = function () {
	    this.btnElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialRadio.prototype['enable'] = MaterialRadio.prototype.enable;
	/**
	   * Check radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.check = function () {
	    this.btnElement_.checked = true;
	    this.onChange_(null);
	};
	MaterialRadio.prototype['check'] = MaterialRadio.prototype.check;
	/**
	   * Uncheck radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.uncheck = function () {
	    this.btnElement_.checked = false;
	    this.onChange_(null);
	};
	MaterialRadio.prototype['uncheck'] = MaterialRadio.prototype.uncheck;
	/**
	   * Initialize element.
	   */
	MaterialRadio.prototype.init = function () {
	    if (this.element_) {
	        this.btnElement_ = this.element_.querySelector('.' + this.CssClasses_.RADIO_BTN);
	        this.boundChangeHandler_ = this.onChange_.bind(this);
	        this.boundFocusHandler_ = this.onChange_.bind(this);
	        this.boundBlurHandler_ = this.onBlur_.bind(this);
	        this.boundMouseUpHandler_ = this.onMouseup_.bind(this);
	        var outerCircle = document.createElement('span');
	        outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);
	        var innerCircle = document.createElement('span');
	        innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);
	        this.element_.appendChild(outerCircle);
	        this.element_.appendChild(innerCircle);
	        var rippleContainer;
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            rippleContainer = document.createElement('span');
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            rippleContainer.addEventListener('mouseup', this.boundMouseUpHandler_);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            rippleContainer.appendChild(ripple);
	            this.element_.appendChild(rippleContainer);
	        }
	        this.btnElement_.addEventListener('change', this.boundChangeHandler_);
	        this.btnElement_.addEventListener('focus', this.boundFocusHandler_);
	        this.btnElement_.addEventListener('blur', this.boundBlurHandler_);
	        this.element_.addEventListener('mouseup', this.boundMouseUpHandler_);
	        this.updateClasses_();
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialRadio,
	    classAsString: 'MaterialRadio',
	    cssClass: 'mdl-js-radio',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Slider MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialSlider = function MaterialSlider(element) {
	    this.element_ = element;
	    // Browser feature detection.
	    this.isIE_ = window.navigator.msPointerEnabled;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialSlider'] = MaterialSlider;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSlider.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSlider.prototype.CssClasses_ = {
	    IE_CONTAINER: 'mdl-slider__ie-container',
	    SLIDER_CONTAINER: 'mdl-slider__container',
	    BACKGROUND_FLEX: 'mdl-slider__background-flex',
	    BACKGROUND_LOWER: 'mdl-slider__background-lower',
	    BACKGROUND_UPPER: 'mdl-slider__background-upper',
	    IS_LOWEST_VALUE: 'is-lowest-value',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Handle input on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSlider.prototype.onInput_ = function (event) {
	    this.updateValueStyles_();
	};
	/**
	   * Handle change on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSlider.prototype.onChange_ = function (event) {
	    this.updateValueStyles_();
	};
	/**
	   * Handle mouseup on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSlider.prototype.onMouseUp_ = function (event) {
	    event.target.blur();
	};
	/**
	   * Handle mousedown on container element.
	   * This handler is purpose is to not require the use to click
	   * exactly on the 2px slider element, as FireFox seems to be very
	   * strict about this.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   * @suppress {missingProperties}
	   */
	MaterialSlider.prototype.onContainerMouseDown_ = function (event) {
	    // If this click is not on the parent element (but rather some child)
	    // ignore. It may still bubble up.
	    if (event.target !== this.element_.parentElement) {
	        return;
	    }
	    // Discard the original event and create a new event that
	    // is on the slider element.
	    event.preventDefault();
	    var newEvent = new MouseEvent('mousedown', {
	        target: event.target,
	        buttons: event.buttons,
	        clientX: event.clientX,
	        clientY: this.element_.getBoundingClientRect().y
	    });
	    this.element_.dispatchEvent(newEvent);
	};
	/**
	   * Handle updating of values.
	   *
	   * @private
	   */
	MaterialSlider.prototype.updateValueStyles_ = function () {
	    // Calculate and apply percentages to div structure behind slider.
	    var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
	    if (fraction === 0) {
	        this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
	    }
	    if (!this.isIE_) {
	        this.backgroundLower_.style.flex = fraction;
	        this.backgroundLower_.style.webkitFlex = fraction;
	        this.backgroundUpper_.style.flex = 1 - fraction;
	        this.backgroundUpper_.style.webkitFlex = 1 - fraction;
	    }
	};
	// Public methods.
	/**
	   * Disable slider.
	   *
	   * @public
	   */
	MaterialSlider.prototype.disable = function () {
	    this.element_.disabled = true;
	};
	MaterialSlider.prototype['disable'] = MaterialSlider.prototype.disable;
	/**
	   * Enable slider.
	   *
	   * @public
	   */
	MaterialSlider.prototype.enable = function () {
	    this.element_.disabled = false;
	};
	MaterialSlider.prototype['enable'] = MaterialSlider.prototype.enable;
	/**
	   * Update slider value.
	   *
	   * @param {number} value The value to which to set the control (optional).
	   * @public
	   */
	MaterialSlider.prototype.change = function (value) {
	    if (typeof value !== 'undefined') {
	        this.element_.value = value;
	    }
	    this.updateValueStyles_();
	};
	MaterialSlider.prototype['change'] = MaterialSlider.prototype.change;
	/**
	   * Initialize element.
	   */
	MaterialSlider.prototype.init = function () {
	    if (this.element_) {
	        if (this.isIE_) {
	            // Since we need to specify a very large height in IE due to
	            // implementation limitations, we add a parent here that trims it down to
	            // a reasonable size.
	            var containerIE = document.createElement('div');
	            containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
	            this.element_.parentElement.insertBefore(containerIE, this.element_);
	            this.element_.parentElement.removeChild(this.element_);
	            containerIE.appendChild(this.element_);
	        } else {
	            // For non-IE browsers, we need a div structure that sits behind the
	            // slider and allows us to style the left and right sides of it with
	            // different colors.
	            var container = document.createElement('div');
	            container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
	            this.element_.parentElement.insertBefore(container, this.element_);
	            this.element_.parentElement.removeChild(this.element_);
	            container.appendChild(this.element_);
	            var backgroundFlex = document.createElement('div');
	            backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
	            container.appendChild(backgroundFlex);
	            this.backgroundLower_ = document.createElement('div');
	            this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
	            backgroundFlex.appendChild(this.backgroundLower_);
	            this.backgroundUpper_ = document.createElement('div');
	            this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
	            backgroundFlex.appendChild(this.backgroundUpper_);
	        }
	        this.boundInputHandler = this.onInput_.bind(this);
	        this.boundChangeHandler = this.onChange_.bind(this);
	        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
	        this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
	        this.element_.addEventListener('input', this.boundInputHandler);
	        this.element_.addEventListener('change', this.boundChangeHandler);
	        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
	        this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);
	        this.updateValueStyles_();
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSlider,
	    classAsString: 'MaterialSlider',
	    cssClass: 'mdl-js-slider',
	    widget: true
	});
	/**
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Snackbar MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialSnackbar = function MaterialSnackbar(element) {
	    this.element_ = element;
	    this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE);
	    this.actionElement_ = this.element_.querySelector('.' + this.cssClasses_.ACTION);
	    if (!this.textElement_) {
	        throw new Error('There must be a message element for a snackbar.');
	    }
	    if (!this.actionElement_) {
	        throw new Error('There must be an action element for a snackbar.');
	    }
	    this.active = false;
	    this.actionHandler_ = undefined;
	    this.message_ = undefined;
	    this.actionText_ = undefined;
	    this.queuedNotifications_ = [];
	    this.setActionHidden_(true);
	};
	window['MaterialSnackbar'] = MaterialSnackbar;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSnackbar.prototype.Constant_ = {
	    // The duration of the snackbar show/hide animation, in ms.
	    ANIMATION_LENGTH: 250
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSnackbar.prototype.cssClasses_ = {
	    SNACKBAR: 'mdl-snackbar',
	    MESSAGE: 'mdl-snackbar__text',
	    ACTION: 'mdl-snackbar__action',
	    ACTIVE: 'mdl-snackbar--active'
	};
	/**
	   * Display the snackbar.
	   *
	   * @private
	   */
	MaterialSnackbar.prototype.displaySnackbar_ = function () {
	    this.element_.setAttribute('aria-hidden', 'true');
	    if (this.actionHandler_) {
	        this.actionElement_.textContent = this.actionText_;
	        this.actionElement_.addEventListener('click', this.actionHandler_);
	        this.setActionHidden_(false);
	    }
	    this.textElement_.textContent = this.message_;
	    this.element_.classList.add(this.cssClasses_.ACTIVE);
	    this.element_.setAttribute('aria-hidden', 'false');
	    setTimeout(this.cleanup_.bind(this), this.timeout_);
	};
	/**
	   * Show the snackbar.
	   *
	   * @param {Object} data The data for the notification.
	   * @public
	   */
	MaterialSnackbar.prototype.showSnackbar = function (data) {
	    if (data === undefined) {
	        throw new Error('Please provide a data object with at least a message to display.');
	    }
	    if (data['message'] === undefined) {
	        throw new Error('Please provide a message to be displayed.');
	    }
	    if (data['actionHandler'] && !data['actionText']) {
	        throw new Error('Please provide action text with the handler.');
	    }
	    if (this.active) {
	        this.queuedNotifications_.push(data);
	    } else {
	        this.active = true;
	        this.message_ = data['message'];
	        if (data['timeout']) {
	            this.timeout_ = data['timeout'];
	        } else {
	            this.timeout_ = 2750;
	        }
	        if (data['actionHandler']) {
	            this.actionHandler_ = data['actionHandler'];
	        }
	        if (data['actionText']) {
	            this.actionText_ = data['actionText'];
	        }
	        this.displaySnackbar_();
	    }
	};
	MaterialSnackbar.prototype['showSnackbar'] = MaterialSnackbar.prototype.showSnackbar;
	/**
	   * Check if the queue has items within it.
	   * If it does, display the next entry.
	   *
	   * @private
	   */
	MaterialSnackbar.prototype.checkQueue_ = function () {
	    if (this.queuedNotifications_.length > 0) {
	        this.showSnackbar(this.queuedNotifications_.shift());
	    }
	};
	/**
	   * Cleanup the snackbar event listeners and accessiblity attributes.
	   *
	   * @private
	   */
	MaterialSnackbar.prototype.cleanup_ = function () {
	    this.element_.classList.remove(this.cssClasses_.ACTIVE);
	    setTimeout(function () {
	        this.element_.setAttribute('aria-hidden', 'true');
	        this.textElement_.textContent = '';
	        if (!Boolean(this.actionElement_.getAttribute('aria-hidden'))) {
	            this.setActionHidden_(true);
	            this.actionElement_.textContent = '';
	            this.actionElement_.removeEventListener('click', this.actionHandler_);
	        }
	        this.actionHandler_ = undefined;
	        this.message_ = undefined;
	        this.actionText_ = undefined;
	        this.active = false;
	        this.checkQueue_();
	    }.bind(this), this.Constant_.ANIMATION_LENGTH);
	};
	/**
	   * Set the action handler hidden state.
	   *
	   * @param {boolean} value
	   * @private
	   */
	MaterialSnackbar.prototype.setActionHidden_ = function (value) {
	    if (value) {
	        this.actionElement_.setAttribute('aria-hidden', 'true');
	    } else {
	        this.actionElement_.removeAttribute('aria-hidden');
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSnackbar,
	    classAsString: 'MaterialSnackbar',
	    cssClass: 'mdl-js-snackbar',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Spinner MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @param {HTMLElement} element The element that will be upgraded.
	   * @constructor
	   */
	var MaterialSpinner = function MaterialSpinner(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialSpinner'] = MaterialSpinner;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSpinner.prototype.Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSpinner.prototype.CssClasses_ = {
	    MDL_SPINNER_LAYER: 'mdl-spinner__layer',
	    MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
	    MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
	    MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
	    MDL_SPINNER_LEFT: 'mdl-spinner__left',
	    MDL_SPINNER_RIGHT: 'mdl-spinner__right'
	};
	/**
	   * Auxiliary method to create a spinner layer.
	   *
	   * @param {number} index Index of the layer to be created.
	   * @public
	   */
	MaterialSpinner.prototype.createLayer = function (index) {
	    var layer = document.createElement('div');
	    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
	    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);
	    var leftClipper = document.createElement('div');
	    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
	    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);
	    var gapPatch = document.createElement('div');
	    gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);
	    var rightClipper = document.createElement('div');
	    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
	    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);
	    var circleOwners = [
	        leftClipper,
	        gapPatch,
	        rightClipper
	    ];
	    for (var i = 0; i < circleOwners.length; i++) {
	        var circle = document.createElement('div');
	        circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
	        circleOwners[i].appendChild(circle);
	    }
	    layer.appendChild(leftClipper);
	    layer.appendChild(gapPatch);
	    layer.appendChild(rightClipper);
	    this.element_.appendChild(layer);
	};
	MaterialSpinner.prototype['createLayer'] = MaterialSpinner.prototype.createLayer;
	/**
	   * Stops the spinner animation.
	   * Public method for users who need to stop the spinner for any reason.
	   *
	   * @public
	   */
	MaterialSpinner.prototype.stop = function () {
	    this.element_.classList.remove('is-active');
	};
	MaterialSpinner.prototype['stop'] = MaterialSpinner.prototype.stop;
	/**
	   * Starts the spinner animation.
	   * Public method for users who need to manually start the spinner for any reason
	   * (instead of just adding the 'is-active' class to their markup).
	   *
	   * @public
	   */
	MaterialSpinner.prototype.start = function () {
	    this.element_.classList.add('is-active');
	};
	MaterialSpinner.prototype['start'] = MaterialSpinner.prototype.start;
	/**
	   * Initialize element.
	   */
	MaterialSpinner.prototype.init = function () {
	    if (this.element_) {
	        for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
	            this.createLayer(i);
	        }
	        this.element_.classList.add('is-upgraded');
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSpinner,
	    classAsString: 'MaterialSpinner',
	    cssClass: 'mdl-js-spinner',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Checkbox MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialSwitch = function MaterialSwitch(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialSwitch'] = MaterialSwitch;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSwitch.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSwitch.prototype.CssClasses_ = {
	    INPUT: 'mdl-switch__input',
	    TRACK: 'mdl-switch__track',
	    THUMB: 'mdl-switch__thumb',
	    FOCUS_HELPER: 'mdl-switch__focus-helper',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onChange_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onMouseUp_ = function (event) {
	    this.blur_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialSwitch.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialSwitch.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.inputElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the components disabled state.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.checkDisabled = function () {
	    if (this.inputElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialSwitch.prototype['checkDisabled'] = MaterialSwitch.prototype.checkDisabled;
	/**
	   * Check the components toggled state.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.checkToggleState = function () {
	    if (this.inputElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialSwitch.prototype['checkToggleState'] = MaterialSwitch.prototype.checkToggleState;
	/**
	   * Disable switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.disable = function () {
	    this.inputElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['disable'] = MaterialSwitch.prototype.disable;
	/**
	   * Enable switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.enable = function () {
	    this.inputElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['enable'] = MaterialSwitch.prototype.enable;
	/**
	   * Activate switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.on = function () {
	    this.inputElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['on'] = MaterialSwitch.prototype.on;
	/**
	   * Deactivate switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.off = function () {
	    this.inputElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['off'] = MaterialSwitch.prototype.off;
	/**
	   * Initialize element.
	   */
	MaterialSwitch.prototype.init = function () {
	    if (this.element_) {
	        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        var track = document.createElement('div');
	        track.classList.add(this.CssClasses_.TRACK);
	        var thumb = document.createElement('div');
	        thumb.classList.add(this.CssClasses_.THUMB);
	        var focusHelper = document.createElement('span');
	        focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);
	        thumb.appendChild(focusHelper);
	        this.element_.appendChild(track);
	        this.element_.appendChild(thumb);
	        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            this.rippleContainerElement_ = document.createElement('span');
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            this.rippleContainerElement_.appendChild(ripple);
	            this.element_.appendChild(this.rippleContainerElement_);
	        }
	        this.boundChangeHandler = this.onChange_.bind(this);
	        this.boundFocusHandler = this.onFocus_.bind(this);
	        this.boundBlurHandler = this.onBlur_.bind(this);
	        this.inputElement_.addEventListener('change', this.boundChangeHandler);
	        this.inputElement_.addEventListener('focus', this.boundFocusHandler);
	        this.inputElement_.addEventListener('blur', this.boundBlurHandler);
	        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
	        this.updateClasses_();
	        this.element_.classList.add('is-upgraded');
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSwitch,
	    classAsString: 'MaterialSwitch',
	    cssClass: 'mdl-js-switch',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Tabs MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	var MaterialTabs = function MaterialTabs(element) {
	    // Stores the HTML element.
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialTabs'] = MaterialTabs;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTabs.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTabs.prototype.CssClasses_ = {
	    TAB_CLASS: 'mdl-tabs__tab',
	    PANEL_CLASS: 'mdl-tabs__panel',
	    ACTIVE_CLASS: 'is-active',
	    UPGRADED_CLASS: 'is-upgraded',
	    MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
	    MDL_RIPPLE: 'mdl-ripple',
	    MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
	};
	/**
	   * Handle clicks to a tabs component
	   *
	   * @private
	   */
	MaterialTabs.prototype.initTabs_ = function () {
	    if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
	        this.element_.classList.add(this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
	    }
	    // Select element tabs, document panels
	    this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
	    this.panels_ = this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);
	    // Create new tabs for each tab element
	    for (var i = 0; i < this.tabs_.length; i++) {
	        new MaterialTab(this.tabs_[i], this);
	    }
	    this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
	};
	/**
	   * Reset tab state, dropping active classes
	   *
	   * @private
	   */
	MaterialTabs.prototype.resetTabState_ = function () {
	    for (var k = 0; k < this.tabs_.length; k++) {
	        this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
	    }
	};
	/**
	   * Reset panel state, droping active classes
	   *
	   * @private
	   */
	MaterialTabs.prototype.resetPanelState_ = function () {
	    for (var j = 0; j < this.panels_.length; j++) {
	        this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
	    }
	};
	/**
	   * Initialize element.
	   */
	MaterialTabs.prototype.init = function () {
	    if (this.element_) {
	        this.initTabs_();
	    }
	};
	/**
	   * Constructor for an individual tab.
	   *
	   * @constructor
	   * @param {Element} tab The HTML element for the tab.
	   * @param {MaterialTabs} ctx The MaterialTabs object that owns the tab.
	   */
	function MaterialTab(tab, ctx) {
	    if (tab) {
	        if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
	            var rippleContainer = document.createElement('span');
	            rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
	            rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
	            var ripple = document.createElement('span');
	            ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
	            rippleContainer.appendChild(ripple);
	            tab.appendChild(rippleContainer);
	        }
	    }
	}
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialTabs,
	    classAsString: 'MaterialTabs',
	    cssClass: 'mdl-js-tabs'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Textfield MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialTextfield = function MaterialTextfield(element) {
	    this.element_ = element;
	    this.maxRows = this.Constant_.NO_MAX_ROWS;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialTextfield'] = MaterialTextfield;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialTextfield.prototype.Constant_ = {
	    NO_MAX_ROWS: -1,
	    MAX_ROWS_ATTRIBUTE: 'maxrows'
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTextfield.prototype.CssClasses_ = {
	    LABEL: 'mdl-textfield__label',
	    INPUT: 'mdl-textfield__input',
	    IS_DIRTY: 'is-dirty',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_INVALID: 'is-invalid',
	    IS_UPGRADED: 'is-upgraded',
	    HAS_PLACEHOLDER: 'has-placeholder'
	};
	/**
	   * Handle input being entered.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onKeyDown_ = function (event) {
	    var currentRowCount = event.target.value.split('\n').length;
	    if (event.keyCode === 13) {
	        if (currentRowCount >= this.maxRows) {
	            event.preventDefault();
	        }
	    }
	};
	/**
	   * Handle focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle reset event from out side.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onReset_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialTextfield.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkValidity();
	    this.checkDirty();
	    this.checkFocus();
	};
	// Public methods.
	/**
	   * Check the disabled state and update field accordingly.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.checkDisabled = function () {
	    if (this.input_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialTextfield.prototype['checkDisabled'] = MaterialTextfield.prototype.checkDisabled;
	/**
	  * Check the focus state and update field accordingly.
	  *
	  * @public
	  */
	MaterialTextfield.prototype.checkFocus = function () {
	    if (Boolean(this.element_.querySelector(':focus'))) {
	        this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	    }
	};
	MaterialTextfield.prototype['checkFocus'] = MaterialTextfield.prototype.checkFocus;
	/**
	   * Check the validity state and update field accordingly.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.checkValidity = function () {
	    if (this.input_.validity) {
	        if (this.input_.validity.valid) {
	            this.element_.classList.remove(this.CssClasses_.IS_INVALID);
	        } else {
	            this.element_.classList.add(this.CssClasses_.IS_INVALID);
	        }
	    }
	};
	MaterialTextfield.prototype['checkValidity'] = MaterialTextfield.prototype.checkValidity;
	/**
	   * Check the dirty state and update field accordingly.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.checkDirty = function () {
	    if (this.input_.value && this.input_.value.length > 0) {
	        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
	    }
	};
	MaterialTextfield.prototype['checkDirty'] = MaterialTextfield.prototype.checkDirty;
	/**
	   * Disable text field.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.disable = function () {
	    this.input_.disabled = true;
	    this.updateClasses_();
	};
	MaterialTextfield.prototype['disable'] = MaterialTextfield.prototype.disable;
	/**
	   * Enable text field.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.enable = function () {
	    this.input_.disabled = false;
	    this.updateClasses_();
	};
	MaterialTextfield.prototype['enable'] = MaterialTextfield.prototype.enable;
	/**
	   * Update text field value.
	   *
	   * @param {string} value The value to which to set the control (optional).
	   * @public
	   */
	MaterialTextfield.prototype.change = function (value) {
	    this.input_.value = value || '';
	    this.updateClasses_();
	};
	MaterialTextfield.prototype['change'] = MaterialTextfield.prototype.change;
	/**
	   * Initialize element.
	   */
	MaterialTextfield.prototype.init = function () {
	    if (this.element_) {
	        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
	        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        if (this.input_) {
	            if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
	                this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
	                if (isNaN(this.maxRows)) {
	                    this.maxRows = this.Constant_.NO_MAX_ROWS;
	                }
	            }
	            if (this.input_.hasAttribute('placeholder')) {
	                this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER);
	            }
	            this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
	            this.boundFocusHandler = this.onFocus_.bind(this);
	            this.boundBlurHandler = this.onBlur_.bind(this);
	            this.boundResetHandler = this.onReset_.bind(this);
	            this.input_.addEventListener('input', this.boundUpdateClassesHandler);
	            this.input_.addEventListener('focus', this.boundFocusHandler);
	            this.input_.addEventListener('blur', this.boundBlurHandler);
	            this.input_.addEventListener('reset', this.boundResetHandler);
	            if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
	                // TODO: This should handle pasting multi line text.
	                // Currently doesn't.
	                this.boundKeyDownHandler = this.onKeyDown_.bind(this);
	                this.input_.addEventListener('keydown', this.boundKeyDownHandler);
	            }
	            var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID);
	            this.updateClasses_();
	            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	            if (invalid) {
	                this.element_.classList.add(this.CssClasses_.IS_INVALID);
	            }
	            if (this.input_.hasAttribute('autofocus')) {
	                this.element_.focus();
	                this.checkFocus();
	            }
	        }
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialTextfield,
	    classAsString: 'MaterialTextfield',
	    cssClass: 'mdl-js-textfield',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Tooltip MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialTooltip = function MaterialTooltip(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialTooltip'] = MaterialTooltip;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialTooltip.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTooltip.prototype.CssClasses_ = {
	    IS_ACTIVE: 'is-active',
	    BOTTOM: 'mdl-tooltip--bottom',
	    LEFT: 'mdl-tooltip--left',
	    RIGHT: 'mdl-tooltip--right',
	    TOP: 'mdl-tooltip--top'
	};
	/**
	   * Handle mouseenter for tooltip.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTooltip.prototype.handleMouseEnter_ = function (event) {
	    var props = event.target.getBoundingClientRect();
	    var left = props.left + props.width / 2;
	    var top = props.top + props.height / 2;
	    var marginLeft = -1 * (this.element_.offsetWidth / 2);
	    var marginTop = -1 * (this.element_.offsetHeight / 2);
	    if (this.element_.classList.contains(this.CssClasses_.LEFT) || this.element_.classList.contains(this.CssClasses_.RIGHT)) {
	        left = props.width / 2;
	        if (top + marginTop < 0) {
	            this.element_.style.top = '0';
	            this.element_.style.marginTop = '0';
	        } else {
	            this.element_.style.top = top + 'px';
	            this.element_.style.marginTop = marginTop + 'px';
	        }
	    } else {
	        if (left + marginLeft < 0) {
	            this.element_.style.left = '0';
	            this.element_.style.marginLeft = '0';
	        } else {
	            this.element_.style.left = left + 'px';
	            this.element_.style.marginLeft = marginLeft + 'px';
	        }
	    }
	    if (this.element_.classList.contains(this.CssClasses_.TOP)) {
	        this.element_.style.top = props.top - this.element_.offsetHeight - 10 + 'px';
	    } else if (this.element_.classList.contains(this.CssClasses_.RIGHT)) {
	        this.element_.style.left = props.left + props.width + 10 + 'px';
	    } else if (this.element_.classList.contains(this.CssClasses_.LEFT)) {
	        this.element_.style.left = props.left - this.element_.offsetWidth - 10 + 'px';
	    } else {
	        this.element_.style.top = props.top + props.height + 10 + 'px';
	    }
	    this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
	};
	/**
	   * Hide tooltip on mouseleave or scroll
	   *
	   * @private
	   */
	MaterialTooltip.prototype.hideTooltip_ = function () {
	    this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
	};
	/**
	   * Initialize element.
	   */
	MaterialTooltip.prototype.init = function () {
	    if (this.element_) {
	        var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');
	        if (forElId) {
	            this.forElement_ = document.getElementById(forElId);
	        }
	        if (this.forElement_) {
	            // It's left here because it prevents accidental text selection on Android
	            if (!this.forElement_.hasAttribute('tabindex')) {
	                this.forElement_.setAttribute('tabindex', '0');
	            }
	            this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
	            this.boundMouseLeaveAndScrollHandler = this.hideTooltip_.bind(this);
	            this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
	            this.forElement_.addEventListener('touchend', this.boundMouseEnterHandler, false);
	            this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveAndScrollHandler, false);
	            window.addEventListener('scroll', this.boundMouseLeaveAndScrollHandler, true);
	            window.addEventListener('touchstart', this.boundMouseLeaveAndScrollHandler);
	        }
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialTooltip,
	    classAsString: 'MaterialTooltip',
	    cssClass: 'mdl-tooltip'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Layout MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialLayout = function MaterialLayout(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialLayout'] = MaterialLayout;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialLayout.prototype.Constant_ = {
	    MAX_WIDTH: '(max-width: 1024px)',
	    TAB_SCROLL_PIXELS: 100,
	    RESIZE_TIMEOUT: 100,
	    MENU_ICON: '&#xE5D2;',
	    CHEVRON_LEFT: 'chevron_left',
	    CHEVRON_RIGHT: 'chevron_right'
	};
	/**
	   * Keycodes, for code readability.
	   *
	   * @enum {number}
	   * @private
	   */
	MaterialLayout.prototype.Keycodes_ = {
	    ENTER: 13,
	    ESCAPE: 27,
	    SPACE: 32
	};
	/**
	   * Modes.
	   *
	   * @enum {number}
	   * @private
	   */
	MaterialLayout.prototype.Mode_ = {
	    STANDARD: 0,
	    SEAMED: 1,
	    WATERFALL: 2,
	    SCROLL: 3
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialLayout.prototype.CssClasses_ = {
	    CONTAINER: 'mdl-layout__container',
	    HEADER: 'mdl-layout__header',
	    DRAWER: 'mdl-layout__drawer',
	    CONTENT: 'mdl-layout__content',
	    DRAWER_BTN: 'mdl-layout__drawer-button',
	    ICON: 'material-icons',
	    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
	    RIPPLE: 'mdl-ripple',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    HEADER_SEAMED: 'mdl-layout__header--seamed',
	    HEADER_WATERFALL: 'mdl-layout__header--waterfall',
	    HEADER_SCROLL: 'mdl-layout__header--scroll',
	    FIXED_HEADER: 'mdl-layout--fixed-header',
	    OBFUSCATOR: 'mdl-layout__obfuscator',
	    TAB_BAR: 'mdl-layout__tab-bar',
	    TAB_CONTAINER: 'mdl-layout__tab-bar-container',
	    TAB: 'mdl-layout__tab',
	    TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
	    TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
	    TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
	    PANEL: 'mdl-layout__tab-panel',
	    HAS_DRAWER: 'has-drawer',
	    HAS_TABS: 'has-tabs',
	    HAS_SCROLLING_HEADER: 'has-scrolling-header',
	    CASTING_SHADOW: 'is-casting-shadow',
	    IS_COMPACT: 'is-compact',
	    IS_SMALL_SCREEN: 'is-small-screen',
	    IS_DRAWER_OPEN: 'is-visible',
	    IS_ACTIVE: 'is-active',
	    IS_UPGRADED: 'is-upgraded',
	    IS_ANIMATING: 'is-animating',
	    ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
	    ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'
	};
	/**
	   * Handles scrolling on the content.
	   *
	   * @private
	   */
	MaterialLayout.prototype.contentScrollHandler_ = function () {
	    if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
	        return;
	    }
	    var headerVisible = !this.element_.classList.contains(this.CssClasses_.IS_SMALL_SCREEN) || this.element_.classList.contains(this.CssClasses_.FIXED_HEADER);
	    if (this.content_.scrollTop > 0 && !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	        this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
	        this.header_.classList.add(this.CssClasses_.IS_COMPACT);
	        if (headerVisible) {
	            this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	        }
	    } else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	        this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
	        if (headerVisible) {
	            this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	        }
	    }
	};
	/**
	   * Handles a keyboard event on the drawer.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialLayout.prototype.keyboardEventHandler_ = function (evt) {
	    // Only react when the drawer is open.
	    if (evt.keyCode === this.Keycodes_.ESCAPE && this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
	        this.toggleDrawer();
	    }
	};
	/**
	   * Handles changes in screen size.
	   *
	   * @private
	   */
	MaterialLayout.prototype.screenSizeHandler_ = function () {
	    if (this.screenSizeMediaQuery_.matches) {
	        this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
	        // Collapse drawer (if any) when moving to a large screen size.
	        if (this.drawer_) {
	            this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
	            this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
	        }
	    }
	};
	/**
	   * Handles events of drawer button.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialLayout.prototype.drawerToggleHandler_ = function (evt) {
	    if (evt && evt.type === 'keydown') {
	        if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
	            // prevent scrolling in drawer nav
	            evt.preventDefault();
	        } else {
	            // prevent other keys
	            return;
	        }
	    }
	    this.toggleDrawer();
	};
	/**
	   * Handles (un)setting the `is-animating` class
	   *
	   * @private
	   */
	MaterialLayout.prototype.headerTransitionEndHandler_ = function () {
	    this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
	};
	/**
	   * Handles expanding the header on click
	   *
	   * @private
	   */
	MaterialLayout.prototype.headerClickHandler_ = function () {
	    if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
	        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	    }
	};
	/**
	   * Reset tab state, dropping active classes
	   *
	   * @private
	   */
	MaterialLayout.prototype.resetTabState_ = function (tabBar) {
	    for (var k = 0; k < tabBar.length; k++) {
	        tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
	    }
	};
	/**
	   * Reset panel state, droping active classes
	   *
	   * @private
	   */
	MaterialLayout.prototype.resetPanelState_ = function (panels) {
	    for (var j = 0; j < panels.length; j++) {
	        panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
	    }
	};
	/**
	  * Toggle drawer state
	  *
	  * @public
	  */
	MaterialLayout.prototype.toggleDrawer = function () {
	    var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
	    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
	    this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
	    // Set accessibility properties.
	    if (this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
	        this.drawer_.setAttribute('aria-hidden', 'false');
	        drawerButton.setAttribute('aria-expanded', 'true');
	    } else {
	        this.drawer_.setAttribute('aria-hidden', 'true');
	        drawerButton.setAttribute('aria-expanded', 'false');
	    }
	};
	MaterialLayout.prototype['toggleDrawer'] = MaterialLayout.prototype.toggleDrawer;
	/**
	   * Initialize element.
	   */
	MaterialLayout.prototype.init = function () {
	    if (this.element_) {
	        var container = document.createElement('div');
	        container.classList.add(this.CssClasses_.CONTAINER);
	        var focusedElement = this.element_.querySelector(':focus');
	        this.element_.parentElement.insertBefore(container, this.element_);
	        this.element_.parentElement.removeChild(this.element_);
	        container.appendChild(this.element_);
	        if (focusedElement) {
	            focusedElement.focus();
	        }
	        var directChildren = this.element_.childNodes;
	        var numChildren = directChildren.length;
	        for (var c = 0; c < numChildren; c++) {
	            var child = directChildren[c];
	            if (child.classList && child.classList.contains(this.CssClasses_.HEADER)) {
	                this.header_ = child;
	            }
	            if (child.classList && child.classList.contains(this.CssClasses_.DRAWER)) {
	                this.drawer_ = child;
	            }
	            if (child.classList && child.classList.contains(this.CssClasses_.CONTENT)) {
	                this.content_ = child;
	            }
	        }
	        window.addEventListener('pageshow', function (e) {
	            if (e.persisted) {
	                // when page is loaded from back/forward cache
	                // trigger repaint to let layout scroll in safari
	                this.element_.style.overflowY = 'hidden';
	                requestAnimationFrame(function () {
	                    this.element_.style.overflowY = '';
	                }.bind(this));
	            }
	        }.bind(this), false);
	        if (this.header_) {
	            this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
	        }
	        var mode = this.Mode_.STANDARD;
	        if (this.header_) {
	            if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
	                mode = this.Mode_.SEAMED;
	            } else if (this.header_.classList.contains(this.CssClasses_.HEADER_WATERFALL)) {
	                mode = this.Mode_.WATERFALL;
	                this.header_.addEventListener('transitionend', this.headerTransitionEndHandler_.bind(this));
	                this.header_.addEventListener('click', this.headerClickHandler_.bind(this));
	            } else if (this.header_.classList.contains(this.CssClasses_.HEADER_SCROLL)) {
	                mode = this.Mode_.SCROLL;
	                container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
	            }
	            if (mode === this.Mode_.STANDARD) {
	                this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
	                if (this.tabBar_) {
	                    this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
	                }
	            } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
	                this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	                if (this.tabBar_) {
	                    this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	                }
	            } else if (mode === this.Mode_.WATERFALL) {
	                // Add and remove shadows depending on scroll position.
	                // Also add/remove auxiliary class for styling of the compact version of
	                // the header.
	                this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
	                this.contentScrollHandler_();
	            }
	        }
	        // Add drawer toggling button to our layout, if we have an openable drawer.
	        if (this.drawer_) {
	            var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
	            if (!drawerButton) {
	                drawerButton = document.createElement('div');
	                drawerButton.setAttribute('aria-expanded', 'false');
	                drawerButton.setAttribute('role', 'button');
	                drawerButton.setAttribute('tabindex', '0');
	                drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);
	                var drawerButtonIcon = document.createElement('i');
	                drawerButtonIcon.classList.add(this.CssClasses_.ICON);
	                drawerButtonIcon.innerHTML = this.Constant_.MENU_ICON;
	                drawerButton.appendChild(drawerButtonIcon);
	            }
	            if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
	                //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
	                drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
	            } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
	                //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
	                drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
	            }
	            drawerButton.addEventListener('click', this.drawerToggleHandler_.bind(this));
	            drawerButton.addEventListener('keydown', this.drawerToggleHandler_.bind(this));
	            // Add a class if the layout has a drawer, for altering the left padding.
	            // Adds the HAS_DRAWER to the elements since this.header_ may or may
	            // not be present.
	            this.element_.classList.add(this.CssClasses_.HAS_DRAWER);
	            // If we have a fixed header, add the button to the header rather than
	            // the layout.
	            if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
	                this.header_.insertBefore(drawerButton, this.header_.firstChild);
	            } else {
	                this.element_.insertBefore(drawerButton, this.content_);
	            }
	            var obfuscator = document.createElement('div');
	            obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
	            this.element_.appendChild(obfuscator);
	            obfuscator.addEventListener('click', this.drawerToggleHandler_.bind(this));
	            this.obfuscator_ = obfuscator;
	            this.drawer_.addEventListener('keydown', this.keyboardEventHandler_.bind(this));
	            this.drawer_.setAttribute('aria-hidden', 'true');
	        }
	        // Keep an eye on screen size, and add/remove auxiliary class for styling
	        // of small screens.
	        this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
	        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
	        this.screenSizeHandler_();
	        // Initialize tabs, if any.
	        if (this.header_ && this.tabBar_) {
	            this.element_.classList.add(this.CssClasses_.HAS_TABS);
	            var tabContainer = document.createElement('div');
	            tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
	            this.header_.insertBefore(tabContainer, this.tabBar_);
	            this.header_.removeChild(this.tabBar_);
	            var leftButton = document.createElement('div');
	            leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
	            leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
	            var leftButtonIcon = document.createElement('i');
	            leftButtonIcon.classList.add(this.CssClasses_.ICON);
	            leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
	            leftButton.appendChild(leftButtonIcon);
	            leftButton.addEventListener('click', function () {
	                this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
	            }.bind(this));
	            var rightButton = document.createElement('div');
	            rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
	            rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
	            var rightButtonIcon = document.createElement('i');
	            rightButtonIcon.classList.add(this.CssClasses_.ICON);
	            rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
	            rightButton.appendChild(rightButtonIcon);
	            rightButton.addEventListener('click', function () {
	                this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
	            }.bind(this));
	            tabContainer.appendChild(leftButton);
	            tabContainer.appendChild(this.tabBar_);
	            tabContainer.appendChild(rightButton);
	            // Add and remove tab buttons depending on scroll position and total
	            // window size.
	            var tabUpdateHandler = function () {
	                if (this.tabBar_.scrollLeft > 0) {
	                    leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
	                } else {
	                    leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
	                }
	                if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
	                    rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
	                } else {
	                    rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
	                }
	            }.bind(this);
	            this.tabBar_.addEventListener('scroll', tabUpdateHandler);
	            tabUpdateHandler();
	            // Update tabs when the window resizes.
	            var windowResizeHandler = function () {
	                // Use timeouts to make sure it doesn't happen too often.
	                if (this.resizeTimeoutId_) {
	                    clearTimeout(this.resizeTimeoutId_);
	                }
	                this.resizeTimeoutId_ = setTimeout(function () {
	                    tabUpdateHandler();
	                    this.resizeTimeoutId_ = null;
	                }.bind(this), this.Constant_.RESIZE_TIMEOUT);
	            }.bind(this);
	            window.addEventListener('resize', windowResizeHandler);
	            if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
	                this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            }
	            // Select element tabs, document panels
	            var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
	            var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);
	            // Create new tabs for each tab element
	            for (var i = 0; i < tabs.length; i++) {
	                new MaterialLayoutTab(tabs[i], tabs, panels, this);
	            }
	        }
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Constructor for an individual tab.
	   *
	   * @constructor
	   * @param {HTMLElement} tab The HTML element for the tab.
	   * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
	   * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
	   * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
	   */
	function MaterialLayoutTab(tab, tabs, panels, layout) {
	    /**
	     * Auxiliary method to programmatically select a tab in the UI.
	     */
	    function selectTab() {
	        var href = tab.href.split('#')[1];
	        var panel = layout.content_.querySelector('#' + href);
	        layout.resetTabState_(tabs);
	        layout.resetPanelState_(panels);
	        tab.classList.add(layout.CssClasses_.IS_ACTIVE);
	        panel.classList.add(layout.CssClasses_.IS_ACTIVE);
	    }
	    if (layout.tabBar_.classList.contains(layout.CssClasses_.JS_RIPPLE_EFFECT)) {
	        var rippleContainer = document.createElement('span');
	        rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
	        rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
	        var ripple = document.createElement('span');
	        ripple.classList.add(layout.CssClasses_.RIPPLE);
	        rippleContainer.appendChild(ripple);
	        tab.appendChild(rippleContainer);
	    }
	    tab.addEventListener('click', function (e) {
	        if (tab.getAttribute('href').charAt(0) === '#') {
	            e.preventDefault();
	            selectTab();
	        }
	    });
	    tab.show = selectTab;
	}
	window['MaterialLayoutTab'] = MaterialLayoutTab;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialLayout,
	    classAsString: 'MaterialLayout',
	    cssClass: 'mdl-js-layout'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Data Table Card MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	var MaterialDataTable = function MaterialDataTable(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialDataTable'] = MaterialDataTable;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialDataTable.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialDataTable.prototype.CssClasses_ = {
	    DATA_TABLE: 'mdl-data-table',
	    SELECTABLE: 'mdl-data-table--selectable',
	    SELECT_ELEMENT: 'mdl-data-table__select',
	    IS_SELECTED: 'is-selected',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Generates and returns a function that toggles the selection state of a
	   * single row (or multiple rows).
	   *
	   * @param {Element} checkbox Checkbox that toggles the selection state.
	   * @param {Element} row Row to toggle when checkbox changes.
	   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
	   * @private
	   */
	MaterialDataTable.prototype.selectRow_ = function (checkbox, row, opt_rows) {
	    if (row) {
	        return function () {
	            if (checkbox.checked) {
	                row.classList.add(this.CssClasses_.IS_SELECTED);
	            } else {
	                row.classList.remove(this.CssClasses_.IS_SELECTED);
	            }
	        }.bind(this);
	    }
	    if (opt_rows) {
	        return function () {
	            var i;
	            var el;
	            if (checkbox.checked) {
	                for (i = 0; i < opt_rows.length; i++) {
	                    el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
	                    el['MaterialCheckbox'].check();
	                    opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
	                }
	            } else {
	                for (i = 0; i < opt_rows.length; i++) {
	                    el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
	                    el['MaterialCheckbox'].uncheck();
	                    opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
	                }
	            }
	        }.bind(this);
	    }
	};
	/**
	   * Creates a checkbox for a single or or multiple rows and hooks up the
	   * event handling.
	   *
	   * @param {Element} row Row to toggle when checkbox changes.
	   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
	   * @private
	   */
	MaterialDataTable.prototype.createCheckbox_ = function (row, opt_rows) {
	    var label = document.createElement('label');
	    var labelClasses = [
	        'mdl-checkbox',
	        'mdl-js-checkbox',
	        'mdl-js-ripple-effect',
	        this.CssClasses_.SELECT_ELEMENT
	    ];
	    label.className = labelClasses.join(' ');
	    var checkbox = document.createElement('input');
	    checkbox.type = 'checkbox';
	    checkbox.classList.add('mdl-checkbox__input');
	    if (row) {
	        checkbox.checked = row.classList.contains(this.CssClasses_.IS_SELECTED);
	        checkbox.addEventListener('change', this.selectRow_(checkbox, row));
	    } else if (opt_rows) {
	        checkbox.addEventListener('change', this.selectRow_(checkbox, null, opt_rows));
	    }
	    label.appendChild(checkbox);
	    componentHandler.upgradeElement(label, 'MaterialCheckbox');
	    return label;
	};
	/**
	   * Initialize element.
	   */
	MaterialDataTable.prototype.init = function () {
	    if (this.element_) {
	        var firstHeader = this.element_.querySelector('th');
	        var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
	        var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
	        var rows = bodyRows.concat(footRows);
	        if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
	            var th = document.createElement('th');
	            var headerCheckbox = this.createCheckbox_(null, rows);
	            th.appendChild(headerCheckbox);
	            firstHeader.parentElement.insertBefore(th, firstHeader);
	            for (var i = 0; i < rows.length; i++) {
	                var firstCell = rows[i].querySelector('td');
	                if (firstCell) {
	                    var td = document.createElement('td');
	                    if (rows[i].parentNode.nodeName.toUpperCase() === 'TBODY') {
	                        var rowCheckbox = this.createCheckbox_(rows[i]);
	                        td.appendChild(rowCheckbox);
	                    }
	                    rows[i].insertBefore(td, firstCell);
	                }
	            }
	            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	        }
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialDataTable,
	    classAsString: 'MaterialDataTable',
	    cssClass: 'mdl-js-data-table'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Ripple MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialRipple = function MaterialRipple(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialRipple'] = MaterialRipple;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialRipple.prototype.Constant_ = {
	    INITIAL_SCALE: 'scale(0.0001, 0.0001)',
	    INITIAL_SIZE: '1px',
	    INITIAL_OPACITY: '0.4',
	    FINAL_OPACITY: '0',
	    FINAL_SCALE: ''
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialRipple.prototype.CssClasses_ = {
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE: 'mdl-ripple',
	    IS_ANIMATING: 'is-animating',
	    IS_VISIBLE: 'is-visible'
	};
	/**
	   * Handle mouse / finger down on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRipple.prototype.downHandler_ = function (event) {
	    if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
	        var rect = this.element_.getBoundingClientRect();
	        this.boundHeight = rect.height;
	        this.boundWidth = rect.width;
	        this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
	        this.rippleElement_.style.width = this.rippleSize_ + 'px';
	        this.rippleElement_.style.height = this.rippleSize_ + 'px';
	    }
	    this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);
	    if (event.type === 'mousedown' && this.ignoringMouseDown_) {
	        this.ignoringMouseDown_ = false;
	    } else {
	        if (event.type === 'touchstart') {
	            this.ignoringMouseDown_ = true;
	        }
	        var frameCount = this.getFrameCount();
	        if (frameCount > 0) {
	            return;
	        }
	        this.setFrameCount(1);
	        var bound = event.currentTarget.getBoundingClientRect();
	        var x;
	        var y;
	        // Check if we are handling a keyboard click.
	        if (event.clientX === 0 && event.clientY === 0) {
	            x = Math.round(bound.width / 2);
	            y = Math.round(bound.height / 2);
	        } else {
	            var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
	            var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
	            x = Math.round(clientX - bound.left);
	            y = Math.round(clientY - bound.top);
	        }
	        this.setRippleXY(x, y);
	        this.setRippleStyles(true);
	        window.requestAnimationFrame(this.animFrameHandler.bind(this));
	    }
	};
	/**
	   * Handle mouse / finger up on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRipple.prototype.upHandler_ = function (event) {
	    // Don't fire for the artificial "mouseup" generated by a double-click.
	    if (event && event.detail !== 2) {
	        // Allow a repaint to occur before removing this class, so the animation
	        // shows for tap events, which seem to trigger a mouseup too soon after
	        // mousedown.
	        window.setTimeout(function () {
	            this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
	        }.bind(this), 0);
	    }
	};
	/**
	   * Initialize element.
	   */
	MaterialRipple.prototype.init = function () {
	    if (this.element_) {
	        var recentering = this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
	        if (!this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
	            this.rippleElement_ = this.element_.querySelector('.' + this.CssClasses_.RIPPLE);
	            this.frameCount_ = 0;
	            this.rippleSize_ = 0;
	            this.x_ = 0;
	            this.y_ = 0;
	            // Touch start produces a compat mouse down event, which would cause a
	            // second ripples. To avoid that, we use this property to ignore the first
	            // mouse down after a touch start.
	            this.ignoringMouseDown_ = false;
	            this.boundDownHandler = this.downHandler_.bind(this);
	            this.element_.addEventListener('mousedown', this.boundDownHandler);
	            this.element_.addEventListener('touchstart', this.boundDownHandler);
	            this.boundUpHandler = this.upHandler_.bind(this);
	            this.element_.addEventListener('mouseup', this.boundUpHandler);
	            this.element_.addEventListener('mouseleave', this.boundUpHandler);
	            this.element_.addEventListener('touchend', this.boundUpHandler);
	            this.element_.addEventListener('blur', this.boundUpHandler);
	            /**
	         * Getter for frameCount_.
	         * @return {number} the frame count.
	         */
	            this.getFrameCount = function () {
	                return this.frameCount_;
	            };
	            /**
	         * Setter for frameCount_.
	         * @param {number} fC the frame count.
	         */
	            this.setFrameCount = function (fC) {
	                this.frameCount_ = fC;
	            };
	            /**
	         * Getter for rippleElement_.
	         * @return {Element} the ripple element.
	         */
	            this.getRippleElement = function () {
	                return this.rippleElement_;
	            };
	            /**
	         * Sets the ripple X and Y coordinates.
	         * @param  {number} newX the new X coordinate
	         * @param  {number} newY the new Y coordinate
	         */
	            this.setRippleXY = function (newX, newY) {
	                this.x_ = newX;
	                this.y_ = newY;
	            };
	            /**
	         * Sets the ripple styles.
	         * @param  {boolean} start whether or not this is the start frame.
	         */
	            this.setRippleStyles = function (start) {
	                if (this.rippleElement_ !== null) {
	                    var transformString;
	                    var scale;
	                    var size;
	                    var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';
	                    if (start) {
	                        scale = this.Constant_.INITIAL_SCALE;
	                        size = this.Constant_.INITIAL_SIZE;
	                    } else {
	                        scale = this.Constant_.FINAL_SCALE;
	                        size = this.rippleSize_ + 'px';
	                        if (recentering) {
	                            offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
	                        }
	                    }
	                    transformString = 'translate(-50%, -50%) ' + offset + scale;
	                    this.rippleElement_.style.webkitTransform = transformString;
	                    this.rippleElement_.style.msTransform = transformString;
	                    this.rippleElement_.style.transform = transformString;
	                    if (start) {
	                        this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
	                    } else {
	                        this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
	                    }
	                }
	            };
	            /**
	         * Handles an animation frame.
	         */
	            this.animFrameHandler = function () {
	                if (this.frameCount_-- > 0) {
	                    window.requestAnimationFrame(this.animFrameHandler.bind(this));
	                } else {
	                    this.setRippleStyles(false);
	                }
	            };
	        }
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialRipple,
	    classAsString: 'MaterialRipple',
	    cssClass: 'mdl-js-ripple-effect',
	    widget: false
	});
	}());


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// jquery.event.move
	//
	// 1.3.6
	//
	// Stephen Band
	//
	// Triggers 'movestart', 'move' and 'moveend' events after
	// mousemoves following a mousedown cross a distance threshold,
	// similar to the native 'dragstart', 'drag' and 'dragend' events.
	// Move events are throttled to animation frames. Move event objects
	// have the properties:
	//
	// pageX:
	// pageY:   Page coordinates of pointer.
	// startX:
	// startY:  Page coordinates of pointer at movestart.
	// distX:
	// distY:  Distance the pointer has moved since movestart.
	// deltaX:
	// deltaY:  Distance the finger has moved since last event.
	// velocityX:
	// velocityY:  Average velocity over last few events.


	(function (module) {
		if (true) {
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (module), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Browser globals
			module(jQuery);
		}
	})(function(jQuery, undefined){

		var // Number of pixels a pressed pointer travels before movestart
		    // event is fired.
		    threshold = 6,
		
		    add = jQuery.event.add,
		
		    remove = jQuery.event.remove,

		    // Just sugar, so we can have arguments in the same order as
		    // add and remove.
		    trigger = function(node, type, data) {
		    	jQuery.event.trigger(type, data, node);
		    },

		    // Shim for requestAnimationFrame, falling back to timer. See:
		    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		    requestFrame = (function(){
		    	return (
		    		window.requestAnimationFrame ||
		    		window.webkitRequestAnimationFrame ||
		    		window.mozRequestAnimationFrame ||
		    		window.oRequestAnimationFrame ||
		    		window.msRequestAnimationFrame ||
		    		function(fn, element){
		    			return window.setTimeout(function(){
		    				fn();
		    			}, 25);
		    		}
		    	);
		    })(),
		    
		    ignoreTags = {
		    	textarea: true,
		    	input: true,
		    	select: true,
		    	button: true
		    },
		    
		    mouseevents = {
		    	move: 'mousemove',
		    	cancel: 'mouseup dragstart',
		    	end: 'mouseup'
		    },
		    
		    touchevents = {
		    	move: 'touchmove',
		    	cancel: 'touchend',
		    	end: 'touchend'
		    };


		// Constructors
		
		function Timer(fn){
			var callback = fn,
			    active = false,
			    running = false;
			
			function trigger(time) {
				if (active){
					callback();
					requestFrame(trigger);
					running = true;
					active = false;
				}
				else {
					running = false;
				}
			}
			
			this.kick = function(fn) {
				active = true;
				if (!running) { trigger(); }
			};
			
			this.end = function(fn) {
				var cb = callback;
				
				if (!fn) { return; }
				
				// If the timer is not running, simply call the end callback.
				if (!running) {
					fn();
				}
				// If the timer is running, and has been kicked lately, then
				// queue up the current callback and the end callback, otherwise
				// just the end callback.
				else {
					callback = active ?
						function(){ cb(); fn(); } : 
						fn ;
					
					active = true;
				}
			};
		}


		// Functions
		
		function returnTrue() {
			return true;
		}
		
		function returnFalse() {
			return false;
		}
		
		function preventDefault(e) {
			e.preventDefault();
		}
		
		function preventIgnoreTags(e) {
			// Don't prevent interaction with form elements.
			if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }
			
			e.preventDefault();
		}

		function isLeftButton(e) {
			// Ignore mousedowns on any button other than the left (or primary)
			// mouse button, or when a modifier key is pressed.
			return (e.which === 1 && !e.ctrlKey && !e.altKey);
		}

		function identifiedTouch(touchList, id) {
			var i, l;

			if (touchList.identifiedTouch) {
				return touchList.identifiedTouch(id);
			}
			
			// touchList.identifiedTouch() does not exist in
			// webkit yet… we must do the search ourselves...
			
			i = -1;
			l = touchList.length;
			
			while (++i < l) {
				if (touchList[i].identifier === id) {
					return touchList[i];
				}
			}
		}

		function changedTouch(e, event) {
			var touch = identifiedTouch(e.changedTouches, event.identifier);

			// This isn't the touch you're looking for.
			if (!touch) { return; }

			// Chrome Android (at least) includes touches that have not
			// changed in e.changedTouches. That's a bit annoying. Check
			// that this touch has changed.
			if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

			return touch;
		}


		// Handlers that decide when the first movestart is triggered
		
		function mousedown(e){
			var data;

			if (!isLeftButton(e)) { return; }

			data = {
				target: e.target,
				startX: e.pageX,
				startY: e.pageY,
				timeStamp: e.timeStamp
			};

			add(document, mouseevents.move, mousemove, data);
			add(document, mouseevents.cancel, mouseend, data);
		}

		function mousemove(e){
			var data = e.data;

			checkThreshold(e, data, e, removeMouse);
		}

		function mouseend(e) {
			removeMouse();
		}

		function removeMouse() {
			remove(document, mouseevents.move, mousemove);
			remove(document, mouseevents.cancel, mouseend);
		}

		function touchstart(e) {
			var touch, template;

			// Don't get in the way of interaction with form elements.
			if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

			touch = e.changedTouches[0];
			
			// iOS live updates the touch objects whereas Android gives us copies.
			// That means we can't trust the touchstart object to stay the same,
			// so we must copy the data. This object acts as a template for
			// movestart, move and moveend event objects.
			template = {
				target: touch.target,
				startX: touch.pageX,
				startY: touch.pageY,
				timeStamp: e.timeStamp,
				identifier: touch.identifier
			};

			// Use the touch identifier as a namespace, so that we can later
			// remove handlers pertaining only to this touch.
			add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
			add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
		}

		function touchmove(e){
			var data = e.data,
			    touch = changedTouch(e, data);

			if (!touch) { return; }

			checkThreshold(e, data, touch, removeTouch);
		}

		function touchend(e) {
			var template = e.data,
			    touch = identifiedTouch(e.changedTouches, template.identifier);

			if (!touch) { return; }

			removeTouch(template.identifier);
		}

		function removeTouch(identifier) {
			remove(document, '.' + identifier, touchmove);
			remove(document, '.' + identifier, touchend);
		}


		// Logic for deciding when to trigger a movestart.

		function checkThreshold(e, template, touch, fn) {
			var distX = touch.pageX - template.startX,
			    distY = touch.pageY - template.startY;

			// Do nothing if the threshold has not been crossed.
			if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

			triggerStart(e, template, touch, distX, distY, fn);
		}

		function handled() {
			// this._handled should return false once, and after return true.
			this._handled = returnTrue;
			return false;
		}

		function flagAsHandled(e) {
			e._handled();
		}

		function triggerStart(e, template, touch, distX, distY, fn) {
			var node = template.target,
			    touches, time;

			touches = e.targetTouches;
			time = e.timeStamp - template.timeStamp;

			// Create a movestart object with some special properties that
			// are passed only to the movestart handlers.
			template.type = 'movestart';
			template.distX = distX;
			template.distY = distY;
			template.deltaX = distX;
			template.deltaY = distY;
			template.pageX = touch.pageX;
			template.pageY = touch.pageY;
			template.velocityX = distX / time;
			template.velocityY = distY / time;
			template.targetTouches = touches;
			template.finger = touches ?
				touches.length :
				1 ;

			// The _handled method is fired to tell the default movestart
			// handler that one of the move events is bound.
			template._handled = handled;
				
			// Pass the touchmove event so it can be prevented if or when
			// movestart is handled.
			template._preventTouchmoveDefault = function() {
				e.preventDefault();
			};

			// Trigger the movestart event.
			trigger(template.target, template);

			// Unbind handlers that tracked the touch or mouse up till now.
			fn(template.identifier);
		}


		// Handlers that control what happens following a movestart

		function activeMousemove(e) {
			var timer = e.data.timer;

			e.data.touch = e;
			e.data.timeStamp = e.timeStamp;
			timer.kick();
		}

		function activeMouseend(e) {
			var event = e.data.event,
			    timer = e.data.timer;
			
			removeActiveMouse();

			endEvent(event, timer, function() {
				// Unbind the click suppressor, waiting until after mouseup
				// has been handled.
				setTimeout(function(){
					remove(event.target, 'click', returnFalse);
				}, 0);
			});
		}

		function removeActiveMouse(event) {
			remove(document, mouseevents.move, activeMousemove);
			remove(document, mouseevents.end, activeMouseend);
		}

		function activeTouchmove(e) {
			var event = e.data.event,
			    timer = e.data.timer,
			    touch = changedTouch(e, event);

			if (!touch) { return; }

			// Stop the interface from gesturing
			e.preventDefault();

			event.targetTouches = e.targetTouches;
			e.data.touch = touch;
			e.data.timeStamp = e.timeStamp;
			timer.kick();
		}

		function activeTouchend(e) {
			var event = e.data.event,
			    timer = e.data.timer,
			    touch = identifiedTouch(e.changedTouches, event.identifier);

			// This isn't the touch you're looking for.
			if (!touch) { return; }

			removeActiveTouch(event);
			endEvent(event, timer);
		}

		function removeActiveTouch(event) {
			remove(document, '.' + event.identifier, activeTouchmove);
			remove(document, '.' + event.identifier, activeTouchend);
		}


		// Logic for triggering move and moveend events

		function updateEvent(event, touch, timeStamp, timer) {
			var time = timeStamp - event.timeStamp;

			event.type = 'move';
			event.distX =  touch.pageX - event.startX;
			event.distY =  touch.pageY - event.startY;
			event.deltaX = touch.pageX - event.pageX;
			event.deltaY = touch.pageY - event.pageY;
			
			// Average the velocity of the last few events using a decay
			// curve to even out spurious jumps in values.
			event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
			event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
			event.pageX =  touch.pageX;
			event.pageY =  touch.pageY;
		}

		function endEvent(event, timer, fn) {
			timer.end(function(){
				event.type = 'moveend';

				trigger(event.target, event);
				
				return fn && fn();
			});
		}


		// jQuery special event definition

		function setup(data, namespaces, eventHandle) {
			// Stop the node from being dragged
			//add(this, 'dragstart.move drag.move', preventDefault);
			
			// Prevent text selection and touch interface scrolling
			//add(this, 'mousedown.move', preventIgnoreTags);
			
			// Tell movestart default handler that we've handled this
			add(this, 'movestart.move', flagAsHandled);

			// Don't bind to the DOM. For speed.
			return true;
		}
		
		function teardown(namespaces) {
			remove(this, 'dragstart drag', preventDefault);
			remove(this, 'mousedown touchstart', preventIgnoreTags);
			remove(this, 'movestart', flagAsHandled);
			
			// Don't bind to the DOM. For speed.
			return true;
		}
		
		function addMethod(handleObj) {
			// We're not interested in preventing defaults for handlers that
			// come from internal move or moveend bindings
			if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
				return;
			}
			
			// Stop the node from being dragged
			add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);
			
			// Prevent text selection and touch interface scrolling
			add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
		}
		
		function removeMethod(handleObj) {
			if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
				return;
			}
			
			remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
			remove(this, 'mousedown.' + handleObj.guid);
		}
		
		jQuery.event.special.movestart = {
			setup: setup,
			teardown: teardown,
			add: addMethod,
			remove: removeMethod,

			_default: function(e) {
				var event, data;
				
				// If no move events were bound to any ancestors of this
				// target, high tail it out of here.
				if (!e._handled()) { return; }

				function update(time) {
					updateEvent(event, data.touch, data.timeStamp);
					trigger(e.target, event);
				}

				event = {
					target: e.target,
					startX: e.startX,
					startY: e.startY,
					pageX: e.pageX,
					pageY: e.pageY,
					distX: e.distX,
					distY: e.distY,
					deltaX: e.deltaX,
					deltaY: e.deltaY,
					velocityX: e.velocityX,
					velocityY: e.velocityY,
					timeStamp: e.timeStamp,
					identifier: e.identifier,
					targetTouches: e.targetTouches,
					finger: e.finger
				};

				data = {
					event: event,
					timer: new Timer(update),
					touch: undefined,
					timeStamp: undefined
				};
				
				if (e.identifier === undefined) {
					// We're dealing with a mouse
					// Stop clicks from propagating during a move
					add(e.target, 'click', returnFalse);
					add(document, mouseevents.move, activeMousemove, data);
					add(document, mouseevents.end, activeMouseend, data);
				}
				else {
					// We're dealing with a touch. Stop touchmove doing
					// anything defaulty.
					e._preventTouchmoveDefault();
					add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
					add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
				}
			}
		};

		jQuery.event.special.move = {
			setup: function() {
				// Bind a noop to movestart. Why? It's the movestart
				// setup that decides whether other move events are fired.
				add(this, 'movestart.move', jQuery.noop);
			},
			
			teardown: function() {
				remove(this, 'movestart.move', jQuery.noop);
			}
		};
		
		jQuery.event.special.moveend = {
			setup: function() {
				// Bind a noop to movestart. Why? It's the movestart
				// setup that decides whether other move events are fired.
				add(this, 'movestart.moveend', jQuery.noop);
			},
			
			teardown: function() {
				remove(this, 'movestart.moveend', jQuery.noop);
			}
		};

		add(document, 'mousedown.move', mousedown);
		add(document, 'touchstart.move', touchstart);

		// Make jQuery copy touch event properties over to the jQuery event
		// object, if they are not already listed. But only do the ones we
		// really need. IE7/8 do not have Array#indexOf(), but nor do they
		// have touch events, so let's assume we can ignore them.
		if (typeof Array.prototype.indexOf === 'function') {
			(function(jQuery, undefined){
				var props = ["changedTouches", "targetTouches"],
				    l = props.length;
				
				while (l--) {
					if (jQuery.event.props.indexOf(props[l]) === -1) {
						jQuery.event.props.push(props[l]);
					}
				}
			})(jQuery);
		};
	});


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = jQuery;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// jQuery.event.swipe
	// 0.5
	// Stephen Band

	// Dependencies
	// jQuery.event.move 1.2

	// One of swipeleft, swiperight, swipeup or swipedown is triggered on
	// moveend, when the move has covered a threshold ratio of the dimension
	// of the target node, or has gone really fast. Threshold and velocity
	// sensitivity changed with:
	//
	// jQuery.event.special.swipe.settings.threshold
	// jQuery.event.special.swipe.settings.sensitivity

	(function (thisModule) {
		if (true) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (thisModule), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
	        module.exports = thisModule;
		} else {
			// Browser globals
	        thisModule(jQuery);
		}
	})(function(jQuery, undefined){
		var add = jQuery.event.add,
		   
		    remove = jQuery.event.remove,

		    // Just sugar, so we can have arguments in the same order as
		    // add and remove.
		    trigger = function(node, type, data) {
		    	jQuery.event.trigger(type, data, node);
		    },

		    settings = {
		    	// Ratio of distance over target finger must travel to be
		    	// considered a swipe.
		    	threshold: 0.4,
		    	// Faster fingers can travel shorter distances to be considered
		    	// swipes. 'sensitivity' controls how much. Bigger is shorter.
		    	sensitivity: 6
		    };

		function moveend(e) {
			var w, h, event;

			w = e.currentTarget.offsetWidth;
			h = e.currentTarget.offsetHeight;

			// Copy over some useful properties from the move event
			event = {
				distX: e.distX,
				distY: e.distY,
				velocityX: e.velocityX,
				velocityY: e.velocityY,
				finger: e.finger
			};

			// Find out which of the four directions was swiped
			if (e.distX > e.distY) {
				if (e.distX > -e.distY) {
					if (e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
						event.type = 'swiperight';
						trigger(e.currentTarget, event);
					}
				}
				else {
					if (-e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
						event.type = 'swipeup';
						trigger(e.currentTarget, event);
					}
				}
			}
			else {
				if (e.distX > -e.distY) {
					if (e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
						event.type = 'swipedown';
						trigger(e.currentTarget, event);
					}
				}
				else {
					if (-e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
						event.type = 'swipeleft';
						trigger(e.currentTarget, event);
					}
				}
			}
		}

		function getData(node) {
			var data = jQuery.data(node, 'event_swipe');
			
			if (!data) {
				data = { count: 0 };
				jQuery.data(node, 'event_swipe', data);
			}
			
			return data;
		}

		jQuery.event.special.swipe =
		jQuery.event.special.swipeleft =
		jQuery.event.special.swiperight =
		jQuery.event.special.swipeup =
		jQuery.event.special.swipedown = {
			setup: function( data, namespaces, eventHandle ) {
				var data = getData(this);

				// If another swipe event is already setup, don't setup again.
				if (data.count++ > 0) { return; }

				add(this, 'moveend', moveend);

				return true;
			},

			teardown: function() {
				var data = getData(this);

				// If another swipe event is still setup, don't teardown.
				if (--data.count > 0) { return; }

				remove(this, 'moveend', moveend);

				return true;
			},

			settings: settings
		};
	});


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Swiper 3.3.1
	 * Most modern mobile touch slider and framework with hardware accelerated transitions
	 *
	 * http://www.idangero.us/swiper/
	 *
	 * Copyright 2016, Vladimir Kharlampidi
	 * The iDangero.us
	 * http://www.idangero.us/
	 *
	 * Licensed under MIT
	 *
	 * Released on: February 7, 2016
	 */
	(function () {
	    'use strict';
	    var $;
	    /*===========================
	    Swiper
	    ===========================*/
	    var Swiper = function (container, params) {
	        if (!(this instanceof Swiper)) return new Swiper(container, params);

	        var defaults = {
	            direction: 'horizontal',
	            touchEventsTarget: 'container',
	            initialSlide: 0,
	            speed: 300,
	            // autoplay
	            autoplay: false,
	            autoplayDisableOnInteraction: true,
	            autoplayStopOnLast: false,
	            // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
	            iOSEdgeSwipeDetection: false,
	            iOSEdgeSwipeThreshold: 20,
	            // Free mode
	            freeMode: false,
	            freeModeMomentum: true,
	            freeModeMomentumRatio: 1,
	            freeModeMomentumBounce: true,
	            freeModeMomentumBounceRatio: 1,
	            freeModeSticky: false,
	            freeModeMinimumVelocity: 0.02,
	            // Autoheight
	            autoHeight: false,
	            // Set wrapper width
	            setWrapperSize: false,
	            // Virtual Translate
	            virtualTranslate: false,
	            // Effects
	            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
	            coverflow: {
	                rotate: 50,
	                stretch: 0,
	                depth: 100,
	                modifier: 1,
	                slideShadows : true
	            },
	            flip: {
	                slideShadows : true,
	                limitRotation: true
	            },
	            cube: {
	                slideShadows: true,
	                shadow: true,
	                shadowOffset: 20,
	                shadowScale: 0.94
	            },
	            fade: {
	                crossFade: false
	            },
	            // Parallax
	            parallax: false,
	            // Scrollbar
	            scrollbar: null,
	            scrollbarHide: true,
	            scrollbarDraggable: false,
	            scrollbarSnapOnRelease: false,
	            // Keyboard Mousewheel
	            keyboardControl: false,
	            mousewheelControl: false,
	            mousewheelReleaseOnEdges: false,
	            mousewheelInvert: false,
	            mousewheelForceToAxis: false,
	            mousewheelSensitivity: 1,
	            // Hash Navigation
	            hashnav: false,
	            // Breakpoints
	            breakpoints: undefined,
	            // Slides grid
	            spaceBetween: 0,
	            slidesPerView: 1,
	            slidesPerColumn: 1,
	            slidesPerColumnFill: 'column',
	            slidesPerGroup: 1,
	            centeredSlides: false,
	            slidesOffsetBefore: 0, // in px
	            slidesOffsetAfter: 0, // in px
	            // Round length
	            roundLengths: false,
	            // Touches
	            touchRatio: 1,
	            touchAngle: 45,
	            simulateTouch: true,
	            shortSwipes: true,
	            longSwipes: true,
	            longSwipesRatio: 0.5,
	            longSwipesMs: 300,
	            followFinger: true,
	            onlyExternal: false,
	            threshold: 0,
	            touchMoveStopPropagation: true,
	            // Unique Navigation Elements
	            uniqueNavElements: true,
	            // Pagination
	            pagination: null,
	            paginationElement: 'span',
	            paginationClickable: false,
	            paginationHide: false,
	            paginationBulletRender: null,
	            paginationProgressRender: null,
	            paginationFractionRender: null,
	            paginationCustomRender: null,
	            paginationType: 'bullets', // 'bullets' or 'progress' or 'fraction' or 'custom'
	            // Resistance
	            resistance: true,
	            resistanceRatio: 0.85,
	            // Next/prev buttons
	            nextButton: null,
	            prevButton: null,
	            // Progress
	            watchSlidesProgress: false,
	            watchSlidesVisibility: false,
	            // Cursor
	            grabCursor: false,
	            // Clicks
	            preventClicks: true,
	            preventClicksPropagation: true,
	            slideToClickedSlide: false,
	            // Lazy Loading
	            lazyLoading: false,
	            lazyLoadingInPrevNext: false,
	            lazyLoadingInPrevNextAmount: 1,
	            lazyLoadingOnTransitionStart: false,
	            // Images
	            preloadImages: true,
	            updateOnImagesReady: true,
	            // loop
	            loop: false,
	            loopAdditionalSlides: 0,
	            loopedSlides: null,
	            // Control
	            control: undefined,
	            controlInverse: false,
	            controlBy: 'slide', //or 'container'
	            // Swiping/no swiping
	            allowSwipeToPrev: true,
	            allowSwipeToNext: true,
	            swipeHandler: null, //'.swipe-handler',
	            noSwiping: true,
	            noSwipingClass: 'swiper-no-swiping',
	            // NS
	            slideClass: 'swiper-slide',
	            slideActiveClass: 'swiper-slide-active',
	            slideVisibleClass: 'swiper-slide-visible',
	            slideDuplicateClass: 'swiper-slide-duplicate',
	            slideNextClass: 'swiper-slide-next',
	            slidePrevClass: 'swiper-slide-prev',
	            wrapperClass: 'swiper-wrapper',
	            bulletClass: 'swiper-pagination-bullet',
	            bulletActiveClass: 'swiper-pagination-bullet-active',
	            buttonDisabledClass: 'swiper-button-disabled',
	            paginationCurrentClass: 'swiper-pagination-current',
	            paginationTotalClass: 'swiper-pagination-total',
	            paginationHiddenClass: 'swiper-pagination-hidden',
	            paginationProgressbarClass: 'swiper-pagination-progressbar',
	            // Observer
	            observer: false,
	            observeParents: false,
	            // Accessibility
	            a11y: false,
	            prevSlideMessage: 'Previous slide',
	            nextSlideMessage: 'Next slide',
	            firstSlideMessage: 'This is the first slide',
	            lastSlideMessage: 'This is the last slide',
	            paginationBulletMessage: 'Go to slide {{index}}',
	            // Callbacks
	            runCallbacksOnInit: true
	            /*
	            Callbacks:
	            onInit: function (swiper)
	            onDestroy: function (swiper)
	            onClick: function (swiper, e)
	            onTap: function (swiper, e)
	            onDoubleTap: function (swiper, e)
	            onSliderMove: function (swiper, e)
	            onSlideChangeStart: function (swiper)
	            onSlideChangeEnd: function (swiper)
	            onTransitionStart: function (swiper)
	            onTransitionEnd: function (swiper)
	            onImagesReady: function (swiper)
	            onProgress: function (swiper, progress)
	            onTouchStart: function (swiper, e)
	            onTouchMove: function (swiper, e)
	            onTouchMoveOpposite: function (swiper, e)
	            onTouchEnd: function (swiper, e)
	            onReachBeginning: function (swiper)
	            onReachEnd: function (swiper)
	            onSetTransition: function (swiper, duration)
	            onSetTranslate: function (swiper, translate)
	            onAutoplayStart: function (swiper)
	            onAutoplayStop: function (swiper),
	            onLazyImageLoad: function (swiper, slide, image)
	            onLazyImageReady: function (swiper, slide, image)
	            */

	        };
	        var initialVirtualTranslate = params && params.virtualTranslate;

	        params = params || {};
	        var originalParams = {};
	        for (var param in params) {
	            if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
	                originalParams[param] = {};
	                for (var deepParam in params[param]) {
	                    originalParams[param][deepParam] = params[param][deepParam];
	                }
	            }
	            else {
	                originalParams[param] = params[param];
	            }
	        }
	        for (var def in defaults) {
	            if (typeof params[def] === 'undefined') {
	                params[def] = defaults[def];
	            }
	            else if (typeof params[def] === 'object') {
	                for (var deepDef in defaults[def]) {
	                    if (typeof params[def][deepDef] === 'undefined') {
	                        params[def][deepDef] = defaults[def][deepDef];
	                    }
	                }
	            }
	        }

	        // Swiper
	        var s = this;

	        // Params
	        s.params = params;
	        s.originalParams = originalParams;

	        // Classname
	        s.classNames = [];
	        /*=========================
	          Dom Library and plugins
	          ===========================*/
	        if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
	            $ = Dom7;
	        }
	        if (typeof $ === 'undefined') {
	            if (typeof Dom7 === 'undefined') {
	                $ = window.Dom7 || window.Zepto || window.jQuery;
	            }
	            else {
	                $ = Dom7;
	            }
	            if (!$) return;
	        }
	        // Export it to Swiper instance
	        s.$ = $;

	        /*=========================
	          Breakpoints
	          ===========================*/
	        s.currentBreakpoint = undefined;
	        s.getActiveBreakpoint = function () {
	            //Get breakpoint for window width
	            if (!s.params.breakpoints) return false;
	            var breakpoint = false;
	            var points = [], point;
	            for ( point in s.params.breakpoints ) {
	                if (s.params.breakpoints.hasOwnProperty(point)) {
	                    points.push(point);
	                }
	            }
	            points.sort(function (a, b) {
	                return parseInt(a, 10) > parseInt(b, 10);
	            });
	            for (var i = 0; i < points.length; i++) {
	                point = points[i];
	                if (point >= window.innerWidth && !breakpoint) {
	                    breakpoint = point;
	                }
	            }
	            return breakpoint || 'max';
	        };
	        s.setBreakpoint = function () {
	            //Set breakpoint for window width and update parameters
	            var breakpoint = s.getActiveBreakpoint();
	            if (breakpoint && s.currentBreakpoint !== breakpoint) {
	                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
	                var needsReLoop = s.params.loop && (breakPointsParams.slidesPerView !== s.params.slidesPerView);
	                for ( var param in breakPointsParams ) {
	                    s.params[param] = breakPointsParams[param];
	                }
	                s.currentBreakpoint = breakpoint;
	                if(needsReLoop && s.destroyLoop) {
	                    s.reLoop(true);
	                }
	            }
	        };
	        // Set breakpoint on load
	        if (s.params.breakpoints) {
	            s.setBreakpoint();
	        }

	        /*=========================
	          Preparation - Define Container, Wrapper and Pagination
	          ===========================*/
	        s.container = $(container);
	        if (s.container.length === 0) return;
	        if (s.container.length > 1) {
	            var swipers = [];
	            s.container.each(function () {
	                var container = this;
	                swipers.push(new Swiper(this, params));
	            });
	            return swipers;
	        }

	        // Save instance in container HTML Element and in data
	        s.container[0].swiper = s;
	        s.container.data('swiper', s);

	        s.classNames.push('swiper-container-' + s.params.direction);

	        if (s.params.freeMode) {
	            s.classNames.push('swiper-container-free-mode');
	        }
	        if (!s.support.flexbox) {
	            s.classNames.push('swiper-container-no-flexbox');
	            s.params.slidesPerColumn = 1;
	        }
	        if (s.params.autoHeight) {
	            s.classNames.push('swiper-container-autoheight');
	        }
	        // Enable slides progress when required
	        if (s.params.parallax || s.params.watchSlidesVisibility) {
	            s.params.watchSlidesProgress = true;
	        }
	        // Coverflow / 3D
	        if (['cube', 'coverflow', 'flip'].indexOf(s.params.effect) >= 0) {
	            if (s.support.transforms3d) {
	                s.params.watchSlidesProgress = true;
	                s.classNames.push('swiper-container-3d');
	            }
	            else {
	                s.params.effect = 'slide';
	            }
	        }
	        if (s.params.effect !== 'slide') {
	            s.classNames.push('swiper-container-' + s.params.effect);
	        }
	        if (s.params.effect === 'cube') {
	            s.params.resistanceRatio = 0;
	            s.params.slidesPerView = 1;
	            s.params.slidesPerColumn = 1;
	            s.params.slidesPerGroup = 1;
	            s.params.centeredSlides = false;
	            s.params.spaceBetween = 0;
	            s.params.virtualTranslate = true;
	            s.params.setWrapperSize = false;
	        }
	        if (s.params.effect === 'fade' || s.params.effect === 'flip') {
	            s.params.slidesPerView = 1;
	            s.params.slidesPerColumn = 1;
	            s.params.slidesPerGroup = 1;
	            s.params.watchSlidesProgress = true;
	            s.params.spaceBetween = 0;
	            s.params.setWrapperSize = false;
	            if (typeof initialVirtualTranslate === 'undefined') {
	                s.params.virtualTranslate = true;
	            }
	        }

	        // Grab Cursor
	        if (s.params.grabCursor && s.support.touch) {
	            s.params.grabCursor = false;
	        }

	        // Wrapper
	        s.wrapper = s.container.children('.' + s.params.wrapperClass);

	        // Pagination
	        if (s.params.pagination) {
	            s.paginationContainer = $(s.params.pagination);
	            if (s.params.uniqueNavElements && typeof s.params.pagination === 'string' && s.paginationContainer.length > 1 && s.container.find(s.params.pagination).length === 1) {
	                s.paginationContainer = s.container.find(s.params.pagination);
	            }

	            if (s.params.paginationType === 'bullets' && s.params.paginationClickable) {
	                s.paginationContainer.addClass('swiper-pagination-clickable');
	            }
	            else {
	                s.params.paginationClickable = false;
	            }
	            s.paginationContainer.addClass('swiper-pagination-' + s.params.paginationType);
	        }
	        // Next/Prev Buttons
	        if (s.params.nextButton || s.params.prevButton) {
	            if (s.params.nextButton) {
	                s.nextButton = $(s.params.nextButton);
	                if (s.params.uniqueNavElements && typeof s.params.nextButton === 'string' && s.nextButton.length > 1 && s.container.find(s.params.nextButton).length === 1) {
	                    s.nextButton = s.container.find(s.params.nextButton);
	                }
	            }
	            if (s.params.prevButton) {
	                s.prevButton = $(s.params.prevButton);
	                if (s.params.uniqueNavElements && typeof s.params.prevButton === 'string' && s.prevButton.length > 1 && s.container.find(s.params.prevButton).length === 1) {
	                    s.prevButton = s.container.find(s.params.prevButton);
	                }
	            }
	        }

	        // Is Horizontal
	        s.isHorizontal = function () {
	            return s.params.direction === 'horizontal';
	        };
	        // s.isH = isH;

	        // RTL
	        s.rtl = s.isHorizontal() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
	        if (s.rtl) {
	            s.classNames.push('swiper-container-rtl');
	        }

	        // Wrong RTL support
	        if (s.rtl) {
	            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
	        }

	        // Columns
	        if (s.params.slidesPerColumn > 1) {
	            s.classNames.push('swiper-container-multirow');
	        }

	        // Check for Android
	        if (s.device.android) {
	            s.classNames.push('swiper-container-android');
	        }

	        // Add classes
	        s.container.addClass(s.classNames.join(' '));

	        // Translate
	        s.translate = 0;

	        // Progress
	        s.progress = 0;

	        // Velocity
	        s.velocity = 0;

	        /*=========================
	          Locks, unlocks
	          ===========================*/
	        s.lockSwipeToNext = function () {
	            s.params.allowSwipeToNext = false;
	        };
	        s.lockSwipeToPrev = function () {
	            s.params.allowSwipeToPrev = false;
	        };
	        s.lockSwipes = function () {
	            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
	        };
	        s.unlockSwipeToNext = function () {
	            s.params.allowSwipeToNext = true;
	        };
	        s.unlockSwipeToPrev = function () {
	            s.params.allowSwipeToPrev = true;
	        };
	        s.unlockSwipes = function () {
	            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
	        };

	        /*=========================
	          Round helper
	          ===========================*/
	        function round(a) {
	            return Math.floor(a);
	        }
	        /*=========================
	          Set grab cursor
	          ===========================*/
	        if (s.params.grabCursor) {
	            s.container[0].style.cursor = 'move';
	            s.container[0].style.cursor = '-webkit-grab';
	            s.container[0].style.cursor = '-moz-grab';
	            s.container[0].style.cursor = 'grab';
	        }
	        /*=========================
	          Update on Images Ready
	          ===========================*/
	        s.imagesToLoad = [];
	        s.imagesLoaded = 0;

	        s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {
	            var image;
	            function onReady () {
	                if (callback) callback();
	            }
	            if (!imgElement.complete || !checkForComplete) {
	                if (src) {
	                    image = new window.Image();
	                    image.onload = onReady;
	                    image.onerror = onReady;
	                    if (srcset) {
	                        image.srcset = srcset;
	                    }
	                    if (src) {
	                        image.src = src;
	                    }
	                } else {
	                    onReady();
	                }

	            } else {//image already loaded...
	                onReady();
	            }
	        };
	        s.preloadImages = function () {
	            s.imagesToLoad = s.container.find('img');
	            function _onReady() {
	                if (typeof s === 'undefined' || s === null) return;
	                if (s.imagesLoaded !== undefined) s.imagesLoaded++;
	                if (s.imagesLoaded === s.imagesToLoad.length) {
	                    if (s.params.updateOnImagesReady) s.update();
	                    s.emit('onImagesReady', s);
	                }
	            }
	            for (var i = 0; i < s.imagesToLoad.length; i++) {
	                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), true, _onReady);
	            }
	        };

	        /*=========================
	          Autoplay
	          ===========================*/
	        s.autoplayTimeoutId = undefined;
	        s.autoplaying = false;
	        s.autoplayPaused = false;
	        function autoplay() {
	            s.autoplayTimeoutId = setTimeout(function () {
	                if (s.params.loop) {
	                    s.fixLoop();
	                    s._slideNext();
	                    s.emit('onAutoplay', s);
	                }
	                else {
	                    if (!s.isEnd) {
	                        s._slideNext();
	                        s.emit('onAutoplay', s);
	                    }
	                    else {
	                        if (!params.autoplayStopOnLast) {
	                            s._slideTo(0);
	                            s.emit('onAutoplay', s);
	                        }
	                        else {
	                            s.stopAutoplay();
	                        }
	                    }
	                }
	            }, s.params.autoplay);
	        }
	        s.startAutoplay = function () {
	            if (typeof s.autoplayTimeoutId !== 'undefined') return false;
	            if (!s.params.autoplay) return false;
	            if (s.autoplaying) return false;
	            s.autoplaying = true;
	            s.emit('onAutoplayStart', s);
	            autoplay();
	        };
	        s.stopAutoplay = function (internal) {
	            if (!s.autoplayTimeoutId) return;
	            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
	            s.autoplaying = false;
	            s.autoplayTimeoutId = undefined;
	            s.emit('onAutoplayStop', s);
	        };
	        s.pauseAutoplay = function (speed) {
	            if (s.autoplayPaused) return;
	            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
	            s.autoplayPaused = true;
	            if (speed === 0) {
	                s.autoplayPaused = false;
	                autoplay();
	            }
	            else {
	                s.wrapper.transitionEnd(function () {
	                    if (!s) return;
	                    s.autoplayPaused = false;
	                    if (!s.autoplaying) {
	                        s.stopAutoplay();
	                    }
	                    else {
	                        autoplay();
	                    }
	                });
	            }
	        };
	        /*=========================
	          Min/Max Translate
	          ===========================*/
	        s.minTranslate = function () {
	            return (-s.snapGrid[0]);
	        };
	        s.maxTranslate = function () {
	            return (-s.snapGrid[s.snapGrid.length - 1]);
	        };
	        /*=========================
	          Slider/slides sizes
	          ===========================*/
	        s.updateAutoHeight = function () {
	            // Update Height
	            var slide = s.slides.eq(s.activeIndex)[0];
	            if (typeof slide !== 'undefined') {
	                var newHeight = slide.offsetHeight;
	                if (newHeight) s.wrapper.css('height', newHeight + 'px');
	            }
	        };
	        s.updateContainerSize = function () {
	            var width, height;
	            if (typeof s.params.width !== 'undefined') {
	                width = s.params.width;
	            }
	            else {
	                width = s.container[0].clientWidth;
	            }
	            if (typeof s.params.height !== 'undefined') {
	                height = s.params.height;
	            }
	            else {
	                height = s.container[0].clientHeight;
	            }
	            if (width === 0 && s.isHorizontal() || height === 0 && !s.isHorizontal()) {
	                return;
	            }

	            //Subtract paddings
	            width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
	            height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);

	            // Store values
	            s.width = width;
	            s.height = height;
	            s.size = s.isHorizontal() ? s.width : s.height;
	        };

	        s.updateSlidesSize = function () {
	            s.slides = s.wrapper.children('.' + s.params.slideClass);
	            s.snapGrid = [];
	            s.slidesGrid = [];
	            s.slidesSizesGrid = [];

	            var spaceBetween = s.params.spaceBetween,
	                slidePosition = -s.params.slidesOffsetBefore,
	                i,
	                prevSlideSize = 0,
	                index = 0;
	            if (typeof s.size === 'undefined') return;
	            if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
	                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
	            }

	            s.virtualSize = -spaceBetween;
	            // reset margins
	            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
	            else s.slides.css({marginRight: '', marginBottom: ''});

	            var slidesNumberEvenToRows;
	            if (s.params.slidesPerColumn > 1) {
	                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
	                    slidesNumberEvenToRows = s.slides.length;
	                }
	                else {
	                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
	                }
	                if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
	                    slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
	                }
	            }

	            // Calc slides
	            var slideSize;
	            var slidesPerColumn = s.params.slidesPerColumn;
	            var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
	            var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
	            for (i = 0; i < s.slides.length; i++) {
	                slideSize = 0;
	                var slide = s.slides.eq(i);
	                if (s.params.slidesPerColumn > 1) {
	                    // Set slides order
	                    var newSlideOrderIndex;
	                    var column, row;
	                    if (s.params.slidesPerColumnFill === 'column') {
	                        column = Math.floor(i / slidesPerColumn);
	                        row = i - column * slidesPerColumn;
	                        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
	                            if (++row >= slidesPerColumn) {
	                                row = 0;
	                                column++;
	                            }
	                        }
	                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
	                        slide
	                            .css({
	                                '-webkit-box-ordinal-group': newSlideOrderIndex,
	                                '-moz-box-ordinal-group': newSlideOrderIndex,
	                                '-ms-flex-order': newSlideOrderIndex,
	                                '-webkit-order': newSlideOrderIndex,
	                                'order': newSlideOrderIndex
	                            });
	                    }
	                    else {
	                        row = Math.floor(i / slidesPerRow);
	                        column = i - row * slidesPerRow;
	                    }
	                    slide
	                        .css({
	                            'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
	                        })
	                        .attr('data-swiper-column', column)
	                        .attr('data-swiper-row', row);

	                }
	                if (slide.css('display') === 'none') continue;
	                if (s.params.slidesPerView === 'auto') {
	                    slideSize = s.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
	                    if (s.params.roundLengths) slideSize = round(slideSize);
	                }
	                else {
	                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
	                    if (s.params.roundLengths) slideSize = round(slideSize);

	                    if (s.isHorizontal()) {
	                        s.slides[i].style.width = slideSize + 'px';
	                    }
	                    else {
	                        s.slides[i].style.height = slideSize + 'px';
	                    }
	                }
	                s.slides[i].swiperSlideSize = slideSize;
	                s.slidesSizesGrid.push(slideSize);


	                if (s.params.centeredSlides) {
	                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
	                    if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
	                    if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
	                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
	                    s.slidesGrid.push(slidePosition);
	                }
	                else {
	                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
	                    s.slidesGrid.push(slidePosition);
	                    slidePosition = slidePosition + slideSize + spaceBetween;
	                }

	                s.virtualSize += slideSize + spaceBetween;

	                prevSlideSize = slideSize;

	                index ++;
	            }
	            s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
	            var newSlidesGrid;

	            if (
	                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
	                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
	            }
	            if (!s.support.flexbox || s.params.setWrapperSize) {
	                if (s.isHorizontal()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
	                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
	            }

	            if (s.params.slidesPerColumn > 1) {
	                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
	                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
	                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
	                if (s.params.centeredSlides) {
	                    newSlidesGrid = [];
	                    for (i = 0; i < s.snapGrid.length; i++) {
	                        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
	                    }
	                    s.snapGrid = newSlidesGrid;
	                }
	            }

	            // Remove last grid elements depending on width
	            if (!s.params.centeredSlides) {
	                newSlidesGrid = [];
	                for (i = 0; i < s.snapGrid.length; i++) {
	                    if (s.snapGrid[i] <= s.virtualSize - s.size) {
	                        newSlidesGrid.push(s.snapGrid[i]);
	                    }
	                }
	                s.snapGrid = newSlidesGrid;
	                if (Math.floor(s.virtualSize - s.size) - Math.floor(s.snapGrid[s.snapGrid.length - 1]) > 1) {
	                    s.snapGrid.push(s.virtualSize - s.size);
	                }
	            }
	            if (s.snapGrid.length === 0) s.snapGrid = [0];

	            if (s.params.spaceBetween !== 0) {
	                if (s.isHorizontal()) {
	                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
	                    else s.slides.css({marginRight: spaceBetween + 'px'});
	                }
	                else s.slides.css({marginBottom: spaceBetween + 'px'});
	            }
	            if (s.params.watchSlidesProgress) {
	                s.updateSlidesOffset();
	            }
	        };
	        s.updateSlidesOffset = function () {
	            for (var i = 0; i < s.slides.length; i++) {
	                s.slides[i].swiperSlideOffset = s.isHorizontal() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
	            }
	        };

	        /*=========================
	          Slider/slides progress
	          ===========================*/
	        s.updateSlidesProgress = function (translate) {
	            if (typeof translate === 'undefined') {
	                translate = s.translate || 0;
	            }
	            if (s.slides.length === 0) return;
	            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();

	            var offsetCenter = -translate;
	            if (s.rtl) offsetCenter = translate;

	            // Visible Slides
	            s.slides.removeClass(s.params.slideVisibleClass);
	            for (var i = 0; i < s.slides.length; i++) {
	                var slide = s.slides[i];
	                var slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
	                if (s.params.watchSlidesVisibility) {
	                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
	                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
	                    var isVisible =
	                        (slideBefore >= 0 && slideBefore < s.size) ||
	                        (slideAfter > 0 && slideAfter <= s.size) ||
	                        (slideBefore <= 0 && slideAfter >= s.size);
	                    if (isVisible) {
	                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
	                    }
	                }
	                slide.progress = s.rtl ? -slideProgress : slideProgress;
	            }
	        };
	        s.updateProgress = function (translate) {
	            if (typeof translate === 'undefined') {
	                translate = s.translate || 0;
	            }
	            var translatesDiff = s.maxTranslate() - s.minTranslate();
	            var wasBeginning = s.isBeginning;
	            var wasEnd = s.isEnd;
	            if (translatesDiff === 0) {
	                s.progress = 0;
	                s.isBeginning = s.isEnd = true;
	            }
	            else {
	                s.progress = (translate - s.minTranslate()) / (translatesDiff);
	                s.isBeginning = s.progress <= 0;
	                s.isEnd = s.progress >= 1;
	            }
	            if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
	            if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);

	            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
	            s.emit('onProgress', s, s.progress);
	        };
	        s.updateActiveIndex = function () {
	            var translate = s.rtl ? s.translate : -s.translate;
	            var newActiveIndex, i, snapIndex;
	            for (i = 0; i < s.slidesGrid.length; i ++) {
	                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
	                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
	                        newActiveIndex = i;
	                    }
	                    else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
	                        newActiveIndex = i + 1;
	                    }
	                }
	                else {
	                    if (translate >= s.slidesGrid[i]) {
	                        newActiveIndex = i;
	                    }
	                }
	            }
	            // Normalize slideIndex
	            if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
	            // for (i = 0; i < s.slidesGrid.length; i++) {
	                // if (- translate >= s.slidesGrid[i]) {
	                    // newActiveIndex = i;
	                // }
	            // }
	            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
	            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;

	            if (newActiveIndex === s.activeIndex) {
	                return;
	            }
	            s.snapIndex = snapIndex;
	            s.previousIndex = s.activeIndex;
	            s.activeIndex = newActiveIndex;
	            s.updateClasses();
	        };

	        /*=========================
	          Classes
	          ===========================*/
	        s.updateClasses = function () {
	            s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
	            var activeSlide = s.slides.eq(s.activeIndex);
	            // Active classes
	            activeSlide.addClass(s.params.slideActiveClass);
	            // Next Slide
	            var nextSlide = activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
	            if (s.params.loop && nextSlide.length === 0) {
	                s.slides.eq(0).addClass(s.params.slideNextClass);
	            }
	            // Prev Slide
	            var prevSlide = activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);
	            if (s.params.loop && prevSlide.length === 0) {
	                s.slides.eq(-1).addClass(s.params.slidePrevClass);
	            }

	            // Pagination
	            if (s.paginationContainer && s.paginationContainer.length > 0) {
	                // Current/Total
	                var current,
	                    total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
	                if (s.params.loop) {
	                    current = Math.ceil((s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup);
	                    if (current > s.slides.length - 1 - s.loopedSlides * 2) {
	                        current = current - (s.slides.length - s.loopedSlides * 2);
	                    }
	                    if (current > total - 1) current = current - total;
	                    if (current < 0 && s.params.paginationType !== 'bullets') current = total + current;
	                }
	                else {
	                    if (typeof s.snapIndex !== 'undefined') {
	                        current = s.snapIndex;
	                    }
	                    else {
	                        current = s.activeIndex || 0;
	                    }
	                }
	                // Types
	                if (s.params.paginationType === 'bullets' && s.bullets && s.bullets.length > 0) {
	                    s.bullets.removeClass(s.params.bulletActiveClass);
	                    if (s.paginationContainer.length > 1) {
	                        s.bullets.each(function () {
	                            if ($(this).index() === current) $(this).addClass(s.params.bulletActiveClass);
	                        });
	                    }
	                    else {
	                        s.bullets.eq(current).addClass(s.params.bulletActiveClass);
	                    }
	                }
	                if (s.params.paginationType === 'fraction') {
	                    s.paginationContainer.find('.' + s.params.paginationCurrentClass).text(current + 1);
	                    s.paginationContainer.find('.' + s.params.paginationTotalClass).text(total);
	                }
	                if (s.params.paginationType === 'progress') {
	                    var scale = (current + 1) / total,
	                        scaleX = scale,
	                        scaleY = 1;
	                    if (!s.isHorizontal()) {
	                        scaleY = scale;
	                        scaleX = 1;
	                    }
	                    s.paginationContainer.find('.' + s.params.paginationProgressbarClass).transform('translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')').transition(s.params.speed);
	                }
	                if (s.params.paginationType === 'custom' && s.params.paginationCustomRender) {
	                    s.paginationContainer.html(s.params.paginationCustomRender(s, current + 1, total));
	                    s.emit('onPaginationRendered', s, s.paginationContainer[0]);
	                }
	            }

	            // Next/active buttons
	            if (!s.params.loop) {
	                if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
	                    if (s.isBeginning) {
	                        s.prevButton.addClass(s.params.buttonDisabledClass);
	                        if (s.params.a11y && s.a11y) s.a11y.disable(s.prevButton);
	                    }
	                    else {
	                        s.prevButton.removeClass(s.params.buttonDisabledClass);
	                        if (s.params.a11y && s.a11y) s.a11y.enable(s.prevButton);
	                    }
	                }
	                if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
	                    if (s.isEnd) {
	                        s.nextButton.addClass(s.params.buttonDisabledClass);
	                        if (s.params.a11y && s.a11y) s.a11y.disable(s.nextButton);
	                    }
	                    else {
	                        s.nextButton.removeClass(s.params.buttonDisabledClass);
	                        if (s.params.a11y && s.a11y) s.a11y.enable(s.nextButton);
	                    }
	                }
	            }
	        };

	        /*=========================
	          Pagination
	          ===========================*/
	        s.updatePagination = function () {
	            if (!s.params.pagination) return;
	            if (s.paginationContainer && s.paginationContainer.length > 0) {
	                var paginationHTML = '';
	                if (s.params.paginationType === 'bullets') {
	                    var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
	                    for (var i = 0; i < numberOfBullets; i++) {
	                        if (s.params.paginationBulletRender) {
	                            paginationHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
	                        }
	                        else {
	                            paginationHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
	                        }
	                    }
	                    s.paginationContainer.html(paginationHTML);
	                    s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
	                    if (s.params.paginationClickable && s.params.a11y && s.a11y) {
	                        s.a11y.initPagination();
	                    }
	                }
	                if (s.params.paginationType === 'fraction') {
	                    if (s.params.paginationFractionRender) {
	                        paginationHTML = s.params.paginationFractionRender(s, s.params.paginationCurrentClass, s.params.paginationTotalClass);
	                    }
	                    else {
	                        paginationHTML =
	                            '<span class="' + s.params.paginationCurrentClass + '"></span>' +
	                            ' / ' +
	                            '<span class="' + s.params.paginationTotalClass+'"></span>';
	                    }
	                    s.paginationContainer.html(paginationHTML);
	                }
	                if (s.params.paginationType === 'progress') {
	                    if (s.params.paginationProgressRender) {
	                        paginationHTML = s.params.paginationProgressRender(s, s.params.paginationProgressbarClass);
	                    }
	                    else {
	                        paginationHTML = '<span class="' + s.params.paginationProgressbarClass + '"></span>';
	                    }
	                    s.paginationContainer.html(paginationHTML);
	                }
	                if (s.params.paginationType !== 'custom') {
	                    s.emit('onPaginationRendered', s, s.paginationContainer[0]);
	                }
	            }
	        };
	        /*=========================
	          Common update method
	          ===========================*/
	        s.update = function (updateTranslate) {
	            s.updateContainerSize();
	            s.updateSlidesSize();
	            s.updateProgress();
	            s.updatePagination();
	            s.updateClasses();
	            if (s.params.scrollbar && s.scrollbar) {
	                s.scrollbar.set();
	            }
	            function forceSetTranslate() {
	                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
	                s.setWrapperTranslate(newTranslate);
	                s.updateActiveIndex();
	                s.updateClasses();
	            }
	            if (updateTranslate) {
	                var translated, newTranslate;
	                if (s.controller && s.controller.spline) {
	                    s.controller.spline = undefined;
	                }
	                if (s.params.freeMode) {
	                    forceSetTranslate();
	                    if (s.params.autoHeight) {
	                        s.updateAutoHeight();
	                    }
	                }
	                else {
	                    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
	                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
	                    }
	                    else {
	                        translated = s.slideTo(s.activeIndex, 0, false, true);
	                    }
	                    if (!translated) {
	                        forceSetTranslate();
	                    }
	                }
	            }
	            else if (s.params.autoHeight) {
	                s.updateAutoHeight();
	            }
	        };

	        /*=========================
	          Resize Handler
	          ===========================*/
	        s.onResize = function (forceUpdatePagination) {
	            //Breakpoints
	            if (s.params.breakpoints) {
	                s.setBreakpoint();
	            }

	            // Disable locks on resize
	            var allowSwipeToPrev = s.params.allowSwipeToPrev;
	            var allowSwipeToNext = s.params.allowSwipeToNext;
	            s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;

	            s.updateContainerSize();
	            s.updateSlidesSize();
	            if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
	            if (s.params.scrollbar && s.scrollbar) {
	                s.scrollbar.set();
	            }
	            if (s.controller && s.controller.spline) {
	                s.controller.spline = undefined;
	            }
	            var slideChangedBySlideTo = false;
	            if (s.params.freeMode) {
	                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
	                s.setWrapperTranslate(newTranslate);
	                s.updateActiveIndex();
	                s.updateClasses();

	                if (s.params.autoHeight) {
	                    s.updateAutoHeight();
	                }
	            }
	            else {
	                s.updateClasses();
	                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
	                    slideChangedBySlideTo = s.slideTo(s.slides.length - 1, 0, false, true);
	                }
	                else {
	                    slideChangedBySlideTo = s.slideTo(s.activeIndex, 0, false, true);
	                }
	            }
	            if (s.params.lazyLoading && !slideChangedBySlideTo && s.lazy) {
	                s.lazy.load();
	            }
	            // Return locks after resize
	            s.params.allowSwipeToPrev = allowSwipeToPrev;
	            s.params.allowSwipeToNext = allowSwipeToNext;
	        };

	        /*=========================
	          Events
	          ===========================*/

	        //Define Touch Events
	        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
	        if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
	        else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
	        s.touchEvents = {
	            start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
	            move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
	            end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
	        };


	        // WP8 Touch Events Fix
	        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
	            (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
	        }

	        // Attach/detach events
	        s.initEvents = function (detach) {
	            var actionDom = detach ? 'off' : 'on';
	            var action = detach ? 'removeEventListener' : 'addEventListener';
	            var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
	            var target = s.support.touch ? touchEventsTarget : document;

	            var moveCapture = s.params.nested ? true : false;

	            //Touch Events
	            if (s.browser.ie) {
	                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
	                target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
	                target[action](s.touchEvents.end, s.onTouchEnd, false);
	            }
	            else {
	                if (s.support.touch) {
	                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
	                    touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
	                    touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false);
	                }
	                if (params.simulateTouch && !s.device.ios && !s.device.android) {
	                    touchEventsTarget[action]('mousedown', s.onTouchStart, false);
	                    document[action]('mousemove', s.onTouchMove, moveCapture);
	                    document[action]('mouseup', s.onTouchEnd, false);
	                }
	            }
	            window[action]('resize', s.onResize);

	            // Next, Prev, Index
	            if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
	                s.nextButton[actionDom]('click', s.onClickNext);
	                if (s.params.a11y && s.a11y) s.nextButton[actionDom]('keydown', s.a11y.onEnterKey);
	            }
	            if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
	                s.prevButton[actionDom]('click', s.onClickPrev);
	                if (s.params.a11y && s.a11y) s.prevButton[actionDom]('keydown', s.a11y.onEnterKey);
	            }
	            if (s.params.pagination && s.params.paginationClickable) {
	                s.paginationContainer[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
	                if (s.params.a11y && s.a11y) s.paginationContainer[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
	            }

	            // Prevent Links Clicks
	            if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
	        };
	        s.attachEvents = function () {
	            s.initEvents();
	        };
	        s.detachEvents = function () {
	            s.initEvents(true);
	        };

	        /*=========================
	          Handle Clicks
	          ===========================*/
	        // Prevent Clicks
	        s.allowClick = true;
	        s.preventClicks = function (e) {
	            if (!s.allowClick) {
	                if (s.params.preventClicks) e.preventDefault();
	                if (s.params.preventClicksPropagation && s.animating) {
	                    e.stopPropagation();
	                    e.stopImmediatePropagation();
	                }
	            }
	        };
	        // Clicks
	        s.onClickNext = function (e) {
	            e.preventDefault();
	            if (s.isEnd && !s.params.loop) return;
	            s.slideNext();
	        };
	        s.onClickPrev = function (e) {
	            e.preventDefault();
	            if (s.isBeginning && !s.params.loop) return;
	            s.slidePrev();
	        };
	        s.onClickIndex = function (e) {
	            e.preventDefault();
	            var index = $(this).index() * s.params.slidesPerGroup;
	            if (s.params.loop) index = index + s.loopedSlides;
	            s.slideTo(index);
	        };

	        /*=========================
	          Handle Touches
	          ===========================*/
	        function findElementInEvent(e, selector) {
	            var el = $(e.target);
	            if (!el.is(selector)) {
	                if (typeof selector === 'string') {
	                    el = el.parents(selector);
	                }
	                else if (selector.nodeType) {
	                    var found;
	                    el.parents().each(function (index, _el) {
	                        if (_el === selector) found = selector;
	                    });
	                    if (!found) return undefined;
	                    else return selector;
	                }
	            }
	            if (el.length === 0) {
	                return undefined;
	            }
	            return el[0];
	        }
	        s.updateClickedSlide = function (e) {
	            var slide = findElementInEvent(e, '.' + s.params.slideClass);
	            var slideFound = false;
	            if (slide) {
	                for (var i = 0; i < s.slides.length; i++) {
	                    if (s.slides[i] === slide) slideFound = true;
	                }
	            }

	            if (slide && slideFound) {
	                s.clickedSlide = slide;
	                s.clickedIndex = $(slide).index();
	            }
	            else {
	                s.clickedSlide = undefined;
	                s.clickedIndex = undefined;
	                return;
	            }
	            if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
	                var slideToIndex = s.clickedIndex,
	                    realIndex,
	                    duplicatedSlides;
	                if (s.params.loop) {
	                    if (s.animating) return;
	                    realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
	                    if (s.params.centeredSlides) {
	                        if ((slideToIndex < s.loopedSlides - s.params.slidesPerView/2) || (slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView/2)) {
	                            s.fixLoop();
	                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
	                            setTimeout(function () {
	                                s.slideTo(slideToIndex);
	                            }, 0);
	                        }
	                        else {
	                            s.slideTo(slideToIndex);
	                        }
	                    }
	                    else {
	                        if (slideToIndex > s.slides.length - s.params.slidesPerView) {
	                            s.fixLoop();
	                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
	                            setTimeout(function () {
	                                s.slideTo(slideToIndex);
	                            }, 0);
	                        }
	                        else {
	                            s.slideTo(slideToIndex);
	                        }
	                    }
	                }
	                else {
	                    s.slideTo(slideToIndex);
	                }
	            }
	        };

	        var isTouched,
	            isMoved,
	            allowTouchCallbacks,
	            touchStartTime,
	            isScrolling,
	            currentTranslate,
	            startTranslate,
	            allowThresholdMove,
	            // Form elements to match
	            formElements = 'input, select, textarea, button',
	            // Last click time
	            lastClickTime = Date.now(), clickTimeout,
	            //Velocities
	            velocities = [],
	            allowMomentumBounce;

	        // Animating Flag
	        s.animating = false;

	        // Touches information
	        s.touches = {
	            startX: 0,
	            startY: 0,
	            currentX: 0,
	            currentY: 0,
	            diff: 0
	        };

	        // Touch handlers
	        var isTouchEvent, startMoving;
	        s.onTouchStart = function (e) {
	            if (e.originalEvent) e = e.originalEvent;
	            isTouchEvent = e.type === 'touchstart';
	            if (!isTouchEvent && 'which' in e && e.which === 3) return;
	            if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
	                s.allowClick = true;
	                return;
	            }
	            if (s.params.swipeHandler) {
	                if (!findElementInEvent(e, s.params.swipeHandler)) return;
	            }

	            var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
	            var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;

	            // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
	            if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
	                return;
	            }

	            isTouched = true;
	            isMoved = false;
	            allowTouchCallbacks = true;
	            isScrolling = undefined;
	            startMoving = undefined;
	            s.touches.startX = startX;
	            s.touches.startY = startY;
	            touchStartTime = Date.now();
	            s.allowClick = true;
	            s.updateContainerSize();
	            s.swipeDirection = undefined;
	            if (s.params.threshold > 0) allowThresholdMove = false;
	            if (e.type !== 'touchstart') {
	                var preventDefault = true;
	                if ($(e.target).is(formElements)) preventDefault = false;
	                if (document.activeElement && $(document.activeElement).is(formElements)) {
	                    document.activeElement.blur();
	                }
	                if (preventDefault) {
	                    e.preventDefault();
	                }
	            }
	            s.emit('onTouchStart', s, e);
	        };

	        s.onTouchMove = function (e) {
	            if (e.originalEvent) e = e.originalEvent;
	            if (isTouchEvent && e.type === 'mousemove') return;
	            if (e.preventedByNestedSwiper) {
	                s.touches.startX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
	                s.touches.startY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
	                return;
	            }
	            if (s.params.onlyExternal) {
	                // isMoved = true;
	                s.allowClick = false;
	                if (isTouched) {
	                    s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
	                    s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
	                    touchStartTime = Date.now();
	                }
	                return;
	            }
	            if (isTouchEvent && document.activeElement) {
	                if (e.target === document.activeElement && $(e.target).is(formElements)) {
	                    isMoved = true;
	                    s.allowClick = false;
	                    return;
	                }
	            }
	            if (allowTouchCallbacks) {
	                s.emit('onTouchMove', s, e);
	            }
	            if (e.targetTouches && e.targetTouches.length > 1) return;

	            s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
	            s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

	            if (typeof isScrolling === 'undefined') {
	                var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
	                isScrolling = s.isHorizontal() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
	            }
	            if (isScrolling) {
	                s.emit('onTouchMoveOpposite', s, e);
	            }
	            if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
	                if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
	                    startMoving = true;
	                }
	            }
	            if (!isTouched) return;
	            if (isScrolling)  {
	                isTouched = false;
	                return;
	            }
	            if (!startMoving && s.browser.ieTouch) {
	                return;
	            }
	            s.allowClick = false;
	            s.emit('onSliderMove', s, e);
	            e.preventDefault();
	            if (s.params.touchMoveStopPropagation && !s.params.nested) {
	                e.stopPropagation();
	            }

	            if (!isMoved) {
	                if (params.loop) {
	                    s.fixLoop();
	                }
	                startTranslate = s.getWrapperTranslate();
	                s.setWrapperTransition(0);
	                if (s.animating) {
	                    s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
	                }
	                if (s.params.autoplay && s.autoplaying) {
	                    if (s.params.autoplayDisableOnInteraction) {
	                        s.stopAutoplay();
	                    }
	                    else {
	                        s.pauseAutoplay();
	                    }
	                }
	                allowMomentumBounce = false;
	                //Grab Cursor
	                if (s.params.grabCursor) {
	                    s.container[0].style.cursor = 'move';
	                    s.container[0].style.cursor = '-webkit-grabbing';
	                    s.container[0].style.cursor = '-moz-grabbin';
	                    s.container[0].style.cursor = 'grabbing';
	                }
	            }
	            isMoved = true;

	            var diff = s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;

	            diff = diff * s.params.touchRatio;
	            if (s.rtl) diff = -diff;

	            s.swipeDirection = diff > 0 ? 'prev' : 'next';
	            currentTranslate = diff + startTranslate;

	            var disableParentSwiper = true;
	            if ((diff > 0 && currentTranslate > s.minTranslate())) {
	                disableParentSwiper = false;
	                if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
	            }
	            else if (diff < 0 && currentTranslate < s.maxTranslate()) {
	                disableParentSwiper = false;
	                if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
	            }

	            if (disableParentSwiper) {
	                e.preventedByNestedSwiper = true;
	            }

	            // Directions locks
	            if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
	                currentTranslate = startTranslate;
	            }
	            if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
	                currentTranslate = startTranslate;
	            }

	            if (!s.params.followFinger) return;

	            // Threshold
	            if (s.params.threshold > 0) {
	                if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
	                    if (!allowThresholdMove) {
	                        allowThresholdMove = true;
	                        s.touches.startX = s.touches.currentX;
	                        s.touches.startY = s.touches.currentY;
	                        currentTranslate = startTranslate;
	                        s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
	                        return;
	                    }
	                }
	                else {
	                    currentTranslate = startTranslate;
	                    return;
	                }
	            }
	            // Update active index in free mode
	            if (s.params.freeMode || s.params.watchSlidesProgress) {
	                s.updateActiveIndex();
	            }
	            if (s.params.freeMode) {
	                //Velocity
	                if (velocities.length === 0) {
	                    velocities.push({
	                        position: s.touches[s.isHorizontal() ? 'startX' : 'startY'],
	                        time: touchStartTime
	                    });
	                }
	                velocities.push({
	                    position: s.touches[s.isHorizontal() ? 'currentX' : 'currentY'],
	                    time: (new window.Date()).getTime()
	                });
	            }
	            // Update progress
	            s.updateProgress(currentTranslate);
	            // Update translate
	            s.setWrapperTranslate(currentTranslate);
	        };
	        s.onTouchEnd = function (e) {
	            if (e.originalEvent) e = e.originalEvent;
	            if (allowTouchCallbacks) {
	                s.emit('onTouchEnd', s, e);
	            }
	            allowTouchCallbacks = false;
	            if (!isTouched) return;
	            //Return Grab Cursor
	            if (s.params.grabCursor && isMoved && isTouched) {
	                s.container[0].style.cursor = 'move';
	                s.container[0].style.cursor = '-webkit-grab';
	                s.container[0].style.cursor = '-moz-grab';
	                s.container[0].style.cursor = 'grab';
	            }

	            // Time diff
	            var touchEndTime = Date.now();
	            var timeDiff = touchEndTime - touchStartTime;

	            // Tap, doubleTap, Click
	            if (s.allowClick) {
	                s.updateClickedSlide(e);
	                s.emit('onTap', s, e);
	                if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
	                    if (clickTimeout) clearTimeout(clickTimeout);
	                    clickTimeout = setTimeout(function () {
	                        if (!s) return;
	                        if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
	                            s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
	                        }
	                        s.emit('onClick', s, e);
	                    }, 300);

	                }
	                if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
	                    if (clickTimeout) clearTimeout(clickTimeout);
	                    s.emit('onDoubleTap', s, e);
	                }
	            }

	            lastClickTime = Date.now();
	            setTimeout(function () {
	                if (s) s.allowClick = true;
	            }, 0);

	            if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
	                isTouched = isMoved = false;
	                return;
	            }
	            isTouched = isMoved = false;

	            var currentPos;
	            if (s.params.followFinger) {
	                currentPos = s.rtl ? s.translate : -s.translate;
	            }
	            else {
	                currentPos = -currentTranslate;
	            }
	            if (s.params.freeMode) {
	                if (currentPos < -s.minTranslate()) {
	                    s.slideTo(s.activeIndex);
	                    return;
	                }
	                else if (currentPos > -s.maxTranslate()) {
	                    if (s.slides.length < s.snapGrid.length) {
	                        s.slideTo(s.snapGrid.length - 1);
	                    }
	                    else {
	                        s.slideTo(s.slides.length - 1);
	                    }
	                    return;
	                }

	                if (s.params.freeModeMomentum) {
	                    if (velocities.length > 1) {
	                        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();

	                        var distance = lastMoveEvent.position - velocityEvent.position;
	                        var time = lastMoveEvent.time - velocityEvent.time;
	                        s.velocity = distance / time;
	                        s.velocity = s.velocity / 2;
	                        if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
	                            s.velocity = 0;
	                        }
	                        // this implies that the user stopped moving a finger then released.
	                        // There would be no events with distance zero, so the last event is stale.
	                        if (time > 150 || (new window.Date().getTime() - lastMoveEvent.time) > 300) {
	                            s.velocity = 0;
	                        }
	                    } else {
	                        s.velocity = 0;
	                    }

	                    velocities.length = 0;
	                    var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
	                    var momentumDistance = s.velocity * momentumDuration;

	                    var newPosition = s.translate + momentumDistance;
	                    if (s.rtl) newPosition = - newPosition;
	                    var doBounce = false;
	                    var afterBouncePosition;
	                    var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
	                    if (newPosition < s.maxTranslate()) {
	                        if (s.params.freeModeMomentumBounce) {
	                            if (newPosition + s.maxTranslate() < -bounceAmount) {
	                                newPosition = s.maxTranslate() - bounceAmount;
	                            }
	                            afterBouncePosition = s.maxTranslate();
	                            doBounce = true;
	                            allowMomentumBounce = true;
	                        }
	                        else {
	                            newPosition = s.maxTranslate();
	                        }
	                    }
	                    else if (newPosition > s.minTranslate()) {
	                        if (s.params.freeModeMomentumBounce) {
	                            if (newPosition - s.minTranslate() > bounceAmount) {
	                                newPosition = s.minTranslate() + bounceAmount;
	                            }
	                            afterBouncePosition = s.minTranslate();
	                            doBounce = true;
	                            allowMomentumBounce = true;
	                        }
	                        else {
	                            newPosition = s.minTranslate();
	                        }
	                    }
	                    else if (s.params.freeModeSticky) {
	                        var j = 0,
	                            nextSlide;
	                        for (j = 0; j < s.snapGrid.length; j += 1) {
	                            if (s.snapGrid[j] > -newPosition) {
	                                nextSlide = j;
	                                break;
	                            }

	                        }
	                        if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
	                            newPosition = s.snapGrid[nextSlide];
	                        } else {
	                            newPosition = s.snapGrid[nextSlide - 1];
	                        }
	                        if (!s.rtl) newPosition = - newPosition;
	                    }
	                    //Fix duration
	                    if (s.velocity !== 0) {
	                        if (s.rtl) {
	                            momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
	                        }
	                        else {
	                            momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
	                        }
	                    }
	                    else if (s.params.freeModeSticky) {
	                        s.slideReset();
	                        return;
	                    }

	                    if (s.params.freeModeMomentumBounce && doBounce) {
	                        s.updateProgress(afterBouncePosition);
	                        s.setWrapperTransition(momentumDuration);
	                        s.setWrapperTranslate(newPosition);
	                        s.onTransitionStart();
	                        s.animating = true;
	                        s.wrapper.transitionEnd(function () {
	                            if (!s || !allowMomentumBounce) return;
	                            s.emit('onMomentumBounce', s);

	                            s.setWrapperTransition(s.params.speed);
	                            s.setWrapperTranslate(afterBouncePosition);
	                            s.wrapper.transitionEnd(function () {
	                                if (!s) return;
	                                s.onTransitionEnd();
	                            });
	                        });
	                    } else if (s.velocity) {
	                        s.updateProgress(newPosition);
	                        s.setWrapperTransition(momentumDuration);
	                        s.setWrapperTranslate(newPosition);
	                        s.onTransitionStart();
	                        if (!s.animating) {
	                            s.animating = true;
	                            s.wrapper.transitionEnd(function () {
	                                if (!s) return;
	                                s.onTransitionEnd();
	                            });
	                        }

	                    } else {
	                        s.updateProgress(newPosition);
	                    }

	                    s.updateActiveIndex();
	                }
	                if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
	                    s.updateProgress();
	                    s.updateActiveIndex();
	                }
	                return;
	            }

	            // Find current slide
	            var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
	            for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
	                if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
	                    if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
	                        stopIndex = i;
	                        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
	                    }
	                }
	                else {
	                    if (currentPos >= s.slidesGrid[i]) {
	                        stopIndex = i;
	                        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
	                    }
	                }
	            }

	            // Find current slide size
	            var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;

	            if (timeDiff > s.params.longSwipesMs) {
	                // Long touches
	                if (!s.params.longSwipes) {
	                    s.slideTo(s.activeIndex);
	                    return;
	                }
	                if (s.swipeDirection === 'next') {
	                    if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
	                    else s.slideTo(stopIndex);

	                }
	                if (s.swipeDirection === 'prev') {
	                    if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
	                    else s.slideTo(stopIndex);
	                }
	            }
	            else {
	                // Short swipes
	                if (!s.params.shortSwipes) {
	                    s.slideTo(s.activeIndex);
	                    return;
	                }
	                if (s.swipeDirection === 'next') {
	                    s.slideTo(stopIndex + s.params.slidesPerGroup);

	                }
	                if (s.swipeDirection === 'prev') {
	                    s.slideTo(stopIndex);
	                }
	            }
	        };
	        /*=========================
	          Transitions
	          ===========================*/
	        s._slideTo = function (slideIndex, speed) {
	            return s.slideTo(slideIndex, speed, true, true);
	        };
	        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
	            if (typeof runCallbacks === 'undefined') runCallbacks = true;
	            if (typeof slideIndex === 'undefined') slideIndex = 0;
	            if (slideIndex < 0) slideIndex = 0;
	            s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
	            if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;

	            var translate = - s.snapGrid[s.snapIndex];
	            // Stop autoplay
	            if (s.params.autoplay && s.autoplaying) {
	                if (internal || !s.params.autoplayDisableOnInteraction) {
	                    s.pauseAutoplay(speed);
	                }
	                else {
	                    s.stopAutoplay();
	                }
	            }
	            // Update progress
	            s.updateProgress(translate);

	            // Normalize slideIndex
	            for (var i = 0; i < s.slidesGrid.length; i++) {
	                if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
	                    slideIndex = i;
	                }
	            }

	            // Directions locks
	            if (!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()) {
	                return false;
	            }
	            if (!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()) {
	                if ((s.activeIndex || 0) !== slideIndex ) return false;
	            }

	            // Update Index
	            if (typeof speed === 'undefined') speed = s.params.speed;
	            s.previousIndex = s.activeIndex || 0;
	            s.activeIndex = slideIndex;

	            if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
	                // Update Height
	                if (s.params.autoHeight) {
	                    s.updateAutoHeight();
	                }
	                s.updateClasses();
	                if (s.params.effect !== 'slide') {
	                    s.setWrapperTranslate(translate);
	                }
	                return false;
	            }
	            s.updateClasses();
	            s.onTransitionStart(runCallbacks);

	            if (speed === 0) {
	                s.setWrapperTranslate(translate);
	                s.setWrapperTransition(0);
	                s.onTransitionEnd(runCallbacks);
	            }
	            else {
	                s.setWrapperTranslate(translate);
	                s.setWrapperTransition(speed);
	                if (!s.animating) {
	                    s.animating = true;
	                    s.wrapper.transitionEnd(function () {
	                        if (!s) return;
	                        s.onTransitionEnd(runCallbacks);
	                    });
	                }

	            }

	            return true;
	        };

	        s.onTransitionStart = function (runCallbacks) {
	            if (typeof runCallbacks === 'undefined') runCallbacks = true;
	            if (s.params.autoHeight) {
	                s.updateAutoHeight();
	            }
	            if (s.lazy) s.lazy.onTransitionStart();
	            if (runCallbacks) {
	                s.emit('onTransitionStart', s);
	                if (s.activeIndex !== s.previousIndex) {
	                    s.emit('onSlideChangeStart', s);
	                    if (s.activeIndex > s.previousIndex) {
	                        s.emit('onSlideNextStart', s);
	                    }
	                    else {
	                        s.emit('onSlidePrevStart', s);
	                    }
	                }

	            }
	        };
	        s.onTransitionEnd = function (runCallbacks) {
	            s.animating = false;
	            s.setWrapperTransition(0);
	            if (typeof runCallbacks === 'undefined') runCallbacks = true;
	            if (s.lazy) s.lazy.onTransitionEnd();
	            if (runCallbacks) {
	                s.emit('onTransitionEnd', s);
	                if (s.activeIndex !== s.previousIndex) {
	                    s.emit('onSlideChangeEnd', s);
	                    if (s.activeIndex > s.previousIndex) {
	                        s.emit('onSlideNextEnd', s);
	                    }
	                    else {
	                        s.emit('onSlidePrevEnd', s);
	                    }
	                }
	            }
	            if (s.params.hashnav && s.hashnav) {
	                s.hashnav.setHash();
	            }

	        };
	        s.slideNext = function (runCallbacks, speed, internal) {
	            if (s.params.loop) {
	                if (s.animating) return false;
	                s.fixLoop();
	                var clientLeft = s.container[0].clientLeft;
	                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
	            }
	            else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
	        };
	        s._slideNext = function (speed) {
	            return s.slideNext(true, speed, true);
	        };
	        s.slidePrev = function (runCallbacks, speed, internal) {
	            if (s.params.loop) {
	                if (s.animating) return false;
	                s.fixLoop();
	                var clientLeft = s.container[0].clientLeft;
	                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
	            }
	            else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
	        };
	        s._slidePrev = function (speed) {
	            return s.slidePrev(true, speed, true);
	        };
	        s.slideReset = function (runCallbacks, speed, internal) {
	            return s.slideTo(s.activeIndex, speed, runCallbacks);
	        };

	        /*=========================
	          Translate/transition helpers
	          ===========================*/
	        s.setWrapperTransition = function (duration, byController) {
	            s.wrapper.transition(duration);
	            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
	                s.effects[s.params.effect].setTransition(duration);
	            }
	            if (s.params.parallax && s.parallax) {
	                s.parallax.setTransition(duration);
	            }
	            if (s.params.scrollbar && s.scrollbar) {
	                s.scrollbar.setTransition(duration);
	            }
	            if (s.params.control && s.controller) {
	                s.controller.setTransition(duration, byController);
	            }
	            s.emit('onSetTransition', s, duration);
	        };
	        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
	            var x = 0, y = 0, z = 0;
	            if (s.isHorizontal()) {
	                x = s.rtl ? -translate : translate;
	            }
	            else {
	                y = translate;
	            }

	            if (s.params.roundLengths) {
	                x = round(x);
	                y = round(y);
	            }

	            if (!s.params.virtualTranslate) {
	                if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
	                else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
	            }

	            s.translate = s.isHorizontal() ? x : y;

	            // Check if we need to update progress
	            var progress;
	            var translatesDiff = s.maxTranslate() - s.minTranslate();
	            if (translatesDiff === 0) {
	                progress = 0;
	            }
	            else {
	                progress = (translate - s.minTranslate()) / (translatesDiff);
	            }
	            if (progress !== s.progress) {
	                s.updateProgress(translate);
	            }

	            if (updateActiveIndex) s.updateActiveIndex();
	            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
	                s.effects[s.params.effect].setTranslate(s.translate);
	            }
	            if (s.params.parallax && s.parallax) {
	                s.parallax.setTranslate(s.translate);
	            }
	            if (s.params.scrollbar && s.scrollbar) {
	                s.scrollbar.setTranslate(s.translate);
	            }
	            if (s.params.control && s.controller) {
	                s.controller.setTranslate(s.translate, byController);
	            }
	            s.emit('onSetTranslate', s, s.translate);
	        };

	        s.getTranslate = function (el, axis) {
	            var matrix, curTransform, curStyle, transformMatrix;

	            // automatic axis detection
	            if (typeof axis === 'undefined') {
	                axis = 'x';
	            }

	            if (s.params.virtualTranslate) {
	                return s.rtl ? -s.translate : s.translate;
	            }

	            curStyle = window.getComputedStyle(el, null);
	            if (window.WebKitCSSMatrix) {
	                curTransform = curStyle.transform || curStyle.webkitTransform;
	                if (curTransform.split(',').length > 6) {
	                    curTransform = curTransform.split(', ').map(function(a){
	                        return a.replace(',','.');
	                    }).join(', ');
	                }
	                // Some old versions of Webkit choke when 'none' is passed; pass
	                // empty string instead in this case
	                transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
	            }
	            else {
	                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
	                matrix = transformMatrix.toString().split(',');
	            }

	            if (axis === 'x') {
	                //Latest Chrome and webkits Fix
	                if (window.WebKitCSSMatrix)
	                    curTransform = transformMatrix.m41;
	                //Crazy IE10 Matrix
	                else if (matrix.length === 16)
	                    curTransform = parseFloat(matrix[12]);
	                //Normal Browsers
	                else
	                    curTransform = parseFloat(matrix[4]);
	            }
	            if (axis === 'y') {
	                //Latest Chrome and webkits Fix
	                if (window.WebKitCSSMatrix)
	                    curTransform = transformMatrix.m42;
	                //Crazy IE10 Matrix
	                else if (matrix.length === 16)
	                    curTransform = parseFloat(matrix[13]);
	                //Normal Browsers
	                else
	                    curTransform = parseFloat(matrix[5]);
	            }
	            if (s.rtl && curTransform) curTransform = -curTransform;
	            return curTransform || 0;
	        };
	        s.getWrapperTranslate = function (axis) {
	            if (typeof axis === 'undefined') {
	                axis = s.isHorizontal() ? 'x' : 'y';
	            }
	            return s.getTranslate(s.wrapper[0], axis);
	        };

	        /*=========================
	          Observer
	          ===========================*/
	        s.observers = [];
	        function initObserver(target, options) {
	            options = options || {};
	            // create an observer instance
	            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
	            var observer = new ObserverFunc(function (mutations) {
	                mutations.forEach(function (mutation) {
	                    s.onResize(true);
	                    s.emit('onObserverUpdate', s, mutation);
	                });
	            });

	            observer.observe(target, {
	                attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
	                childList: typeof options.childList === 'undefined' ? true : options.childList,
	                characterData: typeof options.characterData === 'undefined' ? true : options.characterData
	            });

	            s.observers.push(observer);
	        }
	        s.initObservers = function () {
	            if (s.params.observeParents) {
	                var containerParents = s.container.parents();
	                for (var i = 0; i < containerParents.length; i++) {
	                    initObserver(containerParents[i]);
	                }
	            }

	            // Observe container
	            initObserver(s.container[0], {childList: false});

	            // Observe wrapper
	            initObserver(s.wrapper[0], {attributes: false});
	        };
	        s.disconnectObservers = function () {
	            for (var i = 0; i < s.observers.length; i++) {
	                s.observers[i].disconnect();
	            }
	            s.observers = [];
	        };
	        /*=========================
	          Loop
	          ===========================*/
	        // Create looped slides
	        s.createLoop = function () {
	            // Remove duplicated slides
	            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();

	            var slides = s.wrapper.children('.' + s.params.slideClass);

	            if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides) s.params.loopedSlides = slides.length;

	            s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
	            s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
	            if (s.loopedSlides > slides.length) {
	                s.loopedSlides = slides.length;
	            }

	            var prependSlides = [], appendSlides = [], i;
	            slides.each(function (index, el) {
	                var slide = $(this);
	                if (index < s.loopedSlides) appendSlides.push(el);
	                if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
	                slide.attr('data-swiper-slide-index', index);
	            });
	            for (i = 0; i < appendSlides.length; i++) {
	                s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
	            }
	            for (i = prependSlides.length - 1; i >= 0; i--) {
	                s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
	            }
	        };
	        s.destroyLoop = function () {
	            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
	            s.slides.removeAttr('data-swiper-slide-index');
	        };
	        s.reLoop = function (updatePosition) {
	            var oldIndex = s.activeIndex - s.loopedSlides;
	            s.destroyLoop();
	            s.createLoop();
	            s.updateSlidesSize();
	            if (updatePosition) {
	                s.slideTo(oldIndex + s.loopedSlides, 0, false);
	            }

	        };
	        s.fixLoop = function () {
	            var newIndex;
	            //Fix For Negative Oversliding
	            if (s.activeIndex < s.loopedSlides) {
	                newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
	                newIndex = newIndex + s.loopedSlides;
	                s.slideTo(newIndex, 0, false, true);
	            }
	            //Fix For Positive Oversliding
	            else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
	                newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
	                newIndex = newIndex + s.loopedSlides;
	                s.slideTo(newIndex, 0, false, true);
	            }
	        };
	        /*=========================
	          Append/Prepend/Remove Slides
	          ===========================*/
	        s.appendSlide = function (slides) {
	            if (s.params.loop) {
	                s.destroyLoop();
	            }
	            if (typeof slides === 'object' && slides.length) {
	                for (var i = 0; i < slides.length; i++) {
	                    if (slides[i]) s.wrapper.append(slides[i]);
	                }
	            }
	            else {
	                s.wrapper.append(slides);
	            }
	            if (s.params.loop) {
	                s.createLoop();
	            }
	            if (!(s.params.observer && s.support.observer)) {
	                s.update(true);
	            }
	        };
	        s.prependSlide = function (slides) {
	            if (s.params.loop) {
	                s.destroyLoop();
	            }
	            var newActiveIndex = s.activeIndex + 1;
	            if (typeof slides === 'object' && slides.length) {
	                for (var i = 0; i < slides.length; i++) {
	                    if (slides[i]) s.wrapper.prepend(slides[i]);
	                }
	                newActiveIndex = s.activeIndex + slides.length;
	            }
	            else {
	                s.wrapper.prepend(slides);
	            }
	            if (s.params.loop) {
	                s.createLoop();
	            }
	            if (!(s.params.observer && s.support.observer)) {
	                s.update(true);
	            }
	            s.slideTo(newActiveIndex, 0, false);
	        };
	        s.removeSlide = function (slidesIndexes) {
	            if (s.params.loop) {
	                s.destroyLoop();
	                s.slides = s.wrapper.children('.' + s.params.slideClass);
	            }
	            var newActiveIndex = s.activeIndex,
	                indexToRemove;
	            if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
	                for (var i = 0; i < slidesIndexes.length; i++) {
	                    indexToRemove = slidesIndexes[i];
	                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
	                    if (indexToRemove < newActiveIndex) newActiveIndex--;
	                }
	                newActiveIndex = Math.max(newActiveIndex, 0);
	            }
	            else {
	                indexToRemove = slidesIndexes;
	                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
	                if (indexToRemove < newActiveIndex) newActiveIndex--;
	                newActiveIndex = Math.max(newActiveIndex, 0);
	            }

	            if (s.params.loop) {
	                s.createLoop();
	            }

	            if (!(s.params.observer && s.support.observer)) {
	                s.update(true);
	            }
	            if (s.params.loop) {
	                s.slideTo(newActiveIndex + s.loopedSlides, 0, false);
	            }
	            else {
	                s.slideTo(newActiveIndex, 0, false);
	            }

	        };
	        s.removeAllSlides = function () {
	            var slidesIndexes = [];
	            for (var i = 0; i < s.slides.length; i++) {
	                slidesIndexes.push(i);
	            }
	            s.removeSlide(slidesIndexes);
	        };


	        /*=========================
	          Effects
	          ===========================*/
	        s.effects = {
	            fade: {
	                setTranslate: function () {
	                    for (var i = 0; i < s.slides.length; i++) {
	                        var slide = s.slides.eq(i);
	                        var offset = slide[0].swiperSlideOffset;
	                        var tx = -offset;
	                        if (!s.params.virtualTranslate) tx = tx - s.translate;
	                        var ty = 0;
	                        if (!s.isHorizontal()) {
	                            ty = tx;
	                            tx = 0;
	                        }
	                        var slideOpacity = s.params.fade.crossFade ?
	                                Math.max(1 - Math.abs(slide[0].progress), 0) :
	                                1 + Math.min(Math.max(slide[0].progress, -1), 0);
	                        slide
	                            .css({
	                                opacity: slideOpacity
	                            })
	                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');

	                    }

	                },
	                setTransition: function (duration) {
	                    s.slides.transition(duration);
	                    if (s.params.virtualTranslate && duration !== 0) {
	                        var eventTriggered = false;
	                        s.slides.transitionEnd(function () {
	                            if (eventTriggered) return;
	                            if (!s) return;
	                            eventTriggered = true;
	                            s.animating = false;
	                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
	                            for (var i = 0; i < triggerEvents.length; i++) {
	                                s.wrapper.trigger(triggerEvents[i]);
	                            }
	                        });
	                    }
	                }
	            },
	            flip: {
	                setTranslate: function () {
	                    for (var i = 0; i < s.slides.length; i++) {
	                        var slide = s.slides.eq(i);
	                        var progress = slide[0].progress;
	                        if (s.params.flip.limitRotation) {
	                            progress = Math.max(Math.min(slide[0].progress, 1), -1);
	                        }
	                        var offset = slide[0].swiperSlideOffset;
	                        var rotate = -180 * progress,
	                            rotateY = rotate,
	                            rotateX = 0,
	                            tx = -offset,
	                            ty = 0;
	                        if (!s.isHorizontal()) {
	                            ty = tx;
	                            tx = 0;
	                            rotateX = -rotateY;
	                            rotateY = 0;
	                        }
	                        else if (s.rtl) {
	                            rotateY = -rotateY;
	                        }

	                        slide[0].style.zIndex = -Math.abs(Math.round(progress)) + s.slides.length;

	                        if (s.params.flip.slideShadows) {
	                            //Set shadows
	                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
	                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
	                            if (shadowBefore.length === 0) {
	                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
	                                slide.append(shadowBefore);
	                            }
	                            if (shadowAfter.length === 0) {
	                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
	                                slide.append(shadowAfter);
	                            }
	                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
	                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
	                        }

	                        slide
	                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
	                    }
	                },
	                setTransition: function (duration) {
	                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
	                    if (s.params.virtualTranslate && duration !== 0) {
	                        var eventTriggered = false;
	                        s.slides.eq(s.activeIndex).transitionEnd(function () {
	                            if (eventTriggered) return;
	                            if (!s) return;
	                            if (!$(this).hasClass(s.params.slideActiveClass)) return;
	                            eventTriggered = true;
	                            s.animating = false;
	                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
	                            for (var i = 0; i < triggerEvents.length; i++) {
	                                s.wrapper.trigger(triggerEvents[i]);
	                            }
	                        });
	                    }
	                }
	            },
	            cube: {
	                setTranslate: function () {
	                    var wrapperRotate = 0, cubeShadow;
	                    if (s.params.cube.shadow) {
	                        if (s.isHorizontal()) {
	                            cubeShadow = s.wrapper.find('.swiper-cube-shadow');
	                            if (cubeShadow.length === 0) {
	                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
	                                s.wrapper.append(cubeShadow);
	                            }
	                            cubeShadow.css({height: s.width + 'px'});
	                        }
	                        else {
	                            cubeShadow = s.container.find('.swiper-cube-shadow');
	                            if (cubeShadow.length === 0) {
	                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
	                                s.container.append(cubeShadow);
	                            }
	                        }
	                    }
	                    for (var i = 0; i < s.slides.length; i++) {
	                        var slide = s.slides.eq(i);
	                        var slideAngle = i * 90;
	                        var round = Math.floor(slideAngle / 360);
	                        if (s.rtl) {
	                            slideAngle = -slideAngle;
	                            round = Math.floor(-slideAngle / 360);
	                        }
	                        var progress = Math.max(Math.min(slide[0].progress, 1), -1);
	                        var tx = 0, ty = 0, tz = 0;
	                        if (i % 4 === 0) {
	                            tx = - round * 4 * s.size;
	                            tz = 0;
	                        }
	                        else if ((i - 1) % 4 === 0) {
	                            tx = 0;
	                            tz = - round * 4 * s.size;
	                        }
	                        else if ((i - 2) % 4 === 0) {
	                            tx = s.size + round * 4 * s.size;
	                            tz = s.size;
	                        }
	                        else if ((i - 3) % 4 === 0) {
	                            tx = - s.size;
	                            tz = 3 * s.size + s.size * 4 * round;
	                        }
	                        if (s.rtl) {
	                            tx = -tx;
	                        }

	                        if (!s.isHorizontal()) {
	                            ty = tx;
	                            tx = 0;
	                        }

	                        var transform = 'rotateX(' + (s.isHorizontal() ? 0 : -slideAngle) + 'deg) rotateY(' + (s.isHorizontal() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
	                        if (progress <= 1 && progress > -1) {
	                            wrapperRotate = i * 90 + progress * 90;
	                            if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
	                        }
	                        slide.transform(transform);
	                        if (s.params.cube.slideShadows) {
	                            //Set shadows
	                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
	                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
	                            if (shadowBefore.length === 0) {
	                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
	                                slide.append(shadowBefore);
	                            }
	                            if (shadowAfter.length === 0) {
	                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
	                                slide.append(shadowAfter);
	                            }
	                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
	                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
	                        }
	                    }
	                    s.wrapper.css({
	                        '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
	                        '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
	                        '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
	                        'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
	                    });

	                    if (s.params.cube.shadow) {
	                        if (s.isHorizontal()) {
	                            cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
	                        }
	                        else {
	                            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
	                            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
	                            var scale1 = s.params.cube.shadowScale,
	                                scale2 = s.params.cube.shadowScale / multiplier,
	                                offset = s.params.cube.shadowOffset;
	                            cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
	                        }
	                    }
	                    var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
	                    s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (s.isHorizontal() ? 0 : wrapperRotate) + 'deg) rotateY(' + (s.isHorizontal() ? -wrapperRotate : 0) + 'deg)');
	                },
	                setTransition: function (duration) {
	                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
	                    if (s.params.cube.shadow && !s.isHorizontal()) {
	                        s.container.find('.swiper-cube-shadow').transition(duration);
	                    }
	                }
	            },
	            coverflow: {
	                setTranslate: function () {
	                    var transform = s.translate;
	                    var center = s.isHorizontal() ? -transform + s.width / 2 : -transform + s.height / 2;
	                    var rotate = s.isHorizontal() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
	                    var translate = s.params.coverflow.depth;
	                    //Each slide offset from center
	                    for (var i = 0, length = s.slides.length; i < length; i++) {
	                        var slide = s.slides.eq(i);
	                        var slideSize = s.slidesSizesGrid[i];
	                        var slideOffset = slide[0].swiperSlideOffset;
	                        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;

	                        var rotateY = s.isHorizontal() ? rotate * offsetMultiplier : 0;
	                        var rotateX = s.isHorizontal() ? 0 : rotate * offsetMultiplier;
	                        // var rotateZ = 0
	                        var translateZ = -translate * Math.abs(offsetMultiplier);

	                        var translateY = s.isHorizontal() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
	                        var translateX = s.isHorizontal() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;

	                        //Fix for ultra small values
	                        if (Math.abs(translateX) < 0.001) translateX = 0;
	                        if (Math.abs(translateY) < 0.001) translateY = 0;
	                        if (Math.abs(translateZ) < 0.001) translateZ = 0;
	                        if (Math.abs(rotateY) < 0.001) rotateY = 0;
	                        if (Math.abs(rotateX) < 0.001) rotateX = 0;

	                        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

	                        slide.transform(slideTransform);
	                        slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
	                        if (s.params.coverflow.slideShadows) {
	                            //Set shadows
	                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
	                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
	                            if (shadowBefore.length === 0) {
	                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
	                                slide.append(shadowBefore);
	                            }
	                            if (shadowAfter.length === 0) {
	                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
	                                slide.append(shadowAfter);
	                            }
	                            if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
	                            if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
	                        }
	                    }

	                    //Set correct perspective for IE10
	                    if (s.browser.ie) {
	                        var ws = s.wrapper[0].style;
	                        ws.perspectiveOrigin = center + 'px 50%';
	                    }
	                },
	                setTransition: function (duration) {
	                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
	                }
	            }
	        };

	        /*=========================
	          Images Lazy Loading
	          ===========================*/
	        s.lazy = {
	            initialImageLoaded: false,
	            loadImageInSlide: function (index, loadInDuplicate) {
	                if (typeof index === 'undefined') return;
	                if (typeof loadInDuplicate === 'undefined') loadInDuplicate = true;
	                if (s.slides.length === 0) return;

	                var slide = s.slides.eq(index);
	                var img = slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');
	                if (slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')) {
	                    img = img.add(slide[0]);
	                }
	                if (img.length === 0) return;

	                img.each(function () {
	                    var _img = $(this);
	                    _img.addClass('swiper-lazy-loading');
	                    var background = _img.attr('data-background');
	                    var src = _img.attr('data-src'),
	                        srcset = _img.attr('data-srcset');
	                    s.loadImage(_img[0], (src || background), srcset, false, function () {
	                        if (background) {
	                            _img.css('background-image', 'url("' + background + '")');
	                            _img.removeAttr('data-background');
	                        }
	                        else {
	                            if (srcset) {
	                                _img.attr('srcset', srcset);
	                                _img.removeAttr('data-srcset');
	                            }
	                            if (src) {
	                                _img.attr('src', src);
	                                _img.removeAttr('data-src');
	                            }

	                        }

	                        _img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');
	                        slide.find('.swiper-lazy-preloader, .preloader').remove();
	                        if (s.params.loop && loadInDuplicate) {
	                            var slideOriginalIndex = slide.attr('data-swiper-slide-index');
	                            if (slide.hasClass(s.params.slideDuplicateClass)) {
	                                var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');
	                                s.lazy.loadImageInSlide(originalSlide.index(), false);
	                            }
	                            else {
	                                var duplicatedSlide = s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
	                                s.lazy.loadImageInSlide(duplicatedSlide.index(), false);
	                            }
	                        }
	                        s.emit('onLazyImageReady', s, slide[0], _img[0]);
	                    });

	                    s.emit('onLazyImageLoad', s, slide[0], _img[0]);
	                });

	            },
	            load: function () {
	                var i;
	                if (s.params.watchSlidesVisibility) {
	                    s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
	                        s.lazy.loadImageInSlide($(this).index());
	                    });
	                }
	                else {
	                    if (s.params.slidesPerView > 1) {
	                        for (i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView ; i++) {
	                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
	                        }
	                    }
	                    else {
	                        s.lazy.loadImageInSlide(s.activeIndex);
	                    }
	                }
	                if (s.params.lazyLoadingInPrevNext) {
	                    if (s.params.slidesPerView > 1 || (s.params.lazyLoadingInPrevNextAmount && s.params.lazyLoadingInPrevNextAmount > 1)) {
	                        var amount = s.params.lazyLoadingInPrevNextAmount;
	                        var spv = s.params.slidesPerView;
	                        var maxIndex = Math.min(s.activeIndex + spv + Math.max(amount, spv), s.slides.length);
	                        var minIndex = Math.max(s.activeIndex - Math.max(spv, amount), 0);
	                        // Next Slides
	                        for (i = s.activeIndex + s.params.slidesPerView; i < maxIndex; i++) {
	                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
	                        }
	                        // Prev Slides
	                        for (i = minIndex; i < s.activeIndex ; i++) {
	                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
	                        }
	                    }
	                    else {
	                        var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
	                        if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());

	                        var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
	                        if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
	                    }
	                }
	            },
	            onTransitionStart: function () {
	                if (s.params.lazyLoading) {
	                    if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
	                        s.lazy.load();
	                    }
	                }
	            },
	            onTransitionEnd: function () {
	                if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
	                    s.lazy.load();
	                }
	            }
	        };


	        /*=========================
	          Scrollbar
	          ===========================*/
	        s.scrollbar = {
	            isTouched: false,
	            setDragPosition: function (e) {
	                var sb = s.scrollbar;
	                var x = 0, y = 0;
	                var translate;
	                var pointerPosition = s.isHorizontal() ?
	                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageX : e.pageX || e.clientX) :
	                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageY : e.pageY || e.clientY) ;
	                var position = (pointerPosition) - sb.track.offset()[s.isHorizontal() ? 'left' : 'top'] - sb.dragSize / 2;
	                var positionMin = -s.minTranslate() * sb.moveDivider;
	                var positionMax = -s.maxTranslate() * sb.moveDivider;
	                if (position < positionMin) {
	                    position = positionMin;
	                }
	                else if (position > positionMax) {
	                    position = positionMax;
	                }
	                position = -position / sb.moveDivider;
	                s.updateProgress(position);
	                s.setWrapperTranslate(position, true);
	            },
	            dragStart: function (e) {
	                var sb = s.scrollbar;
	                sb.isTouched = true;
	                e.preventDefault();
	                e.stopPropagation();

	                sb.setDragPosition(e);
	                clearTimeout(sb.dragTimeout);

	                sb.track.transition(0);
	                if (s.params.scrollbarHide) {
	                    sb.track.css('opacity', 1);
	                }
	                s.wrapper.transition(100);
	                sb.drag.transition(100);
	                s.emit('onScrollbarDragStart', s);
	            },
	            dragMove: function (e) {
	                var sb = s.scrollbar;
	                if (!sb.isTouched) return;
	                if (e.preventDefault) e.preventDefault();
	                else e.returnValue = false;
	                sb.setDragPosition(e);
	                s.wrapper.transition(0);
	                sb.track.transition(0);
	                sb.drag.transition(0);
	                s.emit('onScrollbarDragMove', s);
	            },
	            dragEnd: function (e) {
	                var sb = s.scrollbar;
	                if (!sb.isTouched) return;
	                sb.isTouched = false;
	                if (s.params.scrollbarHide) {
	                    clearTimeout(sb.dragTimeout);
	                    sb.dragTimeout = setTimeout(function () {
	                        sb.track.css('opacity', 0);
	                        sb.track.transition(400);
	                    }, 1000);

	                }
	                s.emit('onScrollbarDragEnd', s);
	                if (s.params.scrollbarSnapOnRelease) {
	                    s.slideReset();
	                }
	            },
	            enableDraggable: function () {
	                var sb = s.scrollbar;
	                var target = s.support.touch ? sb.track : document;
	                $(sb.track).on(s.touchEvents.start, sb.dragStart);
	                $(target).on(s.touchEvents.move, sb.dragMove);
	                $(target).on(s.touchEvents.end, sb.dragEnd);
	            },
	            disableDraggable: function () {
	                var sb = s.scrollbar;
	                var target = s.support.touch ? sb.track : document;
	                $(sb.track).off(s.touchEvents.start, sb.dragStart);
	                $(target).off(s.touchEvents.move, sb.dragMove);
	                $(target).off(s.touchEvents.end, sb.dragEnd);
	            },
	            set: function () {
	                if (!s.params.scrollbar) return;
	                var sb = s.scrollbar;
	                sb.track = $(s.params.scrollbar);
	                if (s.params.uniqueNavElements && typeof s.params.scrollbar === 'string' && sb.track.length > 1 && s.container.find(s.params.scrollbar).length === 1) {
	                    sb.track = s.container.find(s.params.scrollbar);
	                }
	                sb.drag = sb.track.find('.swiper-scrollbar-drag');
	                if (sb.drag.length === 0) {
	                    sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
	                    sb.track.append(sb.drag);
	                }
	                sb.drag[0].style.width = '';
	                sb.drag[0].style.height = '';
	                sb.trackSize = s.isHorizontal() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;

	                sb.divider = s.size / s.virtualSize;
	                sb.moveDivider = sb.divider * (sb.trackSize / s.size);
	                sb.dragSize = sb.trackSize * sb.divider;

	                if (s.isHorizontal()) {
	                    sb.drag[0].style.width = sb.dragSize + 'px';
	                }
	                else {
	                    sb.drag[0].style.height = sb.dragSize + 'px';
	                }

	                if (sb.divider >= 1) {
	                    sb.track[0].style.display = 'none';
	                }
	                else {
	                    sb.track[0].style.display = '';
	                }
	                if (s.params.scrollbarHide) {
	                    sb.track[0].style.opacity = 0;
	                }
	            },
	            setTranslate: function () {
	                if (!s.params.scrollbar) return;
	                var diff;
	                var sb = s.scrollbar;
	                var translate = s.translate || 0;
	                var newPos;

	                var newSize = sb.dragSize;
	                newPos = (sb.trackSize - sb.dragSize) * s.progress;
	                if (s.rtl && s.isHorizontal()) {
	                    newPos = -newPos;
	                    if (newPos > 0) {
	                        newSize = sb.dragSize - newPos;
	                        newPos = 0;
	                    }
	                    else if (-newPos + sb.dragSize > sb.trackSize) {
	                        newSize = sb.trackSize + newPos;
	                    }
	                }
	                else {
	                    if (newPos < 0) {
	                        newSize = sb.dragSize + newPos;
	                        newPos = 0;
	                    }
	                    else if (newPos + sb.dragSize > sb.trackSize) {
	                        newSize = sb.trackSize - newPos;
	                    }
	                }
	                if (s.isHorizontal()) {
	                    if (s.support.transforms3d) {
	                        sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
	                    }
	                    else {
	                        sb.drag.transform('translateX(' + (newPos) + 'px)');
	                    }
	                    sb.drag[0].style.width = newSize + 'px';
	                }
	                else {
	                    if (s.support.transforms3d) {
	                        sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
	                    }
	                    else {
	                        sb.drag.transform('translateY(' + (newPos) + 'px)');
	                    }
	                    sb.drag[0].style.height = newSize + 'px';
	                }
	                if (s.params.scrollbarHide) {
	                    clearTimeout(sb.timeout);
	                    sb.track[0].style.opacity = 1;
	                    sb.timeout = setTimeout(function () {
	                        sb.track[0].style.opacity = 0;
	                        sb.track.transition(400);
	                    }, 1000);
	                }
	            },
	            setTransition: function (duration) {
	                if (!s.params.scrollbar) return;
	                s.scrollbar.drag.transition(duration);
	            }
	        };

	        /*=========================
	          Controller
	          ===========================*/
	        s.controller = {
	            LinearSpline: function (x, y) {
	                this.x = x;
	                this.y = y;
	                this.lastIndex = x.length - 1;
	                // Given an x value (x2), return the expected y2 value:
	                // (x1,y1) is the known point before given value,
	                // (x3,y3) is the known point after given value.
	                var i1, i3;
	                var l = this.x.length;

	                this.interpolate = function (x2) {
	                    if (!x2) return 0;

	                    // Get the indexes of x1 and x3 (the array indexes before and after given x2):
	                    i3 = binarySearch(this.x, x2);
	                    i1 = i3 - 1;

	                    // We have our indexes i1 & i3, so we can calculate already:
	                    // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
	                    return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
	                };

	                var binarySearch = (function() {
	                    var maxIndex, minIndex, guess;
	                    return function(array, val) {
	                        minIndex = -1;
	                        maxIndex = array.length;
	                        while (maxIndex - minIndex > 1)
	                            if (array[guess = maxIndex + minIndex >> 1] <= val) {
	                                minIndex = guess;
	                            } else {
	                                maxIndex = guess;
	                            }
	                        return maxIndex;
	                    };
	                })();
	            },
	            //xxx: for now i will just save one spline function to to
	            getInterpolateFunction: function(c){
	                if(!s.controller.spline) s.controller.spline = s.params.loop ?
	                    new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) :
	                    new s.controller.LinearSpline(s.snapGrid, c.snapGrid);
	            },
	            setTranslate: function (translate, byController) {
	               var controlled = s.params.control;
	               var multiplier, controlledTranslate;
	               function setControlledTranslate(c) {
	                    // this will create an Interpolate function based on the snapGrids
	                    // x is the Grid of the scrolled scroller and y will be the controlled scroller
	                    // it makes sense to create this only once and recall it for the interpolation
	                    // the function does a lot of value caching for performance
	                    translate = c.rtl && c.params.direction === 'horizontal' ? -s.translate : s.translate;
	                    if (s.params.controlBy === 'slide') {
	                        s.controller.getInterpolateFunction(c);
	                        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
	                        // but it did not work out
	                        controlledTranslate = -s.controller.spline.interpolate(-translate);
	                    }

	                    if(!controlledTranslate || s.params.controlBy === 'container'){
	                        multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());
	                        controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();
	                    }

	                    if (s.params.controlInverse) {
	                        controlledTranslate = c.maxTranslate() - controlledTranslate;
	                    }
	                    c.updateProgress(controlledTranslate);
	                    c.setWrapperTranslate(controlledTranslate, false, s);
	                    c.updateActiveIndex();
	               }
	               if (s.isArray(controlled)) {
	                   for (var i = 0; i < controlled.length; i++) {
	                       if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
	                           setControlledTranslate(controlled[i]);
	                       }
	                   }
	               }
	               else if (controlled instanceof Swiper && byController !== controlled) {

	                   setControlledTranslate(controlled);
	               }
	            },
	            setTransition: function (duration, byController) {
	                var controlled = s.params.control;
	                var i;
	                function setControlledTransition(c) {
	                    c.setWrapperTransition(duration, s);
	                    if (duration !== 0) {
	                        c.onTransitionStart();
	                        c.wrapper.transitionEnd(function(){
	                            if (!controlled) return;
	                            if (c.params.loop && s.params.controlBy === 'slide') {
	                                c.fixLoop();
	                            }
	                            c.onTransitionEnd();

	                        });
	                    }
	                }
	                if (s.isArray(controlled)) {
	                    for (i = 0; i < controlled.length; i++) {
	                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
	                            setControlledTransition(controlled[i]);
	                        }
	                    }
	                }
	                else if (controlled instanceof Swiper && byController !== controlled) {
	                    setControlledTransition(controlled);
	                }
	            }
	        };

	        /*=========================
	          Hash Navigation
	          ===========================*/
	        s.hashnav = {
	            init: function () {
	                if (!s.params.hashnav) return;
	                s.hashnav.initialized = true;
	                var hash = document.location.hash.replace('#', '');
	                if (!hash) return;
	                var speed = 0;
	                for (var i = 0, length = s.slides.length; i < length; i++) {
	                    var slide = s.slides.eq(i);
	                    var slideHash = slide.attr('data-hash');
	                    if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
	                        var index = slide.index();
	                        s.slideTo(index, speed, s.params.runCallbacksOnInit, true);
	                    }
	                }
	            },
	            setHash: function () {
	                if (!s.hashnav.initialized || !s.params.hashnav) return;
	                document.location.hash = s.slides.eq(s.activeIndex).attr('data-hash') || '';
	            }
	        };

	        /*=========================
	          Keyboard Control
	          ===========================*/
	        function handleKeyboard(e) {
	            if (e.originalEvent) e = e.originalEvent; //jquery fix
	            var kc = e.keyCode || e.charCode;
	            // Directions locks
	            if (!s.params.allowSwipeToNext && (s.isHorizontal() && kc === 39 || !s.isHorizontal() && kc === 40)) {
	                return false;
	            }
	            if (!s.params.allowSwipeToPrev && (s.isHorizontal() && kc === 37 || !s.isHorizontal() && kc === 38)) {
	                return false;
	            }
	            if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
	                return;
	            }
	            if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
	                return;
	            }
	            if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
	                var inView = false;
	                //Check that swiper should be inside of visible area of window
	                if (s.container.parents('.swiper-slide').length > 0 && s.container.parents('.swiper-slide-active').length === 0) {
	                    return;
	                }
	                var windowScroll = {
	                    left: window.pageXOffset,
	                    top: window.pageYOffset
	                };
	                var windowWidth = window.innerWidth;
	                var windowHeight = window.innerHeight;
	                var swiperOffset = s.container.offset();
	                if (s.rtl) swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft;
	                var swiperCoord = [
	                    [swiperOffset.left, swiperOffset.top],
	                    [swiperOffset.left + s.width, swiperOffset.top],
	                    [swiperOffset.left, swiperOffset.top + s.height],
	                    [swiperOffset.left + s.width, swiperOffset.top + s.height]
	                ];
	                for (var i = 0; i < swiperCoord.length; i++) {
	                    var point = swiperCoord[i];
	                    if (
	                        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
	                        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
	                    ) {
	                        inView = true;
	                    }

	                }
	                if (!inView) return;
	            }
	            if (s.isHorizontal()) {
	                if (kc === 37 || kc === 39) {
	                    if (e.preventDefault) e.preventDefault();
	                    else e.returnValue = false;
	                }
	                if ((kc === 39 && !s.rtl) || (kc === 37 && s.rtl)) s.slideNext();
	                if ((kc === 37 && !s.rtl) || (kc === 39 && s.rtl)) s.slidePrev();
	            }
	            else {
	                if (kc === 38 || kc === 40) {
	                    if (e.preventDefault) e.preventDefault();
	                    else e.returnValue = false;
	                }
	                if (kc === 40) s.slideNext();
	                if (kc === 38) s.slidePrev();
	            }
	        }
	        s.disableKeyboardControl = function () {
	            s.params.keyboardControl = false;
	            $(document).off('keydown', handleKeyboard);
	        };
	        s.enableKeyboardControl = function () {
	            s.params.keyboardControl = true;
	            $(document).on('keydown', handleKeyboard);
	        };


	        /*=========================
	          Mousewheel Control
	          ===========================*/
	        s.mousewheel = {
	            event: false,
	            lastScrollTime: (new window.Date()).getTime()
	        };
	        if (s.params.mousewheelControl) {
	            try {
	                new window.WheelEvent('wheel');
	                s.mousewheel.event = 'wheel';
	            } catch (e) {
	                if (window.WheelEvent || (s.container[0] && 'wheel' in s.container[0])) {
	                    s.mousewheel.event = 'wheel';
	                }
	            }
	            if (!s.mousewheel.event && window.WheelEvent) {

	            }
	            if (!s.mousewheel.event && document.onmousewheel !== undefined) {
	                s.mousewheel.event = 'mousewheel';
	            }
	            if (!s.mousewheel.event) {
	                s.mousewheel.event = 'DOMMouseScroll';
	            }
	        }
	        function handleMousewheel(e) {
	            if (e.originalEvent) e = e.originalEvent; //jquery fix
	            var we = s.mousewheel.event;
	            var delta = 0;
	            var rtlFactor = s.rtl ? -1 : 1;

	            //WebKits
	            if (we === 'mousewheel') {
	                if (s.params.mousewheelForceToAxis) {
	                    if (s.isHorizontal()) {
	                        if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX * rtlFactor;
	                        else return;
	                    }
	                    else {
	                        if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
	                        else return;
	                    }
	                }
	                else {
	                    delta = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? - e.wheelDeltaX * rtlFactor : - e.wheelDeltaY;
	                }
	            }
	            //Old FireFox
	            else if (we === 'DOMMouseScroll') delta = -e.detail;
	            //New FireFox
	            else if (we === 'wheel') {
	                if (s.params.mousewheelForceToAxis) {
	                    if (s.isHorizontal()) {
	                        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX * rtlFactor;
	                        else return;
	                    }
	                    else {
	                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
	                        else return;
	                    }
	                }
	                else {
	                    delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX * rtlFactor : - e.deltaY;
	                }
	            }
	            if (delta === 0) return;

	            if (s.params.mousewheelInvert) delta = -delta;

	            if (!s.params.freeMode) {
	                if ((new window.Date()).getTime() - s.mousewheel.lastScrollTime > 60) {
	                    if (delta < 0) {
	                        if ((!s.isEnd || s.params.loop) && !s.animating) s.slideNext();
	                        else if (s.params.mousewheelReleaseOnEdges) return true;
	                    }
	                    else {
	                        if ((!s.isBeginning || s.params.loop) && !s.animating) s.slidePrev();
	                        else if (s.params.mousewheelReleaseOnEdges) return true;
	                    }
	                }
	                s.mousewheel.lastScrollTime = (new window.Date()).getTime();

	            }
	            else {
	                //Freemode or scrollContainer:
	                var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity;
	                var wasBeginning = s.isBeginning,
	                    wasEnd = s.isEnd;

	                if (position >= s.minTranslate()) position = s.minTranslate();
	                if (position <= s.maxTranslate()) position = s.maxTranslate();

	                s.setWrapperTransition(0);
	                s.setWrapperTranslate(position);
	                s.updateProgress();
	                s.updateActiveIndex();

	                if (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) {
	                    s.updateClasses();
	                }

	                if (s.params.freeModeSticky) {
	                    clearTimeout(s.mousewheel.timeout);
	                    s.mousewheel.timeout = setTimeout(function () {
	                        s.slideReset();
	                    }, 300);
	                }
	                else {
	                    if (s.params.lazyLoading && s.lazy) {
	                        s.lazy.load();
	                    }
	                }

	                // Return page scroll on edge positions
	                if (position === 0 || position === s.maxTranslate()) return;
	            }
	            if (s.params.autoplay) s.stopAutoplay();

	            if (e.preventDefault) e.preventDefault();
	            else e.returnValue = false;
	            return false;
	        }
	        s.disableMousewheelControl = function () {
	            if (!s.mousewheel.event) return false;
	            s.container.off(s.mousewheel.event, handleMousewheel);
	            return true;
	        };

	        s.enableMousewheelControl = function () {
	            if (!s.mousewheel.event) return false;
	            s.container.on(s.mousewheel.event, handleMousewheel);
	            return true;
	        };


	        /*=========================
	          Parallax
	          ===========================*/
	        function setParallaxTransform(el, progress) {
	            el = $(el);
	            var p, pX, pY;
	            var rtlFactor = s.rtl ? -1 : 1;

	            p = el.attr('data-swiper-parallax') || '0';
	            pX = el.attr('data-swiper-parallax-x');
	            pY = el.attr('data-swiper-parallax-y');
	            if (pX || pY) {
	                pX = pX || '0';
	                pY = pY || '0';
	            }
	            else {
	                if (s.isHorizontal()) {
	                    pX = p;
	                    pY = '0';
	                }
	                else {
	                    pY = p;
	                    pX = '0';
	                }
	            }

	            if ((pX).indexOf('%') >= 0) {
	                pX = parseInt(pX, 10) * progress * rtlFactor + '%';
	            }
	            else {
	                pX = pX * progress * rtlFactor + 'px' ;
	            }
	            if ((pY).indexOf('%') >= 0) {
	                pY = parseInt(pY, 10) * progress + '%';
	            }
	            else {
	                pY = pY * progress + 'px' ;
	            }

	            el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
	        }
	        s.parallax = {
	            setTranslate: function () {
	                s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
	                    setParallaxTransform(this, s.progress);

	                });
	                s.slides.each(function () {
	                    var slide = $(this);
	                    slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
	                        var progress = Math.min(Math.max(slide[0].progress, -1), 1);
	                        setParallaxTransform(this, progress);
	                    });
	                });
	            },
	            setTransition: function (duration) {
	                if (typeof duration === 'undefined') duration = s.params.speed;
	                s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
	                    var el = $(this);
	                    var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
	                    if (duration === 0) parallaxDuration = 0;
	                    el.transition(parallaxDuration);
	                });
	            }
	        };


	        /*=========================
	          Plugins API. Collect all and init all plugins
	          ===========================*/
	        s._plugins = [];
	        for (var plugin in s.plugins) {
	            var p = s.plugins[plugin](s, s.params[plugin]);
	            if (p) s._plugins.push(p);
	        }
	        // Method to call all plugins event/method
	        s.callPlugins = function (eventName) {
	            for (var i = 0; i < s._plugins.length; i++) {
	                if (eventName in s._plugins[i]) {
	                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
	                }
	            }
	        };

	        /*=========================
	          Events/Callbacks/Plugins Emitter
	          ===========================*/
	        function normalizeEventName (eventName) {
	            if (eventName.indexOf('on') !== 0) {
	                if (eventName[0] !== eventName[0].toUpperCase()) {
	                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
	                }
	                else {
	                    eventName = 'on' + eventName;
	                }
	            }
	            return eventName;
	        }
	        s.emitterEventListeners = {

	        };
	        s.emit = function (eventName) {
	            // Trigger callbacks
	            if (s.params[eventName]) {
	                s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
	            }
	            var i;
	            // Trigger events
	            if (s.emitterEventListeners[eventName]) {
	                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
	                    s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
	                }
	            }
	            // Trigger plugins
	            if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
	        };
	        s.on = function (eventName, handler) {
	            eventName = normalizeEventName(eventName);
	            if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
	            s.emitterEventListeners[eventName].push(handler);
	            return s;
	        };
	        s.off = function (eventName, handler) {
	            var i;
	            eventName = normalizeEventName(eventName);
	            if (typeof handler === 'undefined') {
	                // Remove all handlers for such event
	                s.emitterEventListeners[eventName] = [];
	                return s;
	            }
	            if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
	            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
	                if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
	            }
	            return s;
	        };
	        s.once = function (eventName, handler) {
	            eventName = normalizeEventName(eventName);
	            var _handler = function () {
	                handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
	                s.off(eventName, _handler);
	            };
	            s.on(eventName, _handler);
	            return s;
	        };

	        // Accessibility tools
	        s.a11y = {
	            makeFocusable: function ($el) {
	                $el.attr('tabIndex', '0');
	                return $el;
	            },
	            addRole: function ($el, role) {
	                $el.attr('role', role);
	                return $el;
	            },

	            addLabel: function ($el, label) {
	                $el.attr('aria-label', label);
	                return $el;
	            },

	            disable: function ($el) {
	                $el.attr('aria-disabled', true);
	                return $el;
	            },

	            enable: function ($el) {
	                $el.attr('aria-disabled', false);
	                return $el;
	            },

	            onEnterKey: function (event) {
	                if (event.keyCode !== 13) return;
	                if ($(event.target).is(s.params.nextButton)) {
	                    s.onClickNext(event);
	                    if (s.isEnd) {
	                        s.a11y.notify(s.params.lastSlideMessage);
	                    }
	                    else {
	                        s.a11y.notify(s.params.nextSlideMessage);
	                    }
	                }
	                else if ($(event.target).is(s.params.prevButton)) {
	                    s.onClickPrev(event);
	                    if (s.isBeginning) {
	                        s.a11y.notify(s.params.firstSlideMessage);
	                    }
	                    else {
	                        s.a11y.notify(s.params.prevSlideMessage);
	                    }
	                }
	                if ($(event.target).is('.' + s.params.bulletClass)) {
	                    $(event.target)[0].click();
	                }
	            },

	            liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),

	            notify: function (message) {
	                var notification = s.a11y.liveRegion;
	                if (notification.length === 0) return;
	                notification.html('');
	                notification.html(message);
	            },
	            init: function () {
	                // Setup accessibility
	                if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
	                    s.a11y.makeFocusable(s.nextButton);
	                    s.a11y.addRole(s.nextButton, 'button');
	                    s.a11y.addLabel(s.nextButton, s.params.nextSlideMessage);
	                }
	                if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
	                    s.a11y.makeFocusable(s.prevButton);
	                    s.a11y.addRole(s.prevButton, 'button');
	                    s.a11y.addLabel(s.prevButton, s.params.prevSlideMessage);
	                }

	                $(s.container).append(s.a11y.liveRegion);
	            },
	            initPagination: function () {
	                if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
	                    s.bullets.each(function () {
	                        var bullet = $(this);
	                        s.a11y.makeFocusable(bullet);
	                        s.a11y.addRole(bullet, 'button');
	                        s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
	                    });
	                }
	            },
	            destroy: function () {
	                if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
	            }
	        };


	        /*=========================
	          Init/Destroy
	          ===========================*/
	        s.init = function () {
	            if (s.params.loop) s.createLoop();
	            s.updateContainerSize();
	            s.updateSlidesSize();
	            s.updatePagination();
	            if (s.params.scrollbar && s.scrollbar) {
	                s.scrollbar.set();
	                if (s.params.scrollbarDraggable) {
	                    s.scrollbar.enableDraggable();
	                }
	            }
	            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
	                if (!s.params.loop) s.updateProgress();
	                s.effects[s.params.effect].setTranslate();
	            }
	            if (s.params.loop) {
	                s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
	            }
	            else {
	                s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
	                if (s.params.initialSlide === 0) {
	                    if (s.parallax && s.params.parallax) s.parallax.setTranslate();
	                    if (s.lazy && s.params.lazyLoading) {
	                        s.lazy.load();
	                        s.lazy.initialImageLoaded = true;
	                    }
	                }
	            }
	            s.attachEvents();
	            if (s.params.observer && s.support.observer) {
	                s.initObservers();
	            }
	            if (s.params.preloadImages && !s.params.lazyLoading) {
	                s.preloadImages();
	            }
	            if (s.params.autoplay) {
	                s.startAutoplay();
	            }
	            if (s.params.keyboardControl) {
	                if (s.enableKeyboardControl) s.enableKeyboardControl();
	            }
	            if (s.params.mousewheelControl) {
	                if (s.enableMousewheelControl) s.enableMousewheelControl();
	            }
	            if (s.params.hashnav) {
	                if (s.hashnav) s.hashnav.init();
	            }
	            if (s.params.a11y && s.a11y) s.a11y.init();
	            s.emit('onInit', s);
	        };

	        // Cleanup dynamic styles
	        s.cleanupStyles = function () {
	            // Container
	            s.container.removeClass(s.classNames.join(' ')).removeAttr('style');

	            // Wrapper
	            s.wrapper.removeAttr('style');

	            // Slides
	            if (s.slides && s.slides.length) {
	                s.slides
	                    .removeClass([
	                      s.params.slideVisibleClass,
	                      s.params.slideActiveClass,
	                      s.params.slideNextClass,
	                      s.params.slidePrevClass
	                    ].join(' '))
	                    .removeAttr('style')
	                    .removeAttr('data-swiper-column')
	                    .removeAttr('data-swiper-row');
	            }

	            // Pagination/Bullets
	            if (s.paginationContainer && s.paginationContainer.length) {
	                s.paginationContainer.removeClass(s.params.paginationHiddenClass);
	            }
	            if (s.bullets && s.bullets.length) {
	                s.bullets.removeClass(s.params.bulletActiveClass);
	            }

	            // Buttons
	            if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
	            if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);

	            // Scrollbar
	            if (s.params.scrollbar && s.scrollbar) {
	                if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
	                if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
	            }
	        };

	        // Destroy
	        s.destroy = function (deleteInstance, cleanupStyles) {
	            // Detach evebts
	            s.detachEvents();
	            // Stop autoplay
	            s.stopAutoplay();
	            // Disable draggable
	            if (s.params.scrollbar && s.scrollbar) {
	                if (s.params.scrollbarDraggable) {
	                    s.scrollbar.disableDraggable();
	                }
	            }
	            // Destroy loop
	            if (s.params.loop) {
	                s.destroyLoop();
	            }
	            // Cleanup styles
	            if (cleanupStyles) {
	                s.cleanupStyles();
	            }
	            // Disconnect observer
	            s.disconnectObservers();
	            // Disable keyboard/mousewheel
	            if (s.params.keyboardControl) {
	                if (s.disableKeyboardControl) s.disableKeyboardControl();
	            }
	            if (s.params.mousewheelControl) {
	                if (s.disableMousewheelControl) s.disableMousewheelControl();
	            }
	            // Disable a11y
	            if (s.params.a11y && s.a11y) s.a11y.destroy();
	            // Destroy callback
	            s.emit('onDestroy');
	            // Delete instance
	            if (deleteInstance !== false) s = null;
	        };

	        s.init();



	        // Return swiper instance
	        return s;
	    };


	    /*==================================================
	        Prototype
	    ====================================================*/
	    Swiper.prototype = {
	        isSafari: (function () {
	            var ua = navigator.userAgent.toLowerCase();
	            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
	        })(),
	        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
	        isArray: function (arr) {
	            return Object.prototype.toString.apply(arr) === '[object Array]';
	        },
	        /*==================================================
	        Browser
	        ====================================================*/
	        browser: {
	            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
	            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
	        },
	        /*==================================================
	        Devices
	        ====================================================*/
	        device: (function () {
	            var ua = navigator.userAgent;
	            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	            return {
	                ios: ipad || iphone || ipod,
	                android: android
	            };
	        })(),
	        /*==================================================
	        Feature Detection
	        ====================================================*/
	        support: {
	            touch : (window.Modernizr && Modernizr.touch === true) || (function () {
	                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
	            })(),

	            transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
	                var div = document.createElement('div').style;
	                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
	            })(),

	            flexbox: (function () {
	                var div = document.createElement('div').style;
	                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
	                for (var i = 0; i < styles.length; i++) {
	                    if (styles[i] in div) return true;
	                }
	            })(),

	            observer: (function () {
	                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
	            })()
	        },
	        /*==================================================
	        Plugins
	        ====================================================*/
	        plugins: {}
	    };


	    /*===========================
	     Get Dom libraries
	     ===========================*/
	    var swiperDomPlugins = ['jQuery', 'Zepto', 'Dom7'];
	    for (var i = 0; i < swiperDomPlugins.length; i++) {
	        if (window[swiperDomPlugins[i]]) {
	            addLibraryPlugin(window[swiperDomPlugins[i]]);
	        }
	    }
	    // Required DOM Plugins
	    var domLib;
	    if (typeof Dom7 === 'undefined') {
	        domLib = window.Dom7 || window.Zepto || window.jQuery;
	    }
	    else {
	        domLib = Dom7;
	    }

	    /*===========================
	    Add .swiper plugin from Dom libraries
	    ===========================*/
	    function addLibraryPlugin(lib) {
	        lib.fn.swiper = function (params) {
	            var firstInstance;
	            lib(this).each(function () {
	                var s = new Swiper(this, params);
	                if (!firstInstance) firstInstance = s;
	            });
	            return firstInstance;
	        };
	    }

	    if (domLib) {
	        if (!('transitionEnd' in domLib.fn)) {
	            domLib.fn.transitionEnd = function (callback) {
	                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
	                    i, j, dom = this;
	                function fireCallBack(e) {
	                    /*jshint validthis:true */
	                    if (e.target !== this) return;
	                    callback.call(this, e);
	                    for (i = 0; i < events.length; i++) {
	                        dom.off(events[i], fireCallBack);
	                    }
	                }
	                if (callback) {
	                    for (i = 0; i < events.length; i++) {
	                        dom.on(events[i], fireCallBack);
	                    }
	                }
	                return this;
	            };
	        }
	        if (!('transform' in domLib.fn)) {
	            domLib.fn.transform = function (transform) {
	                for (var i = 0; i < this.length; i++) {
	                    var elStyle = this[i].style;
	                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
	                }
	                return this;
	            };
	        }
	        if (!('transition' in domLib.fn)) {
	            domLib.fn.transition = function (duration) {
	                if (typeof duration !== 'string') {
	                    duration = duration + 'ms';
	                }
	                for (var i = 0; i < this.length; i++) {
	                    var elStyle = this[i].style;
	                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
	                }
	                return this;
	            };
	        }
	    }

	    window.Swiper = Swiper;
	})();
	/*===========================
	Swiper AMD Export
	===========================*/
	if (true)
	{
	    module.exports = window.Swiper;
	}
	else if (typeof define === 'function' && define.amd) {
	    define([], function () {
	        'use strict';
	        return window.Swiper;
	    });
	}
	//# sourceMappingURL=maps/swiper.jquery.js.map


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {(function() {

	  // nb. This is for IE10 and lower _only_.
	  var supportCustomEvent = window.CustomEvent;
	  if (!supportCustomEvent || typeof supportCustomEvent === 'object') {
	    supportCustomEvent = function CustomEvent(event, x) {
	      x = x || {};
	      var ev = document.createEvent('CustomEvent');
	      ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);
	      return ev;
	    };
	    supportCustomEvent.prototype = window.Event.prototype;
	  }

	  /**
	   * @param {Element} el to check for stacking context
	   * @return {boolean} whether this el or its parents creates a stacking context
	   */
	  function createsStackingContext(el) {
	    while (el && el !== document.body) {
	      var s = window.getComputedStyle(el);
	      var invalid = function(k, ok) {
	        return !(s[k] === undefined || s[k] === ok);
	      }
	      if (s.opacity < 1 ||
	          invalid('zIndex', 'auto') ||
	          invalid('transform', 'none') ||
	          invalid('mixBlendMode', 'normal') ||
	          invalid('filter', 'none') ||
	          invalid('perspective', 'none') ||
	          s['isolation'] === 'isolate' ||
	          s.position === 'fixed' ||
	          s.webkitOverflowScrolling === 'touch') {
	        return true;
	      }
	      el = el.parentElement;
	    }
	    return false;
	  }

	  /**
	   * Finds the nearest <dialog> from the passed element.
	   *
	   * @param {Element} el to search from
	   * @return {HTMLDialogElement} dialog found
	   */
	  function findNearestDialog(el) {
	    while (el) {
	      if (el.localName === 'dialog') {
	        return /** @type {HTMLDialogElement} */ (el);
	      }
	      el = el.parentElement;
	    }
	    return null;
	  }

	  /**
	   * Blur the specified element, as long as it's not the HTML body element.
	   * This works around an IE9/10 bug - blurring the body causes Windows to
	   * blur the whole application.
	   *
	   * @param {Element} el to blur
	   */
	  function safeBlur(el) {
	    if (el && el.blur && el !== document.body) {
	      el.blur();
	    }
	  }

	  /**
	   * @param {!NodeList} nodeList to search
	   * @param {Node} node to find
	   * @return {boolean} whether node is inside nodeList
	   */
	  function inNodeList(nodeList, node) {
	    for (var i = 0; i < nodeList.length; ++i) {
	      if (nodeList[i] === node) {
	        return true;
	      }
	    }
	    return false;
	  }

	  /**
	   * @param {HTMLFormElement} el to check
	   * @return {boolean} whether this form has method="dialog"
	   */
	  function isFormMethodDialog(el) {
	    if (!el || !el.hasAttribute('method')) {
	      return false;
	    }
	    return el.getAttribute('method').toLowerCase() === 'dialog';
	  }

	  /**
	   * @param {!HTMLDialogElement} dialog to upgrade
	   * @constructor
	   */
	  function dialogPolyfillInfo(dialog) {
	    this.dialog_ = dialog;
	    this.replacedStyleTop_ = false;
	    this.openAsModal_ = false;

	    // Set a11y role. Browsers that support dialog implicitly know this already.
	    if (!dialog.hasAttribute('role')) {
	      dialog.setAttribute('role', 'dialog');
	    }

	    dialog.show = this.show.bind(this);
	    dialog.showModal = this.showModal.bind(this);
	    dialog.close = this.close.bind(this);

	    if (!('returnValue' in dialog)) {
	      dialog.returnValue = '';
	    }

	    if ('MutationObserver' in window) {
	      var mo = new MutationObserver(this.maybeHideModal.bind(this));
	      mo.observe(dialog, {attributes: true, attributeFilter: ['open']});
	    } else {
	      // IE10 and below support. Note that DOMNodeRemoved etc fire _before_ removal. They also
	      // seem to fire even if the element was removed as part of a parent removal. Use the removed
	      // events to force downgrade (useful if removed/immediately added).
	      var removed = false;
	      var cb = function() {
	        removed ? this.downgradeModal() : this.maybeHideModal();
	        removed = false;
	      }.bind(this);
	      var timeout;
	      var delayModel = function(ev) {
	        if (ev.target !== dialog) { return; }  // not for a child element
	        var cand = 'DOMNodeRemoved';
	        removed |= (ev.type.substr(0, cand.length) === cand);
	        window.clearTimeout(timeout);
	        timeout = window.setTimeout(cb, 0);
	      };
	      ['DOMAttrModified', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument'].forEach(function(name) {
	        dialog.addEventListener(name, delayModel);
	      });
	    }
	    // Note that the DOM is observed inside DialogManager while any dialog
	    // is being displayed as a modal, to catch modal removal from the DOM.

	    Object.defineProperty(dialog, 'open', {
	      set: this.setOpen.bind(this),
	      get: dialog.hasAttribute.bind(dialog, 'open')
	    });

	    this.backdrop_ = document.createElement('div');
	    this.backdrop_.className = 'backdrop';
	    this.backdrop_.addEventListener('click', this.backdropClick_.bind(this));
	  }

	  dialogPolyfillInfo.prototype = {

	    get dialog() {
	      return this.dialog_;
	    },

	    /**
	     * Maybe remove this dialog from the modal top layer. This is called when
	     * a modal dialog may no longer be tenable, e.g., when the dialog is no
	     * longer open or is no longer part of the DOM.
	     */
	    maybeHideModal: function() {
	      if (this.dialog_.hasAttribute('open') && document.body.contains(this.dialog_)) { return; }
	      this.downgradeModal();
	    },

	    /**
	     * Remove this dialog from the modal top layer, leaving it as a non-modal.
	     */
	    downgradeModal: function() {
	      if (!this.openAsModal_) { return; }
	      this.openAsModal_ = false;
	      this.dialog_.style.zIndex = '';

	      // This won't match the native <dialog> exactly because if the user set top on a centered
	      // polyfill dialog, that top gets thrown away when the dialog is closed. Not sure it's
	      // possible to polyfill this perfectly.
	      if (this.replacedStyleTop_) {
	        this.dialog_.style.top = '';
	        this.replacedStyleTop_ = false;
	      }

	      // Clear the backdrop and remove from the manager.
	      this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);
	      dialogPolyfill.dm.removeDialog(this);
	    },

	    /**
	     * @param {boolean} value whether to open or close this dialog
	     */
	    setOpen: function(value) {
	      if (value) {
	        this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
	      } else {
	        this.dialog_.removeAttribute('open');
	        this.maybeHideModal();  // nb. redundant with MutationObserver
	      }
	    },

	    /**
	     * Handles clicks on the fake .backdrop element, redirecting them as if
	     * they were on the dialog itself.
	     *
	     * @param {!Event} e to redirect
	     */
	    backdropClick_: function(e) {
	      if (!this.dialog_.hasAttribute('tabindex')) {
	        // Clicking on the backdrop should move the implicit cursor, even if dialog cannot be
	        // focused. Create a fake thing to focus on. If the backdrop was _before_ the dialog, this
	        // would not be needed - clicks would move the implicit cursor there.
	        var fake = document.createElement('div');
	        this.dialog_.insertBefore(fake, this.dialog_.firstChild);
	        fake.tabIndex = -1;
	        fake.focus();
	        this.dialog_.removeChild(fake);
	      } else {
	        this.dialog_.focus();
	      }

	      var redirectedEvent = document.createEvent('MouseEvents');
	      redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window,
	          e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey,
	          e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
	      this.dialog_.dispatchEvent(redirectedEvent);
	      e.stopPropagation();
	    },

	    /**
	     * Focuses on the first focusable element within the dialog. This will always blur the current
	     * focus, even if nothing within the dialog is found.
	     */
	    focus_: function() {
	      // Find element with `autofocus` attribute, or fall back to the first form/tabindex control.
	      var target = this.dialog_.querySelector('[autofocus]:not([disabled])');
	      if (!target && this.dialog_.tabIndex >= 0) {
	        target = this.dialog_;
	      }
	      if (!target) {
	        // Note that this is 'any focusable area'. This list is probably not exhaustive, but the
	        // alternative involves stepping through and trying to focus everything.
	        var opts = ['button', 'input', 'keygen', 'select', 'textarea'];
	        var query = opts.map(function(el) {
	          return el + ':not([disabled])';
	        });
	        // TODO(samthor): tabindex values that are not numeric are not focusable.
	        query.push('[tabindex]:not([disabled]):not([tabindex=""])');  // tabindex != "", not disabled
	        target = this.dialog_.querySelector(query.join(', '));
	      }
	      safeBlur(document.activeElement);
	      target && target.focus();
	    },

	    /**
	     * Sets the zIndex for the backdrop and dialog.
	     *
	     * @param {number} dialogZ
	     * @param {number} backdropZ
	     */
	    updateZIndex: function(dialogZ, backdropZ) {
	      if (dialogZ < backdropZ) {
	        throw new Error('dialogZ should never be < backdropZ');
	      }
	      this.dialog_.style.zIndex = dialogZ;
	      this.backdrop_.style.zIndex = backdropZ;
	    },

	    /**
	     * Shows the dialog. If the dialog is already open, this does nothing.
	     */
	    show: function() {
	      if (!this.dialog_.open) {
	        this.setOpen(true);
	        this.focus_();
	      }
	    },

	    /**
	     * Show this dialog modally.
	     */
	    showModal: function() {
	      if (this.dialog_.hasAttribute('open')) {
	        throw new Error('Failed to execute \'showModal\' on dialog: The element is already open, and therefore cannot be opened modally.');
	      }
	      if (!document.body.contains(this.dialog_)) {
	        throw new Error('Failed to execute \'showModal\' on dialog: The element is not in a Document.');
	      }
	      if (!dialogPolyfill.dm.pushDialog(this)) {
	        throw new Error('Failed to execute \'showModal\' on dialog: There are too many open modal dialogs.');
	      }

	      if (createsStackingContext(this.dialog_.parentElement)) {
	        console.warn('A dialog is being shown inside a stacking context. ' +
	            'This may cause it to be unusable. For more information, see this link: ' +
	            'https://github.com/GoogleChrome/dialog-polyfill/#stacking-context');
	      }

	      this.setOpen(true);
	      this.openAsModal_ = true;

	      // Optionally center vertically, relative to the current viewport.
	      if (dialogPolyfill.needsCentering(this.dialog_)) {
	        dialogPolyfill.reposition(this.dialog_);
	        this.replacedStyleTop_ = true;
	      } else {
	        this.replacedStyleTop_ = false;
	      }

	      // Insert backdrop.
	      this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling);

	      // Focus on whatever inside the dialog.
	      this.focus_();
	    },

	    /**
	     * Closes this HTMLDialogElement. This is optional vs clearing the open
	     * attribute, however this fires a 'close' event.
	     *
	     * @param {string=} opt_returnValue to use as the returnValue
	     */
	    close: function(opt_returnValue) {
	      if (!this.dialog_.hasAttribute('open')) {
	        throw new Error('Failed to execute \'close\' on dialog: The element does not have an \'open\' attribute, and therefore cannot be closed.');
	      }
	      this.setOpen(false);

	      // Leave returnValue untouched in case it was set directly on the element
	      if (opt_returnValue !== undefined) {
	        this.dialog_.returnValue = opt_returnValue;
	      }

	      // Triggering "close" event for any attached listeners on the <dialog>.
	      var closeEvent = new supportCustomEvent('close', {
	        bubbles: false,
	        cancelable: false
	      });
	      this.dialog_.dispatchEvent(closeEvent);
	    }

	  };

	  var dialogPolyfill = {};

	  dialogPolyfill.reposition = function(element) {
	    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	    var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;
	    element.style.top = Math.max(scrollTop, topValue) + 'px';
	  };

	  dialogPolyfill.isInlinePositionSetByStylesheet = function(element) {
	    for (var i = 0; i < document.styleSheets.length; ++i) {
	      var styleSheet = document.styleSheets[i];
	      var cssRules = null;
	      // Some browsers throw on cssRules.
	      try {
	        cssRules = styleSheet.cssRules;
	      } catch (e) {}
	      if (!cssRules) { continue; }
	      for (var j = 0; j < cssRules.length; ++j) {
	        var rule = cssRules[j];
	        var selectedNodes = null;
	        // Ignore errors on invalid selector texts.
	        try {
	          selectedNodes = document.querySelectorAll(rule.selectorText);
	        } catch(e) {}
	        if (!selectedNodes || !inNodeList(selectedNodes, element)) {
	          continue;
	        }
	        var cssTop = rule.style.getPropertyValue('top');
	        var cssBottom = rule.style.getPropertyValue('bottom');
	        if ((cssTop && cssTop !== 'auto') || (cssBottom && cssBottom !== 'auto')) {
	          return true;
	        }
	      }
	    }
	    return false;
	  };

	  dialogPolyfill.needsCentering = function(dialog) {
	    var computedStyle = window.getComputedStyle(dialog);
	    if (computedStyle.position !== 'absolute') {
	      return false;
	    }

	    // We must determine whether the top/bottom specified value is non-auto.  In
	    // WebKit/Blink, checking computedStyle.top == 'auto' is sufficient, but
	    // Firefox returns the used value. So we do this crazy thing instead: check
	    // the inline style and then go through CSS rules.
	    if ((dialog.style.top !== 'auto' && dialog.style.top !== '') ||
	        (dialog.style.bottom !== 'auto' && dialog.style.bottom !== '')) {
	      return false;
	    }
	    return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
	  };

	  /**
	   * @param {!Element} element to force upgrade
	   */
	  dialogPolyfill.forceRegisterDialog = function(element) {
	    if (window.HTMLDialogElement || element.showModal) {
	      console.warn('This browser already supports <dialog>, the polyfill ' +
	          'may not work correctly', element);
	    }
	    if (element.localName !== 'dialog') {
	      throw new Error('Failed to register dialog: The element is not a dialog.');
	    }
	    new dialogPolyfillInfo(/** @type {!HTMLDialogElement} */ (element));
	  };

	  /**
	   * @param {!Element} element to upgrade, if necessary
	   */
	  dialogPolyfill.registerDialog = function(element) {
	    if (!element.showModal) {
	      dialogPolyfill.forceRegisterDialog(element);
	    }
	  };

	  /**
	   * @constructor
	   */
	  dialogPolyfill.DialogManager = function() {
	    /** @type {!Array<!dialogPolyfillInfo>} */
	    this.pendingDialogStack = [];

	    var checkDOM = this.checkDOM_.bind(this);

	    // The overlay is used to simulate how a modal dialog blocks the document.
	    // The blocking dialog is positioned on top of the overlay, and the rest of
	    // the dialogs on the pending dialog stack are positioned below it. In the
	    // actual implementation, the modal dialog stacking is controlled by the
	    // top layer, where z-index has no effect.
	    this.overlay = document.createElement('div');
	    this.overlay.className = '_dialog_overlay';
	    this.overlay.addEventListener('click', function(e) {
	      this.forwardTab_ = undefined;
	      e.stopPropagation();
	      checkDOM([]);  // sanity-check DOM
	    }.bind(this));

	    this.handleKey_ = this.handleKey_.bind(this);
	    this.handleFocus_ = this.handleFocus_.bind(this);

	    this.zIndexLow_ = 100000;
	    this.zIndexHigh_ = 100000 + 150;

	    this.forwardTab_ = undefined;

	    if ('MutationObserver' in window) {
	      this.mo_ = new MutationObserver(function(records) {
	        var removed = [];
	        records.forEach(function(rec) {
	          for (var i = 0, c; c = rec.removedNodes[i]; ++i) {
	            if (!(c instanceof Element)) {
	              continue;
	            } else if (c.localName === 'dialog') {
	              removed.push(c);
	            }
	            removed = removed.concat(c.querySelectorAll('dialog'));
	          }
	        });
	        removed.length && checkDOM(removed);
	      });
	    }
	  };

	  /**
	   * Called on the first modal dialog being shown. Adds the overlay and related
	   * handlers.
	   */
	  dialogPolyfill.DialogManager.prototype.blockDocument = function() {
	    document.documentElement.addEventListener('focus', this.handleFocus_, true);
	    document.addEventListener('keydown', this.handleKey_);
	    this.mo_ && this.mo_.observe(document, {childList: true, subtree: true});
	  };

	  /**
	   * Called on the first modal dialog being removed, i.e., when no more modal
	   * dialogs are visible.
	   */
	  dialogPolyfill.DialogManager.prototype.unblockDocument = function() {
	    document.documentElement.removeEventListener('focus', this.handleFocus_, true);
	    document.removeEventListener('keydown', this.handleKey_);
	    this.mo_ && this.mo_.disconnect();
	  };

	  /**
	   * Updates the stacking of all known dialogs.
	   */
	  dialogPolyfill.DialogManager.prototype.updateStacking = function() {
	    var zIndex = this.zIndexHigh_;

	    for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
	      dpi.updateZIndex(--zIndex, --zIndex);
	      if (i === 0) {
	        this.overlay.style.zIndex = --zIndex;
	      }
	    }

	    // Make the overlay a sibling of the dialog itself.
	    var last = this.pendingDialogStack[0];
	    if (last) {
	      var p = last.dialog.parentNode || document.body;
	      p.appendChild(this.overlay);
	    } else if (this.overlay.parentNode) {
	      this.overlay.parentNode.removeChild(this.overlay);
	    }
	  };

	  /**
	   * @param {Element} candidate to check if contained or is the top-most modal dialog
	   * @return {boolean} whether candidate is contained in top dialog
	   */
	  dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function(candidate) {
	    while (candidate = findNearestDialog(candidate)) {
	      for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
	        if (dpi.dialog === candidate) {
	          return i === 0;  // only valid if top-most
	        }
	      }
	      candidate = candidate.parentElement;
	    }
	    return false;
	  };

	  dialogPolyfill.DialogManager.prototype.handleFocus_ = function(event) {
	    if (this.containedByTopDialog_(event.target)) { return; }

	    event.preventDefault();
	    event.stopPropagation();
	    safeBlur(/** @type {Element} */ (event.target));

	    if (this.forwardTab_ === undefined) { return; }  // move focus only from a tab key

	    var dpi = this.pendingDialogStack[0];
	    var dialog = dpi.dialog;
	    var position = dialog.compareDocumentPosition(event.target);
	    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
	      if (this.forwardTab_) {  // forward
	        dpi.focus_();
	      } else {  // backwards
	        document.documentElement.focus();
	      }
	    } else {
	      // TODO: Focus after the dialog, is ignored.
	    }

	    return false;
	  };

	  dialogPolyfill.DialogManager.prototype.handleKey_ = function(event) {
	    this.forwardTab_ = undefined;
	    if (event.keyCode === 27) {
	      event.preventDefault();
	      event.stopPropagation();
	      var cancelEvent = new supportCustomEvent('cancel', {
	        bubbles: false,
	        cancelable: true
	      });
	      var dpi = this.pendingDialogStack[0];
	      if (dpi && dpi.dialog.dispatchEvent(cancelEvent)) {
	        dpi.dialog.close();
	      }
	    } else if (event.keyCode === 9) {
	      this.forwardTab_ = !event.shiftKey;
	    }
	  };

	  /**
	   * Finds and downgrades any known modal dialogs that are no longer displayed. Dialogs that are
	   * removed and immediately readded don't stay modal, they become normal.
	   *
	   * @param {!Array<!HTMLDialogElement>} removed that have definitely been removed
	   */
	  dialogPolyfill.DialogManager.prototype.checkDOM_ = function(removed) {
	    // This operates on a clone because it may cause it to change. Each change also calls
	    // updateStacking, which only actually needs to happen once. But who removes many modal dialogs
	    // at a time?!
	    var clone = this.pendingDialogStack.slice();
	    clone.forEach(function(dpi) {
	      if (removed.indexOf(dpi.dialog) !== -1) {
	        dpi.downgradeModal();
	      } else {
	        dpi.maybeHideModal();
	      }
	    });
	  };

	  /**
	   * @param {!dialogPolyfillInfo} dpi
	   * @return {boolean} whether the dialog was allowed
	   */
	  dialogPolyfill.DialogManager.prototype.pushDialog = function(dpi) {
	    var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
	    if (this.pendingDialogStack.length >= allowed) {
	      return false;
	    }
	    if (this.pendingDialogStack.unshift(dpi) === 1) {
	      this.blockDocument();
	    }
	    this.updateStacking();
	    return true;
	  };

	  /**
	   * @param {!dialogPolyfillInfo} dpi
	   */
	  dialogPolyfill.DialogManager.prototype.removeDialog = function(dpi) {
	    var index = this.pendingDialogStack.indexOf(dpi);
	    if (index === -1) { return; }

	    this.pendingDialogStack.splice(index, 1);
	    if (this.pendingDialogStack.length === 0) {
	      this.unblockDocument();
	    }
	    this.updateStacking();
	  };

	  dialogPolyfill.dm = new dialogPolyfill.DialogManager();
	  dialogPolyfill.formSubmitter = null;
	  dialogPolyfill.useValue = null;

	  /**
	   * Installs global handlers, such as click listers and native method overrides. These are needed
	   * even if a no dialog is registered, as they deal with <form method="dialog">.
	   */
	  if (window.HTMLDialogElement === undefined) {

	    /**
	     * If HTMLFormElement translates method="DIALOG" into 'get', then replace the descriptor with
	     * one that returns the correct value.
	     */
	    var testForm = document.createElement('form');
	    testForm.setAttribute('method', 'dialog');
	    if (testForm.method !== 'dialog') {
	      var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method');
	      if (methodDescriptor) {
	        // TODO: older iOS and older PhantomJS fail to return the descriptor here
	        var realGet = methodDescriptor.get;
	        methodDescriptor.get = function() {
	          if (isFormMethodDialog(this)) {
	            return 'dialog';
	          }
	          return realGet.call(this);
	        };
	        var realSet = methodDescriptor.set;
	        methodDescriptor.set = function(v) {
	          if (typeof v === 'string' && v.toLowerCase() === 'dialog') {
	            return this.setAttribute('method', v);
	          }
	          return realSet.call(this, v);
	        };
	        Object.defineProperty(HTMLFormElement.prototype, 'method', methodDescriptor);
	      }
	    }

	    /**
	     * Global 'click' handler, to capture the <input type="submit"> or <button> element which has
	     * submitted a <form method="dialog">. Needed as Safari and others don't report this inside
	     * document.activeElement.
	     */
	    document.addEventListener('click', function(ev) {
	      dialogPolyfill.formSubmitter = null;
	      dialogPolyfill.useValue = null;
	      if (ev.defaultPrevented) { return; }  // e.g. a submit which prevents default submission

	      var target = /** @type {Element} */ (ev.target);
	      if (!target || !isFormMethodDialog(target.form)) { return; }

	      var valid = (target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1);
	      if (!valid) {
	        if (!(target.localName === 'input' && target.type === 'image')) { return; }
	        // this is a <input type="image">, which can submit forms
	        dialogPolyfill.useValue = ev.offsetX + ',' + ev.offsetY;
	      }

	      var dialog = findNearestDialog(target);
	      if (!dialog) { return; }

	      dialogPolyfill.formSubmitter = target;
	    }, false);

	    /**
	     * Replace the native HTMLFormElement.submit() method, as it won't fire the
	     * submit event and give us a chance to respond.
	     */
	    var nativeFormSubmit = HTMLFormElement.prototype.submit;
	    function replacementFormSubmit() {
	      if (!isFormMethodDialog(this)) {
	        return nativeFormSubmit.call(this);
	      }
	      var dialog = findNearestDialog(this);
	      dialog && dialog.close();
	    }
	    HTMLFormElement.prototype.submit = replacementFormSubmit;

	    /**
	     * Global form 'dialog' method handler. Closes a dialog correctly on submit
	     * and possibly sets its return value.
	     */
	    document.addEventListener('submit', function(ev) {
	      var form = /** @type {HTMLFormElement} */ (ev.target);
	      if (!isFormMethodDialog(form)) { return; }
	      ev.preventDefault();

	      var dialog = findNearestDialog(form);
	      if (!dialog) { return; }

	      // Forms can only be submitted via .submit() or a click (?), but anyway: sanity-check that
	      // the submitter is correct before using its value as .returnValue.
	      var s = dialogPolyfill.formSubmitter;
	      if (s && s.form === form) {
	        dialog.close(dialogPolyfill.useValue || s.value);
	      } else {
	        dialog.close();
	      }
	      dialogPolyfill.formSubmitter = null;
	    }, true);
	  }

	  dialogPolyfill['forceRegisterDialog'] = dialogPolyfill.forceRegisterDialog;
	  dialogPolyfill['registerDialog'] = dialogPolyfill.registerDialog;

	  if ("function" === 'function' && 'amd' in __webpack_require__(18)) {
	    // AMD support
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return dialogPolyfill; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module === 'object' && typeof module['exports'] === 'object') {
	    // CommonJS support
	    module['exports'] = dialogPolyfill;
	  } else {
	    // all others
	    window['dialogPolyfill'] = dialogPolyfill;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)(module)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ })
/******/ ]);