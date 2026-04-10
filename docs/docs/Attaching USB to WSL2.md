# How to attach a USB device to WSL2
Use case: You want to test the autonomy code on your own laptop instead of SSH'ing into the Pi5

## Install usbipd
Install usbipd for windows with `winget install usbipd`
  - This will allow your docker container to read the data coming from the microcontroller

Note: Whenever you rebind/reattach the USB device you'll need to restart the terminal or docker container?

## Method 1: VSCode Extension
1. Add this [extension](https://marketplace.visualstudio.com/items?itemName=thecreativedodo.usbip-connect) to VSCode
2. Outside of the devcontainer, click attach and select the COM device you want to use

## Method 2: Commandline
1. Run `usbipd list`. This will display all USB devices on your computer.
2. Run `usbipd bind --busid=<BUSID>  # Example: usbipd bind --busid=1-2`
3. Run `usbipd attach --wsl --busid=<BUSID>` - has to be done anytime the device reconnects
  - May need to rebuild the VSCode devcontainer
Run `ls -l /dev/ttyUSB* /dev/ttyACM*` in the devcontainer. It should show the following on at least one device:
ls: cannot access '/dev/ttyUSB*': No such file or directory
crw-rw---- 1 root dialout 166, 0 Mar 24 02:07  /dev/ttyACM0
3. Run devcontainer
4. . compileDocker.sh
   - You may need to run `dos2unix *` to convert Windows files to Linux newline separators

## Notes
- You'll need to rebuild docker for the devices to show up
- You'll need to reattach whenever the device is disconnected
- You'll need to dettach whenever you want to flash code to the Pico2 (outside of WSL2)