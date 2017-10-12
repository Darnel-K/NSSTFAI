This theme needs a name, leave your suggestions [here](https://github.com/Darnel-K/Apache-Index-Theme/issues/1).

## Installation Instructions:

#### To Install The Global Version (Requires Access To The Host System And Web Server)

This version is global to every directory on the apache server.

Files: /Global

1. Download a copy of all the files in this folder.
2. Copy / upload the folder "ThemeName" from this folder to a location on your server that is accessible by the apache web server.
3. Edit lines 5 & 7 of "Theme.conf" changing "[ThemeFilesLocation]" to the location of the "ThemeName" folder.
4. Copy / upload "Theme.conf" to your apache web server's "Includes" folder.
5. Restart the apache web server.
6. To activate the theme create a ".htaccess" file in the folder that you want indexing and directory listing turned on and put "Options +Indexes" into that file.