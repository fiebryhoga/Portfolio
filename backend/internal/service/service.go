package service

import (
	"errors"
	"strings"
	"time"

	"portfolio-backend/internal/config"
	"portfolio-backend/internal/model"
	"portfolio-backend/internal/repository"
	"portfolio-backend/pkg/utils"
)

type Service struct {
	repo *repository.Repository
	cfg  *config.Config
}

func NewService(repo *repository.Repository, cfg *config.Config) *Service {
	return &Service{
		repo: repo,
		cfg:  cfg,
	}
}

// Auth
type LoginRequest struct {
	Identifier string `json:"identifier" binding:"required"` // Username or Email
	Password   string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token     string      `json:"token"`
	ExpiresIn int         `json:"expires_in"` // hours
	User      *model.User `json:"user"`
}

func (s *Service) Login(req *LoginRequest) (*LoginResponse, error) {
	user, err := s.repo.GetUserByEmailOrUsername(req.Identifier)
	if err != nil {
		return nil, errors.New("invalid email/username or password")
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		return nil, errors.New("invalid email/username or password")
	}

	token, err := utils.GenerateToken(user.ID, user.Username, user.Email, s.cfg.JWTSecret, s.cfg.JWTExpiryHours)
	if err != nil {
		return nil, errors.New("failed to generate authentication token")
	}

	return &LoginResponse{
		Token:     token,
		ExpiresIn: s.cfg.JWTExpiryHours,
		User:      user,
	}, nil
}

func (s *Service) GetCurrentUser(userID uint) (*model.User, error) {
	return s.repo.GetUserByID(userID)
}

// Profile
func (s *Service) GetProfile() (*model.Profile, error) {
	return s.repo.GetProfile()
}

func (s *Service) UpdateProfile(p *model.Profile) error {
	p.UpdatedAt = time.Now()
	return s.repo.UpdateProfile(p)
}

// Projects
func (s *Service) GetProjects(featuredOnly bool) ([]model.Project, error) {
	return s.repo.GetProjects(featuredOnly)
}

func (s *Service) GetProjectBySlug(slug string) (*model.Project, error) {
	return s.repo.GetProjectBySlug(slug)
}

func (s *Service) CreateProject(p *model.Project) error {
	if p.Slug == "" {
		p.Slug = strings.ToLower(strings.ReplaceAll(p.Title, " ", "-"))
	}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	return s.repo.CreateProject(p)
}

func (s *Service) UpdateProject(id uint, p *model.Project) error {
	existing, err := s.repo.GetProjectByID(id)
	if err != nil {
		return errors.New("project not found")
	}

	existing.Title = p.Title
	if p.Slug != "" {
		existing.Slug = p.Slug
	}
	existing.ShortDescription = p.ShortDescription
	existing.FullDescription = p.FullDescription
	existing.ImageURL = p.ImageURL
	existing.DemoURL = p.DemoURL
	existing.GithubURL = p.GithubURL
	existing.TechStack = p.TechStack
	existing.Featured = p.Featured
	existing.OrderIndex = p.OrderIndex
	existing.UpdatedAt = time.Now()

	return s.repo.UpdateProject(existing)
}

func (s *Service) DeleteProject(id uint) error {
	return s.repo.DeleteProject(id)
}

// Skills
func (s *Service) GetSkills() ([]model.Skill, error) {
	return s.repo.GetSkills()
}

func (s *Service) CreateSkill(sk *model.Skill) error {
	sk.CreatedAt = time.Now()
	return s.repo.CreateSkill(sk)
}

func (s *Service) UpdateSkill(id uint, sk *model.Skill) error {
	sk.ID = id
	return s.repo.UpdateSkill(sk)
}

func (s *Service) DeleteSkill(id uint) error {
	return s.repo.DeleteSkill(id)
}

// Experiences
func (s *Service) GetExperiences() ([]model.Experience, error) {
	return s.repo.GetExperiences()
}

func (s *Service) CreateExperience(exp *model.Experience) error {
	exp.CreatedAt = time.Now()
	return s.repo.CreateExperience(exp)
}

func (s *Service) UpdateExperience(id uint, exp *model.Experience) error {
	exp.ID = id
	return s.repo.UpdateExperience(exp)
}

func (s *Service) DeleteExperience(id uint) error {
	return s.repo.DeleteExperience(id)
}

// Contact Messages
type ContactFormRequest struct {
	Name    string `json:"name" binding:"required,min=2,max=100"`
	Email   string `json:"email" binding:"required,email"`
	Subject string `json:"subject" binding:"max=200"`
	Message string `json:"message" binding:"required,min=5,max=2000"`
}

func (s *Service) SubmitContactMessage(req *ContactFormRequest) (*model.ContactMessage, error) {
	msg := &model.ContactMessage{
		Name:      req.Name,
		Email:     req.Email,
		Subject:   req.Subject,
		Message:   req.Message,
		IsRead:    false,
		CreatedAt: time.Now(),
	}
	err := s.repo.CreateContactMessage(msg)
	if err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *Service) GetContactMessages() ([]model.ContactMessage, error) {
	return s.repo.GetContactMessages()
}

func (s *Service) MarkContactMessageRead(id uint) error {
	return s.repo.MarkContactMessageAsRead(id)
}

func (s *Service) DeleteContactMessage(id uint) error {
	return s.repo.DeleteContactMessage(id)
}
