
# tmp/

This directory is used for temporary files generated during request processing.

## Purpose
- Store intermediate data such as:
  - yt-dlp info JSON files
  - temporary metadata
  - short-lived processing artifacts

## Important
- Files in this directory are **temporary**
- They may be created and deleted automatically by the backend
- **Do not rely on these files for persistence**

## Version Control
- This directory is tracked only to document its purpose
- All files except this README are ignored via `.gitignore`

## Notes
- Contents may be cleaned periodically
- Safe to delete when the server is not running
