const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const formidable = require("formidable");
const { mkdir, copyFile, rm, rmdir } = require("fs/promises");

dotenv.config();

const PORT = parseInt(process.env.PORT ?? 6060);
const DIRECTORY = path.join(
  path.resolve(process.env.DIRECTORY ?? ".tmp"),
  process.env.NODE_ENV ?? ""
);

const server = express();

server.use(cors());
server.use(express.static(DIRECTORY));

server.delete("/:collection/:hash/:filename?", async (req, res) => {
  const message = { success: false };

  const collection = req.params.filename ? req.params.collection : "";
  const hash = req.params.filename ? req.params.hash : req.params.collection;
  const filename = req.params.filename ? req.params.filename : req.params.hash;

  const filepath = path.join(DIRECTORY, collection, hash, filename);

  try {
    await rm(filepath, { force: true });

    message.success = true;

    try {
      await rmdir(path.join(filepath, ".."));
      if (collection) {
        await rmdir(path.join(filepath, "../.."));
      }
    } catch (_) {}
  } catch (e) {
    res.status(500);
  }

  res.json(message);
});

server.post("/:collection?", async (req, res) => {
  const collection = req.params.collection ?? "";
  const collectionDir = path.join(DIRECTORY, collection);

  const message = { success: false, url: "" };

  await new Promise((resolve) => {
    formidable({ allowEmptyFiles: false, hashAlgorithm: "MD5" }).parse(
      req,
      async (err, _, files) => {
        if (err) {
          res.status(400);
        } else {
          const file = files.file;

          if (file && file.hash && file.originalFilename) {
            try {
              const destDir = path.join(collectionDir, file.hash);
              const dest = path.join(destDir, file.originalFilename);

              await mkdir(destDir, { recursive: true });
              await copyFile(file.filepath, dest);

              message.success = true;
              message.url = dest.slice(DIRECTORY.length);
            } catch (e) {
              res.status(500);
            }
          } else {
            res.status(400);
          }
        }

        resolve();
      }
    );
  });

  res.json(message);
});

server.listen(PORT, () => {
  console.log("Listen:", PORT);
});
