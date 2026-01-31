"""
Blink detection using Eye Aspect Ratio (EAR).
"""

import numpy as np


class BlinkDetector:
    """
    Detects eye blinks using the Eye Aspect Ratio method.
    
    Reference:
    Soukupová and Čech (2016) - "Real-Time Eye Blink Detection using Facial Landmarks"
    """
    
    # MediaPipe Face Mesh landmark indices for eyes
    LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380]
    RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144]
    
    def __init__(self, ear_threshold=0.2, consecutive_frames=1):
        """
        Initialize the blink detector.
        
        Args:
            ear_threshold: EAR value below which eye is considered closed
            consecutive_frames: Number of consecutive frames below threshold to register closure
        """
        self.ear_threshold = ear_threshold
        self.consecutive_frames = consecutive_frames
        
        # State tracking
        self.is_eye_closed = False
        self.closed_frame_count = 0
        self.blink_count = 0
    
    def calculate_ear(self, landmarks, eye_indices):
        """
        Calculate Eye Aspect Ratio for a single eye.
        
        Args:
            landmarks: List of facial landmarks
            eye_indices: Indices of the 6 eye landmarks
            
        Returns:
            float: Eye Aspect Ratio value
        """
        # Get coordinates of eye landmarks
        coords = [np.array([landmarks[i].x, landmarks[i].y]) for i in eye_indices]
        
        # Compute euclidean distances
        # Vertical distances
        d1 = np.linalg.norm(coords[1] - coords[5])
        d2 = np.linalg.norm(coords[2] - coords[4])
        
        # Horizontal distance
        d3 = np.linalg.norm(coords[0] - coords[3])
        
        # Avoid division by zero
        if d3 == 0:
            return 0.0
        
        # EAR formula
        ear = (d1 + d2) / (2.0 * d3)
        
        return ear
    
    def detect_blink(self, landmarks):
        """
        Detect if a blink occurred in the current frame.
        
        Args:
            landmarks: List of facial landmarks
            
        Returns:
            tuple: (blink_detected: bool, avg_ear: float)
        """
        # Calculate EAR for both eyes
        left_ear = self.calculate_ear(landmarks, self.LEFT_EYE_INDICES)
        right_ear = self.calculate_ear(landmarks, self.RIGHT_EYE_INDICES)
        avg_ear = (left_ear + right_ear) / 2.0
        
        blink_detected = False
        
        # Check if eyes are closed
        if avg_ear < self.ear_threshold:
            self.closed_frame_count += 1
            
            # Register closure after consecutive frames
            if self.closed_frame_count >= self.consecutive_frames:
                if not self.is_eye_closed:
                    self.is_eye_closed = True
        else:
            # Eyes opened - check if this is end of a blink
            if self.is_eye_closed:
                self.blink_count += 1
                blink_detected = True
                self.is_eye_closed = False
            
            self.closed_frame_count = 0
        
        return blink_detected, avg_ear
    
    def get_blink_count(self):
        """Get total number of blinks detected."""
        return self.blink_count
    
    def reset(self):
        """Reset the blink counter and state."""
        self.is_eye_closed = False
        self.closed_frame_count = 0
        self.blink_count = 0
    
    def get_state(self):
        """
        Get current state of the detector.
        
        Returns:
            dict: Current state information
        """
        return {
            "blink_count": self.blink_count,
            "is_closed": self.is_eye_closed,
            "closed_frames": self.closed_frame_count
        }
