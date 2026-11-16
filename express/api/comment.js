const parseId = (raw) => {
  const id = Number.parseInt(raw, 10);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(new Error('Invalid comment id'), { status: 400, expose: true });
  }
  return id;
};

export function likeComment(req, res) {
  const id = parseId(req.params.id);
  res.json({ id, liked: true });
}

export function unlikeComment(req, res) {
  const id = parseId(req.params.id);
  res.json({ id, liked: false });
}
