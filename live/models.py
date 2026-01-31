import torch
import torch.nn as nn
import numpy as np
from sklearn.ensemble import IsolationForest

class LSTMAutoencoder(nn.Module):
    def __init__(self, input_dim=3, hidden_dim=64):
        super(LSTMAutoencoder, self).__init__()
        # input_dim: 3 (ear, yaw, pitch)
        
        # Encoder
        self.encoder = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        # Latent space (Bottleneck)
        self.bottleneck = nn.Linear(hidden_dim, hidden_dim // 2)
        
        # Decoder
        self.decoder_input = nn.Linear(hidden_dim // 2, hidden_dim)
        self.decoder = nn.LSTM(hidden_dim, input_dim, batch_first=True)

    def forward(self, x):
        # x shape: (batch, seq_len, input_dim)
        _, (h_n, _) = self.encoder(x)
        latent = torch.relu(self.bottleneck(h_n[-1]))
        
        # Prepare decoder input (repeat latent vector for seq_len)
        seq_len = x.size(1)
        dec_in = self.decoder_input(latent).unsqueeze(1).repeat(1, seq_len, 1)
        
        reconstructed, _ = self.decoder(dec_in)
        return reconstructed

class LivenessLSTM(nn.Module):
    def __init__(self, input_dim=3, hidden_dim=64):
        super(LivenessLSTM, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        _, (h_n, _) = self.lstm(x)
        out = self.fc(h_n[-1])
        return out

class AnomalyDetector:
    def __init__(self, input_dim=3, hidden_dim=64, threshold=0.05):
        self.autoencoder = LSTMAutoencoder(input_dim, hidden_dim)
        self.classifier = LivenessLSTM(input_dim, hidden_dim)
        self.iso_forest = IsolationForest(contamination=0.01)
        self.threshold = threshold
        
        # Set to evaluation mode
        self.autoencoder.eval()
        self.classifier.eval()

    def get_reconstruction_error(self, sequence):
        """
        Calculates the Mean Squared Error between input and reconstruction.
        sequence: list or array of shape (seq_len, 3)
        """
        with torch.no_grad():
            x = torch.FloatTensor(sequence).unsqueeze(0) # Add batch dim
            reconstructed = self.autoencoder(x)
            mse = torch.mean((x - reconstructed) ** 2).item()
            return mse

    def get_liveness_score(self, sequence):
        """
        Returns the probability of the sequence being human (fluid movement).
        """
        with torch.no_grad():
            x = torch.FloatTensor(sequence).unsqueeze(0)
            score = self.classifier(x).item()
            return score

    def detect_outliers(self, sequence):
        """
        Uses Isolation Forest to detect physically impossible frame jumps.
        Returns: True if anomaly detected in any frame.
        """
        # Isolation Forest expects (n_samples, n_features)
        # We treat each frame as a sample
        if len(sequence) < 2: return False
        
        preds = self.iso_forest.fit_predict(sequence)
        # -1 indicates outlier, 1 indicates inlier
        return np.any(preds == -1)

    def verify_buffer(self, buffer):
        """
        Combined logic for anomaly detection.
        """
        if len(buffer) < 150:
            return 0.0, 0.0, False # Not enough data
            
        data = np.array(buffer)
        
        # Normalize/Standardize data (optional but recommended)
        # Simple normalization for demonstration
        data_min = data.min(axis=0)
        data_max = data.max(axis=0) + 1e-6
        norm_data = (data - data_min) / (data_max - data_min)
        
        error = self.get_reconstruction_error(norm_data)
        score = self.get_liveness_score(norm_data)
        outlier = self.detect_outliers(norm_data)
        
        return error, score, outlier
