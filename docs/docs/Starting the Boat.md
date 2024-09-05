Step-by-step process for how to set up all the electronics and software to run the boat.

## Connecting the Peripherals
Before plugging in the batteries ensure the following are plugged in:

**IMPORTANT: Do not hot plug anything on the PCB, if you want to plug something in you MUST cut power**

1. Connect the two `Motor Encoder Wires` (labeled M1 and M0) to the corresponding pin headers on the Odrive. The black wire should line up with the GND pin. The 3.3V pin for each encoder is unused. ![Odrive Encoder Wiring](./assets/odrive%20encoder%20wiring.png)
2. Connect the two sets of 3-wire `Sail & Rudder Motor Wires` from each corresponding motor to the `Sail Motor` and `Rudder Motor` female bullet connectors on the PCB.

![Wiring Diagram](./assets/PCB%20wiring.png)

3. Plug the USB-C cable from the mast. This plug should have a silver `T` facing up (the top side of the PCB is where the Odrive is).
4. Plug the other end of the USB-C cable into the crows nest at the top of the mast. the USB-C cable also has a `T` marked on it here, this time the `T` should face the 3D print, you should be able to see the black side of the USB-C but not the side with the silver `T`.
5. Plug in the Wi-Fi router to the USB port on the PCB directly next to the USB-C port where the mast is plugged in. Do not plug it into the USB port on either of the Pis, and do not plug it into the USB port the Pi is plugged into.
6. Connect the Pi and Teensy with a USB - USB-C cable.
7. Connect the Odrive and Pi with a USB - USB cable.

## Powering the Boat
1. Make sure the power switch is in the `Off` position, try and move both switches together, they are taped together to make this easier. 
2. Plug the batteries into the BMS, match the etape colors.
3. If there is nothing else to plug in you can plug the BMS output into the PCB (the lil "| -" plug), if you later realize there is something else you forgot to plug in you must unplug the batteries.
4. Flip the PCB switch and Odrive switch. This wll power the rest of the board, including the raspberry pi.
    - You should see the 3 Blue LEDs in the top right of the PCB, as well as the green and red LEDs on the Rasp Pi come on. If not look at [this guide](./Troubleshooting.md#pcb-main-power).
5. Power on the Wi-Fi router

## Starting the Boat
1. Connect you laptop to the `Pitt Sailbot` Wi-Fi access point. 
    - Password is `sailbot`, admin is `sailboot`
    - (Optional) Make sure everything is working up to this point by following the first 3 steps in [Wifi Connectivity](./Troubleshooting.md#wifi-connectivity)
2. On your laptop open a terminal.
3. SSH into the Pi using the powershell window. The command looks like this: `ssh <user>@<Ip address>`
    - The following are subject to change:
    - Pi5: `ssh pi@192.168.8.11`
    - Pi5: `ssh sailbot@192.168.8.12`
    - The passwords for both are `sailbot`
    - If the Pi isn't connected a phone hotspot or our router then you'll need to connect a monitor and keyboard to the pi.
4. Configure the Odrive (on the Pi connected to the Odrive). Make sure the motors are both able to spin a few complete rotations in each direction. With either option you should see a print out of the results with any errors generated. If there are any errors look [here](./Troubleshooting.md#odrive-setup)
    - Option 1: `odriveCalibration.py`. Using `0` or `1` as an argument will only calibrate the corresponding motor.
```bash
cd ~/Sailbot
python3 ./utils/odriveCalibration.py
```
- Option 2: `odrivetool`
```bash
odrivetool
 # run the following commands in the odrivetool cli 
odrv0.clear_errors()
odrv0.axis0.requested_state = AXIS_STATE_FULL_CALIBRATION_SEQUENCE
odrv0.axis1.requested_state = AXIS_STATE_FULL_CALIBRATION_SEQUENCE
dump_errors(odrv0)
 # type quit() to leave the cli
```
5. Start the boat core using the following commands. This will launch the minimum necessary ROS nodes to run RC.
    - Whenever the code is changed, make sure to run `. compile.sh` again
    - Available ROS2 nodes can be found in `setup.py:entry_points` and launch files can be found in `/launch`
```bash
cd ~/Sailbot
python3 ./Utils/docker.py run
# you should now be in a docker terminal and see /workspace# to the left of your cursor, if not look for error messages
# you can type "exit" to leave the docker terminal and return to your normal terminal if you need to. 
# The following commands should be in the docker terminal
. compileDocker.sh
ros2 launch sailbot boat_all.launch.py
```
6. Turn on the RC controller. You should now be able to control the rudder and sail using the controller.
     - Adjust the offsets of the sail/rudder by flipping the sail/rudder offset switch. Then, adjust the potentiometer to adjust the zero point.

## Connecting to the Site
1. Connect to Pi5 (`192.168.8.11` or `192.168.8.12`)
```bash
cd Sailbot
python3 ./Utils/docker.py run
. compileDocker.sh
ros2 run sailbot website
```
2. Connect to https://192.168.8.11:5001

## Rewiring Devices
Not necessary for startup. Only if swapping components.

### Compass
1. Look for [this](https://www.adafruit.com/product/1120) and connect the SCL, SDA, GND, and 3V3 pins to the [pi](https://pinout.xyz/pinout/pin5_gpio3/).
      - To confirm its connected, run `i2cdetect -y 1` and look for a device on 0x1e

### Windvane
1. Thread the 6-pin header cable through the mast
2. At the top of the mast, connect the 6-pin header to the windvane
3. Connect the header to the [rotary encoder]() on the PCB, matching the direction

## Charging Batteries
1. Turn on the variable power supply and set to 12.6 volts
2. Turn off the power supply, then connect alligator clips between the power supply and the batteries (check polarity)
3. Charge until current starts to drop