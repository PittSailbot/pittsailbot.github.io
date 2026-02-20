# Problems We've Encountered & How to Solve Them  

---

## No Power on PCB
**Issue:** The batteries are plugged in but nothing is on

### Check the battery voltage
The voltage of the plug connecting to the PCB should be **greater than 10.8V**. If it's lower, the **Battery Management System (BMS)** could be preventing usage to avoid damage. Charge or replace the batteries.

### Check the Deans plugs  
- Some Deans plugs do not fit properly, causing poor connections.  
- Directly plugging the battery into the PCB may not work—try using jumper wires instead.  
- **⚠️ BE VERY CAREFUL!**  
   - **Swapping the Ground and V+ wires** could destroy the PCB.  
   - **Accidentally shorting the battery terminals** could destroy the battery.  

### Check the Fuses
If there's overly high current on the PCB at any time then the fuses will blow, disconnecting power from part of the board
- Visually inspect the wire inside the fuse, it should be intact and connecting both sides of the fuse
- Try a continuity test (wifi signal) using the multimeter, you should hear a beep if they are connected
  
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

4. **If the Pi is missing from the client list:**  
   - **Unplug** the Pi’s power cable from the PCB (**do not turn off the entire PCB**).  
   - **Do NOT unplug the GPIO cable** (wide black cable).  
   - Wait a few moments, then **plug the Pi back in**.  

5. **Check Pi status:**  
   - **Green light blinking (or steady)** = Pi is running.  
   - **Only red light** = Possible Pi issue.  
   - **No light at all** = The Pi may not be receiving power.  

6. **Wait & retry:**  
   - Sometimes, it takes a **minute or two** for the Pi to appear at `192.168.8.1`.  

---

## ODrive Setup  
**Issue:** Errors during calibration.  

### Unbalanced Phases
1. Swap the **three motor wires** (on the motor side) to different female connectors.  
**Hot-swapping** these wires is safe **ONLY IF**:  
    1. The calibration sequence failed for that axis.  
    2. You **haven't reset the axis** using `odrv0.clear_errors()`.  
2. Rerun the calibration after each attempt until error is resolved.

### Encoder CPR Mismatch
1. Ensure the encoder wires are **fully plugged in**.  
2. Check that the **encoder is firmly attached to the motor**.  
3. Spin the motor to check for excessive resistance (apply **WD-40** if needed).  
4. Rerun the calibration.  

---

## Servos
**Servo's don't move or move erratically**
1. Try manually blasting PWM with script
2. Check voltage (servos usually cut out <3V)
   - Our servos cut out ~3V but usually need 4.8V+
   - Is the wire long? Check closest to the source of the servo due to voltage drop
3. Check if the microcontroller has the same ground as the servo (short servo and microcontroller GND)
4. Check PWM on oscilloscope
5. Check if the servo has enough power
   - The Adafruit Servo Driver is too weak to power the rudder, but can power the sail/jib
     - If so, plug into main PCB
6. Try another servo

---

## Docker  
**Issue:** ROS2 `colcon build` fails.  

- `docker.py create` might be **copying over `venv` files**, leading to unrelated package issues?

---

## No RC Control  
**Issue**: The RC controller fails to control the boat

The process for receiving and executing RC is as follows:

1. **RC Controller** → Wirelessly signals to **Receiver in the Mast**.  
2. **Receiver** → Sends data to **Teensy** over Serial using the mast USB-C (`transceiver.cpp`).  
3. **Teensy** → Publishes controller state to **Pi** (`main.cpp`).  
4. **Pi** → Publishes controller state to various topics (`transceiver.py`), e.g., `cmd_rudder` & `cmd_sail`.  
5. **`motordrivers.py`** → Subscribes to topics and sets position using `odrive.py`.  

### Check Receiver LED
- **Solid blue light** = Normal.  
- **Blue with flashing red** = Controller is off or incorrectly bound.  
- **No LED light** = Check if the **USB-C is plugged into both ends of the mast**.  

### Force Publish to `cmd_rudder` / `cmd_sail`

Try manually publishing a command in the Pi terminal:  
```sh
ros2 topic pub --once boat/cmd_rudder std_msgs/Float32 "{data: 30.0}"
```

If nothing happens, ensure the [ODrive is calibrated](Starting the Boat.md).


### Check Teensy Output & `transceiver.py`
Ensure Teensy is publishing and `transceiver.py` is receiving the data correctly.

### Swap out USB-C Cable
Try flipping the mast cable or replacing with a different USB-C gen 3.2 cable.

---

## Boat Suddenly Loses RC on Water
**Issue**: RC connection drops when the boat leaves Wi-Fi range or laptop goes to sleep.

Having the boat code running on an open-terminal and exiting wifi-range causes the boat to stop.

### Manually kill the terminal before restarting the boat code
1. Run the boat code as stated in [Starting the Boat](Starting the Boat.md)

   - Also try running the commands with `nohup`
  
2. Close out the terminal on the host side

---

## Can't Connect to SailNet Website
**Issue**: Unable to access the Pi-hosted site.

### Ensure you are on the same network as the Pi

> Do not use a mobile hotspot (especially Android, which has client isolation enabled by default). If using a hotspot, check if client isolation can be disabled.

### Try accessing the site locally from the Pi

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