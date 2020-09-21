# NWS-IOT-Alerts
Capture NWS Alerts using an SDR, and send out an MQTT Notification.

I have a Raspberry Pi 3b that has an DVB-T dongle I am using as a Software Defined Radio(SDR). I am monitoring the local
National Weather Service(NWS) radio transmissions, watching for the Alert tones (If you have a Weather Radio, its those
annoying buzzsaw noises that are at the start and the end of any alert messages -- they are actually digital signals of the EAS protocol!)
If one is heard, it is passed to the multimon-ng program to convert it into text that the sdrClient.js program can read
and decipher. That program then sends the text out using the MQTT protocol, where I have other programs subscribing to
the alert topic to do other things.

I use the pm2 program to keep the sdrClient.js running all the time on the Raspberry Pi. I found this blog post to be 
very helpful in setting it all up: https://dev.to/bogdaaamn/run-your-nodejs-application-on-a-headless-raspberry-pi-4jnn 

The multimon-ng program can be found here: https://github.com/EliasOenal/multimon-ng <br>
Use of the rtl_fm program was inspired by this: https://www.raspberrypi.org/forums/viewtopic.php?t=11542 



