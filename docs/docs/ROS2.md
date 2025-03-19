# What is ROS2?

## Understanding Publishers/Subscribers

## Understanding Topics/Services/Actions
https://docs.ros.org/en/foxy/How-To-Guides/Topics-Services-Actions.html

**Topic** - A continuous stream of published data, which any node can subscribe to. 

- ex. RC, GPS, IMU, Windvane sensor states
  
**Service** - A request for data from a node. Good for infrequently used data that does not need to be constantly published. Must be fast to receive data, since it will block the robot until the data is received.

- ex. getting the current rudder/sail angle, getting the current camera servo angles, 
  
**Action** - A request for the robot to do a goal or 'real-world thing' that takes time. The action node should publish 'feedback' to the caller (ex. the delta from where it is, to where it wants to be). Crucially, actions can be stopped mid-process. This is imporant for if our goal changes.

- ex. setting the rudder/sail, setting a target heading for the boat, setting a GPS point to navigate to, completing an event

#### Official Documentation
https://docs.ros2.org/latest/api/rclpy/api.html
https://docs.ros.org/en/humble/

#### Helpful examples
Blog: https://roboticsbackend.com/category/ros2/

Video: https://www.youtube.com/@RoboticsBackEnd/playlists

#### Interactive Course
https://app.theconstructsim.com/

### Common Shell Commands
**Publish to a topic** `ros2 topic pub --once boat/cmd_rudder std_msgs/Float32 "{data: 30.0}"`

**Run with file args** `ros2 run sailbot dummyevent --ros-args --params-file ./config/params_eventDefaults.yaml`

**Run with commandline args** `ros2 launch sailbot event_launch.launch.py executable:=dummyEvent`
