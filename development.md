# Landing Page Development Guide

## Project Structure
```
project-root/
├── assets/            # Static assets
│   ├── models/         # 3D model files (.glb)
│   ├── images/         # Image assets
│   └── fonts/          # Custom fonts
├── dist/              # Production build output
│   ├── assets/         # Compiled and optimized assets
│   ├── css/            # Compiled CSS
│   └── js/             # Bundled JavaScript
├── src/               # Source files
│   ├── css/           # Source CSS/SCSS
│   └── js/            # Source JavaScript
│       └── components/ # React/Vue components (if needed)
├── includes/          # WordPress template parts
├── templates/         # WordPress templates
├── index.php          # Main template
├── functions.php      # WordPress functions
├── style.css          # WordPress theme stylesheet
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js  # PostCSS configuration
├── vite.config.js     # Vite configuration
└── package.json       # Project dependencies
```

## Dependencies
- Node.js & npm
- WordPress
- Three.js (for 3D rendering)
- Tailwind CSS
- Vite (for development server and build process)

## Development Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)
- Local WordPress installation (for full functionality)

### Getting Started
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```
   - Development URL: http://localhost:3000
   - Features hot module replacement (HMR)
   - Auto-reloads on file changes

4. Build for production
   ```bash
   npm run build
   ```
   - Outputs to `/dist` directory
   - Optimized and minified assets
   - Ready for deployment

5. Preview production build locally
   ```bash
   npm run preview
   ```

## 3D Model Integration
1. Place .glb files in `/assets/models/`
2. Import and initialize Three.js in `js/components/model-viewer.js`
3. Configure model loading and rendering

## WordPress Integration
1. Set up theme directory in WordPress
2. Enqueue scripts and styles in `functions.php`
3. Implement template files for WordPress

## Project Progress

### 1. Project Setup ✅
- [x] Initialize npm project
- [x] Install required dependencies
- [x] Configure build process with Vite
- [x] Set up Tailwind CSS
- [x] Configure PostCSS
- [x] Set up Git repository
- [x] Create .gitignore file
- [x] Configure development and build scripts

#### Next Steps for Setup
- [ ] Set up WordPress theme structure
- [ ] Configure WordPress theme headers
- [ ] Set up environment variables
- [ ] Add documentation for team members

### 2. 3D Model Integration (In Progress) ✅
- [x] Set up Three.js
- [x] Create model viewer component (`/js/components/model-viewer.js`)
- [x] Implement model loading with progress tracking
- [x] Add comprehensive interaction controls
  - [x] Orbit controls
  - [x] Zoom controls
  - [x] Rotation controls
  - [x] Touch support for mobile devices
- [x] Optimize model loading and rendering
  - [x] Implement lazy loading
  - [x] Add loading states with progress indicators
  - [x] Comprehensive error handling
  - [x] Performance monitoring and optimization
  - [x] Memory management and cleanup
- [x] Add responsive design
  - [x] Adaptive rendering based on device capabilities
  - [x] Dynamic quality adjustment
  - [x] Viewport-aware resizing
- [x] Implement accessibility features
  - [x] Keyboard navigation
  - [x] ARIA attributes
  - [x] Screen reader support

#### Current Implementation
- Advanced Three.js scene with performance optimizations
- GLB model loading with progress tracking
- Comprehensive camera and interaction controls
- Responsive design that works on all device sizes
- Performance monitoring and adaptive quality
- Memory management and resource cleanup
- WebGL support detection and fallback
- Touch and mouse interaction support

#### Recent Improvements
- Added frame rate limiting for better performance
- Implemented dynamic quality adjustment based on FPS
- Enhanced error handling and user feedback
- Added WebGL support detection with fallback UI
- Improved memory management and resource cleanup
- Optimized for mobile devices
- Added touch gesture support
- Implemented proper event cleanup
- Added performance metrics and monitoring

#### Next Steps
- [ ] Add model animations support
- [ ] Implement model interaction highlights
- [ ] Add model annotation system
- [ ] Implement model comparison feature
- [ ] Add screenshot/capture functionality
- [ ] Implement model measurement tools
- [ ] Add support for model annotations
- [ ] Implement model sharing functionality

### 3. 3D Model Implementation (Completed) ✅

#### Fire Extinguisher Model
- [x] Created detailed 3D model of fire extinguisher
- [x] Implemented realistic materials and textures
- [x] Added interactive elements (pressure gauge, nozzle, etc.)
- [x] Optimized for web performance

#### Hero Model Viewer
- [x] Created `HeroModelViewer` class in `/js/components/hero-model-viewer.js`
- [x] Implemented responsive 3D rendering with Three.js
- [x] Added smooth animations and transitions
- [x] Integrated with the hero section
- [x] Optimized for mobile and desktop

#### Features
- [x] Auto-rotation with configurable speed
- [x] Parallax effect on mouse movement
- [x] Responsive design that works on all devices
- [x] Performance optimizations for smooth rendering
- [x] Proper resource cleanup and memory management

#### Technical Details
- Uses Three.js for 3D rendering
- Implements requestAnimationFrame for smooth animations
- Includes error handling and fallbacks
- Supports both mouse and touch interactions
- Optimized for performance with efficient rendering

### 4. Page Structure (In Progress)

-- Considerations: use into templates the header, menu and footer as parts to be included in the others sections using php fragments. in the footer also use a function to print the year dynamically.

- [ ] Create header section
  - [ ] Responsive navigation
  - [ ] Logo integration
  - [ ] Mobile menu
  - [ ] Sticky header behavior

- [ ] Implement hero section with 3D model
  - [ ] Full-viewport height
  - [ ] 3D model integration, create a model in .glb format that contain an 3D extintor.
        and save it into assets/models/extintor.glb
  - [ ] Scroll animations
  - [ ] Call-to-action buttons

- [ ] Add features section
  - [ ] Feature cards
  - [ ] Icons and illustrations
  - [ ] Hover effects
  - [ ] Responsive grid

- [ ] Create testimonials section
  - [ ] Testimonial cards
  - [ ] Avatar images
  - [ ] Star ratings
  - [ ] Carousel/slider

- [ ] Implement contact form
  - [ ] Form validation
  - [ ] Success/error states
  - [ ] Integration with form handler
  - [ ] Spam protection

- [ ] Add footer
  - [ ] Site map links
  - [ ] Social media icons
  - [ ] Copyright information
  - [ ] Back to top button

### 4. Styling (In Progress)
- [x] Configure Tailwind theme
  - [x] Color palette
  - [x] Typography
  - [x] Breakpoints
  - [ ] Custom animations

- [ ] Implement responsive design
  - [ ] Mobile-first approach
  - [ ] Tablet layouts
  - [ ] Desktop layouts
  - [ ] Large screen optimizations

- [ ] Add animations and transitions
  - [ ] Page load animations
  - [ ] Scroll-triggered animations
  - [ ] Hover/focus states
  - [ ] Micro-interactions

- [ ] Style form elements
  - [ ] Input fields
  - [ ] Buttons
  - [ ] Checkboxes/radios
  - [ ] Validation states

#### Current Implementation
- Basic Tailwind configuration
- Responsive utilities
- Basic color scheme
- Typography scale

#### Next Steps
- [ ] Create design tokens
- [ ] Implement dark mode
- [ ] Add print styles
- [ ] Optimize for performance

### 5. WordPress Integration (Planned)
- [ ] Set up theme structure
  - [ ] Theme headers
  - [ ] Template hierarchy
  - [ ] Theme supports
  - [ ] Text domain and translations

- [ ] Create template files
  - [ ] header.php
  - [ ] footer.php
  - [ ] index.php
  - [ ] single.php
  - [ ] page.php
  - [ ] archive.php
  - [ ] 404.php
  - [ ] search.php

- [ ] Implement WordPress hooks
  - [ ] Enqueue scripts and styles
  - [ ] Register menus
  - [ ] Widget areas
  - [ ] Theme customizer

- [ ] Set up ACF for content management
  - [ ] Custom fields
  - [ ] Flexible content
  - [ ] Options pages
  - [ ] Theme settings

#### Next Steps
- [ ] Set up local WordPress environment
- [ ] Configure permalinks
- [ ] Implement theme customizer options
- [ ] Add theme documentation

### 6. Optimization (Planned)
- [ ] Optimize images and assets
  - [ ] Image compression
  - [ ] WebP format
  - [ ] SVG optimization
  - [ ] Font loading strategy

- [ ] Implement lazy loading
  - [ ] Images
  - [ ] Iframes
  - [ ] Components
  - [ ] Background images

- [ ] Minify assets
  - [ ] CSS minification
  - [ ] JavaScript minification
  - [ ] HTML minification
  - [ ] Source maps

- [ ] Performance testing
  - [ ] Lighthouse audit
  - [ ] Web Vitals
  - [ ] Load testing
  - [ ] Caching strategy

#### Next Steps
- [ ] Set up performance budgets
- [ ] Configure build optimizations
- [ ] Implement code splitting
- [ ] Set up CDN integration

### 7. Testing (Planned)
- [ ] Cross-browser testing
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
  - [ ] Mobile browsers

- [ ] Mobile responsiveness
  - [ ] Various screen sizes
  - [ ] Touch targets
  - [ ] Performance on mobile
  - [ ] Offline capabilities

- [ ] Performance testing
  - [ ] Load time
  - [ ] Time to interactive
  - [ ] Memory usage
  - [ ] Network conditions

- [ ] User testing
  - [ ] Usability testing
  - [ ] Accessibility testing
  - [ ] A/B testing
  - [ ] Feedback collection

#### Next Steps
- [ ] Set up testing environment
- [ ] Create test cases
- [ ] Document testing procedures
- [ ] Set up automated testing

## Development Notes

### 3D Models
- Keep models optimized for web
- Use .glb format for better compatibility
- Implement proper error handling
- Add loading states and placeholders

### WordPress Development
- Follow WordPress coding standards
- Use proper escaping and sanitization
- Implement security best practices
- Document all custom functions

### Performance
- Optimize assets for production
- Implement caching where appropriate
- Monitor performance metrics
- Test on various network conditions

### Accessibility
- Follow WCAG 2.1 guidelines
- Ensure keyboard navigation
- Add proper ARIA attributes
- Test with screen readers

### Maintenance
- Keep dependencies updated
- Document all custom code
- Create backup procedures
- Set up monitoring

### Deployment
- Create deployment checklist
- Set up staging environment
- Document deployment process
- Implement rollback procedures
