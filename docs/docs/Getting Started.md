This guide walks you through all the steps to get started with contributing to Sailbot! :D

## Tech Stack
We use a few different languages and frameworks for our sailboat. The codebase is split between a high-level navigation stack that is written in Python and low-level C++ drivers for interacting with sensors/servos on our microcontroller. 

You do not need to install everything here. Our code is fairly modularized so you can contribute to one part of the codebase without having to worry about knowing everything.

#### Dev Environment:
- **VS Code** - *Strongly preferred* code editor. Works with all programming languages and has very helpful extensions.
- **Git/Github** - Source control for collaborating.

#### High-Level Navigation:
- **Python** - Autonomy code; everything running on the Pi.
- **Docker** - Isolated environment for testing and running our code. This is so we don't have to worry about "it works on my computer".
- **ROS2** - Handles parallelization and message serialization which helps us build independent 'modules'
- **TailScale** - Allows us to remotely access the Pi from almost anywhere in the world (as long as its connected to the internet)

#### Low-Level Embedded Sensor/Controls:
- **C++** - Sensor reading code; everything running on our microcontroller.
- **PlatformIO** - Used to upload to our microcontroller. Similar to ArduinoIDE but much better at handling large-projects.
- **Protobuf** - Used to serialize/deserialize data so we can communicate between the microcontroller & Pi


## Table of contents
1. Install Development Environment
	- VSCode
	- Git
2. Set up Repository
3. Install Dependencies
   - High-level
   - Low-level
4. Testing our Environment

## 1. Install Development Environment
### 1a. Installing Git & Using Github
Git is the industry standard for collaborating on projects. It allows multiple people to work on different features and easily share changes. If you're majoring in CS you'll be forced to learn this eventually, and its a great time to get a head start for your classes.

1\. Install [Git](https://git-scm.com/downloads)

> Don't know git? Learn [here](https://medium.com/free-code-camp/learn-the-basics-of-git-in-under-10-minutes-da548267cc91). Need a refresher instead? Here's a [cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf).

2\. Navigate over to [Github](https://github.com/PittSailbot/Sailbot). If you don't have an account, create one! Using Github early on is great for saving your progress on projects.

### 1b. Installing VSCode
VS Code is an incredibly strong and lightweight editor that works for almost all programming languages. Even if you prefer another IDE, I still recommend you install VS Code since it will be used in most classes and it has helpful extensions to streamline development.

1\. Download and install [VSCode](https://code.visualstudio.com/download)

## 2. Set Up Repository
1\. Open VSCode. In the welcome page, under Start, click 'Clone Git Repository' and enter our repository link
`https://github.com/PittSailbot/Sailbot.git`

This will install our main repository which runs the code for our robot. We also have a few other repositories which can be found [here](https://github.com/orgs/PittSailbot/repositories). These include:
- Sailnet GUI
  - Flutter based GUI to make it easier to interact/debug with the boat
- Simulator
  - Python/Matplotlib navigation simulator
- Our main page & documentation website
  - Raw HTML & mkdocs website
- RFID Door Opener
  - Arduino code to handle accessing our club room

## 3. Install Dependencies
Depending on what you work on, you do not need to install everything listed here. Our low and high-level code are both fairly independent and can be tested individually.

### 3a. High-Level
If you plan on writing event code, changing our navigation behavior, etc.

#### Install Python
Pretty much everything we write on the Pi is using Python. Its easy to pick up and it has good supporting libraries for working with the Raspberry Pi.

1\. Install [Python 3.11](https://www.python.org/downloads/release/python-31114/)

- Downloads are at the bottom of the page. You'll want to download either Windows 64-bit or macOS.


> Never used Python before? It's ok! If you're taking CS 0010/CMPINF 0010 you'll get to learn in your classes. If not, here's some [resources](https://automatetheboringstuff.com/) to learn some of the basics if you're willing to put in the time.

> Or, if you just need a refresher or want to see some *cool advanced features* check this [Python cheat sheet](https://gto76.github.io/python-cheatsheet/).

#### Install Docker
Docker is used for setting up containers for our code. It's essentially a recipe to build the OS, and all other dependencies necessary to run your code so we can avoid the issue of "well it works on my machine...".

We'll be using Docker for testing and running our robot code. Using docker containers is incredibly useful since it is easy to set up and its hardware agnostic. On the lake, water and electronics don't mix well, and if we have to unexpectedly switch to another Pi, we can get the code running in just 15 minutes.

2\. Install [Docker](https://docs.docker.com/desktop/install/windows-install/)

3\. In VSCode, Press Ctrl + Shift + P to pull up VS Code's search and enter "Extensions: Install Extensions".

4\. Search for and install the 'Dev Container' extension

5\. Press Ctrl + Shift + P and enter "Dev Containers: Rebuild and Reopen in Container"

- This step will take a while to install the rest of our dependencies, but it gives us a reliable environment to develop in

#### Testing our Environment
We're almost there! Now that we have a docker container running, we can compile and run our code in a Linux environment. Docker already builds the correct versions of Ubuntu, ROS2 and all other dependencies so there is very little setup!

6\. In the new VSCode dev container terminal, enter:
```console
. compileDocker.sh
```
- Every time you change the source, code you'll run this bash file to compile the changes.

7\. Lastly, we can run any of the ROS2 nodes like so:
```console
ros2 run sailbot transceiver
```
- This should fail with the following exception `Exception: No connected devices found`. That's ok, because our computer doesn't have an RC transceiver!

Many features in the code will not work since our virtual environment is lacking real sensors and peripherals that the boat has.
However, the Docker is very useful for ensuring that your code compiles with ROS2. This lets us to debug compiler errors without having to set the boat up first.
Individual nodes can be ran with `ros2 run sailbot [node]`. You can view all of our robot's nodes with `ros2 node list`

### 3b. Low-Level
If you plan on interacting with the PCB, different sensors and motors to control the boat.

#### PlatformIO
PlatformIO simplifies using different microcontrollers and is much more scalable than ArduinoIDE. However, ArduinoIDE can still be useful for testing code independently from the rest of the codebase.
1. In VSCode install the PlatformIO extension

#### Install Microcontroller Drivers
For whatever reason, the Pico2 doesn't work with the default Windows drivers. If you're using the Teensy, or some other microcontroller then this step isn't necessary.

1. Install [Zadig](https://zadig.akeo.ie)
2. Plug in the Pico2 to your laptop over USB
3. Run Zadig as administrator
4. In Zadig, toggle `Options > List all Devices`
5. In the dropdown, select `Pico2`
6. Press `Replace Driver`

#### Testing our Environment
Now with PlatformIO, we can upload and monitor code running on the microcontroller.

1. Open the PlatformIO extension in the sidebar
2. Plug in the Pico2 to your laptop while holding down the BOOTSEL button
3. Click 'Upload and Monitor'
   - This can be finnicky on the Pico2. You may need to press the BOOTSEL button or replug the USB.

## Learning our Code
We have the code for the boat and can run it locally, great! But what exactly do these dozens of files do?

<br />

Next up, we'll dive into our project structure and tooling in our [Code Overview](Code Overview.md)