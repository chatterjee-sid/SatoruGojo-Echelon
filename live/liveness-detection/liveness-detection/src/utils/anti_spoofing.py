"""
Anti-spoofing detection based on facial landmark movement analysis.
"""

import numpy as np
from collections import deque


class AntiSpoofing:
    """
    Detects photo/video spoofing by analyzing facial landmark movement patterns.
    """
    
    def __init__(self, history_length=30, variance_threshold=0.00001):
        """
        Initialize the anti-spoofing detector.
        
        Args:
            history_length: Number of frames to track for variance calculation
            variance_threshold: Minimum variance to consider face as "live"
        """
        self.history_length = history_length
        self.variance_threshold = variance_threshold
        
        # Track multiple landmarks for better accuracy
        self.nose_tip_history = deque(maxlen=history_length)
        self.chin_history = deque(maxlen=history_length)
        self.forehead_history = deque(maxlen=history_length)
        
        # Landmark indices
        self.NOSE_TIP_IDX = 1
        self.CHIN_IDX = 152
        self.FOREHEAD_IDX = 10
    
    def update(self, landmarks):
        """
        Update landmark history with current frame.
        
        Args:
            landmarks: List of facial landmarks from current frame
        """
        # Extract 3D coordinates of key landmarks
        nose_tip = np.array([
            landmarks[self.NOSE_TIP_IDX].x,
            landmarks[self.NOSE_TIP_IDX].y,
            landmarks[self.NOSE_TIP_IDX].z
        ])
        
        chin = np.array([
            landmarks[self.CHIN_IDX].x,
            landmarks[self.CHIN_IDX].y,
            landmarks[self.CHIN_IDX].z
        ])
        
        forehead = np.array([
            landmarks[self.FOREHEAD_IDX].x,
            landmarks[self.FOREHEAD_IDX].y,
            landmarks[self.FOREHEAD_IDX].z
        ])
        
        # Add to history
        self.nose_tip_history.append(nose_tip)
        self.chin_history.append(chin)
        self.forehead_history.append(forehead)
    
    def calculate_variance(self):
        """
        Calculate movement variance across all tracked landmarks.
        
        Returns:
            float: Total variance value
        """
        if len(self.nose_tip_history) < 10:
            return 0.0
        
        # Calculate variance for each landmark
        nose_var = np.var(list(self.nose_tip_history), axis=0).sum()
        chin_var = np.var(list(self.chin_history), axis=0).sum()
        forehead_var = np.var(list(self.forehead_history), axis=0).sum()
        
        # Combined variance
        total_variance = nose_var + chin_var + forehead_var
        
        return total_variance
    
    def is_live(self):
        """
        Determine if the face is live based on movement variance.
        
        Returns:
            bool: True if face appears live, False if potentially spoofed
        """
        variance = self.calculate_variance()
        return variance >= self.variance_threshold
    
    def get_confidence_score(self):
        """
        Get a confidence score for liveness (0-1).
        
        Returns:
            float: Confidence score where 1.0 is very confident it's live
        """
        variance = self.calculate_variance()
        
        # Normalize variance to confidence score
        # Higher variance = higher confidence of liveness
        confidence = min(variance / (self.variance_threshold * 10), 1.0)
        
        return confidence
    
    def reset(self):
        """Clear all landmark history."""
        self.nose_tip_history.clear()
        self.chin_history.clear()
        self.forehead_history.clear()
    
    def get_state(self):
        """
        Get current state of the anti-spoofing detector.
        
        Returns:
            dict: State information
        """
        variance = self.calculate_variance()
        
        return {
            "variance": variance,
            "is_live": self.is_live(),
            "confidence": self.get_confidence_score(),
            "history_size": len(self.nose_tip_history),
            "threshold": self.variance_threshold
        }
