import { readFileSync } from "node:fs";
import path from "node:path";

export function readImageDimensions(diskPath: string): { width: number; height: number } {
  const ext = path.extname(diskPath).toLowerCase();
  if (ext === ".png") {
    const buffer = readFileSync(diskPath);
    const validSignature =
      buffer.length >= 24 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
    if (!validSignature || buffer.toString("ascii", 12, 16) !== "IHDR") {
      throw new Error(`Invalid PNG metadata for ${diskPath}`);
    }
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (ext === ".svg") {
    const source = readFileSync(diskPath, "utf8");
    return {
      width: Number(source.match(/\bwidth="(\d+)"/)?.[1] ?? 0),
      height: Number(source.match(/\bheight="(\d+)"/)?.[1] ?? 0),
    };
  }

  throw new Error(`Unsupported image format for ${diskPath} (${ext || "no extension"})`);
}
