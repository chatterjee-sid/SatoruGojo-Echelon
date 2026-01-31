"""
Face detection utilities using MediaPipe Face Landmarker.
"""

import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


class FaceDetector:
    """
    Wrapper for MediaPipe Face Landmarker with optimized settings.
    """
    
    def __init__(self, model_path, num_faces=1):
        """
        Initialize the face detector.
        
        Args:
            model_path: Path to the face_landmarker.task model
            num_faces: Maximum number of faces to detect
        """
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=False,
            output_facial_transformation_matrixes=False,
            num_faces=num_faces
        )
        
        self.face_landmarker = vision.FaceLandmarker.create_from_options(options)
    
    def detect(self, frame):
        """
        Detect face landmarks in a frame.
        
        Args:
            frame: BGR image as numpy array
            
        Returns:
            FaceLandmarkerResult or None if no face detected
        """
        # Convert BGR to RGB
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        )
        
        # Detect landmarks
        result = self.face_landmarker.detect(mp_image)
        
        if not result.face_landmarks:
            return None
        
        return result
    
    def get_landmarks(self, result, face_index=0):
        """
        Get landmarks for a specific face.
        
        Args:
            result: FaceLandmarkerResult
            face_index: Index of face to get landmarks for
            
        Returns:
            List of landmarks or None
        """
        if not result or not result.face_landmarks:
            return None
        
        if face_index >= len(result.face_landmarks):
            return None
        
        return result.face_landmarks[face_index]
    
    def __del__(self):
        """Cleanup resources."""
        if hasattr(self, 'face_landmarker'):
            self.face_landmarker.close()
