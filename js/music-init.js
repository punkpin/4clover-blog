/* ===== 网易云歌单播放器（localStorage 缓存 + 接续播放） ===== */
(function () {
  // 弹窗/iframe 里不创建播放器，避免二重奏
  if (window.parent !== window) return;
  if (window.__musicPlayerInit) return;
  window.__musicPlayerInit = true;

  var container = document.getElementById('blog-player');
  if (!container) return;
  if (container.children.length > 0) return;

  var api = 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=17447185020';
  var CACHE_KEY = '__musicPlaylist';
  var STATE_KEY = '__musicState';

  function createPlayer(songs) {
    if (!songs.length) return null;
    var ap = new APlayer({
      container: container,
      fixed: true,
      mini: false,
      autoplay: false,
      theme: '#18D1FF',
      loop: 'all',
      order: 'random',
      preload: 'auto',
      listFolded: true,
      listMaxHeight: '250px',
      audio: songs,
    });

    window.__aplayer = ap;

    // 恢复上次播放位置
    var saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      try {
        var state = JSON.parse(saved);
        if (state.index != null && songs[state.index]) {
          ap.list.switch(state.index);
        }
        if (state.playing) {
          var checkReady = setInterval(function () {
            if (ap.audio && ap.audio.duration) {
              clearInterval(checkReady);
              ap.play();
              if (state.time) ap.audio.currentTime = state.time;
            }
          }, 150);
          setTimeout(function () { clearInterval(checkReady); }, 5000);
        }
      } catch (e) {}
    }

    // 保存状态
    function saveState() {
      if (!window.__aplayer) return;
      localStorage.setItem(STATE_KEY, JSON.stringify({
        index: window.__aplayer.list.index,
        playing: !window.__aplayer.audio.paused,
        time: window.__aplayer.audio.currentTime || 0,
      }));
    }
    window.addEventListener('beforeunload', saveState);
    setInterval(saveState, 3000);
    ap.on('listswitch', saveState);

    return ap;
  }

  function fetchAndCache(callback) {
    fetch(api)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.length) return;
        var songs = data.map(function (item) {
          return {
            name: item.title || '未知歌曲',
            artist: item.author || '未知歌手',
            url: item.url || '',
            cover: item.pic || '',
            lrc: item.lrc || '',
          };
        }).filter(function (s) { return s.url; });
        if (songs.length) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(songs));
          callback(songs);
        }
      })
      .catch(function () {});
  }

  // 1. 优先用缓存，立即初始化（~0ms）
  var cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      var songs = JSON.parse(cached);
      createPlayer(songs);
    } catch (e) {}
  }

  // 2. 后台拉取最新歌单，有变化则更新
  fetchAndCache(function (freshSongs) {
    if (!window.__aplayer) {
      // 没有缓存时的首次创建
      createPlayer(freshSongs);
    }
    // 已有播放器时，后台数据已缓存，下次页面加载自动用新的
  });
})();