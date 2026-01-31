import cv2
from liveness_engine import LivenessEngine
import time
from datetime import datetime


class LivenessDetector:
    """
    Advanced liveness detector with callbacks and logging.
    """
    
    def __init__(self, model_path='face_landmarker.task'):
        self.engine = LivenessEngine(model_path)
        self.on_verified = None
        self.on_failed = None
        self.on_blink = None
        
    def set_callbacks(self, on_verified=None, on_failed=None, on_blink=None):
        """
        Set callback functions for different events.
        
        Args:
            on_verified: Called when liveness is verified
            on_failed: Called when verification fails (timeout)
            on_blink: Called each time a blink is detected
        """
        self.on_verified = on_verified
        self.on_failed = on_failed
        self.on_blink = on_blink
    
    def run_detection(self, session_id, camera_index=0, show_preview=True):
        """
        Run liveness detection with callbacks.
        
        Args:
            session_id: Unique session identifier
            camera_index: Camera device index
            show_preview: Whether to show video preview
            
        Returns:
            dict: Final verification result
        """
        cap = cv2.VideoCapture(camera_index)
        
        if not cap.isOpened():
            return {"error": "Could not open camera"}
        
        last_blink_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            result = self.engine.process_frame(session_id, frame)
            
            # Trigger blink callback
            if result['blinkCount'] > last_blink_count:
                last_blink_count = result['blinkCount']
                if self.on_blink:
                    self.on_blink(result)
            
            # Check for verification
            if result['verified']:
                if self.on_verified:
                    self.on_verified(result)
                cap.release()
                cv2.destroyAllWindows()
                return result
            
            # Check for timeout
            if result['status'] == 'timeout':
                if self.on_failed:
                    self.on_failed(result)
                cap.release()
                cv2.destroyAllWindows()
                return result
            
            # Show preview
            if show_preview:
                self._draw_interface(frame, result)
                cv2.imshow('Liveness Detection', frame)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
        
        cap.release()
        cv2.destroyAllWindows()
        return {"status": "cancelled"}
    
    def _draw_interface(self, frame, result):
        """Draw professional UI on frame."""
        h, w = frame.shape[:2]
        
        # Semi-transparent overlay
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 100), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)
        
        # Status color
        if result['verified']:
            color = (0, 255, 0)
            status = "✓ VERIFIED"
        elif result['status'] == 'no_face':
            color = (0, 0, 255)
            status = "⚠ NO FACE"
        else:
            color = (255, 255, 0)
            status = "⟳ PROCESSING"
        
        # Draw status
        cv2.putText(frame, status, (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
        
        # Progress bar
        if 'timeElapsed' in result and result['status'] == 'processing':
            progress = min(result['timeElapsed'] / 10.0, 1.0)
            bar_width = int((w - 40) * progress)
            cv2.rectangle(frame, (20, 70), (20 + bar_width, 85), color, -1)
            cv2.rectangle(frame, (20, 70), (w - 20, 85), color, 2)
        
        # Blink counter
        blink_text = f"Blinks: {result['blinkCount']}/2"
        cv2.putText(frame, blink_text, (w - 200, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)


def example_callbacks():
    """Example showing how to use callbacks."""
    
    def on_verified(result):
        print("\n" + "="*50)
        print("✓ LIVENESS VERIFIED!")
        print("="*50)
        print(f"Time taken: {result['timeElapsed']:.2f} seconds")
        print(f"Total blinks: {result['blinkCount']}")
        print(f"Variance: {result['variance']:.6f}")
        
        # Here you could:
        # - Save verification to database
        # - Generate authentication token
        # - Send notification
        # - Proceed to next step in workflow
    
    def on_failed(result):
        print("\n" + "="*50)
        print("✗ VERIFICATION FAILED")
        print("="*50)
        print(f"Reason: {result['status']}")
        print(f"Blinks detected: {result['blinkCount']}/2")
        
        # Here you could:
        # - Log failed attempt
        # - Notify security team
        # - Allow retry
    
    def on_blink(result):
        timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        print(f"[{timestamp}] Blink detected! Count: {result['blinkCount']}/2")
    
    # Run detector with callbacks
    detector = LivenessDetector()
    detector.set_callbacks(
        on_verified=on_verified,
        on_failed=on_failed,
        on_blink=on_blink
    )
    
    print("\n" + "="*50)
    print("Starting Liveness Detection")
    print("="*50)
    print("Instructions:")
    print("1. Look at the camera")
    print("2. Blink naturally 2 times")
    print("3. Complete within 10 seconds")
    print("\nPress 'q' to cancel\n")
    
    session_id = f"user_{int(time.time())}"
    result = detector.run_detection(session_id)
    
    print("\nFinal Result:", result.get('status', 'unknown'))


if __name__ == "__main__":
    example_callbacks()
