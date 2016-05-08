const ipc = require('electron').ipcRenderer
const fs = require('fs')

var $ = window.$ = window.jQuery = require('./jquery-2.2.3.min.js')
var path = require('path')
var root = path.dirname(require.main.filename)

var crawlers = {
  'dummyURL1': [
    {'class': 'c', 'id': 'i', 'tagName': 'tag', 'url': 'dummyURL1'},
    {'class': 'c', 'id': 'i', 'tagName': 'tag', 'url': 'dummyURL1'},
    {'class': 'c', 'id': 'i', 'tagName': 'tag', 'url': 'dummyURL1'}
  ],
  'dummyURL2': [
    {'class': 'c', 'id': 'i', 'tagName': 'tag', 'url': 'dummyURL2'},
    {'class': 'c', 'id': 'i', 'tagName': 'tag', 'url': 'dummyURL2'},
    {'class': 'c', 'id': 'i', 'tagName': 'tag', 'url': 'dummyURL2'}
  ]
}

function save_crawler_task (data, filepath) {
  var serData = JSON.srtingfy(data)
  fs.writeFile(filepath, serData, (err) => {
    throw err
  })
}

function createPanel (sourceURL) {
  var panel = `
  <div class="panel-group">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a data-toggle="collapse" href="#collapse_` + sourceURL + `">` + sourceURL + `</a>
        </h4>
      </div>
      <div id="collapse_` + sourceURL + `" class="panel-collapse collapse">
        <ul class="list-group">
        </ul>
      </div>
    </div>
  </div>
  `
  return panel
}

ipc.on('update-crawler-task', function (event, arg) {
  if (crawlers[arg.url] === undefined) {
    crawlers[arg.url] = [arg]
    $('#tab3 > .tab-content').append($(createPanel(arg.url)))
  }
  else crawlers[arg.url].push(arg)
})

var loaded = require(root + '/../crawler_target.json')

for (var url in loaded) {
  console.log(url)
  $('#tab3 > .tab-content').append($(createPanel(url)))
  var list_group = $('#collapse_' + url).find('.list-group')

  for (var tar of loaded[url]) {
    list_group.append($(`
      <li class="list-group-item">` + tar.toString() + `</li>
      `))
  }
}
