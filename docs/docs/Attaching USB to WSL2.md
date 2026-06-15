# How to attach a USB device to WSL2
Use case: You want to test the autonomy code on your own laptop instead of SSH'ing into the Pi5

## Install usbipd
Install usbipd for windows with `winget install usbipd`
  - This will allow your docker container to read the data coming from the microcontroller

## Method 1: VSCode Extension
1. Add this [extension](https://marketplace.visualstudio.com/items?itemName=thecreativedodo.usbip-connect) to VSCode
2. Outside of the devcontainer, click attach and select the COM device you want to use

## Method 2: Commandline
1. Run `usbipd list`. This will display all USB devices on your computer.
2. Run `usbipd bind --busid=<BUSID>  # Example: usbipd bind --busid=1-2`
3. Run `usbipd attach --wsl --busid=<BUSID>` 

   - You may need to run `dos2unix *` to convert Windows files to Linux newline separators

## Notes
- You'll need to rebuild docker for the devices to show up
- You'll need to reattach whenever the device is disconnected
- You'll need to dettach whenever you want to flash code to the Pico2 (outside of WSL2)