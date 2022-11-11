# Minimal Storage Service

Minimal storage service in NodeJS (JavaScript).

## Docker Image

`mardox/minimal-storage-service:1.0`

## Routes

```txt
POST /
POST /:collection
# Response on Success: { success: true, url: "/<collection>/<hash>/<filename>" }
# Response on Failure: { success: false, url: "" }
```

```txt
GET /:collection/:hash/:filename
# File server response
```

```txt
DELETE /:hash/:filename
DELETE /:collection/:hash/:filename
# Response on Success: { success: true }
# Response on Failure: { success: false }
```

## ENV

| PROPERY   | DEFAULT |
| --------- | ------- |
| DIRECTORY | .tmp    |
| PORT      | 6060    |

## Test Frontend

<details>
  <summary>The HTML code</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      h2 {
        font-family: sans-serif;
        margin: 0.25em 0 0.25em;
        text-decoration: underline;
      }

      pre {
        margin: 0;
      }

      img {
        max-width: 256px;
      }
    </style>
  </head>
  <body>
    <form id="upload" onsubmit="onSubmitUpload(event)">
      <h2>Upload</h2>
      <input type="file" name="file" id="file" />
      <input type="text" name="collection" id="collection" />
      <button type="submit">Submit</button>
      <pre id="message"></pre>
    </form>

    <form id="download" onsubmit="onSubmitDownload(event)">
      <h2>Download</h2>
      <input type="text" name="url" id="url" />
      <button type="submit">Submit</button>
      <img id="image" />
    </form>

    <form id="delete" onsubmit="onSubmitDelete(event)">
      <h2>Delete</h2>
      <input type="text" name="delete_url" id="delete_url" />
      <button type="submit">Submit</button>
      <pre id="delete_message"></pre>
    </form>

    <script>
      async function onSubmitUpload(event) {
        event.preventDefault();

        const form = document.getElementById("upload");
        const message = document.getElementById("message");
        const collection = document.getElementById("collection").value.trim();
        const endpoint = `http://${location.hostname}:6060/${collection}`;

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            body: new FormData(form),
          });

          try {
            const data = await response.json();
            console.log(data);
            message.innerText = JSON.stringify(data, " ", 2);
          } catch (e) {
            console.error(e);
            message.innerText = e;
          }
        } catch (e) {
          console.error(e);
          message.innerText = e;
        }
      }

      async function onSubmitDownload(event) {
        event.preventDefault();

        const url = document.getElementById("url").value.trim();
        const image = document.getElementById("image");
        const endpoint = `http://${location.hostname}:6060/${url}`;

        image.src = endpoint;
      }

      async function onSubmitDelete(event) {
        event.preventDefault();

        const url = document
          .getElementById("delete_url")
          .value.trim()
          .replace(/(^\/+)|(\/+$)/, "");
        const message = document.getElementById("delete_message");
        const endpoint = `http://${location.hostname}:6060/${url}`;

        try {
          const response = await fetch(endpoint, {
            method: "DELETE",
          });

          try {
            const data = await response.json();
            console.log(data);
            message.innerText = JSON.stringify(data, " ", 2);
          } catch (e) {
            console.error(e);
            message.innerText = e;
          }
        } catch (e) {
          console.error(e);
          message.innerText = e;
        }
      }
    </script>
  </body>
</html>
```

</details>
