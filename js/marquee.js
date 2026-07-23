// Heisenberg Labs — print marquee. Progressive: reads /assets/portfolio/manifest.json
// and only builds the scrolling gallery if it contains items. If the manifest is empty,
// missing, or the fetch fails, the static fallback already in the page markup stays as-is.
document.addEventListener('DOMContentLoaded', function () {
  var mounts = document.querySelectorAll('[data-marquee-mount]');
  if (!mounts.length) return;

  fetch('/assets/portfolio/manifest.json')
    .then(function (res) { return res.ok ? res.json() : []; })
    .then(function (items) {
      if (!Array.isArray(items) || items.length === 0) return;
      mounts.forEach(function (mount) { renderMarquee(mount, items); });
    })
    .catch(function () { /* leave the static fallback in place */ });

  function renderMarquee(mount, items) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var trackItems = reduceMotion ? items.slice() : items.concat(items);

    var viewport = document.createElement('div');
    viewport.className = 'marquee-viewport' + (reduceMotion ? ' is-static' : '');

    var track = document.createElement('div');
    track.className = 'marquee-track';

    trackItems.forEach(function (item, i) {
      var isDuplicate = !reduceMotion && i >= items.length;
      track.appendChild(buildFigure(item, isDuplicate, i));
    });

    viewport.appendChild(track);
    mount.innerHTML = '';
    mount.appendChild(viewport);
  }

  function buildFigure(item, isDuplicate, index) {
    var figure = document.createElement('figure');
    figure.className = 'marquee-item';
    if (isDuplicate) figure.setAttribute('aria-hidden', 'true');

    var frame = document.createElement('div');
    frame.className = 'marquee-frame';

    var picture = document.createElement('picture');
    if (item.webp) {
      var source = document.createElement('source');
      source.srcset = item.webp;
      source.type = 'image/webp';
      picture.appendChild(source);
    }
    var img = document.createElement('img');
    img.src = item.jpg;
    img.width = item.width || 800;
    img.height = item.height || 600;
    img.alt = item.alt || '';
    img.loading = (index < 2 && !isDuplicate) ? 'eager' : 'lazy';
    img.decoding = 'async';
    picture.appendChild(img);
    frame.appendChild(picture);

    if (item.service) {
      var link = document.createElement('a');
      link.href = item.service;
      if (isDuplicate) link.tabIndex = -1;
      link.appendChild(frame);
      figure.appendChild(link);
    } else {
      figure.appendChild(frame);
    }

    var caption = document.createElement('figcaption');
    caption.className = 'marquee-caption';
    if (item.caption) {
      var title = document.createElement('span');
      title.className = 'marquee-caption-title';
      title.textContent = item.caption;
      caption.appendChild(title);
    }
    if (item.material) {
      var material = document.createElement('span');
      material.className = 'marquee-caption-material';
      material.textContent = item.material;
      caption.appendChild(document.createTextNode(' — '));
      caption.appendChild(material);
    }
    if (item.note) {
      var note = document.createElement('p');
      note.className = 'marquee-caption-note';
      note.textContent = item.note;
      caption.appendChild(note);
    }
    figure.appendChild(caption);

    return figure;
  }
});
