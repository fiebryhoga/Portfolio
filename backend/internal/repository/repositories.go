package repository

import (
	"portfolio-backend/internal/model"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

// User repository
func (r *Repository) GetUserByEmailOrUsername(identifier string) (*model.User, error) {
	var user model.User
	err := r.db.Where("email = ? OR username = ?", identifier, identifier).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Profile repository
func (r *Repository) GetProfile() (*model.Profile, error) {
	var profile model.Profile
	err := r.db.First(&profile).Error
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (r *Repository) UpdateProfile(p *model.Profile) error {
	return r.db.Save(p).Error
}

// Project repository
func (r *Repository) GetProjects(featuredOnly bool) ([]model.Project, error) {
	var projects []model.Project
	query := r.db.Order("order_index ASC, created_at DESC")
	if featuredOnly {
		query = query.Where("featured = ?", true)
	}
	err := query.Find(&projects).Error
	return projects, err
}

func (r *Repository) GetProjectBySlug(slug string) (*model.Project, error) {
	var project model.Project
	err := r.db.Where("slug = ?", slug).First(&project).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *Repository) GetProjectByID(id uint) (*model.Project, error) {
	var project model.Project
	err := r.db.First(&project, id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *Repository) CreateProject(p *model.Project) error {
	return r.db.Create(p).Error
}

func (r *Repository) UpdateProject(p *model.Project) error {
	return r.db.Save(p).Error
}

func (r *Repository) DeleteProject(id uint) error {
	return r.db.Delete(&model.Project{}, id).Error
}

// Skill repository
func (r *Repository) GetSkills() ([]model.Skill, error) {
	var skills []model.Skill
	err := r.db.Order("order_index ASC, name ASC").Find(&skills).Error
	return skills, err
}

func (r *Repository) CreateSkill(s *model.Skill) error {
	return r.db.Create(s).Error
}

func (r *Repository) UpdateSkill(s *model.Skill) error {
	return r.db.Save(s).Error
}

func (r *Repository) DeleteSkill(id uint) error {
	return r.db.Delete(&model.Skill{}, id).Error
}

// Experience repository
func (r *Repository) GetExperiences() ([]model.Experience, error) {
	var experiences []model.Experience
	err := r.db.Order("order_index ASC, created_at DESC").Find(&experiences).Error
	return experiences, err
}

func (r *Repository) CreateExperience(e *model.Experience) error {
	return r.db.Create(e).Error
}

func (r *Repository) UpdateExperience(e *model.Experience) error {
	return r.db.Save(e).Error
}

func (r *Repository) DeleteExperience(id uint) error {
	return r.db.Delete(&model.Experience{}, id).Error
}

// ContactMessage repository
func (r *Repository) GetContactMessages() ([]model.ContactMessage, error) {
	var messages []model.ContactMessage
	err := r.db.Order("created_at DESC").Find(&messages).Error
	return messages, err
}

func (r *Repository) CreateContactMessage(msg *model.ContactMessage) error {
	return r.db.Create(msg).Error
}

func (r *Repository) MarkContactMessageAsRead(id uint) error {
	return r.db.Model(&model.ContactMessage{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *Repository) DeleteContactMessage(id uint) error {
	return r.db.Delete(&model.ContactMessage{}, id).Error
}
