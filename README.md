# Modern 3D Landing Page

A responsive, modern landing page with 3D model integration, built with WordPress, Three.js, and Tailwind CSS.

## Features

- Interactive 3D model viewer using Three.js
- Responsive design with Tailwind CSS
- WordPress integration
- Smooth animations and transitions
- Mobile-friendly navigation
- Optimized for performance

## Prerequisites

- Node.js (v14+)
- npm or yarn
- WordPress installation (for production)
- PHP 7.4+

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
project-root/
├── assets/               # Static assets
│   ├── models/           # 3D model files (.glb)
│   ├── images/           # Image assets
│   └── fonts/            # Custom fonts
├── css/                  # Compiled CSS
│   └── style.css         # Main stylesheet
├── js/                   # JavaScript files
│   ├── main.js           # Main JavaScript file
│   └── components/       # Modular components
│       └── model-viewer.js  # 3D model viewer component
├── includes/             # WordPress template parts
├── templates/            # WordPress templates
├── index.php             # Main template
├── functions.php         # WordPress functions
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Project dependencies
```

## Adding 3D Models

1. Place your `.glb` files in the `assets/models/` directory
2. Update the model path in `js/main.js`:
   ```javascript
   const modelPath = themeData.themeUrl + '/assets/models/your-model.glb';
   ```

## WordPress Integration

1. Copy the theme files to your WordPress themes directory
2. Activate the theme in WordPress admin
3. Customize the content through the WordPress Customizer

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome for Android

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Build tool
