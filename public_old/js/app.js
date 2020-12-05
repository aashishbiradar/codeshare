
(function() {
  var uri = uri = window.location.search;
  var queryString = {};
  uri.replace(
      new RegExp(
          "([^?=&]+)(=([^&#]*))?", "g"),
      function ($0, $1, $2, $3) {
          queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
      }
  );
  var shareId = queryString.id;
  if (!shareId || !shareId.length) {
    shareId = Date.now();
    window.location.href = window.location.href + 'share.html?id=' + shareId;
  }

  var content = '';
  var socket = io();
  var codeEditorDiv = document.getElementById('code-editor');
  var codeEditor = CodeMirror.fromTextArea(codeEditorDiv, { lineNumbers: true });

  // events
  socket.on('connect', function () {
    console.log('Connected to server');
    socket.emit('join', { shareId: shareId });
  });

  codeEditor.on('change', function () {
    var newContent = codeEditor.getValue();
    if (newContent !== content) {
      content = newContent;
      socket.emit('codeChange', {
        shareId: shareId,
        payload: content
      });
    }
  });

  socket.on('codeChange', function (newContent) {
    if (newContent !== content) {
      content = newContent;
      var cursor = codeEditor.getCursor();
      codeEditor.setValue(content);
      codeEditor.setCursor(cursor);
    }
  });

  socket.on('newUser', function (socketId) {
    if (content !== '') {
      socket.emit('codeChange', {
        socketId: socketId,
        payload: content
      });
    }
  });
})();