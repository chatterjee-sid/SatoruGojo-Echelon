from abc import ABC, abstractmethod
from typing import Any

class BaseModel(ABC):
    """
    Abstract Base Class for all machine learning or logic models in the Echelon system.
    """

    @abstractmethod
    def preprocess(self, data: Any) -> Any:
        """
        Preprocess the input data before passing it to predict.
        """
        pass

    @abstractmethod
    def predict(self, data: Any) -> Any:
        """
        Perform the prediction/logic on the preprocessed data.
        """
        pass
