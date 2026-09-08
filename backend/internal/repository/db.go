package repository

import (
	"fmt"
	"log"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"portfolio-backend/internal/config"
	"portfolio-backend/internal/model"
	"portfolio-backend/pkg/utils"
)

type Database struct {
	DB *gorm.DB
}

func InitDB(cfg *config.Config) (*Database, error) {
	var db *gorm.DB
	var err error

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	if cfg.DBDriver == "postgres" {
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
			cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
		)
		log.Printf("Connecting to PostgreSQL at %s:%s...", cfg.DBHost, cfg.DBPort)
		db, err = gorm.Open(postgres.Open(dsn), gormConfig)
		if err != nil {
			log.Printf("Warning: Failed to connect to PostgreSQL (%v). Falling back to SQLite database: %s", err, cfg.DBSqlitePath)
			db, err = gorm.Open(sqlite.Open(cfg.DBSqlitePath), gormConfig)
		}
	} else {
		log.Printf("Using SQLite database at %s...", cfg.DBSqlitePath)
		db, err = gorm.Open(sqlite.Open(cfg.DBSqlitePath), gormConfig)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(100)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	// Run Auto-Migrations
	log.Println("Running database migrations...")
	err = db.AutoMigrate(
		&model.User{},
		&model.Profile{},
		&model.Project{},
		&model.Skill{},
		&model.Experience{},
		&model.ContactMessage{},
		&model.Article{},
	)
	if err != nil {
		return nil, fmt.Errorf("database auto-migration failed: %w", err)
	}

	// Seed default data if empty or outdated
	SeedData(db, cfg)

	return &Database{DB: db}, nil
}

