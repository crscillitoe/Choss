#!/bin/sh
echo "[------ Building ------]"
ng build --prod
echo "[------ Updating Prod Files ------]"
cd /var/www/choss
rm -rf front-end/
mv ~/git/Choss/front-end/dist/front-end .
echo "[------ Done! ------]"