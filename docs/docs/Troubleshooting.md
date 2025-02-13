This guide helps solve problems related to the boat

## PCB Main Power
The batteries are plugged in but nothing is lighting up
1. Check the voltage of the plug you are connecting to PCB. It should be >10.8V. If it is not then the batteries are dead or nearly dead and the BMS might be preventing them from being used to prevent damage, you will need to charge the batteries or use different ones. 

2. Some of the deans plugs do not fit correctly together, For example the batteries will not make proper contact with the PCB when plugged in directly. Try using jumper wires to connect the battery to the PCB. **BE VERY CAREFUL!** Switching the Ground and V+ wire could destroy part or all of the PCB. Accidentally touching the battery alligator clips while connecting them to the PCB Could destroy the battery. 

## Wi-Fi Connectivity
1. Make sure the Wi-Fi router is running and has a green light for the Wi-Fi signal
2. Make sure your device is connected to the `Pitt Sailbot` Wi-Fi network
3. Open a browser and type `192.168.8.1` into the address bar. The password is `sailboot`. On the left there should be a tab labeled clients, after clicking on it you should see the clients currently connected. If you've gotten to this point you laptop will definitly be one of the listed devices, you should also see the Pi(s) and their Ip addresses. 
4. If you do not see the Pi(s) connected unplug the Pi power cable from the PCB (do not turn off the entire PCB, this is the only time you should do this). **Do not unplug the GPIO cable** (The GPIO cable is the wide black cable)
5. Wait a moment and plug the Pi back in, make sure it has a green light blinking (or steady). If only the red light shows up the is a problem with the Pi. If not light comes up it might not be getting power
6. If you see the green light on the Pi then give it a little while and try again to connect. 
    - Sometimes it takes a minute or two for the Pi to show up (or disappear from) clients at `192.168.8.1`


## Odrive Setup
- These are the only two common errors, if anything else comes up while running the calibration try asking chatGPT for help. 

### Unbalanced Phases
This seems to happen with axis1 sometimes, just swap the 3 motor wires (on the actual motor) around so they connect to a different female connector. You may have to try several different options before it works, run the calibration sequence with each try. It is ok to unplug and replug these wires (hotswap) if and only if the motors calibration sequence failed for the axis you are unplugging AND you have not reset the axis using odrv0.clear_errors() 

### Encoder CPR mismatch
This happens somewhat randomly, make sure the wires are plugged all the way in and the encoders are firmly connected to the motor. Spin the motor a little and make sure there is not too much resistance (if there is spray some wd40 or something) Even still this happens on occasion, just run the calibration again. 


## Docker
- ROS2 colcon build fails
  - docker.py create copies over venv files as well? Causes unrelated packages to be included


## No RC Control
The process for receiving and executing RC is as follows:

- RC controller talks to receiver in the mast
- Mast receiver is read by teensy over serial (connected by usb-c) in `transceiver.cpp`
- Teensy publishes controller state to Pi in `main.cpp`
- Pi publishes controller state to various topics in `transceiver.py`, notably `cmd_rudder` and `cmd_sail`
- `Motordrivers.py` subscribes to these topics and sets the correct position with `odrive.py`

### Check receiver LED
The LED should be permanent blue. If it is blue and flashing red, then the controller is either not on or bound incorrectly.

If there is no LED light, then check that the usb-c is plugged into both ends of the mast.

### Force publish to `cmd_rudder`/`cmd_sail`
Paste `ros2 topic pub --once boat/cmd_rudder std_msgs/Float32 "{data: 30.0}"` in the terminal to see if motorDrivers is reading the topic correctly.

If nothing happens then make sure that the odrive is calibrated using odrivetool following the steps in `Starting the Boat.md`


### Check that the teensy is publishing publishing and being read into transceiver.py correctly


### Swap out the cable
The mast only works with usb-c gen 3.2.


## Boat loses RC on water
Seems to happen when the boat either leaves Wi-Fi range or the laptop goes to sleep while the terminal is open and the code is running. Solved by manually killing the terminal after running the boat code.

## Can't connect to Website
1. Make sure you are on the same network as the Pi and that you are not trying to access it from a hotspot
   - Android hotspots seem to have client isolation on by default, preventing peers from connecting to each other (may be possible to disable this)
2. Try accessing the site locally from the Pi