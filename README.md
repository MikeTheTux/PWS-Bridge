# PWS-Bridge
OpenHAB2 Bridge for Weather Underground (WU) Updater

# Tested with:
- node.js, v8.13.0
- openHAB v2.4.0.M6
- Froggit WH2600 SE, Firmware v2.2.5

# Required Packages:
- request
- express
- normalize-port
- sprintf

```
 sudo npm install -g normalize-port --save
 sudo npm link normalize-port
```

# References:
- https://www.openhab.org/
- https://www.froggit.de/product_info.php?info=p233_funk-internet-wetterstation-wh2600-se--second-edition-2018--lan-windmessung-regen-wettermast.html
- https://rtupdate.wunderground.com

# Setup as systemctl service
- Copy it to /lib/systemd/system/
- Run systemctl daemon-reload to refresh services
- Enable the service

```
cp pws_bridge.service /lib/systemd/system/
systemctl daemon-reload
systemctl enable pws_bridge.service
```
