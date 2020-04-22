package main

import (
	"fmt"
	"golang.org/x/sys/unix"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	ch := make(chan os.Signal)
	signal.Notify(ch, os.Interrupt, syscall.SIGUSR1, syscall.SIGUSR2)
	go func() {
		sig := <-ch
		fmt.Println("Receive signal: ", sig)
		fmt.Println("Exiting...")
		fmt.Println("Clearing...")
		close(ch)
		os.Exit(0)
	}()
	fmt.Println("Waiting for signal...")
	_ = unix.Pause()
}
