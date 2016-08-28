cat $(find . -type f | sort -nr | cut -d\  -f2- | grep -v '.meteor' | grep -v '.git') | wc -l
