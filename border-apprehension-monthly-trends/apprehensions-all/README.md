GraphicBuilder is boilerplate for embeddable graphics built atop the [Texas Tribune's News Apps Graphic Kit](https://github.com/texastribune/newsapps-graphic-kit) 

## Quickstart

Run this command in your project's folder:

```sh
curl -fsSL https://github.com/sa-express-news/graphicBuilder/archive/master.tar.gz | tar -xz --strip-components=1
```

Next, `npm install`.

If this is your first time to ever use the kit, you need to authorize your computer: `npm run user/authorize`


Add your Google sheet's ID to the `config.json`, and override any sheets that need to be processed differently. (`keyvalue` or `objectlist`)

Get to work!

## Connect to S3

To use the commands to deploy your project to Amazon S3, you'll need to add a [profile newsapps] to ~/.aws/config. It should look something like this:

```
[profile newsapps]
aws_access_key_id=YOUR_UNIQUE_ID
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

Then you can run these commands to build and deploy:

```
gulp
npm run deploy
```

The package will deploy to graphics.texastribune.org/donor-wall. To change the location, update the package.json file.

## Available Commands

```sh
npm run user/authorize
```
Allows your computer to interact with the scraper. Only needs to be done once! Any future uses of the graphic kit can skip this.

```sh
npm run spreadsheet/fetch
```
Pulls down the project's spreadsheet and processes it into the `data.json` file.

```sh
npm run spreadsheet/edit
```
Opens the project's spreadsheet in your browser.

```sh
npm run deploy
```
Deploys the project.

```sh
npm run assets/push
```
Pushes the raw assets to the S3 bucket.

```sh
npm run assets/pull
```
Pulls the raw assets down to the local environment.
