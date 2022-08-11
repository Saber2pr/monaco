// Inspector constructor
var template = `<template class='tl-template'>
 <style>
 .tl-wrap {
   pointer-events: none;
   position: fixed;
   top: 0;
   right: 0;
   bottom: 0;
   left: 0;
   z-index: 10000001;
 }
 
 .tl-wrap.-out .tl-codeWrap {
   -webkit-animation: 0.5s tl-hide forwards !important;
   animation: 0.5s tl-hide forwards !important;
 }
 
 .tl-wrap.-out .tl-canvas {
   transition: opacity 0.3s;
   opacity: 0;
 }
 
 .tl-codeWrap {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   padding: 4px;
   -webkit-animation: 0.4s tl-show forwards;
   animation: 0.4s tl-show forwards;
 }
 
 .tl-code {
   display: inline-block;
   max-width: 100%;
   box-sizing: border-box;
   background: #fff;
   box-shadow: 0 0 0 1px #eee;
   font-family: Consolas, Monaco, 'Andale Mono', monospace;
   font-size: 13px;
   font-weight: 400;
   color: #aaa;
   padding: 5px 6px 4px;
   border-radius: 3px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   -webkit-animation-duration: 0.5s;
   animation-duration: 0.5s;
   -webkit-animation-fill-mode: both;
   animation-fill-mode: both;
 }
 /* http://prismjs.com/download.html?themes=prism&languages=markup+css */
 /**
     * prism.js default theme for JavaScript, CSS and HTML
     * Based on dabblet (http://dabblet.com)
     * @author Lea Verou
     */
 
 .tl-codeWrap .token.comment,
 .tl-codeWrap .token.prolog,
 .tl-codeWrap .token.doctype,
 .tl-codeWrap .token.cdata {
   color: #b9bec9;
 }
 
 .tl-codeWrap .token.punctuation {
   color: #ccc;
     /* punctuation */;
 }
 
 .tl-codeWrap .token.property,
 .tl-codeWrap .token.tag,
 .tl-codeWrap .token.boolean,
 .tl-codeWrap .token.number,
 .tl-codeWrap .token.constant,
 .tl-codeWrap .token.symbol,
 .tl-codeWrap .token.deleted {
   color: #d259ff;
 }
 
 .tl-codeWrap .token.selector,
 .tl-codeWrap .token.attr-name,
 .tl-codeWrap .token.string,
 .tl-codeWrap .token.char,
 .tl-codeWrap .token.builtin,
 .tl-codeWrap .token.inserted {
   color: #7ebd00;
     /* attr name */;
 }
 
 .tl-codeWrap .token.atrule,
 .tl-codeWrap .token.attr-value,
 .tl-codeWrap .token.keyword {
   color: #52b2e5;
 }
 
 .tl-codeWrap .token.operator,
 .tl-codeWrap .token.entity,
 .tl-codeWrap .token.url,
 .tl-codeWrap .language-css .token.string,
 .tl-codeWrap .style .token.string {
   color: #a67f59;
 }
 
 .tl-codeWrap .token.function {
   color: #dd4a68;
 }
 
 .tl-codeWrap .token.regex,
 .tl-codeWrap .token.important,
 .tl-codeWrap .token.variable {
   color: #e90;
 }
 
 .tl-codeWrap .token.important {
   font-weight: bold;
 }
 
 @-webkit-keyframes tl-show {
   0% {
     -webkit-transform: translate(0, -100%);
     transform: translate(0, -100%);
   };
 }
 
 @keyframes tl-show {
   0% {
     -webkit-transform: translate(0, -100%);
     transform: translate(0, -100%);
   };
 }
 
 @-webkit-keyframes tl-hide {
   45% {
     -webkit-transform: translate(0, 30%);
     transform: translate(0, 30%);
   }
 
   100% {
     -webkit-transform: translate(0, -100%);
     transform: translate(0, -100%);
   };
 }
 
 @keyframes tl-hide {
   45% {
     -webkit-transform: translate(0, 30%);
     transform: translate(0, 30%);
   }
 
   100% {
     -webkit-transform: translate(0, -100%);
     transform: translate(0, -100%);
   };
 }
 </style>
 
 <div class="tl-wrap">
   <canvas width='100' height='100' id='tl-canvas' class='tl-canvas'></canvas>
 
   <div class='tl-codeWrap'>
   </div>
 </div>
 </template>`

var Inspector = function () {
  this.highlight = this.highlight.bind(this)
  this.log = this.log.bind(this)
  this.codeOutput = this.codeOutput.bind(this)
  this.layout = this.layout.bind(this)
  this.handleResize = this.handleResize.bind(this)

  this.$target = document.body
  this.$cacheEl = document.body
  this.$cacheElMain = document.body

  this.serializer = new XMLSerializer()
  this.forbidden = [this.$cacheEl, document.body, document.documentElement]
}

