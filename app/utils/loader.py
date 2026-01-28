import importlib
import logging
from typing import Type, Any

logger = logging.getLogger(__name__)

def load_module_class(module_path: str, class_name: str = "Module") -> Type[Any]:
    """
    Dynamically imports a class from a module.
    :param module_path: The full python path to the module (e.g., 'app.modules.example')
    :param class_name: The name of the class to import from the module.
    """
    try:
        module = importlib.import_module(module_path)
        cls = getattr(module, class_name)
        logger.info(f"Successfully loaded {class_name} from {module_path}")
        return cls
    except (ImportError, AttributeError) as e:
        logger.error(f"Failed to load module {module_path} or class {class_name}: {e}")
        raise e
