import cv2
import numpy as np
import pickle
import sys
model = pickle.load(open('finalized_model.sav', 'rb')) 
#testing 
img = cv2.imread(sys.argv[1], cv2.IMREAD_GRAYSCALE)
img = cv2.resize(img, (28, 28))
img = cv2.bitwise_not(img)
img = img / 255.0
img = np.reshape(img, (1, 28, 28, 1))
pred = model.predict(img)
class_idx = np.argmax(pred)
print(class_idx)