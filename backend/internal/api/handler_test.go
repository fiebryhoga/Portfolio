package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"

	"portfolio-backend/internal/api"
	"portfolio-backend/internal/config"
	"portfolio-backend/internal/repository"
	"portfolio-backend/internal/service"
)

func setupTestRouter(t *testing.T) (*gin.Engine, *config.Config) {
	gin.SetMode(gin.TestMode)

	// Use temporary SQLite database for testing
	testDBPath := "test_portfolio.db"
	t.Cleanup(func() {
		os.Remove(testDBPath)
	})

	cfg := &config.Config{
		Port:               "8080",
		DBDriver:           "sqlite",
		DBSqlitePath:       testDBPath,
		JWTSecret:          "test-jwt-secret-key-12345",
		JWTExpiryHours:     1,
		CORSAllowedOrigins: []string{"*"},
		AdminEmail:         "admin@test.com",
		AdminPassword:      "TestAdmin123!",
		AdminName:          "Test Admin",
	}

	db, err := repository.InitDB(cfg)
	if err != nil {
		t.Fatalf("Failed to initialize test db: %v", err)
	}

	repo := repository.NewRepository(db.DB)
	svc := service.NewService(repo, cfg)
	h := api.NewHandler(svc, cfg)

	router := gin.New()
	h.RegisterRoutes(router)

	return router, cfg
}

func TestHealthCheck(t *testing.T) {
	router, _ := setupTestRouter(t)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/health", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse JSON response: %v", err)
	}

	if resp["success"] != true {
		t.Errorf("Expected success to be true, got %v", resp["success"])
	}
}

func TestGetProfile(t *testing.T) {
	router, _ := setupTestRouter(t)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/profile", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestGetProjects(t *testing.T) {
	router, _ := setupTestRouter(t)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/projects", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestSubmitContactMessage(t *testing.T) {
	router, _ := setupTestRouter(t)

	body := map[string]string{
		"name":    "John Doe",
		"email":   "john@example.com",
		"subject": "Collab Inquiry",
		"message": "Hello, I would love to discuss a new software project.",
	}
	bodyBytes, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/contact", bytes.NewReader(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d, body: %s", w.Code, w.Body.String())
	}
}

func TestAdminLoginSuccess(t *testing.T) {
	router, cfg := setupTestRouter(t)

	body := map[string]string{
		"identifier": cfg.AdminEmail,
		"password":   cfg.AdminPassword,
	}
	bodyBytes, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d, body: %s", w.Code, w.Body.String())
	}
}
