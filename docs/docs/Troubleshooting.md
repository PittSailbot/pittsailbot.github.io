# Problems We've Encountered & How to Solve Them  

---

## No Power on PCB
**Issue:** The batteries are plugged in but nothing is on

1. **Check the battery voltage**
      - The voltage of the battery should be **greater than 10.8V** for 3S batteries. If it's lower, the BMS could be preventing usage to avoid damage. Charge or replace the batteries.

2. **Check the Fuses**
      - If there's high current on the PCB then the fuses will blow, disconnecting power from part of the board.
  
      1. Visually inspect the wire inside the fuse, it should be intact and connecting both sides of the fuse
      2. Try a continuity test using the multimeter, you will hear a beep if they are connected
  
---

## Wi-Fi Connectivity  
**Issue:** Unable to connect to the `Pitt Sailbot` Wi-Fi network. Or the Pi is not connected to the router.

1. **Ensure the Wi-Fi router is running**  
   - The router should have a **green light** indicating Wi-Fi signal.  

2. **Check your connection**  
   - Make sure your device is connected to **`Pitt Sailbot`**.  

3. **Verify router access**  
   - Open a browser and enter `192.168.8.1` in the address bar.  
   - Password: **`sailboot`**  
   - Click on the **Clients** tab to check connected devices.  
   - Your device should be listed along with the **Raspberry Pi(s) and their IP addresses**.  

4. **Check Pi status:**  
   - **Green light blinking (or steady)** = Pi is running.  
   - **Only red light** = Possible Pi issue.  
   - **No light at all** = The Pi may not be receiving power.  

5. **Attach a display & debug:**  

---

## Servos
**Issue:** Servos don't move or move erratically

1. Try manually blasting PWM with script
2. Check voltage (servos usually cut out <3V)
   - Our servos cut out ~3V but usually need 4.8V+
   - Is the wire long? Check closest to the source of the servo due to voltage drop
3. Check if the microcontroller has the same ground as the servo (short servo and microcontroller GND)
4. Check PWM on oscilloscope
5. Check if the servo has enough power
   - The Adafruit Servo Driver is too weak to power the rudder, but can power the sail/jib
     - If so, plug into main PCB
6. Try another servo on the same header

---

## No RC Control  
**Issue**: The RC controller fails to control the boat

The process for receiving and executing RC is as follows:

RC Controller -> Receiver -> Pico2 -> Servo PWM

1. Check Receiver LED
- **Solid blue light** = Normal.  
- **Blue with flashing red** = Controller is off or incorrectly bound.  
- **No LED light** = Check if the **USB-C is plugged into both ends of the mast**.  

2. Circumvent Pico2 by trying with FSIA6 receiver or SBUS decoder

---

## Can't Connect to SailNet Website
**Issue**: Unable to access the Pi-hosted site.

1. Ensure you are on the same network as the Pi

> If using a hotspot, check if client isolation can be disabled.

2. Try accessing the site locally from the Pi

- If you receive `localhost did not send any data`, this may be from your SSL keys for HTTPS being incorrect or out of date. Regenerate those with this command:
`openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365`

## Pico 2 USB Device Malfunctioned
This usually happens when your code causes the Pico 2 to crash during runtime.

1. Hold the BOOTSEL button and then plug into the USB-A port
2. Reflash with 'bare-bones' code to determine the source

## Pico 2 doesn't flash
Unfortunately this is a relatively common issue. Windows drivers are very inconsistent.

1. Check Device Manager for 'RP2350 Boot' under Ports
   - If it is not there, check that the micro-usb cable supports data and that the pico 2 isn't fried
2. Make sure the Pico 2 drivers are set to WinUSB with [Zadig](https://zadig.akeo.ie)
3. On Windows uninstall *every* RP2350 Boot or Pico2 driver
  a. Open Device Manager
  b. View > Devices By Driver
  c. Scan through the list and uninstall *every* RP2350 Boot or Pico 2 related driver (there may be multiple)
4. Replug the device, it should open as Mass Storage (usb)
5. Reinstall the Zadig WinUSB driver
   - Make sure you install to RP2350 (Boot Interface 1) ONLY

## Windvane Sensor Error
This happens on the P3022 pretty frequently. 

1. Check that all connectors are correct and securely fastened
2. Disconnect and reconnect the 5V power
      - If this does not fix the problem, make sure that the MOSI pin is connected to 3.3V