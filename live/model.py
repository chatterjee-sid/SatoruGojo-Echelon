import torch
import torch.nn as nn

class TemporalLSTM(nn.Module):
    """
    LSTM model to classify natural human movement vs synthesized/mechanical movement.
    """
    def __init__(self, input_dim=1434, hidden_dim=64, num_layers=1):
        super(TemporalLSTM, self).__init__()
        
        # Input Layer: (Batch, 150, 1434)
        # LSTM Layer: 64 hidden units
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        
        # Fully Connected Layer: Output classification
        self.fc = nn.Linear(hidden_dim, 1)
        
        # Sigmoid activation for binary classification
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        """
        x: (Batch, Sequence_length, 478 * 3)
        """
        # LSTM output: (batch, seq_len, hidden_dim)
        # h_n shape: (num_layers, batch, hidden_dim)
        lstm_out, (h_n, c_n) = self.lstm(x)
        
        # Use the last hidden state for classification
        last_hidden = h_n[-1]
        
        # Fully connected
        out = self.fc(last_hidden)
        
        # Sigmoid
        out = self.sigmoid(out)
        
        return out

def get_model(input_dim=1434):
    return TemporalLSTM(input_dim=input_dim)
