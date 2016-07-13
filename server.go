package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path"
)

const BUFFER_SIZE = 32

func FileServer(w http.ResponseWriter, req *http.Request) {
	var err error

	requestPath := path.Clean(req.URL.Path)
	requestExtension := path.Ext(requestPath)

	if requestExtension == "" {
		requestPath = requestPath + "/index.html"
	}

	file, err := os.Open("./web/" + requestPath)

	if err != nil {
		log.Print("Could not open file path: ", requestPath)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 Not Found"))
		return
	}

	switch requestExtension {
	case ".css":
		w.Header().Set("Content-Type", "text/css")
	case ".js":
		w.Header().Set("Content-Type", "application/javascript")
	}

	log.Print("Serving:", requestPath)

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
