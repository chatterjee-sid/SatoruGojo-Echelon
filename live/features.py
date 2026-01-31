import numpy as np
from collections import deque

class LandmarkPreprocessor:
    """
    Handles landmark normalization and sliding window management.
    """
    def __init__(self, window_size=150):
        self.window_size = window_size
        self.raw_history = deque(maxlen=window_size)
        # Nose tip index in MediaPipe Face Mesh is 1
        self.NOSE_TIP_IDX = 1

    def preprocess(self, landmarks):
        """
        Normalize landmarks relative to the nose tip and store in history.
        landmarks: List of landmark objects (with x, y, z)
        """
        # Convert to numpy array: (478, 3)
        coords = np.array([[l.x, l.y, l.z] for l in landmarks])
        
        # Relative coordinate system: subtract nose tip
        nose_tip = coords[self.NOSE_TIP_IDX]
        normalized_coords = coords - nose_tip
        
        # Flatten to (1434,)
        flat_coords = normalized_coords.flatten()
        
        self.raw_history.append(flat_coords)
        
        if len(self.raw_history) < self.window_size:
            return None
            
        return np.array(self.raw_history)

class FeatureExtractor:
    """
    Calculates temporal features (velocity and acceleration).
    """
    def __init__(self):
        # MediaPipe indices for eyes and mouth
        self.LEFT_EYE = [362, 385, 387, 263, 373, 380]
        self.RIGHT_EYE = [33, 160, 158, 133, 153, 144]
        self.MOUTH = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]
        
        self.interest_indices = list(set(self.LEFT_EYE + self.RIGHT_EYE + self.MOUTH))
        # Sort to ensure consistent flattening
        self.interest_indices.sort()

    def get_temporal_features(self, window_data):
        """
        window_data: shape (150, 1434) - flattened 478*3
        Returns: Velocity and Acceleration for key landmarks
        """
        if window_data is None:
            return None
            
        # Reshape to (150, 478, 3)
        reshaped_data = window_data.reshape(-1, 478, 3)
        
        # Extract only interest landmarks: (150, N, 3)
        interest_data = reshaped_data[:, self.interest_indices, :]
        
        # Velocity (1st derivative): delta / frame
        velocity = np.diff(interest_data, axis=0) # (149, N, 3)
        
        # Acceleration (2nd derivative): delta_v / frame
        acceleration = np.diff(velocity, axis=0) # (148, N, 3)
        
        # Pad or truncate to maintain consistent shapes if needed, 
        # but for LSTM we usually pass the raw window. 
        # The request asks for LSTM Input Layer shape (Batch, 150, 478*3).
        # We will use the raw window for the LSTM but these features are for analysis.
        
        # Calculate stats for "micro-jitters"
        v_jitter = np.std(velocity, axis=0)
        a_jitter = np.std(acceleration, axis=0)
        
        return {
            "velocity": velocity,
            "acceleration": acceleration,
            "v_jitter_mean": np.mean(v_jitter),
            "a_jitter_mean": np.mean(a_jitter)
        }
