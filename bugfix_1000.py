import subprocess
import json
import os

def fix_version_mismatch(repo_path, package_name, local_version, published_version):
    # Check if the package.json exists in the repository
    package_json_path = os.path.join(repo_path, 'package.json')
    if not os.path.exists(package_json_path):
        raise FileNotFoundError(f"package.json not found in {repo_path}")

    # Read the current package.json
    with open(package_json_path, 'r') as file:
        package_json = json.load(file)

    # Check if the package name exists in the dependencies
    if package_name not in package_json['dependencies']:
        raise KeyError(f"{package_name} not found in dependencies of package.json")

    # Update the version to the local version
    package_json['dependencies'][package_name] = local_version

    # Write the updated package.json back to the file
    with open(package_json_path, 'w') as file:
        json.dump(package_json, file, indent=2)

    # Run yarn install to update the package
    try:
        subprocess.run(['yarn', 'install'], check=True, cwd=repo_path)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Failed to install packages: {e}")

    print(f"Successfully updated {package_name} to version {local_version} in {repo_path}")

# Test cases
def test_fix_version_mismatch():
    # Create a temporary directory for testing
    test_dir = 'test_repo'
    os.makedirs(test_dir, exist_ok=True)
    package_json_path = os.path.join(test_dir, 'package.json')

    # Create a package.json with the wrong version
    with open(package_json_path, 'w') as file:
        json.dump({
            "name": "test-package",
            "version": "0.0.1",
            "dependencies": {
                "@embeddedchat/api": "0.1.3"
            }
        }, file)

    # Fix the version mismatch
    fix_version_mismatch(test_dir, "@embeddedchat/api", "0.1.2", "0.1.3")

    # Check if the package.json was updated correctly
    with open(package_json_path, 'r') as file:
        updated_package_json = json.load(file)
        assert updated_package_json['dependencies']['@embeddedchat/api'] == "0.1.2", "Version mismatch not fixed"

    # Clean up the test directory
    os.rmdir(test_dir)

# Run the test cases
test_fix_version_mismatch()