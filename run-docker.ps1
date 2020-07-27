$running = docker container inspect -f '{{.State.Running}}' nvdb-api-skriv

if($running -eq 'true') {
  docker stop nvdb-api-skriv
} else {
  docker start nvdb-api-skriv
}
