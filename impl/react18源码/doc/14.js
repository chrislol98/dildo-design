
let workInProgressRoot = null;
function ensureRootIsScheduled(root) {
  if (workInProgressRoot) return;
  console.log('workLoop');
  workInProgressRoot = root;
}
let root = { tag: 3 };
ensureRootIsScheduled(root);
ensureRootIsScheduled(root);
ensureRootIsScheduled(root);