# Using Tribune-specific Bootstrap
This customization of Twitter Bootstrap attempts to balance the ability to merge upstream Twitter Bootstrap updates with the ability to create custom CSS on a per-market basis. This custom CSS often relies on and overrides Bootstrap's standard styles. Here's what has been modified:


##Tribune LESS folder
This folder contains all of the LESS files that modify Bootstrap's core styles. The files that are direct children implement NGUX styles and should be applicable to any Tribune market. Each market using Bootstrap has its own folder within `/tribune/`. Market-specific LESS files should be composed here. By default, the Bootstrap docs reference the Chicago Tribune's styles.

When creating a new market-specific LESS file, be sure to include these statements at the top:

```
@import '../../variables.less';
@import '../ngux-variables.less';
```

To define variables with market-specific styles, create a file like this and import it after the other variable files:
`@import 'chicagotribune-variables.less';`

Note that variables with the same name will overwrite each other. The values in the last-imported file will be used.


##Grunt tasks
Run `grunt dist` to compile your new LESS files into CSS. (For the task to compile correctly, `dist/css` must contain files matching all expected filenames. Sometimes, this means you will need to create an empty file for Grunt to write to.)

**A note about our modifications**
Gruntfile.js has been modified to compile the files and folders in the `/tribune/` folder. You can find this under `less` task, subtask `compileTribune`. It looks like this: 

```
/* Compile separate CSS for Tribune markets */
compileTribune: {
   options: {
     strictMath: true,
     outputSourceFiles: true,
     paths: 'less'
    },
    files: {
        // Add more files here to create new styles for other markets
       'dist/css/chicago-bootstrap.css': 'less/tribune/chicago/chicagotribune.less'
    }
 },
```
To add files for a new market, just copy one of the existing rules under `files`. Edit it to match the path of your desired CSS file (which should be in `dist/css/marketname`) and the path of your LESS file (which should be in `less/tribune/marketname`).

##Deploying with tribapps-assets
Once you've compiled your CSS and JS changes, you should use the tribapps-assets repo to upload your changes to S3. (Clone the tribapps-assets repo from Unfuddle.)

You will need to copy the *entire* `_gh_pages` folder and the *contents* of the `dist` folder. You'll run something like this on the command line (assuming you are inside your Bootstrap directory):

```
cp -r _gh_pages ~/Projects/tribapps-assets/assets/bootstrap/v3.1.1 
cp -r dist/* ~/Projects/tribapps-assets/assets/bootstrap/v3.1.1/
```

To deploy, make sure you have `s3cmd` installed and configured:
```
brew install s3cmd
s3cmd --configure
```

Then deploy to staging:
`./deploy.sh media-beta.tribapps.com`

Check S3 to make sure the changes look right. If so, go ahead and deploy to media.apps.chicagotribune.com.
