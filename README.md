# Apache-Index-Theme
A Not So Simple Theme Made For Apache's Index

This theme needs a name, leave your suggestions [here](https://github.com/Darnel-K/Apache-Index-Theme/issues/1).

## Installation Instructions:

Both versions require "AllowOverride All" activated on the web server for the directories that use the ".htaccess" files

#### To Install The Global Version (Requires Access To The Host System And Web Server)

This version is global to every directory on the apache server.

Files: /Global

1. Download a copy of all the files in the folder "Global".
2. Copy / upload the folder "ThemeName" from the folder "Global" to a location on your server that is accessible by the apache web server.
3. Edit lines 5 & 7 of "Theme.conf" changing "[ThemeFilesLocation]" to the location of the "ThemeName" folder.
4. Copy / upload "Theme.conf" to your apache web server's "Includes" folder.
5. Restart the apache web server.
6. To activate the theme create a ".htaccess" file in the folder that you want indexing and directory listing turned on and put "Options +Indexes" into that file.

#### To Install The .htaccess version

This version is only active on the directory that contains the required files and all sub-directories with indexing allowed.

Files: /Directory

1. Download a copy of all the files in the folder "Directory".
2. Copy / upload the contents of the folder "Directory" (Folder "ThemeName" & File ".htaccess") to the folder that you want to enable indexing and directory listing on.

## TO-DO:
* [x] Upload Files To GitHub
* [x] Create htaccess Directory Version
* [x] Add Setup Instructions For Both Versions
* [ ] Add Credits Screen
* [ ] Finish Video Player
* [ ] Audio Player
* [ ] More Settings
* [ ] Add More To This List
* [ ] Replace All Instances Of "ThemeName" With Chosen Name

## Resources Used:
* [jscolor Color Picker](http://jscolor.com/)
* [jQuery-rcrumbs Responsive Breadcrumb](https://github.com/cm0s/jquery-rcrumbs)
* [jQuery.qrcode QR Code Generator](https://larsjung.de/jquery-qrcode/)
* [jQuery](https://jquery.com/)