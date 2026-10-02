"""Superseded by `harvest.py sweep`, which merges into harvest-log/pins-decided.jsonl and updates state.json.
Kept so old instructions still work."""
import os
import subprocess
import sys

sys.exit(subprocess.call([sys.executable, os.path.join(os.path.dirname(__file__), 'harvest.py'), 'sweep', *sys.argv[1:]]))
