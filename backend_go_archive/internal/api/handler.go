package api

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"portfolio-backend/internal/config"
	"portfolio-backend/internal/middleware"
	"portfolio-backend/internal/model"
	"portfolio-backend/internal/service"
	"portfolio-backend/pkg/utils"
)

type Handler struct {
	svc *service.Service
	cfg *config.Config
}

func NewHandler(svc *service.Service, cfg *config.Config) *Handler {
	return &Handler{
		svc: svc,
		cfg: cfg,
	}
}

func (h *Handler) RegisterRoutes(router *gin.Engine) {
	// Global middleware
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware(h.cfg.CORSAllowedOrigins))

	// Static uploads directory
	router.Static("/uploads", "./uploads")

	// Health Check
	router.GET("/health", h.HealthCheck)

	// API v1 group
	v1 := router.Group("/api/v1")
	{
		// Public Endpoints
		v1.GET("/profile", h.GetProfile)
		v1.GET("/projects", h.GetProjects)
		v1.GET("/projects/:slug", h.GetProjectBySlug)
		v1.GET("/skills", h.GetSkills)
		v1.GET("/experiences", h.GetExperiences)
		v1.GET("/articles", h.GetArticles)
		v1.GET("/articles/:slug", h.GetArticleBySlug)
		v1.POST("/articles", h.CreateArticle)
		v1.DELETE("/articles/:id", h.DeleteArticle)
		v1.POST("/contact", h.SubmitContact)

		// Auth
		v1.POST("/auth/login", h.Login)

		// Protected Routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(h.cfg.JWTSecret))
		{
			protected.GET("/auth/me", h.GetCurrentUser)

			// Admin Profile
			protected.PUT("/admin/profile", h.UpdateProfile)

			// Admin Projects
			protected.POST("/admin/projects", h.CreateProject)
			protected.PUT("/admin/projects/:id", h.UpdateProject)
			protected.DELETE("/admin/projects/:id", h.DeleteProject)

			// Admin Skills
			protected.POST("/admin/skills", h.CreateSkill)
			protected.PUT("/admin/skills/:id", h.UpdateSkill)
			protected.DELETE("/admin/skills/:id", h.DeleteSkill)

			// Admin Experiences
			protected.POST("/admin/experiences", h.CreateExperience)
			protected.PUT("/admin/experiences/:id", h.UpdateExperience)
			protected.DELETE("/admin/experiences/:id", h.DeleteExperience)

			// Admin Articles
			protected.POST("/admin/articles", h.CreateArticle)
			protected.PUT("/admin/articles/:id", h.UpdateArticle)
			protected.DELETE("/admin/articles/:id", h.DeleteArticle)

			// Admin Messages
			protected.GET("/admin/messages", h.GetContactMessages)
			protected.PATCH("/admin/messages/:id/read", h.MarkMessageRead)
			protected.DELETE("/admin/messages/:id", h.DeleteMessage)

			// Admin File Upload (Avatar, Images, Assets)
			protected.POST("/admin/upload", h.UploadFile)
		}
	}
}

func (h *Handler) HealthCheck(c *gin.Context) {
	utils.SendSuccess(c, http.StatusOK, "System is healthy and operational", gin.H{
		"status":    "UP",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"version":   "1.0.0",
		"service":   "portfolio-backend-go-gin",
	})
}

// Auth Handlers
func (h *Handler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(c, "Invalid request body", err)
		return
	}

	res, err := h.svc.Login(&req)
	if err != nil {
		utils.SendUnauthorized(c, err.Error())
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Login successful", res)
}

func (h *Handler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.SendUnauthorized(c, "Unauthorized")
		return
	}

	user, err := h.svc.GetCurrentUser(userID.(uint))
	if err != nil {
		utils.SendNotFound(c, "User not found")
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Current user fetched", user)
}

