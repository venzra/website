## Venzra Website

Venzra commerce solution - full end-to-end stack

[![CircleCI](https://circleci.com/gh/sysen-limited/venzra-website.svg?style=svg&circle-token=2ab17fec2242f6bb1b9e34533af5cc8b8854ccd3)](https://circleci.com/gh/sysen-limited/venzra-website)

### Marketing Website

When running this project will be available locally on http://localhost:8080

### Running and Testing

Installing dependencies is done via `npm install` note that version 8 or newer of node should be used.

Running the entire project in production mode can be done by calling `npm start` this will start the server.

To run the projects currently you should use the `npm` commands for each project, for example;

```shell
> npm start
```

### Deployment

Deployment occurs via CircleCI on commit to master, the following environment variables are required

| variable | example | description |
| :--- | :--- | :--- |
| DEPLOY_CERT | arn:aws:acm:us-east-1:xxxxxxxxxxxx | AWS certificate ARN, certificate must exist on US-EAST-1 |
| DEPLOY_URI | www.venzra.com | The domain for which to create this Website |
| DEPLOY_STACK | www-venzra | The name for AWS to use to reference this environment |
