/* 语言切换器 - 跨子站版：EN / ES / JA 三个独立 Pages 子站互跳 */
(function() {
    if (window.__langSwitcherLoaded) return;
    window.__langSwitcherLoaded = true;

    var SITES = {
        'en': 'https://andy-develop.github.io/runoob-wiki-en/',
        'es': 'https://andy-develop.github.io/runoob-wiki-es/',
        'ja': 'https://andy-develop.github.io/runoob-wiki-ja/'
    };
    var ORDER = ['en', 'es', 'ja'];
    var LANGS = {
        'en': { label: 'English', short: 'EN' },
        'es': { label: 'Español', short: 'ES' },
        'ja': { label: '日本語', short: 'JA' }
    };

    var path = window.location.pathname || '/';
    var currentLang = 'en';
    var relPath = path;

    // 生产环境：匹配 /runoob-wiki-{lang}/ 前缀（独立 Pages 子站域名）
    var matched = false;
    ORDER.forEach(function(l) {
        var repo = SITES[l].split('/').filter(Boolean).pop();
        var prefix = '/' + repo + '/';
        if (path.indexOf(prefix) === 0) {
            currentLang = l;
            relPath = path.slice(prefix.length - 1); // 保留开头的 '/'
            matched = true;
        }
    });
    // 兜底（本地直接打开子站目录）：匹配 /{lang}/ 路径前缀
    if (!matched) {
        ORDER.forEach(function(l) {
            if (path.indexOf('/' + l + '/') === 0 || path.endsWith('/' + l) || path.endsWith('/' + l + '/')) {
                currentLang = l;
                relPath = path.replace(new RegExp('^/' + l), '') || '/';
            }
        });
    }
    if (relPath.charAt(0) !== '/') relPath = '/' + relPath;

    // 目标 URL = 目标站基址 + 相对路径（保持 search/hash）
    function buildTarget(lang) {
        var base = SITES[lang].replace(/\/+$/, '');
        var target = base + relPath;
        target += window.location.search + window.location.hash;
        return target;
    }

    // 创建按钮容器
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:12px;right:12px;z-index:99999;display:flex;gap:4px;align-items:center;';

    ORDER.forEach(function(lang) {
        var isCurrent = lang === currentLang;
        var btn = document.createElement('a');
        if (!isCurrent) {
            btn.href = buildTarget(lang);
        }
        btn.textContent = LANGS[lang].short;
        btn.title = LANGS[lang].label;
        btn.style.cssText = 'display:inline-block;padding:8px 14px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:700;transition:background 0.2s;cursor:pointer;' + (isCurrent
            ? 'background:rgba(255,255,255,0.9);color:#5c9e6e;box-shadow:0 2px 10px rgba(0,0,0,0.1);'
            : 'background:#5c9e6e;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,0.2);');
        if (!isCurrent) {
            btn.onmouseover = function() { this.style.background = '#4a8a5c'; };
            btn.onmouseout = function() { this.style.background = '#5c9e6e'; };
            btn.onclick = function() {
                try { localStorage.setItem('preferred_lang', lang); } catch(e) {}
            };
        }
        container.appendChild(btn);
    });

    // 等待 body 可用
    function inject() {
        if (document.body) {
            document.body.appendChild(container);
        } else {
            setTimeout(inject, 100);
        }
    }
    inject();
})();
