var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://fcspdemo.myfan.co/sdk/styles.css';
//link.href  = './sdk/styles.css';
link.media = 'all';
head.appendChild(link);
var MyfanAuth = /** @class */ (function () {
    function MyfanAuth() {
        var _this = this;
        this.events = [];
        this.xDown = 0;
        this.lastTouchX = 0;
        this.startTimestamp = 0;
        this.init = function (url) {
            _this.url = url;
            _this.createOverlay();
            _this.createWrapper();
            _this.on('close', function () {
                _this.hideElements({ target: null });
            });
            return _this;
        };
        this.show = function (path) {
            document.body.style.overflow = 'hidden';
            if (_this.getWrapper())
                _this.getWrapper().style.height = window.innerHeight + 'px';
            var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
            if (iOS) {
                document.body.style.position = 'fixed';
            }
            _this.createOverlay();
            _this.createWrapper();
            setTimeout(function () {
                _this.getOverlay().style.display = 'block';
                _this.getWrapper().style.right = '0';
            }, 0);
            if (path)
                _this.navigate(path);
            return _this;
        };
        this.hideElements = function (evt) {
            if (evt.target === _this.getIFrame())
                return;
            if (_this.getWrapper())
                _this.getWrapper().style.right = '-' + _this.getWrapper().offsetWidth + 'px';
            if (_this.getOverlay())
                _this.getOverlay().style.display = 'none';
            document.body.style.overflow = 'visible';
            document.body.style.position = 'initial';
        };
        this.close = function () {
            _this.removeOverlay();
            _this.removeWrapper();
            _this.clearEvents();
            document.body.style.overflow = 'visible';
            document.body.style.position = 'initial';
        };
        this.on = function (action, callback) {
            function authListener(e) {
                if (action === e.data.action) {
                    callback(e.data);
                }
            }
            if (_this.isExistsEvent(action))
                return _this;
            window.addEventListener('message', authListener.bind(_this));
            _this.addEvent(action);
            return _this;
        };
        this.onLoad = function (cb) {
            if (_this.loaded) {
                cb();
            }
            else {
                _this.onLoadCb = cb;
            }
            return _this;
        };
        this.showLoader = function () {
            if (!_this.loaded) {
                _this.createOverlay();
                setTimeout(function () {
                    _this.getOverlay().style.display = 'block';
                }, 0);
            }
            return _this;
        };
        this.navigate = function (path) {
            return _this.sendJson({
                do: 'navigation',
                to: path,
            });
        };
        this.buy = function (item) {
            item.clientProductId = item.id;
            return _this.sendJson({
                do: 'payment',
                item: item,
                parentUrl: window.location.href,
            });
        };
        this.removeLoader = function () {
            _this.getLoader() && _this.getLoader().parentNode.removeChild(_this.getLoader());
            _this.loader = null;
        };
        this.createLoader = function () {
            var p = _this.getLoader();
            if (p)
                return p;
            p = document.createElement('p');
            p.innerText = 'Loading ...';
            p.style.fontSize = '40px';
            p.style.position = 'absolute';
            p.style.color = 'white';
            p.style.top = '50%';
            p.style.left = '50%';
            p.style.marginTop = '-50px';
            p.style.marginLeft = '-50px';
            p.style.zIndex = '99998';
            p.setAttribute('id', '@myfan/loader');
            document.body.prepend(p);
            _this.loader = p;
        };
        this.whileLoading = function (cb) {
            if (!_this.loaded) {
                cb();
            }
            return _this;
        };
        this.isExistsEvent = function (action) {
            return _this.events.find(function (event) { return event === action; });
        };
        this.addEvent = function (action) {
            _this.events.push(action);
        };
        this.clearEvents = function () {
            _this.events = [];
        };
        this.getLoader = function () {
            return _this.loader;
        };
        this.getOverlay = function () {
            return _this.overlay;
        };
        this.removeOverlay = function () {
            _this.getOverlay().parentNode.removeChild(_this.getOverlay());
            _this.overlay = null;
        };
        this.createOverlay = function () {
            var div = _this.getOverlay();
            if (div)
                return div;
            div = document.createElement('div');
            div.addEventListener('click', _this.hideElements.bind(_this));
            div.setAttribute('id', '@myfan/overlay');
            document.body.prepend(div);
            _this.overlay = div;
        };
        this.getWrapper = function () {
            return _this.wrapper;
        };
        this.removeWrapper = function () {
            _this.getWrapper().parentNode.removeChild(_this.getWrapper());
            _this.wrapper = null;
        };
        this.createWrapper = function () {
            var wrapper = _this.getWrapper();
            if (wrapper)
                return wrapper;
            wrapper = document.createElement('div');
            wrapper.addEventListener('click', _this.hideElements.bind(_this), false);
            wrapper.addEventListener('touchstart', _this.handleTouchStart.bind(_this), { passive: true });
            wrapper.addEventListener('touchend', _this.handleTouchEnd.bind(_this), { passive: true });
            wrapper.addEventListener('touchmove', _this.handleTouchMove.bind(_this), { passive: true });
            wrapper.setAttribute('id', '@myfan/login-form-wrapper');
            wrapper.style.height = window.innerHeight + 'px';
            var xDiv = document.createElement('div');
            xDiv.setAttribute('id', 'empty-div');
            wrapper.prepend(xDiv);
            document.body.before(wrapper);
            _this.createIFrame();
            _this.wrapper = wrapper;
        };
        this.getIFrame = function () {
            return _this.iFrame;
        };
        this.createIFrame = function () {
            var iframe = _this.getIFrame();
            if (iframe)
                return iframe;
            iframe = document.createElement('iframe');
            iframe.setAttribute('id', '@myfan/login-form-iframe');
            iframe.setAttribute('src', _this.url);
            iframe.addEventListener('load', function () {
                if (_this.onLoadCb) {
                    _this.onLoadCb();
                }
                _this.loaded = true;
            }, false);
            var wrapper = document.getElementById('@myfan/login-form-wrapper');
            wrapper && wrapper.append(iframe);
            _this.iFrame = iframe;
        };
        this.sendJson = function (message) {
            if (typeof message !== 'undefined') {
                var parsel = {
                    source: 'client',
                    data: message,
                };
                _this.getIFrame() && _this.getIFrame().contentWindow.postMessage(JSON.stringify(parsel), '*');
            }
            return _this;
        };
        this.getTouches = function (evt) {
            return evt.touches;
        };
        this.handleTouchStart = function (evt) {
            _this.getWrapper().style.transition = 'none';
            _this.startTimestamp = new Date().getTime();
            var firstTouch = _this.getTouches(evt)[0];
            _this.xDown = firstTouch.screenX;
            _this.lastTouchX = evt.touches[0].screenX;
        };
        this.handleTouchEnd = function (evt) {
            var wrapper = _this.getWrapper();
            wrapper.style.transition = 'right 0.2s';
            if (-parseInt(wrapper.style.right) > wrapper.offsetWidth / 2 ||
                (new Date().getTime() - _this.startTimestamp < 200 && _this.lastTouchX - _this.xDown > 24)) {
                _this.hideElements(evt);
            }
            else {
                wrapper.style.right = '0';
                wrapper.style.transition = 'right 0.5s';
            }
            _this.lastTouchX = 0;
        };
        this.handleTouchMove = function (evt) {
            var xScreen = (evt.touches[0].screenX - _this.xDown);
            var wrapper = _this.getWrapper();
            if (xScreen > 0) {
                wrapper.style.right = -xScreen + 'px';
            }
            _this.lastTouchX = evt.touches[0].screenX;
        };
        this.on = this.on.bind(this);
    }
    return MyfanAuth;
}());
