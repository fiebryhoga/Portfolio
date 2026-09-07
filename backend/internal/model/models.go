package model

import (
	"time"
)

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;not null;size:100" json:"username"`
	Email        string    `gorm:"uniqueIndex;not null;size:150" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	Name         string    `gorm:"size:100" json:"name"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Profile struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	Name             string    `gorm:"size:100;not null" json:"name"`
	Headline         string    `gorm:"size:255" json:"headline"`
	Bio              string    `gorm:"type:text" json:"bio"`
	AvatarURL        string    `gorm:"size:500" json:"avatar_url"`
	ResumeURL        string    `gorm:"size:500" json:"resume_url"`
	GithubURL        string    `gorm:"size:255" json:"github_url"`
	LinkedinURL      string    `gorm:"size:255" json:"linkedin_url"`
	TwitterURL       string    `gorm:"size:255" json:"twitter_url"`
	Email            string    `gorm:"size:150" json:"email"`
	Phone            string    `gorm:"size:50" json:"phone"`
	Location         string    `gorm:"size:100" json:"location"`
	AvailableForWork bool      `gorm:"default:true" json:"available_for_work"`
	YearsExperience  int       `gorm:"default:3" json:"years_experience"`
	CompletedProjects int      `gorm:"default:20" json:"completed_projects"`
	SatisfiedClients int       `gorm:"default:15" json:"satisfied_clients"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Project struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	Title            string    `gorm:"size:200;not null" json:"title"`
	Slug             string    `gorm:"uniqueIndex;size:200;not null" json:"slug"`
	ShortDescription string    `gorm:"size:300" json:"short_description"`
	FullDescription  string    `gorm:"type:text" json:"full_description"`
	ImageURL         string    `gorm:"size:500" json:"image_url"`
	DemoURL          string    `gorm:"size:500" json:"demo_url"`
	GithubURL        string    `gorm:"size:500" json:"github_url"`
	TechStack        string    `gorm:"size:500" json:"tech_stack"` // Comma-separated or JSON string
	Featured         bool      `gorm:"default:false" json:"featured"`
	OrderIndex       int       `gorm:"default:0" json:"order_index"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Skill struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:100;not null" json:"name"`
	Category    string    `gorm:"size:100;not null" json:"category"` // e.g., "Backend", "Frontend", "DevOps & Cloud", "Database & Tools"
	Proficiency int       `gorm:"default:80" json:"proficiency"`     // 1 to 100
	IconName    string    `gorm:"size:100" json:"icon_name"`
	OrderIndex  int       `gorm:"default:0" json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
}

type Experience struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Role         string    `gorm:"size:150;not null" json:"role"`
	Company      string    `gorm:"size:150;not null" json:"company"`
	CompanyURL   string    `gorm:"size:255" json:"company_url"`
	Location     string    `gorm:"size:100" json:"location"`
	StartDate    string    `gorm:"size:50;not null" json:"start_date"` // e.g. "Jan 2023"
	EndDate      string    `gorm:"size:50" json:"end_date"`            // e.g. "Present" or "Dec 2024"
	IsCurrent    bool      `gorm:"default:false" json:"is_current"`
	Description  string    `gorm:"type:text" json:"description"`
	BulletPoints string    `gorm:"type:text" json:"bullet_points"` // Stored as pipe-delimited or JSON string
	OrderIndex   int       `gorm:"default:0" json:"order_index"`
	CreatedAt    time.Time `json:"created_at"`
}

type ContactMessage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:100;not null" json:"name"`
	Email     string    `gorm:"size:150;not null" json:"email"`
	Subject   string    `gorm:"size:200" json:"subject"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	IsRead    bool      `gorm:"default:false" json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}
