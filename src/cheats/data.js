export const CHEATS = {
  git: [
    { cmd: 'git commit --amend -m "new message"', desc: 'Modify the message of the most recent commit' },
    { cmd: 'git reset --soft HEAD~1', desc: 'Undo the last commit but keep changes staged' },
    { cmd: 'git reset --hard HEAD~1', desc: 'Completely undo the last commit and discard all changes' },
    { cmd: 'git restore --staged <file>', desc: 'Unstage a file without losing local modifications' },
    { cmd: 'git branch -m <new_name>', desc: 'Rename the current active branch' },
    { cmd: 'git push origin --delete <branch>', desc: 'Delete a branch from the remote repository' },
    { cmd: 'git stash pop', desc: 'Apply and remove the most recently stashed changes' },
    { cmd: 'git cherry-pick <commit-hash>', desc: 'Apply a specific commit from another branch to current' },
    { cmd: 'git log --oneline --graph --all', desc: 'Display a compact ASCII graph of all branches and commits' }
  ],
  docker: [
    { cmd: 'docker ps -a', desc: 'List all containers (running and stopped)' },
    { cmd: 'docker exec -it <container_id> bash', desc: 'Open an interactive bash shell inside a container' },
    { cmd: 'docker logs -f --tail 100 <container>', desc: 'Follow the live logs of a container' },
    { cmd: 'docker system prune -af --volumes', desc: 'Remove all unused containers, images, and volumes' },
    { cmd: 'docker build -t <image_name>:tag .', desc: 'Build an image from the current directory Dockerfile' },
    { cmd: 'docker compose up -d --build', desc: 'Build and start multi-container services in detached mode' }
  ],
  chmod: [
    { cmd: 'chmod +x <file>', desc: 'Make a script or file executable' },
    { cmd: 'chmod 600 ~/.ssh/id_rsa', desc: 'Read/write by owner only (strict private key permission)' },
    { cmd: 'chmod 644 <file>', desc: 'Read/write by owner; read-only for group and others (standard file)' },
    { cmd: 'chmod 755 <dir>', desc: 'Read/write/execute by owner; read/execute for others (standard dir)' },
    { cmd: 'chmod -R 755 <folder>', desc: 'Recursively apply 755 permission to directory contents' }
  ],
  linux: [
    { cmd: 'lsof -i :<port>', desc: 'Find which process is listening on a specific port' },
    { cmd: 'kill -9 <PID>', desc: 'Forcefully kill a process by its Process ID' },
    { cmd: 'tar -czvf archive.tar.gz /path/to/dir', desc: 'Create a compressed tar.gz archive' },
    { cmd: 'tar -xzvf archive.tar.gz', desc: 'Extract a compressed tar.gz archive' },
    { cmd: 'df -h', desc: 'Check available disk space in human-readable format' },
    { cmd: 'du -sh * | sort -h', desc: 'Display size of directories and files sorted from smallest to largest' }
  ],
  curl: [
    { cmd: 'curl -X GET https://api.example.com/items', desc: 'Simple GET request' },
    { cmd: 'curl -X POST -H "Content-Type: application/json" -d \'{"name":"item"}\' https://api.example.com', desc: 'Send JSON payload via POST' },
    { cmd: 'curl -I https://example.com', desc: 'Fetch HTTP headers only (HEAD request)' },
    { cmd: 'curl -L https://example.com', desc: 'Automatically follow HTTP redirects (301/302)' },
    { cmd: 'curl -w "Time: %{time_total}s\\n" -o /dev/null -s https://example.com', desc: 'Measure server response latency' }
  ],
  http: [
    { cmd: '200 OK', desc: 'Standard response for successful HTTP requests' },
    { cmd: '201 Created', desc: 'Request fulfilled and a new resource was created' },
    { cmd: '204 No Content', desc: 'Request succeeded with no response body (common in DELETE)' },
    { cmd: '400 Bad Request', desc: 'Malformed syntax or invalid client request payload' },
    { cmd: '401 Unauthorized', desc: 'Authentication required or invalid token' },
    { cmd: '403 Forbidden', desc: 'Client is authenticated but lacks required permissions' },
    { cmd: '404 Not Found', desc: 'Target endpoint or resource does not exist' },
    { cmd: '422 Unprocessable', desc: 'Validation error: syntax is valid but semantic data is invalid' },
    { cmd: '500 Internal Error', desc: 'Server encountered an unexpected condition' },
    { cmd: '502 Bad Gateway', desc: 'Reverse proxy / gateway received invalid upstream response' }
  ],
  regex: [
    { cmd: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', desc: 'Validate standard email format' },
    { cmd: '^(\\+62|62|0)8[1-9][0-9]{6,10}$', desc: 'Indonesian phone number validator' },
    { cmd: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}', desc: 'Strong password: uppercase, lowercase, digit, min 8 chars' },
    { cmd: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', desc: 'IPv4 address matcher' },
    { cmd: '(?<=@)\\w+', desc: 'Positive lookbehind: match username after @ symbol' }
  ]
};
