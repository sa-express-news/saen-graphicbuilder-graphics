GraphicBuilder is boilerplate for embeddable graphics originally built atop the [Texas Tribune's News Apps Graphic Kit](https://github.com/texastribune/newsapps-graphic-kit) before being rewritten and updated with Vue.js

## Quickstart

Run this command in your project's folder:

```sh
curl -fsSL https://github.com/sa-express-news/graphicBuilder/archive/master.tar.gz | tar -xz --strip-components=1
```

Next, `npm install`.

If this is your first time to ever use the kit, you need to authorize your computer: `npm run user/authorize`

Add your Google sheet's ID to the `config.json`, and override any sheets that need to be processed differently. (`keyvalue` or `objectlist`)

Run `npm run serve` to spin up a local server.

Get to work!

## Building your graphic

Inside your working directory you should find a subdirectory named `src`, which itself has three subdirectories:

 - `assets/`: Here you can store any static assets like images or additional data files
 - `mixins/`: No need to modify anything in here unless you intend to build additional Vue.js mixins.
 - `components/`: Here is where you will write your code.
 
### Building components

As mentioned, graphicBuilder is built with Vue.js. To get full use out of the produce, you should read through the [tutorials here](https://vuejs.org/v2/guide/).

However, if you're building a simple chart you can get by just in the `Index/` component that is provided by default. Open the directory and you'll find three files:

 - Index.vue: You can write your HTML here, all `data.json` properties that were injested from Google Sheets are also available for use.
 - Index.scss: You can write CSS or SASS in here for your HTML.
 - Index.js: This is the main component JS. If you simply needed to add arbitrary JavaScript, you can do it inside the `mounted` method and it will run after the component has been mounted to the DOM.
 
If your graphic is of any degree of complexity, I suggest adding your own subcomponents and getting familiar with Vue. This straightforward [example graphic](https://github.com/sa-express-news/saen-graphicbuilder-graphics/tree/master/farmworker-poverty-levels) or this more complext [example graphic](https://github.com/sa-express-news/saen-graphicbuilder-graphics/tree/master/sheriff-shooting-mental-health) might be helpful to explore too.

## Connect to S3

To use the commands to deploy your project to Amazon S3, you'll need to add a [graphicBuilder] to ~/.aws/credentials. It should look something like this:

```
[graphicBuilder]
aws_access_key_id=YOUR_UNIQUE_ID
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

To get your unique ID and secret access key, you'll need to be added as a User in the data team AWS account. Luke Whyte can help with that.

## Deploying to S3

Graphics deploy to the graphics.expressnews.com buket on S3 and you'll need to declare a subdirectory name. In package.json, set the `slug` property to a directory name of your choosing.

Then you can run these commands to build and deploy:

```
npm run build
npm run deploy
```

Usually, at this point, I'll navigate to my `index.html` file on S3 and checkout the graphic there to make sure all deployed as expected. Once you're happy with the production graphic, it's time to embed it in your story.

## Embedding in a story

Jump into the WCM and create a new freeform. GraphicBuilder uses [pym.js](http://blog.apps.npr.org/pym.js/) to load your graphic into an iFrame at the correct size for the user's device. To utilize it, copy and paste the following into your freeform:

```
<div id="example"></div>
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
    var pymParent = new pym.Parent('example', 'child.html', {});
</script>
```

The above does three things:
 - Creates a div with the id "example"
 - Loads pym.js
 - Utilizes pym to load your graphics into the div

Change the "example" ID to something unique that fits your graphic. Then change the first argument in pym.Parent from 'example' to your new ID. Finally, swap 'child.html' with the path to your graphic on S3. Hit save, publish, pop the freeform into your article and away we go!!!
 
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
npm run serve
```
Spin up a development environment with hot reloading for building your graphic.

```sh
npm run build
```
Compress and compile your completed project into a `dist` directory.

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
