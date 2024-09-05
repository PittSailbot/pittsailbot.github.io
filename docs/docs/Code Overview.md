This is a run-down of what our code does. The project repo may look daunting, but half of it is just configurations and boilerplate.
I promise its not as complicated as it looks!

## ROS2
The core of our boat runs on ROS2. This is standard for almost all robotics applications in industry.

### Why ROS?
ROS provides many benefits:
- It handles the parallelization of code, which means you can utilize your entire CPU.
- It makes code independent. This lets you test individual nodes and scale easier.
- It standardizes how code communicates. This lets you swap out a sensor or rewrite code without causing bugs in other parts of the code.
- It provides a lot of supporting libraries

### What is ROS?
The foundation of ROS relies on a network of independent **Nodes**.
These often represent a physical sensor or motor, but they also apply to anything you would write a `Class` or `Object` for.

To communicate between **Nodes**, ROS uses **topics**, which are like a group chat that **Nodes** can talk on 
or listen to. To speak on a **topic**, you create a **publisher**. Then, you can write whatever messages you want
to a topic. To listen to a **topic**, you create a **subscriber**. Any messages that are published onto a **topic**
are broadcasted to ALL **subscribers** on that **topic**. 

Whenever a message is broadcasted, the **subscribers** will run a **callback function**. A **callback function** is just
 a function that is executed whenever a specific event happens. For example, pressing the 'A' key on a keyboard might run 
`a_pressed_callback()`, which would execute whatever code is defined in the function. ROS also uses  **callbacks** for when 
a certain time has passed, called **timers**.

### Sensors/Controls
Scripts which interface with the mechanical parts of the boat. Virtual versions of each sensor exist for debugging with fake values.

- **GPS** - boat position
- **compass** - boat heading
- **windvane** - wind direction
- **camera** - RGB optical camera
- **cameraServos** - pitch and yaw servos controlling camera movement
- **boatMovement** - rudder/sail controls and controlling the boat's movement
- **Odrive** - motors used in rudder and sail control
- **transceiver** - wireless communication to shore

### Utils
Miscellaneous functions used by the boat

- **constants** - config containing all static parameters used by the boat
- **utils** - commonly used functions for anything
- **boatMath** - common functions for working with coordinates and angles
- **eventUtils** - common functions used in events
- **objectDetection** - AI buoy detection from an image

### Debug
Scripts used to test boat behavior
- **boatSim** - simulates how the boat moves in a virtual environment
