const ipc = require('electron').ipcRenderer
var $ = window.$ = window.jQuery = require('./jquery-2.2.3.min.js')

var source_url_row = {}
var dom_by_url = {}

var DOM_toString = function (message_arg) {
  var color = `
  <div class="color">
    <h2>` + this.id + `</h2>
    <small>` + this.tagName + ' .' + this.class + `</small>
    <small>` + this.url + `</small>
    <em>#` + this.id + `</em>
  </div>
  `
  return color
}

function addSourceRow (url) {
  var row = `
  <div class="row ` + url + `">
    <div class="col-md-6"></div>
    <div class="col-md-6"></div>
  </div>
  `
  return row
}

ipc.on('on-foucs', function (event, arg) {
  arg['toString'] = DOM_toString
  arg['jquery'] = $(arg.toString())

  if (source_url_row[arg.url] === undefined) {
    source_url_row[arg.url] = $(addSourceRow(arg.url))
    $('#tab4 > .tab-content').append(source_url_row[arg.url])
  }

  dom_by_url[arg.url] = dom_by_url[arg.url] === undefined ? [] : dom_by_url[arg.url]
  dom_by_url[arg.url].push(arg)

  var col = source_url_row[arg.url].find('.col-md-6')[dom_by_url[arg.url].length % 2]
  $(col).append(arg.jquery)

  if ($('#tab4 > .tab-content').height() > $('#tab4').height()) {
    $('.tab').height($('#tab4 > .tab-content').height())
  }
})
