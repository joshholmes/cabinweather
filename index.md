---
title: Cabin Weather Home Page
---

# Cabin Weather

Cabin Weather is a little project built at an Intel Iot Roadshow using the Edison board. It uses the Weather Underground API to pull what weather is coming and uses local sensors to see what's happening outside right now. 

### Main Hub 

This is the center device that collects from Weather Underground using the Mashery APIs. 

### Remote Sensors 

This is the module that pulls data from the local sensors and pushes it to the central hub. 

### Setup

In order to use the MRAA (library for controlling sensors on the Edison), you'll need to install  the library. Unfortunately it's not actually an NPM library like we'd hope. It has to be opkg installed. First "screen" to your edison and then run the following commands. 

'''
echo "src mraa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/mraa-upm.conf
opkg update
opkg install libmraa0
'''

