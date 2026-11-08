/** Read with a hard byte and wall-clock bound before framework multipart/JSON parsing. */
export async function boundedRequest(request, limit) {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit))
    throw new Error("BODY_LIMIT");
  if (!request.body) throw new Error("EMPTY_BODY");
  const reader = request.body.getReader(),
    chunks = [];
  let total = 0;
  const deadline = Date.now() + 30000;
  try {
    while (true) {
      let timer;
      const result = await Promise.race([
        reader.read(),
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error("BODY_TIMEOUT")),
            Math.max(1, deadline - Date.now()),
          );
        }),
      ]).finally(() => clearTimeout(timer));
      if (result.done) break;
      total += result.value.length;
      if (total > limit) throw new Error("BODY_LIMIT");
      chunks.push(result.value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: Buffer.concat(chunks),
  });
}
