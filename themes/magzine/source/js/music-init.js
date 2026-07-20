/* ===== 网易云歌单播放器（单例，防重复） ===== */
(function () {
  // 已存在则不重复创建
  if (window.__musicPlayerInit) return;
  window.__musicPlayerInit = true;

  var container = document.getElementById('blog-player');
  if (!container) return;

  // 如果容器已经有内容（PJAX 导航回来时），跳过
  if (container.children.length > 0) return;

  var api = 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=17447185020';

  fetch(api)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data || !data.length) {
        console.warn('[Music] 歌单加载失败');
        return;
      }

      var songs = data.map(function (item) {
        return {
          name: item.title || '未知歌曲',
          artist: item.author || '未知歌手',
          url: item.url || '',
          cover: item.pic || '',
          lrc: item.lrc || '',
        };
      }).filter(function (s) { return s.url; });

      if (!songs.length) return;

      new APlayer({
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
    })
    .catch(function (err) {
      console.error('[Music] 初始化失败:', err);
    });
})();
