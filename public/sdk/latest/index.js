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
        this.events = [];
        this.iFrame = null;
        this.xDown = 0;
        this.lastTouchX = 0;
        this.startTimestamp = 0;
        this.on = this.on.bind(this);
    }
    MyfanAuth.prototype.init = function (url) {
        var _this = this;
        this.url = url;
        this.createOverlay();
        this.createWrapper();
        this.on('close', function () {
            _this.hideElements({ target: null });
        });
        return this;
    };
    MyfanAuth.prototype.show = function (path) {
        var _this = this;
        this.throwIfNotInitialized();
        document.body.style.overflow = 'hidden';
        if (this.getWrapper())
            this.getWrapper().style.height = window.innerHeight + 'px';
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (iOS) {
            document.body.style.position = 'fixed';
        }
        this.createOverlay();
        this.createWrapper();
        setTimeout(function () {
            _this.getOverlay().style.display = 'block';
            _this.getWrapper().style.right = '0';
        }, 0);
        if (path)
            this.navigate(path);
        return this;
    };
    MyfanAuth.prototype.hide = function () {
        this.throwIfNotInitialized();
        if (this.getWrapper())
            this.getWrapper().style.right = '-' + this.getWrapper().offsetWidth + 'px';
        if (this.getOverlay())
            this.getOverlay().style.display = 'none';
        document.body.style.overflow = 'visible';
        document.body.style.position = 'initial';
    };
    MyfanAuth.prototype.close = function () {
        this.throwIfNotInitialized();
        this.removeOverlay();
        this.removeWrapper();
        this.clearEvents();
        document.body.style.overflow = 'visible';
        document.body.style.position = 'initial';
    };
    MyfanAuth.prototype.on = function (action, callback) {
        function authListener(e) {
            if (action === e.data.action) {
                callback(e.data);
            }
        }
        if (this.isExistsEvent(action))
            return this;
        window.addEventListener('message', authListener.bind(this));
        this.addEvent(action);
        return this;
    };
    MyfanAuth.prototype.onLoad = function (cb) {
        if (this.loaded) {
            cb();
        }
        else {
            this.onLoadCb = cb;
        }
        return this;
    };
    MyfanAuth.prototype.showLoader = function () {
        var _this = this;
        if (!this.loaded) {
            this.createOverlay();
            setTimeout(function () {
                _this.getOverlay().style.display = 'block';
            }, 0);
        }
        return this;
    };
    MyfanAuth.prototype.navigate = function (path) {
        return this.sendJson({
            do: 'navigation',
            to: path,
        });
    };
    MyfanAuth.prototype.buy = function (item) {
        item.clientProductId = item.id;
        return this.sendJson({
            do: 'payment',
            item: item,
            parentUrl: window.location.href,
        });
    };
    MyfanAuth.prototype.removeLoader = function () {
        this.getLoader() && this.getLoader().parentNode.removeChild(this.getLoader());
        this.loader = null;
    };
    MyfanAuth.prototype.createLoader = function () {
        var p = this.getLoader();
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
        p.setAttribute('id', 'myfan-loader');
        document.body.prepend(p);
        this.loader = p;
    };
    MyfanAuth.prototype.whileLoading = function (cb) {
        if (!this.loaded) {
            cb();
        }
        return this;
    };
    MyfanAuth.prototype.throwIfNotInitialized = function () {
        if (!this.getIFrame())
            throw new Error('iframe is not initialized');
    };
    MyfanAuth.prototype.hideElements = function (evt) {
        if (evt.target === this.getIFrame())
            return;
        if (this.getWrapper())
            this.getWrapper().style.right = '-' + this.getWrapper().offsetWidth + 'px';
        if (this.getOverlay())
            this.getOverlay().style.display = 'none';
        document.body.style.overflow = 'visible';
        document.body.style.position = 'initial';
    };
    MyfanAuth.prototype.isExistsEvent = function (action) {
        return this.events.find(function (event) { return event === action; });
    };
    MyfanAuth.prototype.addEvent = function (action) {
        this.events.push(action);
    };
    MyfanAuth.prototype.clearEvents = function () {
        this.events = [];
    };
    MyfanAuth.prototype.getLoader = function () {
        return this.loader;
    };
    MyfanAuth.prototype.getOverlay = function () {
        return this.overlay;
    };
    MyfanAuth.prototype.removeOverlay = function () {
        this.getOverlay().parentNode.removeChild(this.getOverlay());
        this.overlay = null;
    };
    MyfanAuth.prototype.createOverlay = function () {
        var div = this.getOverlay();
        if (div)
            return div;
        div = document.createElement('div');
        div.addEventListener('click', this.hideElements.bind(this));
        div.setAttribute('id', 'myfan-overlay');
        document.body.prepend(div);
        this.overlay = div;
    };
    MyfanAuth.prototype.getWrapper = function () {
        return this.wrapper;
    };
    MyfanAuth.prototype.removeWrapper = function () {
        this.getWrapper().parentNode.removeChild(this.getWrapper());
        this.wrapper = null;
    };
    MyfanAuth.prototype.createWrapper = function () {
        var wrapper = this.getWrapper();
        if (wrapper)
            return wrapper;
        wrapper = document.createElement('div');
        wrapper.addEventListener('click', this.hideElements.bind(this), false);
        wrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        wrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        wrapper.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        wrapper.setAttribute('id', 'myfan-login-form-wrapper');
        wrapper.style.height = window.innerHeight + 'px';
        var xDiv = document.createElement('div');
        xDiv.setAttribute('id', 'empty-div');
        wrapper.prepend(xDiv);
        document.body.before(wrapper);
        this.createIFrame();
        this.wrapper = wrapper;
    };
    MyfanAuth.prototype.getIFrame = function () {
        return this.iFrame;
    };
    MyfanAuth.prototype.createIFrame = function () {
        var _this = this;
        var iframe = this.getIFrame();
        if (iframe)
            return iframe;
        iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'myfan-login-form-iframe');
        iframe.setAttribute('src', this.url);
        iframe.addEventListener('load', function () {
            if (_this.onLoadCb) {
                _this.onLoadCb();
            }
            _this.loaded = true;
        }, false);
        var wrapper = document.getElementById('myfan-login-form-wrapper');
        wrapper && wrapper.append(iframe);
        this.iFrame = iframe;
    };
    MyfanAuth.prototype.sendJson = function (message) {
        if (typeof message !== 'undefined') {
            var parsel = {
                source: 'client',
                data: message,
            };
            this.getIFrame() && this.getIFrame().contentWindow.postMessage(JSON.stringify(parsel), '*');
        }
        return this;
    };
    MyfanAuth.prototype.getTouches = function (evt) {
        return evt.touches;
    };
    MyfanAuth.prototype.handleTouchStart = function (evt) {
        this.getWrapper().style.transition = 'none';
        this.startTimestamp = new Date().getTime();
        var firstTouch = this.getTouches(evt)[0];
        this.xDown = firstTouch.screenX;
        this.lastTouchX = evt.touches[0].screenX;
    };
    MyfanAuth.prototype.handleTouchEnd = function (evt) {
        var wrapper = this.getWrapper();
        wrapper.style.transition = 'right 0.2s';
        if (-parseInt(wrapper.style.right) > wrapper.offsetWidth / 2 ||
            (new Date().getTime() - this.startTimestamp < 200 && this.lastTouchX - this.xDown > 24)) {
            this.hideElements(evt);
        }
        else {
            wrapper.style.right = '0';
            wrapper.style.transition = 'right 0.5s';
        }
        this.lastTouchX = 0;
    };
    MyfanAuth.prototype.handleTouchMove = function (evt) {
        var xScreen = (evt.touches[0].screenX - this.xDown);
        var wrapper = this.getWrapper();
        if (xScreen > 0) {
            wrapper.style.right = -xScreen + 'px';
        }
        this.lastTouchX = evt.touches[0].screenX;
    };
    return MyfanAuth;
}());
