// Stable IDs and local assets keep the collection ready for more pictures or likes.
const unicorns = [
  {
    "id": "star-flight",
    "file": "star-flight.jpg",
    "name": "Sterrenvlucht",
    "alt": "Een blauwe eenhoorn met grote vleugels vliegt tussen fonkelende sterren",
    "source": "https://stockcake.com/i/mystical-flying-unicorn_1030068_824810"
  },
  {
    "id": "rainbow-waterfall",
    "file": "rainbow-waterfall.jpg",
    "name": "Regenboogwaterval",
    "alt": "Een witte gevleugelde eenhoorn vliegt bij een waterval onder een regenboog",
    "source": "https://stockcake.com/i/majestic-winged-unicorn_671828_124980"
  },
  {
    "id": "rainbow-clouds",
    "file": "rainbow-clouds.jpg",
    "name": "Boven de wolken",
    "alt": "Een witte eenhoorn met een gouden hoorn tussen wolken en regenbooglicht",
    "source": "https://stockcake.com/i/majestic-unicorn-magic_176901_30135"
  },
  {
    "id": "mountain-magic",
    "file": "mountain-magic.jpg",
    "name": "Magische bergtop",
    "alt": "Een eenhoorn met kleurrijke manen boven een gouden bergtop en waterval",
    "source": "https://images.stockcake.com/public/1/d/0/1d0111fb-7b44-443a-a790-04ccab109970_large/majestic-unicorn-summit-stockcake.jpg"
  },
  {
    "id": "rainbow-friends",
    "file": "rainbow-friends.jpg",
    "name": "Samen op avontuur",
    "alt": "Twee witte eenhoorns lopen door glinsterend water onder een regenboog",
    "source": "https://stockcake.com/i/majestic-unicorns-galloping_370949_65765"
  },
  {
    "id": "moon-flight",
    "file": "moon-flight.jpg",
    "name": "Maanlichtvleugels",
    "alt": "Een witte gevleugelde eenhoorn vliegt door blauwe wolken onder de sterren",
    "source": "https://stockcake.com/i/majestic-winged-unicorn_965967_786590"
  },
  {
    "id": "forest-flight",
    "file": "forest-flight.jpg",
    "name": "Het betoverde bos",
    "alt": "Een gevleugelde eenhoorn springt in een bos vol gouden zonlicht",
    "source": "https://images.stockcake.com/public/3/f/b/3fbfff97-0ba5-4f10-ba9f-01cefb89db4a_large/mystical-winged-unicorn-stockcake.jpg"
  },
  {
    "id": "flower-flight",
    "file": "flower-flight.jpg",
    "name": "Bloemenvlucht",
    "alt": "Een witte eenhoorn met vleugels vliegt boven een kleurrijke bloemenweide",
    "source": "https://images.stockcake.com/public/b/f/6/bf64c491-df90-40ce-9e7a-c3cad8621e9a_large/majestic-unicorn-flying-stockcake.jpg"
  },
  {
    "id": "twilight-flight",
    "file": "twilight-flight.jpg",
    "name": "Dromen in paars",
    "alt": "Een witte gevleugelde eenhoorn stijgt op tussen paarse wolken en lichtjes",
    "source": "https://images.stockcake.com/public/c/9/7/c971524a-c562-4975-acc0-aa627dbc78b1_large/magical-flying-unicorn-stockcake.jpg"
  },
  {
    "id": "golden-forest",
    "file": "golden-forest.jpg",
    "name": "Gouden boslicht",
    "alt": "Een witte eenhoorn staat tussen bomen in een bos met gouden licht",
    "source": "https://stockcake.com/i/mystical-forest-unicorn_900293_1030994"
  }
];

const picture = document.querySelector('#picture');
const strip = document.querySelector('#thumbnails');
const error = document.querySelector('#image-error');
const credits = document.querySelector('#credits');
const fullscreen = document.querySelector('#fullscreen');
let current = 0;

const thumbnails = unicorns.map((unicorn, index) => {
  const button = document.createElement('button');
  button.className = 'thumbnail';
  button.setAttribute('aria-label', unicorn.name);
  const image = document.createElement('img');
  image.src = `images/${unicorn.file}`;
  image.alt = '';
  image.draggable = false;
  button.append(image);
  button.addEventListener('click', () => show(index));
  strip.append(button);

  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = unicorn.source;
  link.textContent = unicorn.name;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  item.append(link);
  document.querySelector('#sources').append(item);
  return button;
});

function show(index, scroll = true) {
  current = (index + unicorns.length) % unicorns.length;
  const unicorn = unicorns[current];
  error.hidden = true;
  picture.hidden = false;
  picture.alt = unicorn.alt;
  picture.src = `images/${unicorn.file}`;
  document.querySelector('#name').textContent = unicorn.name;
  document.querySelector('#counter').textContent = `EENHOORN ${current + 1} / ${unicorns.length}`;
  thumbnails.forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
  if (scroll) {
    const active = thumbnails[current];
    // Scroll only the thumbnail strip, never the whole page.
    strip.scrollTo({ left: active.offsetLeft - strip.offsetLeft - (strip.clientWidth - active.clientWidth) / 2, behavior: 'auto' });
  }
}

document.querySelector('#previous').addEventListener('click', () => show(current - 1));
document.querySelector('#next').addEventListener('click', () => show(current + 1));
document.addEventListener('keydown', (event) => {
  if (credits.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

let touchStart = null;
const area = document.querySelector('#picture-area');
area.addEventListener('touchstart', (event) => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
area.addEventListener('touchmove', (event) => {
  if (event.touches.length !== 1) touchStart = null;
}, { passive: true });
area.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
}, { passive: true });
area.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

picture.addEventListener('error', () => { picture.hidden = true; error.hidden = false; });
document.querySelector('#retry').addEventListener('click', () => show(current));
document.querySelector('#credits-button').addEventListener('click', () => credits.showModal());
document.querySelector('#close-credits').addEventListener('click', () => credits.close());

if (document.fullscreenEnabled) {
  fullscreen.hidden = false;
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      fullscreen.hidden = true; // The app still fills the available viewport.
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.setAttribute('aria-label', document.fullscreenElement ? 'Volledig scherm verlaten' : 'Volledig scherm');
    fullscreen.title = fullscreen.getAttribute('aria-label');
  });
}
show(0, false);
