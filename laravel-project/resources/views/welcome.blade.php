<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to DigitalCard Pro</title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <style>
        :root {
            --primary-color: #3B82F6;
            --secondary-color: #64748B;
            --light-bg: #F8FAFC;
        }
        
        body {
            background-color: var(--light-bg);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 0;
        }
        
        .feature-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
        }
        
        .feature-icon i {
            font-size: 1.5rem;
            color: white;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            padding: 0.75rem 2rem;
            font-weight: 600;
        }
        
        .btn-primary:hover {
            background-color: #2563EB;
            border-color: #2563EB;
        }
        
        .navbar-brand {
            font-weight: 700;
            color: white !important;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">
                <i class="bi bi-credit-card-2-front me-2"></i>
                DigitalCard Pro
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#features">Features</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#pricing">Pricing</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#about">About</a>
                    </li>
                    <li class="nav-item ms-2">
                        <a href="{{ url('/login') }}" class="btn btn-outline-light me-2">Login</a>
                    </li>
                    <li class="nav-item">
                        <a href="{{ url('/register') }}" class="btn btn-primary">Get Started</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">Transform Your Networking with Digital Business Cards</h1>
                    <p class="lead mb-4">Create, share, and manage professional digital business cards. Schedule appointments, manage leads, and grow your network seamlessly.</p>
                    <div class="d-flex gap-3">
                        <a href="{{ url('/register') }}" class="btn btn-light btn-lg">
                            <i class="bi bi-rocket-takeoff me-2"></i>Start Free Trial
                        </a>
                        <a href="#features" class="btn btn-outline-light btn-lg">
                            <i class="bi bi-play-circle me-2"></i>Watch Demo
                        </a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="text-center">
                        <i class="bi bi-credit-card-2-front" style="font-size: 15rem; opacity: 0.8;"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="display-5 fw-bold">Powerful Features</h2>
                <p class="lead text-muted">Everything you need to manage your professional network</p>
            </div>
            
            <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card text-center">
                        <div class="feature-icon mx-auto">
                            <i class="bi bi-credit-card"></i>
                        </div>
                        <h5>Digital Business Cards</h5>
                        <p class="text-muted">Create stunning digital business cards with multiple templates and customization options.</p>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card text-center">
                        <div class="feature-icon mx-auto">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <h5>Appointment Scheduling</h5>
                        <p class="text-muted">Schedule and manage appointments with smart availability and conflict detection.</p>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card text-center">
                        <div class="feature-icon mx-auto">
                            <i class="bi bi-people"></i>
                        </div>
                        <h5>CRM & Lead Management</h5>
                        <p class="text-muted">Track leads, manage customer relationships, and grow your business.</p>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card text-center">
                        <div class="feature-icon mx-auto">
                            <i class="bi bi-briefcase"></i>
                        </div>
                        <h5>Job Profile Builder</h5>
                        <p class="text-muted">Create professional profiles with career history, education, and certifications.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="display-5 fw-bold">How It Works</h2>
                <p class="lead text-muted">Get started in minutes with our simple setup</p>
            </div>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="text-center">
                        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                            <span class="fw-bold">1</span>
                        </div>
                        <h5>Sign Up</h5>
                        <p class="text-muted">Create your free account in seconds. No credit card required.</p>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="text-center">
                        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                            <span class="fw-bold">2</span>
                        </div>
                        <h5>Create Your Card</h5>
                        <p class="text-muted">Choose from beautiful templates and customize your digital business card.</p>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="text-center">
                        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                            <span class="fw-bold">3</span>
                        </div>
                        <h5>Share & Grow</h5>
                        <p class="text-muted">Share your card, schedule appointments, and manage your network.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="display-5 fw-bold">Simple, Transparent Pricing</h2>
                <p class="lead text-muted">Choose the plan that works best for you</p>
            </div>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title">Free</h5>
                            <h6 class="card-price text-primary">$0<span class="text-muted">/month</span></h6>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>1 Business Card</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Basic Templates</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Email Support</li>
                                <li class="mb-2 text-muted"><i class="bi bi-x me-2"></i>Appointment Scheduling</li>
                                <li class="mb-2 text-muted"><i class="bi bi-x me-2"></i>CRM Features</li>
                            </ul>
                            <a href="{{ url('/register') }}" class="btn btn-outline-primary w-100">Get Started</a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card h-100 border-primary">
                        <div class="card-body text-center">
                            <div class="badge bg-primary mb-3">Most Popular</div>
                            <h5 class="card-title">Professional</h5>
                            <h6 class="card-price text-primary">$29<span class="text-muted">/month</span></h6>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>10 Business Cards</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Premium Templates</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Appointment Scheduling</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>CRM & Lead Management</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Priority Support</li>
                            </ul>
                            <a href="{{ url('/register') }}" class="btn btn-primary w-100">Start Free Trial</a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title">Enterprise</h5>
                            <h6 class="card-price text-primary">$99<span class="text-muted">/month</span></h6>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Unlimited Everything</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Team Collaboration</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Advanced Analytics</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>White-label Solution</li>
                                <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Dedicated Support</li>
                            </ul>
                            <a href="{{ url('/register') }}" class="btn btn-outline-primary w-100">Contact Sales</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 bg-primary text-white">
        <div class="container text-center">
            <h2 class="display-5 fw-bold mb-4">Ready to Get Started?</h2>
            <p class="lead mb-4">Join thousands of professionals who trust DigitalCard Pro</p>
            <a href="{{ url('/register') }}" class="btn btn-light btn-lg">
                <i class="bi bi-rocket-takeoff me-2"></i>Start Your Free Trial
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>DigitalCard Pro</h5>
                    <p class="text-muted">Transform your networking with digital business cards.</p>
                </div>
                <div class="col-md-6">
                    <div class="d-flex justify-content-md-end gap-3">
                        <a href="#" class="text-white text-decoration-none">Privacy Policy</a>
                        <a href="#" class="text-white text-decoration-none">Terms of Service</a>
                        <a href="#" class="text-white text-decoration-none">Contact</a>
                    </div>
                </div>
            </div>
            <hr class="my-4 bg-secondary">
            <div class="text-center">
                <p class="mb-0">&copy; 2024 DigitalCard Pro. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>