func SeedData(db *gorm.DB, cfg *config.Config) {
	// Clean up old placeholder data if found
	var existingProfile model.Profile
	if err := db.First(&existingProfile).Error; err == nil {
		if existingProfile.Name == "Alex Pratama" {
			log.Println("Old placeholder detected. Refreshing seed data to Dimas Fiebry Prayhoga Putra...")
			db.Exec("DELETE FROM profiles")
			db.Exec("DELETE FROM projects")
			db.Exec("DELETE FROM skills")
			db.Exec("DELETE FROM experiences")
		}
	}

	// 1. Seed Admin User
	var userCount int64
	db.Model(&model.User{}).Count(&userCount)
	if userCount == 0 {
		hashed, err := utils.HashPassword(cfg.AdminPassword)
		if err == nil {
			adminEmail := cfg.AdminEmail
			if adminEmail == "" {
				adminEmail = "dimasfiebry@gmail.com"
			}
			adminName := cfg.AdminName
			if adminName == "" {
				adminName = "Dimas Fiebry Prayhoga Putra"
			}
			adminUser := model.User{
				Username:     "admin",
				Email:        adminEmail,
				PasswordHash: hashed,
				Name:         adminName,
			}
			db.Create(&adminUser)
			log.Printf("Default admin user created: %s (%s)", adminUser.Username, adminUser.Email)
		}
	}

	// 2. Seed Profile
	var profileCount int64
	db.Model(&model.Profile{}).Count(&profileCount)
	if profileCount == 0 {
		defaultProfile := model.Profile{
			Name:             "Dimas Fiebry Prayhoga Putra",
			Headline:         "Versatile Fullstack Developer & Performance Systems Engineer",
			Bio:              "Versatile Fullstack Developer with a strong track record of architecting and deploying scalable web applications, ranging from enterprise-level sports analytics platforms to comprehensive business management solutions. Combining a solid academic foundation from Universitas Brawijaya with extensive hands-on experience in API integrations, database architecture, and end-to-end project management.",
			AvatarURL:        "http://localhost:8080/uploads/1788842474245918000.jpg",
			ResumeURL:        "https://fiebryhoga.my.id/",
			GithubURL:        "https://github.com/fiebryhoga",
			LinkedinURL:      "https://linkedin.com/in/dimas-fiebry-prayhoga-putra/",
			TwitterURL:       "https://fiebryhoga.my.id/",
			Email:            "dimasfiebry@gmail.com",
			Phone:            "+6285730979537",
			Location:         "Malang, Indonesia",
			AvailableForWork: true,
			YearsExperience:  3,
			CompletedProjects: 15,
			SatisfiedClients: 10,
		}
		db.Create(&defaultProfile)
		log.Println("Profile seeded for Dimas Fiebry Prayhoga Putra.")
	}

	// 3. Seed Projects
	var projectCount int64
	db.Model(&model.Project{}).Count(&projectCount)
	if projectCount == 0 {
		projects := []model.Project{
			{
				Title:            "ISMS - Integrated Soccer Monitoring System (Persebaya Surabaya)",
				Slug:             "isms-persebaya-surabaya",
				ShortDescription: "Elite sports analytics platform exclusively for Persebaya Surabaya monitoring ACWR models, GPS load metrics, and medical diagnostics.",
				FullDescription:  "Developed exclusively for Persebaya Surabaya to generate comprehensive data-driven reports supporting tactical and medical decisions for the head coach, team doctors, and coaching staff. Features training periodization, microcycles, multiple ACWR models (Weekly, RA, EWMA), GPS Scores, Daily Wellness RPE, VALD Hub integration, and Player Performance Readiness Index (PPRI).",
				ImageURL:         "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Laravel, React.js, Inertia.js, MySQL, Tailwind CSS, REST API",
				Featured:         true,
				OrderIndex:       1,
			},
			{
				Title:            "Simadis Mitreka (SMAN 1 Malang)",
				Slug:             "simadis-mitreka-sman1-malang",
				ShortDescription: "Student management platform for attendance and disciplinary tracking with automated WhatsApp notifications.",
				FullDescription:  "Engineered for SMA Negeri 1 Malang to track student attendance and disciplinary records with real-time automated WhatsApp notifications to parents utilizing Node.js and Baileys socket integration.",
				ImageURL:         "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Laravel, Node.js, Baileys (WhatsApp API), MySQL, Tailwind CSS",
				Featured:         true,
				OrderIndex:       2,
			},
			{
				Title:            "ZK Performance Sports Analytics",
				Slug:             "zk-performance",
				ShortDescription: "Performance analytics and reporting platform tailored for youth sports trainers and athlete development.",
				FullDescription:  "Engineered a performance analytics and reporting suite for youth sports trainers, featuring custom dashboards to track athlete development, strength training metrics, and athletic readiness benchmarks.",
				ImageURL:         "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "React.js, Next.js, Node.js, PostgreSQL, Tailwind CSS",
				Featured:         true,
				OrderIndex:       3,
			},
			{
				Title:            "UD Sumberpangan Inventory & Stock ERP",
				Slug:             "ud-sumberpangan-inventory",
				ShortDescription: "Robust inventory and stock management system with real-time stock tracking and automated reporting.",
				FullDescription:  "Developed a comprehensive inventory management system to optimize operational workflows, featuring real-time stock tracking, automated alerts, and financial reporting for product distribution.",
				ImageURL:         "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Laravel Filament, MySQL, Tailwind CSS, Livewire",
				Featured:         true,
				OrderIndex:       4,
			},
			{
				Title:            "Barbershop Real-Time Booking & Queue",
				Slug:             "barbershop-booking-midtrans",
				ShortDescription: "Real-time queue and appointment booking platform with Midtrans Payment Gateway integration.",
				FullDescription:  "Created a real-time queue and reservation system using Laravel Filament, seamlessly integrated with the Midtrans Payment Gateway for automated cashless transactions and appointment management.",
				ImageURL:         "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Laravel Filament, React.js, Midtrans Gateway, MySQL",
				Featured:         false,
				OrderIndex:       5,
			},
			{
				Title:            "Metro Correspondence & QR App",
				Slug:             "metro-correspondence-qr",
				ShortDescription: "Automated mail administration and document tracking system with custom Python QR Code verification.",
				FullDescription:  "Engineered an automated correspondence workflow system featuring custom QR Code scanning integration using Python to digitize, index, and securely track institutional document workflows.",
				ImageURL:         "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Python, Inertia.js, Laravel, React.js, MySQL",
				Featured:         false,
				OrderIndex:       6,
			},
			{
				Title:            "Siakad LPK Academic Information System",
				Slug:             "siakad-lpk",
				ShortDescription: "Academic Information System utilizing Laravel and Filament to manage student data and schedules.",
				FullDescription:  "Built a comprehensive Academic Information System utilizing Laravel and Filament to seamlessly manage student data, grade transcripts, academic schedules, and institutional administration.",
				ImageURL:         "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Laravel, Filament, MySQL, Tailwind CSS",
				Featured:         false,
				OrderIndex:       7,
			},
			{
				Title:            "E-Archive CV Tunas Abadi",
				Slug:             "e-archive-cv-tunas-abadi",
				ShortDescription: "Secure digital document archiving system built with Next.js for rapid search and retrieval.",
				FullDescription:  "Developed a secure digital archiving platform utilizing Next.js to modernize document storage, ensuring fast retrieval, categorized indexing, and efficient organizational data management.",
				ImageURL:         "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "Next.js, React, TypeScript, Node.js, Tailwind CSS",
				Featured:         false,
				OrderIndex:       8,
			},
			{
				Title:            "Brandly-id Vocational E-Learning",
				Slug:             "brandly-id-elearning",
				ShortDescription: "Interactive e-learning platform for vocational high school students with digital modules.",
				FullDescription:  "Built an interactive e-learning platform for vocational high school (SMK) students, providing engaging digital modules, assignment evaluations, and streamlined learning management.",
				ImageURL:         "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "React.js, Next.js, Node.js, MySQL, Tailwind CSS",
				Featured:         false,
				OrderIndex:       9,
			},
			{
				Title:            "Karangwungu Citizen Portal & Mail Automation",
				Slug:             "karangwungu-portal",
				ShortDescription: "SEO-optimized community portal with automated population management and digital request workflows.",
				FullDescription:  "Built an SEO-optimized community portal using React.js and Inertia.js, featuring administrative modules for population data, resident announcements, and automated digital mail delivery.",
				ImageURL:         "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
				DemoURL:          "https://fiebryhoga.my.id/",
				GithubURL:        "https://github.com/fiebryhoga",
				TechStack:        "React.js, Inertia.js, Laravel, Tailwind CSS, MySQL",
				Featured:         false,
				OrderIndex:       10,
			},
		}
		for _, p := range projects {
			db.Create(&p)
		}
		log.Println("Projects seeded for Dimas Fiebry Prayhoga Putra.")
	}

	// 4. Seed Skills
	var skillCount int64
	db.Model(&model.Skill{}).Count(&skillCount)
	if skillCount == 0 {
		skills := []model.Skill{
			// Backend
			{Name: "PHP & Laravel (Filament)", Category: "Backend", Proficiency: 95, IconName: "Server", OrderIndex: 1},
			{Name: "Golang & Gin Framework", Category: "Backend", Proficiency: 90, IconName: "FileCode", OrderIndex: 2},
			{Name: "Node.js & Express / Baileys", Category: "Backend", Proficiency: 92, IconName: "Network", OrderIndex: 3},
			{Name: "Python & Java", Category: "Backend", Proficiency: 88, IconName: "Terminal", OrderIndex: 4},
			{Name: "Database Architecture (MySQL/Postgres)", Category: "Backend", Proficiency: 92, IconName: "Database", OrderIndex: 5},
			{Name: "REST API & Microservices", Category: "Backend", Proficiency: 94, IconName: "Cpu", OrderIndex: 6},
			// Frontend
			{Name: "React.js & Inertia.js", Category: "Frontend", Proficiency: 95, IconName: "Code2", OrderIndex: 1},
			{Name: "Next.js & TypeScript", Category: "Frontend", Proficiency: 92, IconName: "Globe", OrderIndex: 2},
			{Name: "Tailwind CSS", Category: "Frontend", Proficiency: 96, IconName: "Palette", OrderIndex: 3},
			{Name: "UI/UX & Graphic Design", Category: "Frontend", Proficiency: 88, IconName: "Layers", OrderIndex: 4},
			// DevOps & Tools
			{Name: "Git & Version Control", Category: "DevOps & Cloud", Proficiency: 94, IconName: "GitBranch", OrderIndex: 1},
			{Name: "Docker & Server Deployment", Category: "DevOps & Cloud", Proficiency: 90, IconName: "Box", OrderIndex: 2},
			{Name: "SEO Optimization & QA Testing", Category: "DevOps & Cloud", Proficiency: 88, IconName: "ShieldCheck", OrderIndex: 3},
			{Name: "Midtrans Gateway & Integrations", Category: "DevOps & Cloud", Proficiency: 90, IconName: "CheckCircle2", OrderIndex: 4},
		}
		for _, s := range skills {
			db.Create(&s)
		}
		log.Println("Skills seeded for Dimas Fiebry Prayhoga Putra.")
	}

	// 5. Seed Experience
	var expCount int64
	db.Model(&model.Experience{}).Count(&expCount)
	if expCount == 0 {
		experiences := []model.Experience{
			{
				Role:         "Fullstack Developer - Ass. Performance Analyst",
				Company:      "PT. Suyoko Fit Sejahtera - Persebaya Surabaya (ISMS)",
				CompanyURL:   "https://fiebryhoga.my.id/",
				Location:     "Surabaya, Indonesia",
				StartDate:    "Feb 2026",
				EndDate:      "Aug 2026",
				IsCurrent:    true,
				Description:  "Developed the Integrated Soccer Monitoring System (ISMS), an elite sports analytics platform exclusively for Persebaya Surabaya to support tactical and medical staff decisions.",
				BulletPoints: "Developed the Integrated Soccer Monitoring System (ISMS), generating comprehensive data-driven reports to support tactical and medical decisions for the head coach, team doctors, and coaching staff.|Engineered advanced training and load analytics dashboards to monitor Training Periodization, Microcycles, and athletic metrics including multiple ACWR models (Weekly, RA, EWMA), GPS Scores, and Load Adaptation.|Implemented extensive health and medical tracking systems by seamlessly integrating Daily Wellness RPE, VALD Hub data, Functional Movement Screen (FMS) analysis, and Squad Health Profiles.|Configured dynamic Player Performance Readiness Index (PPRI) scores, Neuromuscular Readiness, and team performance benchmarking using custom formula calculation engines.",
				OrderIndex:   1,
			},
			{
				Role:         "Web Developer (Freelance)",
				Company:      "Karangwungu Village Government",
				CompanyURL:   "https://fiebryhoga.my.id/",
				Location:     "Lamongan, Indonesia",
				StartDate:    "July 2026",
				EndDate:      "July 2026",
				IsCurrent:    false,
				Description:  "Built an SEO-optimized public portal with administrative modules and mail automation.",
				BulletPoints: "Built an SEO-optimized community portal using React.js and Inertia.js, featuring administrative modules for population data and citizen requests.|Engineered an automated digital mail system to streamline internal government workflows and accelerate public service delivery.",
				OrderIndex:   2,
			},
			{
				Role:         "Fullstack Developer",
				Company:      "PT. Suyoko Fit Sejahtera - Olympus Training Surabaya",
				CompanyURL:   "https://fiebryhoga.my.id/",
				Location:     "Surabaya, Indonesia",
				StartDate:    "Jan 2026",
				EndDate:      "Mar 2026",
				IsCurrent:    false,
				Description:  "Built a dedicated health monitoring and training management platform for training clients.",
				BulletPoints: "Built a dedicated health monitoring platform for training clients.|Implemented modules to seamlessly track Wellness RPE (Rating of Perceived Exertion), physical fitness testing profiles, and customized training programs.",
				OrderIndex:   3,
			},
			{
				Role:         "Web Developer (Freelance)",
				Company:      "Karanggeneng Village Government",
				CompanyURL:   "https://fiebryhoga.my.id/",
				Location:     "Lamongan, Indonesia",
				StartDate:    "August 2025",
				EndDate:      "August 2025",
				IsCurrent:    false,
				Description:  "Developed a centralized informational portal using React.js and Inertia.js.",
				BulletPoints: "Developed a centralized informational portal using React.js and Inertia.js.|Designed a responsive UI for easy public access to village news, profiles, and announcements.",
				OrderIndex:   4,
			},
			{
				Role:         "Web Developer (Internship)",
				Company:      "PT Sarana Inti Perwira",
				CompanyURL:   "https://fiebryhoga.my.id/",
				Location:     "Bekasi, Indonesia",
				StartDate:    "May 2025",
				EndDate:      "July 2025",
				IsCurrent:    false,
				Description:  "Developed a web application using Inertia.js and Laravel following the Waterfall methodology.",
				BulletPoints: "Developed a web application using Inertia.js and Laravel following the Waterfall methodology.|Designed database schemas and implemented core business logic for the system.|Managed end-to-end project configuration and deployment to production environments.",
				OrderIndex:   5,
			},
		}
		for _, exp := range experiences {
			db.Create(&exp)
		}
		log.Println("Experiences seeded for Dimas Fiebry Prayhoga Putra.")
	}

	// 6. Seed Articles / Writings
	var articleCount int64
	db.Model(&model.Article{}).Count(&articleCount)
	if articleCount == 0 {
		articles := []model.Article{
			{
				Title:       "Architecting the Integrated Soccer Monitoring System (ISMS) for Persebaya Surabaya",
				Slug:        "architecting-isms-persebaya-surabaya",
				Excerpt:     "A technical breakdown of how we engineered a mission-critical athletic load monitoring platform integrating ACWR models, VALD Hub datasets, and neuromuscular readiness scoring.",
				Category:    "Sports Analytics",
				ReadingTime: "6 min read",
				PublishedAt: time.Now().Add(-72 * time.Hour),
				IsPublished: true,
				OrderIndex:  1,
				Content: `### Introduction & Problem Statement

Professional football teams demand rapid, high-precision analytics to prevent non-contact injuries and maximize athletic output across congested fixture schedules. During my tenure as Fullstack Developer and Assistant Performance Analyst at **PT. Suyoko Fit Sejahtera for Persebaya Surabaya**, we identified a key operational bottleneck: physical performance datasets from disparate hardware ecosystems (GPS trackers, force plates, subjective wellness forms) were fragmented across spreadsheets.

To resolve this, we architected the **Integrated Soccer Monitoring System (ISMS)**: a centralized sports intelligence platform built exclusively for Persebaya Surabaya.

---

### Core Architectural Pillars

1. **Daily Wellness & Subjective RPE Collection**:
   - Player self-assessment engines recording sleep quality, muscle soreness, stress, and Rating of Perceived Exertion (RPE).
   - Instant anomaly detection flagging acute dips in wellness before morning training sessions.

2. **Acute:Chronic Workload Ratio (ACWR) Calculation Engine**:
   - Multi-model workload processing implementing Rolling Average (RA), Exponentially Weighted Moving Average (EWMA), and Weekly Microcycle distributions.
   - The ratio compares immediate acute workload (7 days) against historical chronic workload (28 days) to pinpoint the "sweet spot" of high fitness with minimal injury risk.

3. **VALD Hub & Force Plate Telemetry Integration**:
   - Automated ingestion of neuromuscular symmetry scores, eccentric hamstring strength metrics, and countermovement jump (CMJ) force-time curves.
   - Algorithmic generation of the **Player Performance Readiness Index (PPRI)** to directly guide head coach and medical staff tactical selections.

---

### Key Takeaways

By converging high-volume telemetry into actionable visual dashboards, technical staff were able to tailor microcycle periodization to individual player tolerance thresholds, demonstrating the immense value of software engineering in elite sports performance.`,
			},
			{
				Title:       "Concurrency in Go: Building High-Throughput REST APIs with Gin & Channels",
				Slug:        "concurrency-in-go-gin-channels",
				Excerpt:     "Practical patterns for leveraging lightweight goroutines, worker pools, and buffered channels to handle concurrent requests without thread starvation.",
				Category:    "Backend Engineering",
				ReadingTime: "5 min read",
				PublishedAt: time.Now().Add(-140 * time.Hour),
				IsPublished: true,
				OrderIndex:  2,
				Content: `### Why Concurrency Matters in Modern Backend Architecture

In traditional thread-per-request architectures, scaling to thousands of concurrent requests rapidly exhausts server memory. The Go runtime resolves this with **Goroutines**—cooperatively scheduled green threads requiring as little as 2KB of initial stack memory.

When pairing the high-performance **Gin Web Framework** with Go's channel primitives, you can build production microservices capable of processing high-volume workloads with single-digit millisecond latency.

---

### Pattern 1: Non-Blocking Background Tasks with Worker Pools

Instead of spawning unbounded goroutines on every HTTP request, leverage a worker pool with a buffered channel queue:

` + "```go" + `
type Job struct {
    Payload   []byte
    ResultChan chan error
}

func WorkerPool(jobs <-chan Job, numWorkers int) {
    for i := 0; i < numWorkers; i++ {
        go func(id int) {
            for job := range jobs {
                // Process job asynchronously
                job.ResultChan <- processPayload(job.Payload)
            }
        }(i)
    }
}
` + "```" + `

---

### Pattern 2: Context Cancellation & Timeout Management

Always propagate ` + "`context.Context`" + ` from the incoming Gin request:

` + "```go" + `
func HandleTask(c *gin.Context) {
    ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
    defer cancel()

    select {
    case res := <-performWork(ctx):
        c.JSON(http.StatusOK, res)
    case <-ctx.Done():
        c.JSON(http.StatusGatewayTimeout, gin.H{"error": "Request deadline exceeded"})
    }
}
` + "```" + `

---

### Conclusion

Embracing Go's concurrency idioms enables clean, resilient backend architectures that scale horizontally with minimal hardware footprint.`,
			},
			{
				Title:       "The Inertia.js Paradigm: Bridging Laravel and React for Modern Fullstack Apps",
				Slug:        "inertiajs-laravel-react-fullstack-paradigm",
				Excerpt:     "How Inertia.js eliminates the friction of building separate client-side SPAs and REST APIs while keeping the developer velocity of classic monoliths.",
				Category:    "Fullstack Architecture",
				ReadingTime: "4 min read",
				PublishedAt: time.Now().Add(-200 * time.Hour),
				IsPublished: true,
				OrderIndex:  3,
				Content: `### The Modern Monolith Alternative

Building modern web applications often forces developers to choose between two extremes:
1. **Server-Side Rendered (SSR) Blade/Blade templates**: Rapid productivity, but clunky full-page reloads and limited client-side reactivity.
2. **Decoupled SPA + REST/GraphQL API**: Smooth client interactions, but duplicate validation logic, manual JWT token handling, and complex state management overhead.

**Inertia.js** offers a third, elegant path: The modern monolith.

---

### How Inertia Works Under the Hood

Inertia is not a framework; it is an architectural adapter. It replaces server-side view engines with client-side component renderers (React, Vue, or Svelte).

- Your routes and controllers remain 100% Laravel:
` + "```php" + `
public function show(Project $project)
{
    return Inertia::render('Projects/Detail', [
        'project' => $project->load('metrics'),
    ]);
}
` + "```" + `
- The client receives pure JSON props automatically injected into the React component:
` + "```tsx" + `
export default function Detail({ project }: Props) {
    return <h1>{project.title}</h1>;
}
` + "```" + `

---

### Summary

For teams that prioritize rapid shipping, type safety, and seamless UX without the complexity of managing two separate codebases, Laravel + Inertia.js + React is an unrivaled fullstack stack.`,
			},
		}

		for _, a := range articles {
			db.Create(&a)
		}
		log.Println("Articles seeded for Dimas Fiebry Prayhoga Putra.")
	}
}

