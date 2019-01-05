# PWS-Bridge
OpenHAB2 Bridge for Weather Underground (WU) Updater

![PWS-Bridge](https://github.com/MikeTheTux/PWS-Bridge/blob/master/pws_bridge.png)

Should work with all weather stations that implement the Weather Underground PWS protocol, like
- Renkforce
- Ambient Weather
- Froggit
- Aercus Instruments WeatherSleuth
- Fine Offset

## Tested with
- node.js, v8.13.0
- openHAB2, v2.4.0.M6
- Froggit WH2600 SE, Firmware v2.2.5

## Required node.js Packages
- request
- express
- normalize-port
- sprintf

Example:
```
 sudo npm install -g normalize-port --save
 sudo npm link normalize-port
```

## References
- https://www.openhab.org/
- https://www.froggit.de/product_info.php?info=p233_funk-internet-wetterstation-wh2600-se--second-edition-2018--lan-windmessung-regen-wettermast.html
- https://rtupdate.wunderground.com

## Setup as systemctl service
- Copy pws_bridge.service to /lib/systemd/system/
- Run systemctl daemon-reload to refresh services
- Enable the service
- Start the service
- Check the service

```
sudo cp pws_bridge.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pws_bridge.service
sudo systemctl start pws_bridge.service
sudo systemctl status pws_bridge.service
```

### Alternative: Start within openHAB2
```
var boolean reloadOnce = true

rule "Start pws_bridge"
when
    System started
then
    if ( reloadOnce == true )
    {
        executeCommandLine("node@@/srv/openhab2-conf/scripts/pws_bridge.js")
    }
   reloadOnce = false
  ;
end
```

## Sample openHAB2 Items
```
Number:Temperature      WH2600_Temperature          "Temperature [%.1f %unit%]"         <temperature> 
Number:Dimensionless    WH2600_Humidity             "Humidity [%d %%]"                  <humidity>    
Number:Temperature      WH2600_Indoor_Temperature   "Indoor Temperature [%.1f %unit%]"  <temperature> 
Number:Dimensionless    WH2600_Indoor_Humidity      "Indoor Humidity [%d %%]"           <humidity>    
Number:Temperature      WH2600_DewPoint             "Dew Point [%.1f %unit%]"           <temperature> 
Number:Temperature      WH2600_WindChill            "Wind Chill [%.1f %unit%]"          <temperature> 
Number:Temperature      WH2600_HeatIndex            "Heat Index [%.1f %unit%]"          <temperature> 
String                  WH2600_WindDirection        "Wind Direction [%s]"               <wind> 
Number:Angle            WH2600_WindDirection2       "Wind Direction [%d %unit%]"        <wind>        
Number:Speed            WH2600_WindSpeed            "Wind Speed [%.1f %unit%]"          <wind>        
Number:Speed            WH2600_WindGust             "Wind Gust [%.1f %unit%]"           <wind>        
Number:Length           WH2600_RainH                "Rain H [%.1f mm]"                  <rain>        
Number:Length           WH2600_RainD                "Rain D [%.1f mm]"                  <rain>        
Number:Length           WH2600_RainW                "Rain W [%.1f mm]"                  <rain>        
Number:Length           WH2600_RainM                "Rain M [%.1f mm]"                  <rain>        
Number:Length           WH2600_RainY                "Rain Y [%.1f mm]"                  <rain>        
Number:Intensity        WH2600_SolarRadiation       "Solar Radiation [%.2f %unit%]"                   
Number                  WH2600_UV                   "UV Index [%.1f]"                                 
Number:Pressure         WH2600_Pressure             "Pressure [%.0f %unit%]"                          
Switch                  WH2600_LowBat               "Low Battery [%s]"                                
String                  WH2600_SoftwareType         "Software Type [%s]"                              
DateTime                WH2600_Date                 "Date [%1$tH:%1$tM:%1$tS]"                        
Switch                  WH2600_RealTime             "RealTime [%s]"                                   
String                  WH2600_Action               "Action [%s]"                                     
Number                  WH2600_RTFreq               "RealTimeFreq [%d]"                               
String                  WH2600_Station              "Station [%s]"                                    
String                  WH2600_PWSState             "PWS Update Status [%s]"                          
String                  WH2600_PWSError             "PWS Update Error [%s]"                          
```
