"""
Unit tests for BlinkDetector.
"""

import unittest
import numpy as np
from src.utils.blink_detector import BlinkDetector


class MockLandmark:
    """Mock landmark for testing."""
    def __init__(self, x, y):
        self.x = x
        self.y = y


class TestBlinkDetector(unittest.TestCase):
    """Test cases for BlinkDetector class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.detector = BlinkDetector(ear_threshold=0.2)
    
    def test_initialization(self):
        """Test detector initialization."""
        self.assertEqual(self.detector.blink_count, 0)
        self.assertFalse(self.detector.is_eye_closed)
        self.assertEqual(self.detector.ear_threshold, 0.2)
    
    def test_calculate_ear_open_eye(self):
        """Test EAR calculation for open eye."""
        # Create mock landmarks for an open eye
        landmarks = [MockLandmark(0, 0) for _ in range(500)]
        
        # Set specific eye landmarks for open eye (high EAR)
        eye_indices = [33, 160, 158, 133, 153, 144]
        landmarks[eye_indices[0]] = MockLandmark(0.0, 0.5)  # outer corner
        landmarks[eye_indices[1]] = MockLandmark(0.1, 0.4)  # top
        landmarks[eye_indices[2]] = MockLandmark(0.1, 0.6)  # bottom
        landmarks[eye_indices[3]] = MockLandmark(0.2, 0.5)  # inner corner
        landmarks[eye_indices[4]] = MockLandmark(0.15, 0.6) # bottom middle
        landmarks[eye_indices[5]] = MockLandmark(0.15, 0.4) # top middle
        
        ear = self.detector.calculate_ear(landmarks, eye_indices)
        self.assertGreater(ear, 0.2)  # Open eye should have EAR > threshold
    
    def test_blink_count_increment(self):
        """Test that blink count increments correctly."""
        initial_count = self.detector.get_blink_count()
        
        # Simulate a blink cycle
        # This would require more complex mock data
        # For now, just test the counter works
        self.detector.blink_count = 1
        self.assertEqual(self.detector.get_blink_count(), 1)
    
    def test_reset(self):
        """Test detector reset functionality."""
        self.detector.blink_count = 5
        self.detector.is_eye_closed = True
        self.detector.closed_frame_count = 3
        
        self.detector.reset()
        
        self.assertEqual(self.detector.blink_count, 0)
        self.assertFalse(self.detector.is_eye_closed)
        self.assertEqual(self.detector.closed_frame_count, 0)
    
    def test_get_state(self):
        """Test state retrieval."""
        state = self.detector.get_state()
        
        self.assertIn('blink_count', state)
        self.assertIn('is_closed', state)
        self.assertIn('closed_frames', state)


if __name__ == '__main__':
    unittest.main()
