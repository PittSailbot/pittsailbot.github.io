## Setup
Full instructions on hooking up all sensors, servos, etc.

## Plug in the WindVane
   - The green P3022 windvane is directional! 0/360° lines up with the single screw hole & blue sharpie lines. Make sure that is in-line with the center of the bow or it will be inaccurate!

## Plug in the IMU
  - The IMU is directional! Make sure that the y-silkscreen arrow (0/360°) lines up with the center of the bow. If it cannot, then offset the angles in software so that autonomy is not messed up.


## Hot Start
All components are plugged in and the boat just needs to be powered on.

## Calibrate the IMU
Every time the boat is powered on, the BNO055 IMU must be calibrated before it will be accurate.

- Magnetometer: Move the sensor in a figure-8 pattern until it begins reading values. 
- Gyroscope: Leave the sensor still for a few seconds
- Accelerometer: Should calibrate automatically after a second.

## Alternative Setups
### Running with local laptop
Replace the Pi5 by running the ROS2 autonomy stack on any Windows device.

1. Plug in Pico2 USB to laptop
2. [Attach the Pico2 to WSL2](Attaching USB to WSL2.md)
3. Ctrl + Shift + P > Rebuild & Reopen in Container
4. Run `. compileDocker.sh` to compile ROS2
5. Run the relevant nodes:
   - mcu_bridge
   - navigation
   - website