package main

import (
	"io"
	"log"
	"net/http"
	"os"
)

const BUFFER_SIZE = 32

func FileServer(w http.ResponseWriter, req *http.Request) {
	var err error

	path := req.URL.Path

	if path[len(path)-1] == '/' {
		path = path + "index.html"
	}

	file, err := os.Open("./web/" + path)

	if err != nil {
		log.Print("Could not open file path: ", path)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 Not Found"))
		return
	}

	log.Print("Serving:", path)

	// My own custom slow server! For testing purposes.
	var written int64

	for {
		written, err = io.CopyN(w, file, BUFFER_SIZE)

		if written < BUFFER_SIZE {
			break
		}
	}
}

func main() {
	log.Print("Listening on :8080")

	http.HandleFunc("/", FileServer)
	http.ListenAndServe(":8080", nil)
}
