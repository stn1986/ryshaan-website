export function isFullscreen() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

export async function toggleFullscreen(onError) {
  try {
    if (isFullscreen()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (!exit) throw new Error();
      await exit.call(document);
    } else {
      const root = document.documentElement;
      const enter = root.requestFullscreen || root.webkitRequestFullscreen;
      if (!enter) {
        onError('Deze browser ondersteunt geen volledig scherm voor het spel. Je kunt gewoon in dit venster verder spelen.');
        return;
      }
      await enter.call(root);
    }
  } catch {
    onError('Volledig scherm kon niet worden geopend of gesloten. Probeer de knop nog eens of gebruik de schermoptie van je browser.');
  }
}
