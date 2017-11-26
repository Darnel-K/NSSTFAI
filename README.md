# NSSTFAI
A Not So Simple Theme For Apache's Index

[Demo](http://rs01.kajida.uk/GitHub/Experimental-Code) showing a clone of one of my other repositories, setup globally.

This theme now has a name however if you have any other ideas please, leave your suggestions [here](https://github.com/Darnel-K/Apache-Index-Theme/issues/1).

## Installation Instructions:

Both versions require "AllowOverride All" activated on the web server for the directories that use the ".htaccess" files.

#### To Install The Global Version (Requires Access To The Host System And Web Server)

This version is global to every directory on the apache server.

Files: /Global

1. Download a copy of all the files in the folder "Global".
2. Copy / upload the folder "NSSTFAI" from the folder "Global" to a location on your server that is accessible by the apache web server.
3. Edit lines 5 & 7 of "Theme.conf" changing "[ThemeFilesLocation]" to the location of the "NSSTFAI" folder.
4. Copy / upload "Theme.conf" to your apache web server's "Includes" folder.
5. Restart the apache web server.
6. To activate the theme create a ".htaccess" file in the folder that you want indexing and directory listing turned on and put "Options +Indexes" into that file.

#### To Install The .htaccess version

This version is only active on the directory that contains the required files and all sub-directories with indexing allowed.

Files: /Directory

1. Download a copy of all the files in the folder "Directory".
2. Copy / upload the folder "NSSTFAI" to your domain's root directory
3. Copy / upload the file ".htaccess" to the folder you wish to enable indexing and directory listing on (This also enables on all directories in the same folder). If copying or uploading the ".htaccess" file to the root directory SKIP STEP 4.
4. In the root directory create a ".htaccess" file and put "IndexIgnore .htaccess NSSTFAI" into it

## Help:

* Left Arrow / Backspace: Goes to the previous directory if available.
* Right Arrow: Will enter / open the currently selected directory / file.
* Up Arrow: Navigates the selector up one.
* Down Arrow: Navigates the selector down one.
* S Key: Toggles Settings Screen

## TO-DO:
* [ ] Add Credits Screen
* [ ] Video Player
* [ ] Audio Player
* [ ] Image Viewer
* [ ] Clean CSS
* [ ] Create Unix .sh Installer
* [ ] Create Windows .bat Installer
* [ ] Add Help Screen
* [ ] Acquire Logo For Theme
* [ ] Logo Favicon
* [x] Rewrite Settings Screen HTML & JS
* [x] Implement Console Logging Into The JS
* [X] Pick A Name
* [x] Rewrite The JS Settings
* [x] Add Arrow Key Navigation
* [X] Replace All Instances Of "ThemeName" With Chosen Name
* [x] Upload Files To GitHub
* [x] Create htaccess Directory Version
* [x] Add Setup Instructions For Both Versions

## Resources Used:
* [jscolor Color Picker](http://jscolor.com/)
* [jQuery-rcrumbs Responsive Breadcrumb](https://github.com/cm0s/jquery-rcrumbs)
* [jQuery.qrcode QR Code Generator](https://larsjung.de/jquery-qrcode/)
* [jQuery](https://jquery.com/)
* [Icons Used From Icons8](https://icons8.com/)