Inspector.prototype = {
  getNodes: function () {
    this.template = template
    this.createNodes()
    this.registerEvents()
  },

  createNodes: function () {
    this.$host = document.createElement('div')
    this.$host.className = 'tl-host'
    this.$host.style.cssText = 'all: initial;'

    var shadow = this.$host.attachShadow({ mode: 'open' })
    document.body.appendChild(this.$host)

    var templateMarkup = document.createElement('div')
    templateMarkup.innerHTML = this.template
    shadow.innerHTML = templateMarkup.querySelector('template').innerHTML

    this.$wrap = shadow.querySelector('.tl-wrap')
    // this.$code = shadow.querySelector('.tl-code');

    this.$canvas = shadow.querySelector('#tl-canvas')
    this.c = this.$canvas.getContext('2d')
    this.width = this.$canvas.width = window.innerWidth
    this.height = this.$canvas.height = window.innerHeight

    this.highlight()
  },

  registerEvents: function () {
    document.addEventListener('mousemove', this.log)
    document.addEventListener('scroll', this.layout)
    window.addEventListener(
      'resize',
      function () {
        this.handleResize()
        this.layout()
      }.bind(this)
    )
  },

  log: function (e) {
    this.$target = e.target

    // check if element cached
    if (this.forbidden.indexOf(this.$target) !== -1) return

    this.stringified = this.serializer.serializeToString(this.$target)

    this.codeOutput()

    this.$cacheEl = this.$target
    this.layout()
  },

  codeOutput: function () {
    if (this.$cacheElMain === this.$target) return
    this.$cacheElMain = this.$target

    var fullCode = this.stringified
      .slice(0, this.stringified.indexOf('>') + 1)
      .replace(/ xmlns="[^"]*"/, '')

    // this.$code.innerText = fullCode; // set full element code
    this.highlight() // highlight element
  },

  // redraw overlay
  layout: function () {
    var box, computedStyle, rect
    var c = this.c

    rect = this.$target.getBoundingClientRect()
    computedStyle = window.getComputedStyle(this.$target)
    box = {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      margin: {
        top: computedStyle.marginTop,
        right: computedStyle.marginRight,
        bottom: computedStyle.marginBottom,
        left: computedStyle.marginLeft,
      },
      padding: {
        top: computedStyle.paddingTop,
        right: computedStyle.paddingRight,
        bottom: computedStyle.paddingBottom,
        left: computedStyle.paddingLeft,
      },
    }

    // pluck negatives
    ;['margin', 'padding'].forEach(function (property) {
      for (var el in box[property]) {
        var val = parseInt(box[property][el], 10)
        box[property][el] = Math.max(0, val)
      }
    })

    c.clearRect(0, 0, this.width, this.height)

    box.left = Math.floor(box.left) + 1.5
    box.width = Math.floor(box.width) - 1

    var x, y, width, height

    // margin
    x = box.left - box.margin.left
    y = box.top - box.margin.top
    width = box.width + box.margin.left + box.margin.right
    height = box.height + box.margin.top + box.margin.bottom

    c.fillStyle = 'rgba(255,165,0,0.5)'
    c.fillRect(x, y, width, height)

    // padding
    x = box.left
    y = box.top
    width = box.width
    height = box.height

    c.fillStyle = 'rgba(158,113,221,0.5)'
    c.clearRect(x, y, width, height)
    c.fillRect(x, y, width, height)

    // content
    x = box.left + box.padding.left
    y = box.top + box.padding.top
    width = box.width - box.padding.right - box.padding.left
    height = box.height - box.padding.bottom - box.padding.top

    c.fillStyle = 'rgba(73,187,231,0.25)'
    c.clearRect(x, y, width, height)
    c.fillRect(x, y, width, height)

    // rulers (horizontal - =)
    x = -10
    y = Math.floor(box.top) + 0.5
    width = this.width + 10
    height = box.height - 1

    c.beginPath()
    c.setLineDash([10, 3])
    c.fillStyle = 'rgba(0,0,0,0.02)'
    c.strokeStyle = 'rgba(13, 139, 201, 0.45)'
    c.lineWidth = 1
    c.rect(x, y, width, height)
    c.stroke()
    c.fill()

    // rulers (vertical - ||)
    x = box.left
    y = -10
    width = box.width
    height = this.height + 10

    c.beginPath()
    c.setLineDash([10, 3])
    c.fillStyle = 'rgba(0,0,0,0.02)'
    c.strokeStyle = 'rgba(13, 139, 201, 0.45)'
    c.lineWidth = 1
    c.rect(x, y, width, height)
    c.stroke()
    c.fill()
  },

  handleResize: function () {
    this.width = this.$canvas.width = window.innerWidth
    this.height = this.$canvas.height = window.innerHeight
  },

  // code highlighting
  highlight: function () {},

  activate: function () {
    if (!this.$active) {
      this.$active = true
      this.getNodes()
    }
  },

  deactivate: function () {
    if (this.$active) {
      this.$active = false
      this.$wrap.classList.add('-out')
      document.removeEventListener('mousemove', this.log)
      setTimeout(
        function () {
          document.body.removeChild(this.$host)
        }.bind(this),
        600
      )
    }
  },
}

export { Inspector }
