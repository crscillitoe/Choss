#!/bin/sh
ng build --prod
cd /var/www/choss
rm -rf front-end/
mv ~/git/Choss/front-end/dist/front-end .