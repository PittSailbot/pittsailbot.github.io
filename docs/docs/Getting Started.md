This guide walks you through all the steps to get started with contributing to Sailbot! :D

For our tech stack, we use:

- **Python** - Higher level autonomy code; everything running on the Pi.
- **C++** - Low level sensor reading code; everything running on the Teensy microcontroller.
- **Git** - Source control for collaborating
- **Pycharm/VS Code** - Preferred code editors. Use whatever you like.
- **Docker** - Isolated environment for testing and running our code. This is so we don't have to worry about "it works on my computer".

## Table of contents
1. Install Dependencies
	- Git
	- Python
	- Docker
	- VSCode
2. Testing our Environment

## Installing Git & Using Github
Git is the industry standard for collaborating on projects. It allows multiple people to work on different features and easily share changes. If you're majoring in CS you'll be forced to learn this eventually, and its a great time to get a head start for your classes.

1\. Install [Git](https://git-scm.com/downloads)

> Don't know git? Learn [here](https://medium.com/free-code-camp/learn-the-basics-of-git-in-under-10-minutes-da548267cc91). Need a refresher instead? Here's a [cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf).

2\. Navigate over to [Github](https://github.com/PittSailbot/Sailbot). If you don't have an account, create one! Using Github early on is great for saving your progress on projects.

## Installing Python
Pretty much everything we write is using Python. Its easy to pick up and it has good supporting libraries for working with the Raspberry Pi.

3\. Install [Python 3.10](https://www.python.org/downloads/release/python-31011/)

- Downloads are at the bottom of the page. You'll want to download either Windows 64-bit or macOS.


> Never used Python before? It's ok! If you're taking CS 0010/CMPINF 0010 you'll get to learn in your classes. If not, here's some [resources](https://automatetheboringstuff.com/) to learn some of the basics if you're willing to put in the time.

> Or, if you just need a refresher or want to see some *cool advanced features* [click here](https://gto76.github.io/python-cheatsheet/).

## Installing Docker
Docker is used for setting up containers for our code. It's essentially a recipe to build the OS, and all other dependencies necessary to run your code so we can avoid the issue of "well it works on my machine...". Technically, we could skip all of these installation steps if I were to make container for developing, but it balloons compilation times from 5s to over 4 minutes.

We'll be using Docker for testing and running our robot code. Using docker containers is incredibly useful since it is easy to set up and its hardware agnostic. On the lake, water and electronics don't mix well, and if we have to unexpectedly switch to another Pi, we can get the code running in just 15 minutes.

4\. Install [Docker](https://docs.docker.com/desktop/install/windows-install/)


## Installing IDE & Setting up our Environment
VS Code is an incredibly strong and lightweight editor that works for almost all programming languages. If you prefer Jetbrains's PyCharm, that's also ok. I still recommend you install VS Code since it will be used in most classes and it has helpful extensions to streamline development.

5\. Download and install [VSCode](https://code.visualstudio.com/download)

6\. In the welcome page, under Start, click 'Clone Git Repository' and enter our repository link
`https://github.com/PittSailbot/Sailbot.git`

7\. Press Ctrl + Shift + P to pull up VS Code's search and enter "Extensions: Install Extensions".

8\. Search for and install the 'Dev Container' extension

9\. Press Ctrl + Shift + P and enter "Dev Containers: Rebuild and Reopen in Container"

- This step will take a while to install the rest of our dependencies, but it gives us a reliable environment to develop in

## Testing our Environment
We're almost there! Now that we have a docker container running, we can compile and run our code in a Linux environment. Docker already builds the correct versions of Ubuntu, ROS2 and all other dependencies so there is very little setup!

10\. In the new VSCode dev container terminal, enter:
```console
. compileDocker.sh
```
- Every time you change the source, code you'll run this bash file to compile the changes.

11\. Lastly, we can run any of the ROS2 nodes like so:
```console
ros2 run sailbot transceiver
```
- This should fail with the following exception `Exception: No connected devices found`. That's ok, because our computer doesn't have an RC transceiver!

Many features in the code will not work since our virtual environment is lacking real sensors and peripherals that the boat has.
However, the Docker is very useful for ensuring that your code compiles with ROS2. This lets us to debug compiler errors without having to set the boat up first.
Individual nodes can be ran with `ros2 run sailbot [node]`. You can view all of our robot's nodes with `ros2 node list`