<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Atum Console</title>
    
    <link type="text/css" rel="stylesheet" href="resources/jquery-ui-1.10.3/css/ui-lightness/jquery-ui-1.10.3.custom.css" />
    <link type="text/css" rel="stylesheet" href="resources/layout-default-latest.css" />
    <link type="text/css" rel="stylesheet" href="resources/codemirror-3.14/codemirror.css" />
    
    <style>
        @import url(https://fonts.googleapis.com/css?family=Lato:300italic,700italic,300,700);
    
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        
        body {
            font:14px/1.5 Lato, "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        
        #page-header {
            
        }
        
        #page-title {
            position: absolute;
            margin: 0 0.25em;
            padding: 0;
            font-size: 1.6em;
            float: left;
        }
        
        #container {
            box-sizing: border-box;
            min-height: 400px;
            min-width: 800px;
            height: 100%;
            width: 100%;
            padding-top: 33px;
        }

        .pane {
            position: relative;
            padding: 0;
            margin: 0;
            width: auto;
        }
        
        .pane-header {
            border-bottom: 1px solid gray;
        }
        
        .pane-title {
            margin: 0;
            font-weight: normal;
            font-size: 1.2em;
            color: black;
            padding: 0 0.25em;
        }

        .ui-layout-resizer {
            border: 0;
        }
        
        #input {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            padding-bottom: 19px;
        }
        
         #input .CodeMirror {
            height: 100%;
         }
         
         #input .CodeMirror-scroll {
            margin-bottom: 0;
            padding-bottom: 0;
         }
        
        .console .workspace {
            width: auto;
            border-bottom: 1px solid gray;
            position: relative;
        }
        
        .console .workspace .controls {
            border-top: 1px solid lightgray;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        
        .console .workspace .run-buttons > *,
        .console .workspace .debug-buttons > * {
            display: block;
            padding: 0 1em;
            font-size: 0.90em;
        }
        
        .console .workspace .run-buttons {
            float: right;
        }
        
        .console .workspace .run-buttons > * {
            float: right;
            border-left: 1px solid gray;
        }
        
        .console .workspace .debug-buttons {
            float: left;
        }
        .console .workspace .debug-buttons > * {
            float: left;
            border-right: 1px solid gray;
        }
        
        .ui-widget {
            font:inherit;
            }
        
        .ui-corner-all {
            border-radius: 0;
        }
        
        .ui-button {
            color: black;
            border: 0;
            background: transparent;
            margin: 0;
            border: 0;
        }
        
        .ui-button.ui-state-hover .ui-icon {
            opacity: 0.50;
        }
        
        .ui-button-text-only .ui-button-text {
            padding: 0.1em 0.25em;
        }
        
        .ui-state-default .ui-icon {
            background-image: url(resources/jquery-ui-1.10.3/css/ui-lightness/images/ui-icons_222222_256x240.png);
        }
        
        button {

        }
        
        .output-error {
            color: red;
        }
        .output-value {
        
        }
        
        #text_out {
            padding: 0;
            margin: 0;
        }
        
        .code {
            font-family: Courier New, monospace;
        }
        
    /* Environments */
        .environments {
            margin: 0;
            padding: 0;
        }
        
        .environment {
            list-style: none;
            border-bottom: 1px solid gray;
        }

        .binding-list {
            margin: 0;
            padding: 0;
            border-bottom: 1px solid black;
        }
        
        .binding-list > .binding {
            margin-bottom: 0.25em;
        }
        
        .binding {
            list-style: none;
            font-size: 0.90em;
            font-weight: normal;
            line-height: 100%;
        }
        
        .binding .binding-name {
            font-weight: bold;
        }
        
        .binding .binding-value {
            margin-left: 0.15em;
        }
        
        .workspace {
            height: 60%;
        }
        
        .output {
            position: relative;
            height: 40%;
        }
        
        #output-console {
            box-sizing: border-box;
            height: 100%;
            padding-bottom: 18px;
            overflow-y: scroll;
            list-style: none;
            margin: 0;
        }
        
        .output-interactive {
            position: absolute;
            width: 100%;
            bottom: 0;
            border-top: 1px solid red;
        }
        
        .output-interactive-textarea {
            overflow-y: hidden;
            background: red;
        }
        
        .output-interactive-textarea .CodeMirror-hscrollbar {
            display: none;
        }
        
        .object-browser {
            font-size: 1em;
        }
        
        .object-children > .object-value {
            display: inline-block;
        }
        
        .ui-accordion-header,
        .ui-accordion .ui-accordion-header {
            color: black;
            border: 0;
            padding-right: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
        
        .ui-accordion  .ui-accordion-content {
            border: none;
            background: none;
            margin: 0;
            margin-left: 1em;
            padding: 0;
        }
        
        
    /* CodeMirror*/
        .CodeMirror {
            background: transparent;
        }
        
    /* From http://nicolasgallagher.com/micro-clearfix-hack/ */
        .cf:before,
        .cf:after {
            content: " ";
            display: table;
        }
        
        .cf:after {
            clear: both;
        }
    </style>
</head>

<body lang="en">

    <script type="text/html" id="environments-template">
        <li>
            <ul class='binding-list' data-bind="foreach: bindings">
                <li class='binding code'>
                    <span class='binding-name' data-bind="text: name"></span>:<span class='binding-value' data-bind="text: value"></span>
                </li>
            </ul>
        </li>
    </script>
    
    <script type="text/html" id="stack-frame-template">
        <li class='stack-frame'>
            <span class='stack-frame-name' data-bind="text: name"></span>
        </li>
    </script>
    
    <script type="text/html" id="object-template">
        <div class='object-browser'>
            <span class='object-value' data-bind="text: value"></span>
            <ul class='object-children' data-bind="foreach: children">
                <li>
                    <a class='child-key' data-bind="text: key, click: $parent.getChildren"></a>
                    <div data-bind="template: { name: 'object-template', data: value}"></div>
                </li>
            </ul>
        </div>
    </script>
    
    <script type="text/html" id="output-template">
        <li class='output-value' data-bind="css: { 'output-error': error }">
            <div data-bind="template: { name: 'object-template', data: value }"></div>
        </li>
    </script>
    
    
    <header id='page-header' class='cf'>
        <h1 id='page-title'>Atum</h1>
    </header>
    
    <div id='container' class="content">
        <div class='console pane ui-layout-center'>
            <div class='workspace cf'>
                <div id='input'></div>
                <div class='controls cf'>
                    <div class='run-buttons cf'>
                        <button id='eval-button' title='Eval'>eval</button>
                        <button id='debug-button' title='Debug'>debug</button>
                    </div>
                    <div class='debug-buttons cf'>
                        <button id='stop-button' title='stop'><span class="ui-icon ui-icon-stop"></span></button>
                        <button id='run-button' title='run'><span class="ui-icon ui-icon-play"></span></button>
                        <button id='step-button' title='step over'><span class="ui-icon ui-icon-arrowstop-1-e"></span></button>
                        <button id='step-into-button' title='step into'><span class="ui-icon ui-icon-arrowstop-1-s"></span></button>
                        <button id='step-out-button' title='step out'><span class="ui-icon ui-icon-arrowstop-1-n"></span></button>
                    </div>
                </div>
            </div><div class='output code'>
                <ul id='output-console' data-bind="template: { name: 'output-template', foreach: output }"></ul>
                <div class='output-interactive cf'>
                    <div id='output-interactive-textarea'></div>
                </div>
            </div>
        </div>
        
        <div class='debug pane ui-layout-east'>
            <div class='pane-header'>
                <h2 class='pane-title'>State</h2>
            </div>
            <div>
                <ul class='environments' data-bind="template: { name: 'environments-template', foreach: environments }"></ul>
            </div>
        </div>
        
        <div class='callstack pane ui-layout-west'>
            <div class='pane-header'>
                <h2 class='pane-title'>Callstack</h2>
            </div>
            <div>
                <ul class='callstack' data-bind="template: { name: 'stack-frame-template', foreach: stack }"></ul>
            </div>
        </div>
        
    </div>
    
    
    <script type="application/javascript" src="resources/require.js"></script>
    
    <script type="application/javascript">
        requirejs.config({
            paths: {
                'text': 'resources/text',

                'atum': 'lib',
                'amulet': 'dependencies/amulet/lib',
                'parse': 'dependencies/parse/lib',
                'seshat': 'dependencies/seshat/lib/seshat',
                'nu': 'dependencies/nu/lib',
                'ecma': 'dependencies/parse-ecma/lib',
                'ecma_ast': 'dependencies/ecma-ast/lib',
                
                'knockout-2.2.1': 'resources/knockout-2.2.1'
            }
        });
    </script>
    
    <script type="application/javascript" src="resources/jquery-ui-1.10.3/js/jquery-1.9.1.js"></script>
    <script type="application/javascript" src="resources/jquery-ui-1.10.3/js/jquery-ui-1.10.3.custom.js"></script>
    <script type="application/javascript" src="resources/jquery.layout-latest.js"></script>
    
    <script type="application/javascript" src="resources/codemirror-3.14/codemirror.js"></script>
    <script type="application/javascript" src="resources/codemirror-3.14/javascript.js"></script>
    
    
    <script type="application/javascript" src="console.js"></script>
</body>
    
</html>