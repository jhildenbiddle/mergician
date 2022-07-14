/* global window, document, Docsify, $docsify, RunKit */
/* eslint-disable no-var */

// RunKit Embed documentation: https://runkit.com/docs/embed

// var runkitOptions = [
//     // Environment variables for the execution environment. Available under
//     // `process.env`. Defaults to []
//     // TYPE: Array<{name: string, value: string}>
//     environment,

//     // Evaluate the Embed when it finishes loading.
//     // TYPE: boolean
//     evaluateOnLoad,

//     // Where the line numbers should appear. Defaults to "outside"
//     // TYPE: "inside" | "none" | "outside"
//     gutterStyle,

//     // Hides the "▶ Run" button. In Endpoint mode, Hides the endpoint URL.
//     // TYPE: boolean
//     hidesActionButton,

//     // In Endpoint mode, Hides the logs that would appear when hitting the Endpoint.
//     // See https://runkit.com/docs/endpoint.
//     // TYPE: boolean
//     hidesEndpointLogs,

//     // Minimum height of the embed in pixels. E.g. "100px". Defaults to "73px"
//     // TYPE: cssPxString
//     minHeight,

//     // When in default mode RunKit Embeds behave like a regular notebook and display
//     // outputs after each evaluation. When the Embed is in endpoint mode the outputs
//     // are replaced by endpoint logs and a URL is provided to run the Embed code. See
//     // https://runkit.com/docs/endpoint. Defaults to "default"
//     // TYPE: "endpoint" | "default"
//     mode,

//     // A semver range that the node engine should satisfy, e.g. "4.0.x" or ">
//     // 6.9.2". Defaults to "10.x.x"
//     // TYPE: semverRange
//     nodeVersion,

//     // The timestamp in UTC milliseconds to recreate the state of package
//     // availability. No packages published to npm after this time are available in this
//     // embed. Useful for reproducing bugs, or guaranteeing dependency versions. By
//     // default the timestamp is set to the time the embed is created.
//     // TYPE: number | null
//     packageTimestamp,

//     // Code in the preamble field will not be displayed in the embed, but will be
//     // executed before running the code in the embed. For example, libraries that use
//     // RunKit for documentation often require their package in the preamble to avoid
//     // clutter in the embed code.
//     // TYPE: string
//     preamble,
//     // TYPE: boolean
//     readOnly,
//     // An Integer Minimum of 0 Defaults to 4
//     // TYPE: number
//     tabSize,
//     // The title of the RunKit Notebook when it is saved on RunKit.
//     // TYPE: string
//     title
// ];

function addEvents() {
    // Resize <iframe>
    window.addEventListener('message', function (e) {
        if (e.origin !== 'https://runkit.com') {
            return;
        }

        var data;

        try {
            data = JSON.parse(e.data);
        }
        catch (e) {
            return false;
        }

        if (data.context !== 'iframe.resize') {
            return false;
        }

        var iframe = document.querySelector('iframe[src="' + data.src + '"]');

        if (!iframe) {
            return false;
        }

        if (data.height) {
            iframe.height = data.height;
        }
    });
}

function appendScript() {
    var scriptElm = document.createElement('script');

    scriptElm.src = 'https://embed.runkit.com';

    document.body.appendChild(scriptElm);
}

function appendStyle() {
    var styleElm = document.createElement('style');

    styleElm.textContent = [
        '[data-runkit], [data-runkit-url] { margin: 1em 0; }',
        '[data-runkit] pre { display: none; }',
        '[data-runkit-url] iframe { width: calc(100% + 100px) !important; margin-left: -50px !important; }'
    ].join('\n');

    document.body.appendChild(styleElm);
}

function init() {
    var runkitElms = [].slice.call(document.querySelectorAll('[data-runkit], [data-runkit-url]'));

    runkitElms.forEach(function(runkitElm) {
        // [data-runkit]
        if (runkitElm.matches('[data-runkit]')) {
            var attrNames = runkitElm.getAttributeNames();
            var preElm = runkitElm.querySelector('pre[data-lang]');
            var codeElm = preElm.querySelector('code');
            var sourceCode = codeElm.textContent;
            var notebookConfig = Object.assign({}, $docsify.runkit || {}, {
                element: runkitElm,
                source: sourceCode
            });

            attrNames.forEach(function(attr) {
                var val = (runkitElm.getAttribute(attr) || '').trim();

                if (val) {
                    var prop = (attr.match(/data-runkit-(\S*)/) || [])[1];

                    // Dash case to camelCase
                    prop = prop.replace(/-([a-z])/g, function(m) {
                        return m[1].toUpperCase();
                    });

                    // Allow numbers for semver string (e.g., 12.2 => '12.2')
                    if (prop === 'nodeVersion') {
                        val = typeof val === 'number' ? String(val) : val;
                    }
                    // Boolean
                    else if (val === 'true' || val === 'false') {
                        val = val === 'true';
                    }
                    // Array / Object
                    else if (/^[{[].*[}\]]$/s.test(val)) {
                        val = JSON.parse(val);
                    }
                    // Number
                    else if (!isNaN(val)) {
                        val = Number(val);
                    }

                    notebookConfig[prop] = val;
                }
            });

            RunKit.createNotebook(notebookConfig);
        }
        // [data-runkit-url]
        else {
            var baseURL = 'https://embed.runkit.com/oembed?url=';
            var notebookURL = runkitElm.getAttribute('data-runkit-url');
            var embedURL = baseURL + notebookURL;

            Docsify.get(embedURL).then(function(response) {
                var data = JSON.parse(response);

                runkitElm.insertAdjacentHTML('afterbegin', data.html);
            });
        }
    });
}

function waitFor(options) {
    var defaults = {
        testFn: false,
        successFn: Function.prototype,
        failFn: Function.prototype,
        interval: 500,
        timeout: 2500
    };
    var settings = Object.assign({}, defaults, options);
    var elapsed = 0;
    var waitInterval = setInterval(function() {
        if (elapsed >= settings.timeout) {
            clearInterval(waitInterval);
            settings.failFn();
        }

        if (settings.testFn()) {
            clearInterval(waitInterval);
            settings.successFn();
        }
        else {
            elapsed += settings.interval;
        }
    }, settings.interval);
}

(function() {
    appendScript();
    appendStyle();

    var docsifyRunKit = function (hook, vm) {
        hook.init(function () {
            addEvents();
        });

        hook.ready(function () {
            waitFor({
                testFn: function() {
                    return window.RunKit;
                },
                failFn: function() {
                    // eslint-disable-next-line no-console
                    console.warn('docsify-plugin-runkit: RunKit not available');
                },
                successFn: init
            });
        });
    };

    // Add plugin to docsify's plugin array
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(docsifyRunKit, window.$docsify.plugins || []);
})();
