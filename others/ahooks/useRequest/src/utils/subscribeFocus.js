import isDocumentVisible from './isDocumentVisible';
const listeners = [];

function subscribe(listener) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

const revalidate = () => {
  if (!isDocumentVisible()) return;

  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }
};

window.addEventListener('visibilitychange', revalidate, false);
window.addEventListener('focus', revalidate, false);

export default subscribe;
