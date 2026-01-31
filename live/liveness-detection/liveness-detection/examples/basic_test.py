import cv2
from liveness_engine import LivenessEngine


def main():
    """
    Test the liveness detection engine with webcam input.
    Press 'q' to quit, 'r' to reset session.
    """
    # Initialize camera
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    # Initialize liveness engine
    try:
        engine = LivenessEngine(model_path='face_landmarker.task')
    except Exception as e:
        print(f"Error initializing engine: {e}")
        print("Make sure 'face_landmarker.task' is in the current directory")
        print("Download from: https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task")
        cap.release()
        return
    
    session_id = "test_user_123"
    
    print("Liveness Detection Started")
    print("Instructions:")
    print("- Look at the camera and blink naturally")
    print("- You need to blink 2 times within 10 seconds")
    print("- Press 'q' to quit")
    print("- Press 'r' to reset session")
    print("-" * 50)
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break
        
        # Process the frame
        result = engine.process_frame(session_id, frame)
        
        # Determine display color
        if result["verified"]:
            color = (0, 255, 0)  # Green
            status_text = "VERIFIED"
        elif result["status"] == "no_face":
            color = (0, 0, 255)  # Red
            status_text = "NO FACE DETECTED"
        elif result["status"] == "timeout":
            color = (0, 165, 255)  # Orange
            status_text = "TIMEOUT - Press 'r' to retry"
        else:
            color = (255, 255, 0)  # Yellow
            status_text = "PROCESSING"
        
        # Display information on frame
        cv2.putText(frame, status_text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        
        cv2.putText(frame, f"Blinks: {result['blinkCount']}/2", (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        cv2.putText(frame, f"Live: {result['isLive']}", (10, 110),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        cv2.putText(frame, f"Variance: {result['variance']:.6f}", (10, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        if 'timeElapsed' in result:
            cv2.putText(frame, f"Time: {result['timeElapsed']:.1f}s / 10s", (10, 190),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        if 'avgEAR' in result:
            cv2.putText(frame, f"EAR: {result['avgEAR']:.3f}", (10, 230),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        # Show the frame
        cv2.imshow('Liveness Detection', frame)
        
        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            print("Exiting...")
            break
        elif key == ord('r'):
            print("Resetting session...")
            engine.reset_session(session_id)
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    print("Cleanup complete")


if __name__ == "__main__":
    main()
