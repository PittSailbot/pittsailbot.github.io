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
