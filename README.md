# Minimal Storage Service

Minimal storage service in NodeJS (JavaScript).

## Routes

```txt
POST /:collection
# Response on Success: { success: true, url: "/<collection>/<hash>/<filename>" }
# Response on Failure: { success: false, url: "" }
```

```txt
GET /:collection/:hash/:filename
# File server response
```

```txt
DELETE /:collection/:hash/:filename
# Response on Success: { success: true }
# Response on Failure: { success: false }
```

## ENV

| PROPERY   | DEFAULT |
| --------- | ------- |
| DIRECTORY | .tmp    |
| PORT      | 6060    |
