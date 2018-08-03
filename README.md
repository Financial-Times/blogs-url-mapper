# Blogs URL mapper

A serverless service to map and redirect legacy FT Blogs Wordpress-style URLs to the standard FT `/content/UUID` type URLs.


## Install
```
npm install
```

## Setup

### `.env` file

| Variable                | Value                         | Description                                       |
| ----------------------- | ----------------------------- | ------------------------------------------------- |
| `AWS_DEPLOYMENT_BUCKET` |                               | Bucket for serverless deployments                 |
| `AWS_REGION`            | `eu-west-1`                   | AWS region to run the app in                      |
| `AWS_ROLE`              |                               | AWS role the serverless uses for deployments      |
| `AWS_ACCESS_KEY_ID`     |                               | AWS access key ID for serverless deployments      |
| `AWS_SECRET_ACCESS_KEY` |                               | AWS access key secret for serverless deployments  |
| `WP_DB_READ_URL`        |                               | MySQL connection string for the Blogs WP database |
| `UUID_NAMESPACE`        |                               | Blogs UUID namespace used for generating v3 UUIds |
| `FT_BASE_URL`           | `https://www.ft.com/content/` | FT base URL                                       |
| `BLOGS_DEFAULT_HOST`    | `blogs.ft.com`                | Default Blogs host                                |


### AWS credentials

Follow [Konstructor AWS Policy Generator guide](https://github.com/Financial-Times/konstructor-aws-policy-generator/blob/master/README.md)

## Deploy

```
npm run deploy
```

Look for `ServiceEndpoint` value in the output, e.g. `https://14ps56m5dj.execute-api.eu-west-1.amazonaws.com/dev`

## Usage

```
https://<ENDPOINT>/<BLOGS_LEGACY_URL>
```

E.g. using the example endpoint above will redirect the user to corresponding FT URL:
```
$ curl -i https://14ps56m5dj.execute-api.eu-west-1.amazonaws.com/dev/westminster/2007/09/colourful-coppehtml

HTTP/2 301
location: https://www.ft.com/content/90d07b2f-7990-3a34-9462-9f569e652dc2
x-legacy-url: http://blogs.ft.com/westminster/2007/09/colourful-coppehtml/
...
```


## Misc
### Generate SQL statements to add indices for guid column on every post table

```
SELECT CONCAT('ALTER TABLE `wp_', blog_id, '_posts` ADD INDEX `guid` (`guid`);') FROM wp_blogs
```