// Profile Handlers
func (h *Handler) GetProfile(c *gin.Context) {
	profile, err := h.svc.GetProfile()
	if err != nil {
		utils.SendNotFound(c, "Profile not found")
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Profile retrieved successfully", profile)
}

func (h *Handler) UpdateProfile(c *gin.Context) {
	var profile model.Profile
	if err := c.ShouldBindJSON(&profile); err != nil {
		utils.SendBadRequest(c, "Invalid profile payload", err)
		return
	}

	if err := h.svc.UpdateProfile(&profile); err != nil {
		utils.SendInternalServerError(c, "Failed to update profile", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Profile updated successfully", profile)
}

// Project Handlers
func (h *Handler) GetProjects(c *gin.Context) {
	featured := c.Query("featured") == "true"
	projects, err := h.svc.GetProjects(featured)
	if err != nil {
		utils.SendInternalServerError(c, "Failed to retrieve projects", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Projects retrieved successfully", projects)
}

func (h *Handler) GetProjectBySlug(c *gin.Context) {
	slug := c.Param("slug")
	project, err := h.svc.GetProjectBySlug(slug)
	if err != nil {
		utils.SendNotFound(c, "Project not found")
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Project retrieved successfully", project)
}

func (h *Handler) CreateProject(c *gin.Context) {
	var project model.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		utils.SendBadRequest(c, "Invalid project payload", err)
		return
	}

	if err := h.svc.CreateProject(&project); err != nil {
		utils.SendInternalServerError(c, "Failed to create project", err)
		return
	}
	utils.SendSuccess(c, http.StatusCreated, "Project created successfully", project)
}

func (h *Handler) UpdateProject(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid project ID", err)
		return
	}

	var project model.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		utils.SendBadRequest(c, "Invalid project payload", err)
		return
	}

	if err := h.svc.UpdateProject(uint(id), &project); err != nil {
		utils.SendInternalServerError(c, "Failed to update project", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Project updated successfully", project)
}

func (h *Handler) DeleteProject(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid project ID", err)
		return
	}

	if err := h.svc.DeleteProject(uint(id)); err != nil {
		utils.SendInternalServerError(c, "Failed to delete project", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Project deleted successfully", nil)
}

// Skills Handlers
func (h *Handler) GetSkills(c *gin.Context) {
	skills, err := h.svc.GetSkills()
	if err != nil {
		utils.SendInternalServerError(c, "Failed to retrieve skills", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Skills retrieved successfully", skills)
}

func (h *Handler) CreateSkill(c *gin.Context) {
	var skill model.Skill
	if err := c.ShouldBindJSON(&skill); err != nil {
		utils.SendBadRequest(c, "Invalid skill payload", err)
		return
	}

	if err := h.svc.CreateSkill(&skill); err != nil {
		utils.SendInternalServerError(c, "Failed to create skill", err)
		return
	}
	utils.SendSuccess(c, http.StatusCreated, "Skill created successfully", skill)
}

func (h *Handler) UpdateSkill(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid skill ID", err)
		return
	}

	var skill model.Skill
	if err := c.ShouldBindJSON(&skill); err != nil {
		utils.SendBadRequest(c, "Invalid skill payload", err)
		return
	}

	if err := h.svc.UpdateSkill(uint(id), &skill); err != nil {
		utils.SendInternalServerError(c, "Failed to update skill", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Skill updated successfully", skill)
}

func (h *Handler) DeleteSkill(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid skill ID", err)
		return
	}

	if err := h.svc.DeleteSkill(uint(id)); err != nil {
		utils.SendInternalServerError(c, "Failed to delete skill", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Skill deleted successfully", nil)
}

// Experience Handlers
func (h *Handler) GetExperiences(c *gin.Context) {
	experiences, err := h.svc.GetExperiences()
	if err != nil {
		utils.SendInternalServerError(c, "Failed to retrieve experiences", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Experiences retrieved successfully", experiences)
}

func (h *Handler) CreateExperience(c *gin.Context) {
	var exp model.Experience
	if err := c.ShouldBindJSON(&exp); err != nil {
		utils.SendBadRequest(c, "Invalid experience payload", err)
		return
	}

	if err := h.svc.CreateExperience(&exp); err != nil {
		utils.SendInternalServerError(c, "Failed to create experience", err)
		return
	}
	utils.SendSuccess(c, http.StatusCreated, "Experience created successfully", exp)
}

func (h *Handler) UpdateExperience(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid experience ID", err)
		return
	}

	var exp model.Experience
	if err := c.ShouldBindJSON(&exp); err != nil {
		utils.SendBadRequest(c, "Invalid experience payload", err)
		return
	}

	if err := h.svc.UpdateExperience(uint(id), &exp); err != nil {
		utils.SendInternalServerError(c, "Failed to update experience", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Experience updated successfully", exp)
}

func (h *Handler) DeleteExperience(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid experience ID", err)
		return
	}

	if err := h.svc.DeleteExperience(uint(id)); err != nil {
		utils.SendInternalServerError(c, "Failed to delete experience", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Experience deleted successfully", nil)
}

// Contact Handlers
func (h *Handler) SubmitContact(c *gin.Context) {
	var req service.ContactFormRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(c, "Validation error: Please provide valid name, email, and message", err)
		return
	}

	msg, err := h.svc.SubmitContactMessage(&req)
	if err != nil {
		utils.SendInternalServerError(c, "Failed to send contact message", err)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "Thank you! Your message has been sent successfully.", msg)
}

func (h *Handler) GetContactMessages(c *gin.Context) {
	messages, err := h.svc.GetContactMessages()
	if err != nil {
		utils.SendInternalServerError(c, "Failed to retrieve messages", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Contact messages retrieved", messages)
}

func (h *Handler) MarkMessageRead(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid message ID", err)
		return
	}

	if err := h.svc.MarkContactMessageRead(uint(id)); err != nil {
		utils.SendInternalServerError(c, "Failed to update message status", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Message marked as read", nil)
}

func (h *Handler) DeleteMessage(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid message ID", err)
		return
	}

	if err := h.svc.DeleteContactMessage(uint(id)); err != nil {
		utils.SendInternalServerError(c, "Failed to delete message", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Message deleted successfully", nil)
}

// Articles Handlers
func (h *Handler) GetArticles(c *gin.Context) {
	publishedOnly := c.DefaultQuery("all", "false") != "true"
	articles, err := h.svc.GetArticles(publishedOnly)
	if err != nil {
		utils.SendInternalServerError(c, "Failed to retrieve articles", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Articles retrieved successfully", articles)
}

func (h *Handler) GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article, err := h.svc.GetArticleBySlug(slug)
	if err != nil {
		utils.SendNotFound(c, "Article not found")
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Article retrieved successfully", article)
}

func (h *Handler) CreateArticle(c *gin.Context) {
	var article model.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		utils.SendBadRequest(c, "Invalid article payload", err)
		return
	}

	if article.Title == "" || article.Content == "" {
		utils.SendBadRequest(c, "Title and Content are required", nil)
		return
	}

	if err := h.svc.CreateArticle(&article); err != nil {
		utils.SendInternalServerError(c, "Failed to publish article", err)
		return
	}
	utils.SendSuccess(c, http.StatusCreated, "Article published successfully", article)
}

func (h *Handler) UpdateArticle(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid article ID", err)
		return
	}

	var article model.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		utils.SendBadRequest(c, "Invalid article payload", err)
		return
	}

	if err := h.svc.UpdateArticle(uint(id), &article); err != nil {
		utils.SendInternalServerError(c, "Failed to update article", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Article updated successfully", article)
}

func (h *Handler) DeleteArticle(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.SendBadRequest(c, "Invalid article ID", err)
		return
	}

	if err := h.svc.DeleteArticle(uint(id)); err != nil {
		utils.SendInternalServerError(c, "Failed to delete article", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Article deleted successfully", nil)
}

// UploadFile handles multipart image uploads (profile avatar, project images, etc.)
func (h *Handler) UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		utils.SendBadRequest(c, "No file provided in form-data", err)
		return
	}

	// Maximum allowed size: 10MB
	if file.Size > 10*1024*1024 {
		utils.SendBadRequest(c, "File size exceeds 10MB limit", nil)
		return
	}

	// Validate file extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".gif":  true,
		".svg":  true,
	}
	if !allowedExts[ext] {
		utils.SendBadRequest(c, "Invalid file format. Allowed formats: .jpg, .jpeg, .png, .webp, .gif, .svg", nil)
		return
	}

	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		utils.SendInternalServerError(c, "Failed to create upload directory", err)
		return
	}

	// Generate safe, unique filename
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	dst := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		utils.SendInternalServerError(c, "Failed to save uploaded file", err)
		return
	}

	// Public URL accessible through backend static route
	scheme := "http"
	if c.Request.TLS != nil {
		scheme = "https"
	}
	fileURL := fmt.Sprintf("%s://%s/uploads/%s", scheme, c.Request.Host, filename)

	utils.SendSuccess(c, http.StatusOK, "File uploaded successfully", gin.H{
		"url":      fileURL,
		"filename": filename,
		"size":     file.Size,
	})
}


