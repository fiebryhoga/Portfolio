<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Profiles
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('headline', 255)->nullable();
            $table->text('bio')->nullable();
            $table->text('philosophy')->nullable();
            $table->string('education_title', 150)->nullable();
            $table->string('education_degree', 150)->nullable();
            $table->string('education_gpa', 50)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->string('resume_url', 500)->nullable();
            $table->string('github_url', 255)->nullable();
            $table->string('linkedin_url', 255)->nullable();
            $table->string('twitter_url', 255)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('location', 100)->nullable();
            $table->boolean('available_for_work')->default(true);
            $table->integer('years_experience')->default(3);
            $table->integer('completed_projects')->default(20);
            $table->integer('satisfied_clients')->default(15);
            $table->timestamps();
        });

        // 2. Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 200)->unique();
            $table->string('short_description', 500)->nullable();
            $table->text('full_description')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->string('demo_url', 500)->nullable();
            $table->string('github_url', 500)->nullable();
            $table->string('tech_stack', 500)->nullable();
            $table->boolean('featured')->default(false);
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 3. Skills
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('category', 100);
            $table->integer('proficiency')->default(80);
            $table->string('icon_name', 100)->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 4. Experiences
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('role', 150);
            $table->string('company', 150);
            $table->string('company_url', 255)->nullable();
            $table->string('location', 100)->nullable();
            $table->string('start_date', 50);
            $table->string('end_date', 50)->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->text('bullet_points')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 5. Articles
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('excerpt', 500)->nullable();
            $table->longText('content');
            $table->string('category', 100)->default('Engineering');
            $table->string('reading_time', 50)->default('5 min read');
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(true);
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 6. Contact Messages
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150);
            $table->string('subject', 200)->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('profiles');
    }
};
