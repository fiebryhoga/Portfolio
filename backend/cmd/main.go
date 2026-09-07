package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"portfolio-backend/internal/api"
	"portfolio-backend/internal/config"
	"portfolio-backend/internal/repository"
	"portfolio-backend/internal/service"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("==============================================")
	log.Printf("🚀 Starting Portfolio Backend (Go + Gin)")
	log.Printf("Port: %s | DB Driver: %s", cfg.Port, cfg.DBDriver)
	log.Printf("==============================================")

	// Initialize Database
	db, err := repository.InitDB(cfg)
	if err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}

	// Initialize Dependencies
	repo := repository.NewRepository(db.DB)
	svc := service.NewService(repo, cfg)
	handler := api.NewHandler(svc, cfg)

	// Setup Gin Engine
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Logger())

	// Register all routes
	handler.RegisterRoutes(router)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("🌟 Server is listening on http://localhost:%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server gracefully stopped.")
}
