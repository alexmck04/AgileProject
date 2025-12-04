# test/test_file_structure.py

# This script verifies that essential files and directories exist

import os.path
import pytest

# Define the root directory (where the tests are run from)
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- Root-level Checks ---
# List of directories that MUST exist at the repository root
REQUIRED_ROOT_DIRECTORIES = [
    "CSV",
    "web-dev",
    "test",
]

@pytest.mark.parametrize("dirname", REQUIRED_ROOT_DIRECTORIES)
def test_required_root_directories_exist(dirname):
    """Test to ensure core directories (CSV, web-dev, test) are present."""
    dir_path = os.path.join(ROOT_DIR, dirname)
    assert os.path.isdir(dir_path), f"Required directory not found at root: {dirname}"


# --- React App Component Checks ---
# Files expected to be inside 'web-dev/my-react-app/src/'
REQUIRED_SRC_FILES = [
    "HomePage.jsx",
    "ChartsPage.jsx",
    "firebase.js",
    "App.jsx", # Added a common file for robustness
]

@pytest.mark.parametrize("filename", REQUIRED_SRC_FILES)
def test_required_react_source_files_exist(filename):
    """Test to ensure key React source files and components are present."""
    # Path construction: ROOT_DIR / web-dev / my-react-app / src / filename
    file_path = os.path.join(ROOT_DIR, 'web-dev', 'my-react-app', 'src', filename)
    assert os.path.isfile(file_path), f"React source file not found: web-dev/my-react-app/src/{filename}"


# --- Essential Config and Data Checks ---
def test_react_config_and_data_files_exist():
    """Specific test to check for critical config and data files."""
    required_files = [
        # Root of React App
        os.path.join('web-dev', 'my-react-app', 'package.json'),
        # Data/ML File (seen in screenshot)
        os.path.join('web-dev', 'my-react-app', 'GameSales_Final_ML.csv'),
        # Python script (seen in screenshot)
        os.path.join('web-dev', 'my-react-app', 'train.py'),
    ]

    for rel_path in required_files:
        full_path = os.path.join(ROOT_DIR, rel_path)
        assert os.path.isfile(full_path), f"Essential file is missing: {rel_path}"