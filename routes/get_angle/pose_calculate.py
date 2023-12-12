import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import math
import os
import sys
import json

pose_point = {
   "RightArm" : [12, 14, 16],
   "LeftArm" : [11, 13, 15],

   "RightArmpit" : [14, 12, 24],
   "LeftArmpit" : [13, 11, 23],

   "RightSide" : [12, 24, 26],
   "LeftSide" : [11, 23, 25],

   "RightKnee" : [24, 26, 28],
   "LeftKnee" : [23, 25, 27]
}

pose_num = 10

# cos 값을 연산하여 결과 반환 => 3차원 공간에 대한 각도
def get_cos(point) : 
  '''
  #frac = 두 백터 크기의 곱.
  frac = np.linalg.norm(point[0] - point[1]) * np.linalg.norm(point[2] - point[1])
  #두 백터의 내적에 frac 나누기 => cos 결과 반환
  cos = np.dot(point[0] - point[1], point[2] - point[1]) / frac
  return cos
  '''
  angle = math.degrees(math.atan2(point[0][1]-point[1][1], point[0][0]-point[1][0])-
                       math.atan2(point[2][1]-point[1][1], point[2][0]-point[1][0]))
  angle = abs(angle)
  if angle > 180:
     angle = 360.0 - angle
  return angle
  

def read_angle_on_image(name_of_pose):
  folder_name = f'./data/pose_image/{name_of_pose}'
  file_list = os.listdir(folder_name)

  angles = np.zeros([len(file_list), pose_num]) 
  idx = 0
  for imgpath in file_list:
    file_path = os.path.join(folder_name, imgpath)
    if os.path.isfile(file_path):
      base_options = python.BaseOptions(model_asset_path='./routes/get_angle/pose_landmarker.task')
      options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        output_segmentation_masks=True)
      detector = vision.PoseLandmarker.create_from_options(options)
      image = mp.Image.create_from_file(file_path)

      detection_result = detector.detect(image)

      landmarks = np.zeros([33, 3])
      try :
        for j in range(33):
          landmarks[j][0] = detection_result.pose_world_landmarks[0][j].x
          landmarks[j][1] = detection_result.pose_world_landmarks[0][j].y
          landmarks[j][2] = detection_result.pose_world_landmarks[0][j].z
      except :
        pass

      point_num = 0
      for point_name in pose_point :
        angles[idx][point_num] = get_cos([landmarks[pose_point[point_name][i]] for i in range(3)])
        point_num += 1

      ## 8 목 각도(몸/어깨/코를 기반으로 계산)
      body = (landmarks[11] + landmarks[12] + landmarks[23] + landmarks[24])/4 # 몸의 중심 위치를 계산
      neck = (landmarks[11] + landmarks[12])/2 # 두 어깨의 중심을 계산
      #목 각도 계산 뒤 반환
      angles[idx][8] = get_cos([landmarks[0], neck, body])
      
      ## 9 가랑이
      heap = (landmarks[24]+landmarks[23])/2
      angles[idx][9] = get_cos([landmarks[26], heap, landmarks[25]])

      idx += 1
  return angles

# 측정각도에 대한 범위를 저장합니다.
def calculate_range(name_of_pose) :
  angles_cos =  np.zeros([pose_num, 2])
  angles_sin = np.zeros([pose_num, 2])

  degree = 10
  degree2 = 30

  angles_range = np.zeros([6, pose_num])

  myangles = read_angle_on_image(name_of_pose)
  t_angles = myangles.transpose()
  for i in range(pose_num):
    angles_cos[i][0] = t_angles[i].min()#max angle
    angles_cos[i][1] = t_angles[i].max()#min angle

  #angle_range_calculate
  
  for i in range(pose_num) :
    ##Excellent
    angles_range[0][i] = angles_cos[i][0] 
    angles_range[1][i] = angles_cos[i][1]

    if (angles_cos[i][0]<=degree) :
      angles_range[2][i] = 0
    else :
      angles_range[2][i] = angles_cos[i][0]-degree
    
    if (angles_cos[i][1]>=360-degree):
      angles_range[3][i] = 360
    else:
      angles_range[3][i] = angles_cos[i][0]+degree
    
  
    if (angles_cos[i][0]<=degree2):
      angles_range[4][i] = 0
    else:
      angles_range[4][i] = angles_cos[i][0]-degree2
    if (angles_cos[i][1]>=360-degree2):
      angles_range[5][i] = 360
    else:
      angles_range[5][i] = angles_cos[i][0]+degree2
  '''
  #cos rangecalculate
  for i in range(pose_num) :
    angles_sin[i][0] = (1-(angles_cos[i][0]**2))**(1/2)
    angles_sin[i][1] = (1-(angles_cos[i][1]**2))**(1/2)

  cos1 = math.cos(math.radians(degree))
  cos2 = math.cos(math.radians(degree2))

  sin1 = math.sin(math.radians(degree))
  sin2 = math.sin(math.radians(degree2))
 
  for i in range(pose_num) :
    ##Excellent
    angles_range[0][i] = angles_cos[i][0] 
    angles_range[1][i] = angles_cos[i][1]

    ##Good #max angle+dgree / min angle-degree
    if (angles_cos[i][0]<(-cos1)) : #max angle+degree
      angles_range[2][i] = -1 #overflow
    else :
      angles_range[2][i] = angles_cos[i][0]*cos1 - angles_sin[i][0]*sin1

    if (angles_cos[i][1]>(cos1)) : #min angle-degree
      angles_range[3][i] = 1 #underflow
    else :
      angles_range[3][i] = angles_cos[i][1]*cos1 + angles_sin[i][1]*sin1

    ##Nomal #max angle+degree2 / min angle-degree2
    if (angles_cos[i][0]<(-cos2)) : #max angle+degree2
      angles_range[4][i] = -1 #overflow
    else :
      angles_range[4][i] = angles_cos[i][0]*cos2 - angles_sin[i][0]*sin2

    if (angles_cos[i][1]>(cos2)) : #min angle-degree2
      angles_range[5][i] = 1 #underflow
    else :
      angles_range[5][i] = angles_cos[i][1]*cos2 + angles_sin[i][1]*sin2
  '''    
  return angles_range

angles_range = calculate_range(sys.argv[1])

angles_name = ["right_arm", "left_arm", "right_armpit", "left_armpit", 
               "right_side", "left_side", "right_knee", "left_knee", "neck", "crotch"]
level = ["excellent_upper", "excellent_lower","good_upper","good_lower", "nomal_upper", "nomal_lower"]

angles_out = {}
for lev, angles_level in enumerate(angles_range) :
  angles_out[level[lev]] = {}
  for point, angle in enumerate(angles_level) :
    angles_out[level[lev]][angles_name[point]] = angle
  
print(json.dumps(angles_out))